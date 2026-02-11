"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "../../utils/debounce";
import { storage } from "../../utils/storage";
import {
  logClickFrequency,
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
const VIOLATION_WARNING = "Tab switching or minimizing is not allowed during the exam.";

const resolveClickWindowMs = () => {
  const rawValue = process.env.NEXT_PUBLIC_CLICK_WINDOW_MS;
  const configured = Number(rawValue);
  return Number.isFinite(configured) && configured > 0 ? configured : 40000;
};

const CLICK_WINDOW_MS = resolveClickWindowMs();

const StudentExam = () => {
  const [sessionData, setSessionData] = useState(() => storage.get("session"));
  const [exam, setExam] = useState(() => storage.get("exam"));
  const [questions, setQuestions] = useState(() => storage.get("questions") || []);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem("sessionId"));

  const [answers, setAnswers] = useState({});
  const [stress, setStress] = useState(5);
  const [submitted, setSubmitted] = useState(() => Boolean(storage.get("session")?.submitted_at));
  const [status, setStatus] = useState("");
  const [violationCount, setViolationCount] = useState(0);
  const [violationModal, setViolationModal] = useState({ visible: false, message: "" });

  const router = useRouter();
  const redirectTimeoutRef = useRef(null);
  const enforcementActive = Boolean(sessionData?.id) && !submitted;
  const clickWindowStartRef = useRef(null);
  const clickCountRef = useRef(0);
  const clickQueueRef = useRef([]);
  const flushInProgressRef = useRef(false);
  const clickTimerRef = useRef(null);

  useEffect(() => () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
  }, []);

  const clearSessionArtifacts = useCallback(() => {
    ["session", "exam", "questions", "student", "exams"].forEach((key) =>
      storage.remove(key)
    );
    ["studentDbId", "sessionId", "examId"].forEach((key) =>
      localStorage.removeItem(key)
    );
    setSessionData(null);
    setExam(null);
    setQuestions([]);
    setSessionId(null);
    setAnswers({});
    setStress(5);
    setViolationCount(0);
    setViolationModal({ visible: false, message: "" });
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
      const payload = {
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString(),
        clickCount,
      };
      clickQueueRef.current.push(payload);
      await flushClickQueue();
      return clickQueueRef.current.length === 0;
    },
    [flushClickQueue]
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
    [queueClickWindow]
  );

  const requestFullscreen = useCallback(() => {
    const element = document.documentElement;
    if (!document.fullscreenElement && element.requestFullscreen) {
      element.requestFullscreen().catch(() => {
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
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          /* ignore */
        });
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      router.replace("/login");
    },
    [clearSessionArtifacts, closeCurrentWindow, router]
  );

  useEffect(() => {
    if (!sessionData?.id || !sessionId || submitted) {
      setStatus((prev) => prev || "Redirecting to login...");
      router.replace("/login");
    }
  }, [sessionData, sessionId, submitted, router]);

  useEffect(() => {
    if (enforcementActive) {
      requestFullscreen();
    }
  }, [enforcementActive, requestFullscreen]);

  useEffect(() => {
    if (!enforcementActive) {
      if (clickTimerRef.current) {
        clearInterval(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      clickWindowStartRef.current = null;
      clickCountRef.current = 0;
      clickQueueRef.current = [];
      return undefined;
    }

    clickWindowStartRef.current = new Date();
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
      setViolationModal({ visible: true, message });
      try {
        const { data } = await logViolation(sessionData.id, { type });
        setViolationCount(data.violationCount);
        if (data.forcedSubmit) {
          await finalizeClientExit(
            data.message || "Exam auto-submitted due to repeated violations."
          );
        }
      } catch (error) {
        setStatus(
          error?.response?.data?.error ||
            "Violation detected. Please stay on the exam page."
        );
      }
    },
    [sessionData?.id, submitted, finalizeClientExit]
  );

  const handleClick = useCallback((event) => {
    if (!sessionData?.id || submitted) return;

    // Only count clicks within the exam interface
    const examContainer = document.querySelector(".exam-container");
    if (examContainer && examContainer.contains(event.target)) {
      requestFullscreen();
      clickCountRef.current += 1;
    }
  }, [sessionData?.id, submitted, requestFullscreen]);

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
      if (document.visibilityState === "hidden") {
        handleViolation("MINIMIZE", VIOLATION_WARNING);
      }
    };

    const handleBlur = () => handleViolation("TAB_SWITCH", VIOLATION_WARNING);
    const handleFocus = () =>
      setViolationModal((prev) => ({ ...prev, visible: false }));

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation(
          "FULLSCREEN_EXIT",
          "Fullscreen mode is required during the exam."
        );
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
          "Keyboard shortcuts are disabled during the exam."
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
    [questions, answers]
  );

  const canSubmit =
    !!sessionData?.id && !submitted && questions.length > 0 && unansweredQuestions.length === 0;

  const debouncedSave = useMemo(
    () =>
      debounce(async (questionId, answer) => {
        if (!sessionData?.id || submitted) return;
        await saveResponse(sessionData.id, { questionId, answer });
      }, 500),
    [sessionData?.id, submitted]
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

  const handleSubmit = async () => {
    if (!sessionData?.id || submitted || !canSubmit) {
      if (!sessionData?.id && !submitted) {
        router.replace("/login");
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
            saveResponse(sessionData.id, { questionId, answer })
          )
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
        error?.response?.data?.error || "Unable to submit exam. Please try again.";
      setStatus(message);
    }
  };

  if (!sessionData?.id || !sessionId || submitted) {
    return (
      <div className="container">
        <div className="card">{status || "Redirecting to login..."}</div>
      </div>
    );
  }

  return (
    <div className="container exam-container">
      <div className="card">
        <h2>{exam?.title || "Exam"}</h2>
        <div className="badge">Session #{sessionData.id}</div>
        {submitted && <p className="notice">Submitted</p>}
      </div>

      <div className="card">
        <strong>Integrity Monitor</strong>
        <p style={{ margin: "0.3rem 0" }}>
          Violations: {violationCount}/{VIOLATION_THRESHOLD}
        </p>
        <p className="notice" style={{ margin: 0 }}>
          Leaving or minimizing this window will end your exam.
        </p>
      </div>

      <div className="card">
        <label>Stress Level: {stress}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={stress}
          onChange={(e) => handleStress(e.target.value)}
          disabled={submitted}
        />
      </div>

      <div className="card">
        <h3>Questions</h3>
        <div className="grid">
          {questions.map((q) => (
            <div key={q.id} className="card" style={{ background: "var(--card-2)" }}>
              <p>{q.text}</p>
              {q.type === "mcq" ? (
                <select
                  className="input"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  disabled={submitted}
                >
                  <option value="">Select option</option>
                  {q.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <textarea
                  className="input"
                  rows="3"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  disabled={submitted}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <button className="btn" onClick={handleSubmit} disabled={!canSubmit}>
          Submit Exam
        </button>
        {!submitted && unansweredQuestions.length > 0 && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Answer all questions to submit ({unansweredQuestions.length} remaining)
          </p>
        )}
        {status && (
          <p className="notice" style={{ marginTop: "0.5rem" }}>
            {status}
          </p>
        )}
      </div>

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
    </div>
  );
};

export default StudentExam;
