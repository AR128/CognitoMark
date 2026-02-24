import { getCollection, getNextSequence } from "../db/database.js";
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

const examSessions = () => getCollection("exam_sessions");
const responses = () => getCollection("responses");
const telemetry = () => getCollection("telemetry_events");
const clickTimeseries = () => getCollection("click_timeseries");
const questions = () => getCollection("questions");

const insertTelemetryEvent = async (sessionId, type, value, meta = {}) => {
  const payload = {
    session_id: sessionId,
    type,
    value: JSON.stringify(value),
    created_at: new Date().toISOString(),
  };

  if (Number.isFinite(meta.questionId)) {
    payload.question_id = meta.questionId;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const id = await getNextSequence("telemetry_events");
      await telemetry().insertOne({ id, ...payload });
      return;
    } catch (error) {
      if (error?.code === 11000 && attempt < 2) {
        continue;
      }
      throw error;
    }
  }
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const findSessionById = async (sessionId) =>
  examSessions().findOne({ id: sessionId });

const emitSubmissionEvent = (sessionId) => {
  getIo().emit("exam_submitted", {
    sessionId: Number(sessionId),
    submittedAt: new Date().toISOString(),
  });
};

const markSessionSubmitted = async (sessionId, feedback) => {
  await examSessions().updateOne(
    { id: sessionId },
    {
      $set: {
        submitted_at: new Date().toISOString(),
        feedback: normalizeFeedback(feedback),
      },
    },
  );
  emitSubmissionEvent(sessionId);
};

const countExamQuestions = (examId) =>
  questions().countDocuments({ exam_id: examId });

const countAnsweredQuestions = (sessionId) =>
  responses().countDocuments({
    session_id: sessionId,
    answer: { $type: "string", $regex: /\S/ },
  });

const countRecordedViolations = (sessionId) =>
  telemetry().countDocuments({
    session_id: sessionId,
    type: { $in: VIOLATION_TYPES },
  });

const getLastClickWindowEnd = (sessionId) =>
  clickTimeseries().find({ session_id: sessionId })
    .sort({ window_end: -1 })
    .limit(1)
    .project({ window_end: 1, _id: 0 })
    .toArray();

const isValidDate = (value) => {
  const date = new Date(value);
  return Number.isFinite(date.getTime());
};

