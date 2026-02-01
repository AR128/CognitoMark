import { get, run } from "../db/database.js";
import { getIo } from "../sockets/index.js";

const VIOLATION_THRESHOLD = Number(process.env.VIOLATION_THRESHOLD || 3);
const VIOLATION_TYPES = ["TAB_SWITCH", "MINIMIZE", "FULLSCREEN_EXIT"];

const normalizeFeedback = (feedback) => {
  if (typeof feedback !== "string") {
    return null;
  }
  const trimmed = feedback.trim();
  return trimmed.length ? trimmed : null;
};

const findSessionById = (sessionId) =>
  get("SELECT * FROM exam_sessions WHERE id = @id", { id: sessionId });

const emitSubmissionEvent = (sessionId) => {
  getIo().emit("exam_submitted", {
    sessionId: Number(sessionId),
    submittedAt: new Date().toISOString(),
  });
};

const markSessionSubmitted = (sessionId, feedback) => {
  run(
    "UPDATE exam_sessions SET submitted_at = CURRENT_TIMESTAMP, feedback = @feedback WHERE id = @id",
    { id: sessionId, feedback: normalizeFeedback(feedback) }
  );
  emitSubmissionEvent(sessionId);
};

const countExamQuestions = (examId) =>
  get("SELECT COUNT(*) AS total FROM questions WHERE exam_id = @exam_id", {
    exam_id: examId,
  });

const countAnsweredQuestions = (sessionId) =>
  get(
    `SELECT COUNT(*) AS total
     FROM responses
     WHERE session_id = @session_id
       AND answer IS NOT NULL
       AND TRIM(answer) <> ''`,
    { session_id: sessionId }
  );

const countRecordedViolations = (sessionId) =>
  get(
    `SELECT COUNT(*) AS total
     FROM telemetry_events
     WHERE session_id = @session_id
       AND type IN (${VIOLATION_TYPES.map((t) => `'${t}'`).join(", ")})`,
    { session_id: sessionId }
  );

export const saveResponse = (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer } = req.body;

    const session = findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    run(
      `INSERT INTO responses (session_id, question_id, answer, updated_at)
       VALUES (@session_id, @question_id, @answer, CURRENT_TIMESTAMP)
       ON CONFLICT(session_id, question_id)
       DO UPDATE SET answer = @answer, updated_at = CURRENT_TIMESTAMP`,
      { session_id: sessionId, question_id: questionId, answer }
    );

    run(
      "INSERT INTO telemetry_events (session_id, type, value) VALUES (@session_id, 'answer_saved', @value)",
      { session_id: sessionId, value: JSON.stringify({ questionId }) }
    );

    getIo().emit("answer_saved", {
      sessionId: Number(sessionId),
      questionId,
      answer,
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const updateClicks = (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { totalClicks } = req.body;

    run(
      "UPDATE exam_sessions SET total_clicks = @total_clicks WHERE id = @id",
      { total_clicks: totalClicks, id: sessionId }
    );

    run(
      "INSERT INTO telemetry_events (session_id, type, value) VALUES (@session_id, 'click_update', @value)",
      { session_id: sessionId, value: JSON.stringify({ totalClicks }) }
    );

    getIo().emit("click_update", {
      sessionId: Number(sessionId),
      totalClicks,
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const updateStress = (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { stressLevel } = req.body;

    run(
      "UPDATE exam_sessions SET stress_level = @stress_level WHERE id = @id",
      { stress_level: stressLevel, id: sessionId }
    );

    run(
      "INSERT INTO telemetry_events (session_id, type, value) VALUES (@session_id, 'stress_update', @value)",
      { session_id: sessionId, value: JSON.stringify({ stressLevel }) }
    );

    getIo().emit("stress_update", {
      sessionId: Number(sessionId),
      stressLevel,
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const submitExam = (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { feedback } = req.body;

    const session = findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.submitted_at) {
      return res.status(400).json({ error: "Exam already submitted" });
    }

    const totalQuestionsRow = countExamQuestions(session.exam_id);
    if (!totalQuestionsRow?.total) {
      return res
        .status(400)
        .json({ error: "Exam cannot be submitted without any questions" });
    }

    const answeredQuestionsRow = countAnsweredQuestions(sessionId);

    if (answeredQuestionsRow.total < totalQuestionsRow.total) {
      return res.status(400).json({
        error: "Please answer all questions before submitting",
        remaining: totalQuestionsRow.total - answeredQuestionsRow.total,
      });
    }

    markSessionSubmitted(sessionId, feedback);

    return res.json({
      message: "Exam submitted successfully",
      logout: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const logViolation = (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { type } = req.body;

    const session = findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.submitted_at) {
      const violationCount = countRecordedViolations(sessionId).total;
      return res.json({
        message: "Session already submitted",
        violationCount,
        threshold: VIOLATION_THRESHOLD,
        forcedSubmit: false,
      });
    }

    run(
      "INSERT INTO telemetry_events (session_id, type, value) VALUES (@session_id, @type, @value)",
      {
        session_id: sessionId,
        type,
        value: JSON.stringify({ violationType: type, occurredAt: new Date().toISOString() }),
      }
    );

    const violationCount = countRecordedViolations(sessionId).total;
    let forcedSubmit = false;

    if (violationCount >= VIOLATION_THRESHOLD) {
      markSessionSubmitted(sessionId, null);
      forcedSubmit = true;
    }

    return res.json({
      message: forcedSubmit
        ? "Exam auto-submitted due to repeated violations."
        : "Violation logged",
      violationCount,
      threshold: VIOLATION_THRESHOLD,
      forcedSubmit,
    });
  } catch (error) {
    return next(error);
  }
};
