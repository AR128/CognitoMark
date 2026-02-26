"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "../../utils/debounce";
import { storage } from "../../utils/storage";
import {
  logClickFrequency,
  logNavigation,
  logViolation,
  saveResponse,
  submitExam,
  updateStress,
} from "../../api/sessionApi";

const hasAnswerValue = (value) => {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return true;
};

const resolveViolationThreshold = () => {
  const rawValue = process.env.NEXT_PUBLIC_VIOLATION_THRESHOLD;
  const configured = Number(rawValue);
  return Number.isFinite(configured) && configured > 0 ? configured : 3;
};

const VIOLATION_THRESHOLD = resolveViolationThreshold();
const VIOLATION_WARNING =
  "Tab switching or minimizing is not allowed during the exam.";

const resolveClickWindowMs = () => {
  const rawValue = process.env.NEXT_PUBLIC_CLICK_WINDOW_MS;
  const configured = Number(rawValue);
  return Number.isFinite(configured) && configured > 0 ? configured : 60000;
};

const CLICK_WINDOW_MS = resolveClickWindowMs();

const StudentExam = () => {
  const [sessionData, setSessionData] = useState(() => storage.get("session"));
  const [exam, setExam] = useState(() => storage.get("exam"));
  const [questions, setQuestions] = useState(
    () => storage.get("questions") || [],
  );
  const [sessionId, setSessionId] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("sessionId") : null,
  );

  const [answers, setAnswers] = useState({});
  const [stress, setStress] = useState(0);
  const [submitted, setSubmitted] = useState(() =>
    Boolean(storage.get("session")?.submitted_at),
  );
  const [status, setStatus] = useState("");
  const [violationCount, setViolationCount] = useState(0);
  const [violationModal, setViolationModal] = useState({
    visible: false,
    message: "",
  });
  const [forcedExitModal, setForcedExitModal] = useState({
    visible: false,
    message: "",
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const sectionClicksRef = useRef({
    header: 0,
    integrity: 0,
    stress: 0,
    questionPanel: 0,
    question: 0,
    footer: 0,
    other: 0,
  });

  const router = useRouter();
  const redirectTimeoutRef = useRef(null);
  const enforcementActive = Boolean(sessionData?.id) && !submitted;
  const clickWindowStartRef = useRef(null);
  const clickCountRef = useRef(0);
  const clickQueueRef = useRef([]);
  const flushInProgressRef = useRef(false);
  const clickTimerRef = useRef(null);
  const enforcementStartRef = useRef(0);
  const hasFullscreenRef = useRef(false);
  const ENFORCEMENT_GRACE_MS = 1500;

  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    },
    [],
  );

  const clearSessionArtifacts = useCallback(() => {
    ["session", "exam", "questions", "student", "exams"].forEach((key) =>
      storage.remove(key),
    );
    ["studentDbId", "sessionId", "examId"].forEach((key) =>
      localStorage.removeItem(key),
    );
    setSessionData(null);
    setExam(null);
    setQuestions([]);
    setSessionId(null);
    setAnswers({});
    setStress(0);
    setViolationCount(0);
    setViolationModal({ visible: false, message: "" });
    setForcedExitModal({ visible: false, message: "" });
  }, []);

  const flushClickQueue = useCallback(async () => {
    if (!sessionData?.id || flushInProgressRef.current) {
      return;
    }
    flushInProgressRef.current = true;
    try {
      while (clickQueueRef.current.length > 0) {
        const payload = clickQueueRef.current[0];
        await logClickFrequency(sessionData.id, payload);
        clickQueueRef.current.shift();
      }
    } finally {
      flushInProgressRef.current = false;
    }
  }, [sessionData?.id]);

  const queueClickWindow = useCallback(
    async (windowStart, windowEnd, clickCount) => {
      const currentQuestion = questions[currentQuestionIndex];
      const sectionClicks = { ...sectionClicksRef.current };

      // Reset section clicks for the next window
      sectionClicksRef.current = {
        header: 0,
        integrity: 0,
        stress: 0,
        questionPanel: 0,
        question: 0,
        footer: 0,
        other: 0,
      };

      const payload = {
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString(),
        questionId: currentQuestion?.id,
        headerClicks: sectionClicks.header,
        integrityClicks: sectionClicks.integrity,
        stressClicks: sectionClicks.stress,
        questionPanelClicks: sectionClicks.questionPanel,
        stressLevel: stress,
        questionClicks: sectionClicks.question,
        footerClicks: sectionClicks.footer,
        otherClicks: sectionClicks.other,
        clickCount,
      };
      clickQueueRef.current.push(payload);
      await flushClickQueue();
      return clickQueueRef.current.length === 0;
    },
    [flushClickQueue, questions, currentQuestionIndex, stress],
  );

  const closeCurrentWindow = useCallback(
    async (forceEndTime) => {
      if (!clickWindowStartRef.current) {
        return true;
      }

      const windowStart = clickWindowStartRef.current;
      const windowEnd =
        forceEndTime || new Date(windowStart.getTime() + CLICK_WINDOW_MS);
      const clickCount = clickCountRef.current;

      clickCountRef.current = 0;
      clickWindowStartRef.current = windowEnd;

      return queueClickWindow(windowStart, windowEnd, clickCount);
    },
    [queueClickWindow],
  );

  const requestFullscreen = useCallback(() => {
    const element = document.documentElement;
    if (!document.fullscreenElement && element.requestFullscreen) {
      element.requestFullscreen().catch(() => {
        /* ignore */
      });
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
        /* ignore */
      });
    }
  }, []);

  const finalizeClientExit = useCallback(
    async (message) => {
      setSubmitted(true);
      setStatus(message);
      if (clickTimerRef.current) {
        clearInterval(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      await closeCurrentWindow(new Date());
      clearSessionArtifacts();
      exitFullscreen();
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      router.replace("/");
    },
    [clearSessionArtifacts, closeCurrentWindow, exitFullscreen, router],
  );

  useEffect(() => {
    if (!sessionData?.id || !sessionId || (submitted && !forcedExitModal.visible)) {
      setStatus((prev) => prev || "Redirecting to login...");
      exitFullscreen();
      router.replace("/");
    }
  }, [sessionData, sessionId, submitted, forcedExitModal.visible, exitFullscreen, router]);

  useEffect(() => {
    if (!enforcementActive) {
      return;
    }

    clickTimerRef.current = window.setInterval(() => {
      closeCurrentWindow().catch(() => {
        setStatus("Unable to sync click data. Retrying automatically.");
      });
    }, CLICK_WINDOW_MS);

    return () => {
      if (clickTimerRef.current) {
        clearInterval(clickTimerRef.current);
        clickTimerRef.current = null;
      }
    };
  }, [enforcementActive, closeCurrentWindow]);

  const handleViolation = useCallback(
    async (type, message) => {
      if (!sessionData?.id || submitted) {
        return;
      }
      const currentQuestion = questions[currentQuestionIndex];
      setViolationModal({ visible: true, message });
      try {
        const { data } = await logViolation(sessionData.id, {
          type,
          questionId: currentQuestion?.id || null,
        });
        setViolationCount(data.violationCount);
        if (data.forcedSubmit) {
          const forcedMessage =
            data.message || "Exam auto-submitted due to repeated violations.";
          if (clickTimerRef.current) {
            clearInterval(clickTimerRef.current);
            clickTimerRef.current = null;
          }
          setSubmitted(true);
          setForcedExitModal({ visible: true, message: forcedMessage });
          setStatus(forcedMessage);
        }
      } catch (error) {
        setStatus(
          error?.response?.data?.error ||
            "Violation detected. Please stay on the exam page.",
        );
      }
    },
    [sessionData?.id, submitted, finalizeClientExit, questions, currentQuestionIndex],
  );

  const handleClick = useCallback(
    (event) => {
      if (!sessionData?.id || submitted) return;

      requestFullscreen();
      clickCountRef.current += 1;

      // Identify which section was clicked
      const clickedSection =
        event.target.closest("[data-section]")?.dataset.section;
      if (
        clickedSection &&
        sectionClicksRef.current[clickedSection] !== undefined
      ) {
        sectionClicksRef.current[clickedSection] += 1;
      } else {
        sectionClicksRef.current.other += 1;
      }
    },
    [sessionData?.id, submitted, requestFullscreen],
  );

  useEffect(() => {
    if (!enforcementActive) {
      return undefined;
    }

    // Global click listener for accurate click counting
    const handleDocumentClick = (event) => {
      handleClick(event);
    };

    // Add global click listener to capture all clicks
    document.addEventListener("click", handleDocumentClick, true);

    const handleVisibility = () => {
      if (Date.now() - enforcementStartRef.current < ENFORCEMENT_GRACE_MS) {
        return;
      }
      if (document.visibilityState === "hidden") {
        handleViolation("MINIMIZE", VIOLATION_WARNING);
      }
    };

    const handleBlur = () => {
      if (Date.now() - enforcementStartRef.current < ENFORCEMENT_GRACE_MS) {
        return;
      }
      handleViolation("TAB_SWITCH", VIOLATION_WARNING);
    };
    const handleFocus = () =>
      setViolationModal((prev) => ({ ...prev, visible: false }));

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        hasFullscreenRef.current = true;
        return;
      }
      if (!hasFullscreenRef.current) {
        return;
      }
      if (Date.now() - enforcementStartRef.current < ENFORCEMENT_GRACE_MS) {
        return;
      }
      if (!document.fullscreenElement) {
        handleViolation(
          "FULLSCREEN_EXIT",
          "Fullscreen mode is required during the exam.",
        );
        if (enforcementActive) {
          requestFullscreen();
        }
      }
    };

    const handleKeyDown = (event) => {
      const key = event.key?.toLowerCase();
      const ctrlOrMeta = event.ctrlKey || event.metaKey;
      const altPressed = event.altKey;
      const blockedShortcut =
        (ctrlOrMeta && ["t", "w", "tab"].includes(key)) ||
        (altPressed && key === "tab") ||
        key === "f11";

      if (blockedShortcut) {
        event.preventDefault();
        event.stopPropagation();
        handleViolation(
          "TAB_SWITCH",
          "Keyboard shortcuts are disabled during the exam.",
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [enforcementActive, handleViolation, handleClick]);

  const unansweredQuestions = useMemo(
    () => questions.filter((q) => !hasAnswerValue(answers[q.id])),
    [questions, answers],
  );

  const canSubmit =
    !!sessionData?.id &&
    !submitted &&
    questions.length > 0 &&
    unansweredQuestions.length === 0;

  const debouncedSave = useMemo(
    () =>
      debounce(async (questionId, answer) => {
        if (!sessionData?.id || submitted) return;
        await saveResponse(sessionData.id, { questionId, answer });
      }, 500),
    [sessionData?.id, submitted],
  );

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    debouncedSave(questionId, value);
  };

  const handleStress = (value) => {
    const numericValue = Number(value);
    setStress(numericValue);
    if (sessionData?.id && !submitted) {
      updateStress(sessionData.id, { stressLevel: numericValue });
    }
  };

  const stressLabel = useMemo(() => {
    if (stress <= 1) return "Low stress";
    if (stress >= 9) return "High stress";
    return "Moderate stress";
  }, [stress]);

  useEffect(() => {
    if (!sessionData?.id || submitted) {
      return;
    }
    setStress(0);
    updateStress(sessionData.id, { stressLevel: 0 });
  }, [currentQuestionIndex, sessionData?.id, submitted]);

  const handleSubmit = async () => {
    if (!sessionData?.id || submitted || !canSubmit) {
      if (!sessionData?.id && !submitted) {
        router.replace("/");
      }
      return;
    }

    try {
      const preparedResponses = questions
        .map((q) => ({ questionId: q.id, answer: answers[q.id] }))
        .filter(({ answer }) => hasAnswerValue(answer));

      if (preparedResponses.length) {
        await Promise.all(
          preparedResponses.map(({ questionId, answer }) =>
            saveResponse(sessionData.id, { questionId, answer }),
          ),
        );
      }

      const flushOk = await closeCurrentWindow(new Date());
      if (!flushOk) {
        setStatus("Unable to sync click data. Please try again.");
        return;
      }

      const { data } = await submitExam(sessionData.id, { feedback: "" });
      const successMessage = data?.message || "Exam submitted successfully.";
      await finalizeClientExit(`${successMessage} Redirecting to login...`);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        "Unable to submit exam. Please try again.";
      setStatus(message);
    }
  };

  const logQuestionNavigation = (fromIndex, toIndex, directionOverride) => {
    const fromQuestion = questions[fromIndex];
    const toQuestion = questions[toIndex];
    if (!sessionData?.id || submitted || !fromQuestion?.id || !toQuestion?.id) {
      return;
    }

    const direction =
      directionOverride || (toIndex > fromIndex ? "next" : "previous");

    logNavigation(sessionData.id, {
      fromQuestionId: fromQuestion.id,
      toQuestionId: toQuestion.id,
      direction,
      fromQuestionNumber: fromIndex + 1,
      toQuestionNumber: toIndex + 1,
    }).catch(() => {
      /* ignore navigation logging errors */
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      logQuestionNavigation(currentQuestionIndex, currentQuestionIndex + 1, "next");
      await closeCurrentWindow(new Date());
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = async () => {
    if (currentQuestionIndex > 0) {
      logQuestionNavigation(currentQuestionIndex, currentQuestionIndex - 1, "previous");
      await closeCurrentWindow(new Date());
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleJumpTo = async (targetIndex) => {
    if (
      submitted ||
      targetIndex === currentQuestionIndex ||
      targetIndex < 0 ||
      targetIndex >= questions.length
    ) {
      return;
    }

    logQuestionNavigation(currentQuestionIndex, targetIndex);
    await closeCurrentWindow(new Date());
    setCurrentQuestionIndex(targetIndex);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isQuestionAnswered = hasAnswerValue(answers[currentQuestion?.id]);

  if (!sessionData?.id || !sessionId || (submitted && !forcedExitModal.visible)) {
    return (
      <div className="container">
        <div className="card">{status || "Redirecting to login..."}</div>
      </div>
    );
  }

  return (
    <div className="container exam-container" data-section="container">
      <div className="card exam-header" data-section="header">
        <div className="exam-header-top">
          <h2 className="exam-title">{exam?.title || "Exam"}</h2>
          {submitted && <span className="badge">Submitted</span>}
        </div>
        <div className="exam-header-meta">
          <div className="exam-violations">
            Violations: {violationCount}/{VIOLATION_THRESHOLD}
          </div>
          <div className="exam-notice">
            Leaving or minimizing this window will end your exam.
          </div>
        </div>
      </div>

      <div
        className={`card exam-stress stress-${
          stress <= 1 ? "low" : stress >= 9 ? "high" : "mid"
        }`}
        data-section="stress"
      >
        <div className="stress-header">
          <div>
            <div className="stress-title">Question Difficulty</div>
            <div className="stress-value">{stressLabel}</div>
          </div>
          <div className="stress-pill">{stress}/10</div>
        </div>
        <input
          className="stress-range"
          type="range"
          min="0"
          max="10"
          value={stress}
          onChange={(e) => handleStress(e.target.value)}
          disabled={submitted}
        />
        <div className="stress-scale">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      <div className="exam-layout">
        <aside className="card question-panel" aria-label="Questions">
          <div className="question-panel-header">
            <h3>Questions</h3>
            <span className="question-count">{questions.length}</span>
          </div>
          <div className="question-panel-grid">
            {questions.map((question, index) => {
              const isAnswered = hasAnswerValue(answers[question.id]);
              const isActive = index === currentQuestionIndex;
              return (
                <button
                  key={question.id}
                  type="button"
                  className={`question-pill${isActive ? " active" : ""}${
                    isAnswered ? " answered" : ""
                  }`}
                  onClick={() => handleJumpTo(index)}
                  disabled={submitted}
                  aria-current={isActive ? "step" : undefined}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="exam-main">
          <div className="card" data-section="question">
            <h3 className="question-title">
              Question {currentQuestionIndex + 1}.
            </h3>
            {currentQuestion && (
              <div
                className="card question-body"
                style={{ background: "var(--card-2)" }}
              >
                <p>{currentQuestion.text}</p>
                {currentQuestion.type === "mcq" ? (
                  <div
                    className={`mcq-options${
                      currentQuestion.options?.some((opt) =>
                        String(opt).trim().length > 28,
                      )
                        ? " single-column"
                        : ""
                    }`}
                  >
                    {currentQuestion.options?.map((opt) => (
                      <label key={opt} className="mcq-option">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={opt}
                          checked={answers[currentQuestion.id] === opt}
                          onChange={(e) =>
                            handleAnswerChange(
                              currentQuestion.id,
                              e.target.value,
                            )
                          }
                          disabled={submitted}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="input"
                    rows="3"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion.id, e.target.value)
                    }
                    disabled={submitted}
                  />
                )}
                <div className="question-actions" data-section="footer">
                  <div className="question-actions-buttons">
                    <button
                      className="btn"
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0 || submitted}
                      style={{
                        background:
                          currentQuestionIndex === 0
                            ? "var(--border)"
                            : "var(--primary)",
                      }}
                    >
                      Previous
                    </button>
                    {!isLastQuestion ? (
                      <button
                        className="btn"
                        onClick={handleNext}
                        disabled={!isQuestionAnswered || submitted}
                        style={{
                          background: !isQuestionAnswered
                            ? "var(--border)"
                            : "var(--primary)",
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn"
                        onClick={handleSubmit}
                        disabled={!canSubmit || submitted}
                        style={{
                          background: !canSubmit
                            ? "var(--border)"
                            : "var(--primary)",
                        }}
                      >
                        Submit Exam
                      </button>
                    )}
                  </div>
                  {!submitted && !isQuestionAnswered && (
                    <p className="question-warning">
                      Please answer current question to proceed
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {status && (
        <div className="card">
          <p className="notice" style={{ margin: 0 }}>
            {status}
          </p>
        </div>
      )}

      {violationModal.visible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div className="card" style={{ maxWidth: 420, textAlign: "center" }}>
            <h3>Warning</h3>
            <p style={{ margin: "1rem 0" }}>{violationModal.message}</p>
            <button
              className="btn"
              onClick={() => setViolationModal({ visible: false, message: "" })}
            >
              Stay Focused
            </button>
          </div>
        </div>
      )}

      {forcedExitModal.visible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ maxWidth: 440, textAlign: "center" }}>
            <h3>Session Ended</h3>
            <p style={{ margin: "1rem 0" }}>{forcedExitModal.message}</p>
            <button
              className="btn"
              onClick={() => {
                setForcedExitModal({ visible: false, message: "" });
                finalizeClientExit(forcedExitModal.message);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExam;
