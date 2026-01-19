import { get, run } from "../db/database.js";
import { getIo } from "../sockets/index.js";

export const saveResponse = (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer } = req.body;

    const session = get("SELECT * FROM exam_sessions WHERE id = @id", {
      id: sessionId,
    });
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

    run(
      "UPDATE exam_sessions SET submitted_at = CURRENT_TIMESTAMP, feedback = @feedback WHERE id = @id",
      { id: sessionId, feedback: feedback || null }
    );

    getIo().emit("exam_submitted", {
      sessionId: Number(sessionId),
      submittedAt: new Date().toISOString(),
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};