export const saveResponse = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer } = req.body;

    const parsedSessionId = toNumber(sessionId);
    const parsedQuestionId = toNumber(questionId);
    if (!parsedSessionId || !parsedQuestionId) {
      return res.status(400).json({ error: "Invalid session or question id" });
    }

    const session = await findSessionById(parsedSessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const existingResponse = await responses().findOne(
      { session_id: parsedSessionId, question_id: parsedQuestionId },
      { projection: { id: 1 } },
    );

    if (existingResponse) {
      await responses().updateOne(
        { session_id: parsedSessionId, question_id: parsedQuestionId },
        {
          $set: {
            answer,
            updated_at: new Date().toISOString(),
          },
        },
      );
    } else {
      await responses().insertOne({
        id: await getNextSequence("responses"),
        session_id: parsedSessionId,
        question_id: parsedQuestionId,
        answer,
        updated_at: new Date().toISOString(),
      });
    }

    await insertTelemetryEvent(parsedSessionId, "answer_saved", {
      questionId: parsedQuestionId,
    });

    getIo().emit("answer_saved", {
      sessionId: Number(parsedSessionId),
      questionId: parsedQuestionId,
      answer,
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const updateClicks = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { totalClicks } = req.body;

    const parsedSessionId = toNumber(sessionId);
    if (!parsedSessionId) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    await examSessions().updateOne(
      { id: parsedSessionId },
      { $set: { total_clicks: totalClicks } },
    );

    await insertTelemetryEvent(parsedSessionId, "click_update", {
      totalClicks,
    });

    getIo().emit("click_update", {
      sessionId: Number(parsedSessionId),
      totalClicks,
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const updateStress = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { stressLevel } = req.body;

    const parsedSessionId = toNumber(sessionId);
    if (!parsedSessionId) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    await examSessions().updateOne(
      { id: parsedSessionId },
      { $set: { stress_level: stressLevel } },
    );

    await insertTelemetryEvent(parsedSessionId, "stress_update", {
      stressLevel,
    });

    getIo().emit("stress_update", {
      sessionId: Number(parsedSessionId),
      stressLevel,
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const logClickFrequency = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const {
      windowStart,
      windowEnd,
      questionId,
      headerClicks,
      integrityClicks,
      stressClicks,
      stressLevel,
      questionClicks,
      footerClicks,
      otherClicks,
      clickCount,
    } = req.body;

    const parsedSessionId = toNumber(sessionId);
    if (!parsedSessionId) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    const session = await findSessionById(parsedSessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.submitted_at) {
      return res.json({ success: true, ignored: true, reason: "submitted" });
    }

    if (!isValidDate(windowStart) || !isValidDate(windowEnd)) {
      return res.status(400).json({ error: "Invalid window timestamps" });
    }

    let startDate = new Date(windowStart);
    let endDate = new Date(windowEnd);
    if (endDate <= startDate) {
      endDate = new Date(startDate.getTime() + 1);
    }

    if (clickCount < 0) {
      return res
        .status(400)
        .json({ error: "Click count must be non-negative" });
    }

    const lastWindowRows = await getLastClickWindowEnd(parsedSessionId);
    const lastWindow = lastWindowRows[0];
    if (lastWindow?.window_end && new Date(lastWindow.window_end) > startDate) {
      startDate = new Date(lastWindow.window_end);
      if (endDate <= startDate) {
        endDate = new Date(startDate.getTime() + 1);
      }
    }

    await clickTimeseries().insertOne({
      id: await getNextSequence("click_timeseries"),
      session_id: parsedSessionId,
      window_start: startDate.toISOString(),
      window_end: endDate.toISOString(),
      question_id: questionId ? Number(questionId) : null,
      header_clicks: headerClicks || 0,
      integrity_clicks: integrityClicks || 0,
      stress_clicks: stressClicks || 0,
      stress_level: Number.isFinite(Number(stressLevel))
        ? Number(stressLevel)
        : 0,
      question_clicks: questionClicks || 0,
      footer_clicks: footerClicks || 0,
      other_clicks: otherClicks || 0,
      click_count: clickCount,
      created_at: new Date().toISOString(),
    });

    await insertTelemetryEvent(parsedSessionId, "click_window", {
      windowStart,
      windowEnd,
      questionId,
      headerClicks,
      integrityClicks,
      stressClicks,
      questionClicks,
      footerClicks,
      otherClicks,
      clickCount,
    });

    getIo().emit("click_window", {
      sessionId: Number(parsedSessionId),
      windowStart: startDate.toISOString(),
      windowEnd: endDate.toISOString(),
      questionId,
      clickCount,
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getClickSeries = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const parsedSessionId = toNumber(sessionId);
    if (!parsedSessionId) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    const session = await findSessionById(parsedSessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const total = await clickTimeseries().countDocuments({
      session_id: parsedSessionId,
    });

    const items = await clickTimeseries()
      .find(
        { session_id: parsedSessionId },
        { projection: { _id: 0, window_start: 1, window_end: 1, click_count: 1 } },
      )
      .sort({ window_start: 1 })
      .toArray();

    return res.json({ total, items });
  } catch (error) {
    return next(error);
  }
};

export const submitExam = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { feedback } = req.body;
    const parsedSessionId = toNumber(sessionId);
    if (!parsedSessionId) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    const session = await findSessionById(parsedSessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.submitted_at) {
      return res.status(400).json({ error: "Exam already submitted" });
    }

    const totalQuestions = await countExamQuestions(session.exam_id);
    if (!totalQuestions) {
      return res
        .status(400)
        .json({ error: "Exam cannot be submitted without any questions" });
    }

    const answeredQuestions = await countAnsweredQuestions(parsedSessionId);

    if (answeredQuestions < totalQuestions) {
      return res.status(400).json({
        error: "Please answer all questions before submitting",
        remaining: totalQuestions - answeredQuestions,
      });
    }

    await markSessionSubmitted(parsedSessionId, feedback);

    return res.json({
      message: "Exam submitted successfully",
      logout: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const logViolation = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { type, questionId } = req.body;
    const parsedSessionId = toNumber(sessionId);
    if (!parsedSessionId) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    const parsedQuestionId = toNumber(questionId);

    const session = await findSessionById(parsedSessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.submitted_at) {
      const violationCount = await countRecordedViolations(parsedSessionId);
      return res.json({
        message: "Session already submitted",
        violationCount,
        threshold: VIOLATION_THRESHOLD,
        forcedSubmit: false,
      });
    }

    await insertTelemetryEvent(
      parsedSessionId,
      type,
      {
        questionId: parsedQuestionId,
        violationType: type,
        occurredAt: new Date().toISOString(),
      },
      { questionId: parsedQuestionId },
    );

    const violationCount = await countRecordedViolations(parsedSessionId);
    let forcedSubmit = false;

    if (violationCount >= VIOLATION_THRESHOLD) {
      await markSessionSubmitted(parsedSessionId, null);
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
