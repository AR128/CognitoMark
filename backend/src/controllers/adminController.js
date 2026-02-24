import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollection, getNextSequence } from "../db/database.js";
import { getIo } from "../sockets/index.js";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const admins = () => getCollection("admins");
const students = () => getCollection("students");
const exams = () => getCollection("exams");
const questions = () => getCollection("questions");
const examSessions = () => getCollection("exam_sessions");
const responses = () => getCollection("responses");
const telemetry = () => getCollection("telemetry_events");
const clickTimeseries = () => getCollection("click_timeseries");

const VIOLATION_TYPES = ["TAB_SWITCH", "MINIMIZE", "FULLSCREEN_EXIT"];

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await admins().findOne({ username });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.id, username }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    return res.json({ token });
  } catch (error) {
    return next(error);
  }
};

export const getDashboardLive = async (req, res, next) => {
  try {
    const [activeCount, submittedCount, avgStressRow, avgClicksRow] =
      await Promise.all([
        examSessions().countDocuments({ submitted_at: null }),
        examSessions().countDocuments({ submitted_at: { $ne: null } }),
        examSessions()
          .aggregate([
            { $match: { stress_level: { $gt: 0 } } },
            { $group: { _id: null, avg: { $avg: "$stress_level" } } },
          ])
          .toArray(),
        clickTimeseries()
          .aggregate([
            {
              $group: {
                _id: "$session_id",
                total: { $sum: "$click_count" },
              },
            },
            { $group: { _id: null, avg: { $avg: "$total" } } },
          ])
          .toArray(),
      ]);

    const sessions = await examSessions()
      .aggregate([
        { $sort: { started_at: -1 } },
        { $limit: 100 },
        {
          $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "id",
            as: "student",
          },
        },
        {
          $lookup: {
            from: "exams",
            localField: "exam_id",
            foreignField: "id",
            as: "exam",
          },
        },
        {
          $lookup: {
            from: "click_timeseries",
            let: { sessionId: "$id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$session_id", "$$sessionId"] } } },
              { $sort: { window_end: -1 } },
              {
                $group: {
                  _id: null,
                  total_clicks: { $sum: "$click_count" },
                  avg_stress_level: { $avg: "$stress_level" },
                  last_window_clicks: { $first: "$click_count" },
                  last_window_start: { $first: "$window_start" },
                  last_window_end: { $first: "$window_end" },
                },
              },
            ],
            as: "click_stats",
          },
        },
        {
          $lookup: {
            from: "telemetry_events",
            let: { sessionId: "$id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$session_id", "$$sessionId"] },
                      { $in: ["$type", VIOLATION_TYPES] },
                    ],
                  },
                },
              },
              { $count: "count" },
            ],
            as: "violation_stats",
          },
        },
        {
          $addFields: {
            student: { $first: "$student" },
            exam: { $first: "$exam" },
            click_stats: { $first: "$click_stats" },
            violation_stats: { $first: "$violation_stats" },
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            started_at: 1,
            submitted_at: 1,
            student_id: "$student.student_id",
            name: "$student.name",
            exam_title: "$exam.title",
            avg_stress_level: { $ifNull: ["$click_stats.avg_stress_level", 0] },
            total_clicks: { $ifNull: ["$click_stats.total_clicks", 0] },
            violation_count: { $ifNull: ["$violation_stats.count", 0] },
            last_window_clicks: {
              $ifNull: ["$click_stats.last_window_clicks", 0],
            },
            last_window_start: "$click_stats.last_window_start",
            last_window_end: "$click_stats.last_window_end",
          },
        },
      ])
      .toArray();

    const clickSeries = await clickTimeseries()
      .aggregate([
        { $sort: { window_start: -1 } },
        { $limit: 50 },
        {
          $lookup: {
            from: "exam_sessions",
            localField: "session_id",
            foreignField: "id",
            as: "session",
          },
        },
        { $addFields: { session: { $first: "$session" } } },
        {
          $lookup: {
            from: "students",
            localField: "session.student_id",
            foreignField: "id",
            as: "student",
          },
        },
        {
          $lookup: {
            from: "exams",
            localField: "session.exam_id",
            foreignField: "id",
            as: "exam",
          },
        },
        {
          $lookup: {
            from: "questions",
            localField: "question_id",
            foreignField: "id",
            as: "question",
          },
        },
        {
          $addFields: {
            student: { $first: "$student" },
            exam: { $first: "$exam" },
            question: { $first: "$question" },
          },
        },
        {
          $project: {
            _id: 0,
            session_id: 1,
            window_start: 1,
            window_end: 1,
            click_count: 1,
            question_id: 1,
            question_text: "$question.text",
            student_id: "$student.student_id",
            name: "$student.name",
            exam_title: "$exam.title",
          },
        },
      ])
      .toArray();

    return res.json({
      metrics: {
        activeStudents: activeCount,
        submittedStudents: submittedCount,
        averageStress: Number(avgStressRow?.[0]?.avg || 0).toFixed(2),
        averageClicks: Number(avgClicksRow?.[0]?.avg || 0).toFixed(2),
      },
      sessions,
      clickSeries,
    });
  } catch (error) {
    return next(error);
  }
};

export const getExams = async (req, res, next) => {
  try {
    const items = await exams()
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

export const createExam = async (req, res, next) => {
  try {
    const { title } = req.body;
    const id = await getNextSequence("exams");
    const exam = {
      id,
      title,
      created_at: new Date().toISOString(),
    };

    await exams().insertOne(exam);
    getIo().emit("exam_created", { examId: exam.id });
    return res.status(201).json(exam);
  } catch (error) {
    return next(error);
  }
};

export const deleteExam = async (req, res, next) => {
  try {
    const examId = toNumber(req.params.id);
    if (!examId) {
      return res.status(400).json({ error: "Invalid exam id" });
    }

    const existing = await exams().findOne({ id: examId });
    if (!existing) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const questionIds = await questions()
      .find({ exam_id: examId }, { projection: { id: 1 } })
      .toArray();
    const questionIdList = questionIds.map((q) => q.id);

    const sessionIds = await examSessions()
      .find({ exam_id: examId }, { projection: { id: 1 } })
      .toArray();
    const sessionIdList = sessionIds.map((s) => s.id);

    const responseFilters = [];
    if (questionIdList.length) {
      responseFilters.push({ question_id: { $in: questionIdList } });
    }
    if (sessionIdList.length) {
      responseFilters.push({ session_id: { $in: sessionIdList } });
    }

    if (responseFilters.length) {
      await responses().deleteMany({ $or: responseFilters });
    }

    if (sessionIdList.length) {
      await telemetry().deleteMany({ session_id: { $in: sessionIdList } });
      await clickTimeseries().deleteMany({ session_id: { $in: sessionIdList } });
    }

    await examSessions().deleteMany({ exam_id: examId });
    await questions().deleteMany({ exam_id: examId });
    await exams().deleteOne({ id: examId });

    getIo().emit("exam_deleted", { examId });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getExamQuestions = async (req, res, next) => {
  try {
    const examId = toNumber(req.params.id);
    if (!examId) {
      return res.status(400).json({ error: "Invalid exam id" });
    }
    const items = await questions()
      .find({ exam_id: examId }, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray();
    return res.json(items.map((q) => ({ ...q, options: q.options || [] })));
  } catch (error) {
    return next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const { examId, text, type, options } = req.body;
    const id = await getNextSequence("questions");
    const question = {
      id,
      exam_id: Number(examId),
      text,
      type,
      options: Array.isArray(options) ? options : [],
      created_at: new Date().toISOString(),
    };

    await questions().insertOne(question);
    getIo().emit("question_created", {
      questionId: question.id,
      examId: question.exam_id,
    });
    return res.status(201).json(question);
  } catch (error) {
    return next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const questionId = toNumber(req.params.id);
    if (!questionId) {
      return res.status(400).json({ error: "Invalid question id" });
    }

    const result = await questions().deleteOne({ id: questionId });
    if (!result.deletedCount) {
      return res.status(404).json({ error: "Question not found" });
    }

    await responses().deleteMany({ question_id: questionId });
    await clickTimeseries().deleteMany({ question_id: questionId });

    getIo().emit("question_deleted", { questionId });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const items = await students()
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const rawId = req.params.id;
    const parsedId = toNumber(rawId);
    const student = parsedId
      ? await students().findOne({ id: parsedId })
      : await students().findOne({ student_id: rawId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const sessionIds = await examSessions()
      .find({ student_id: student.id }, { projection: { id: 1 } })
      .toArray();
    const sessionIdList = sessionIds.map((s) => s.id);

    if (sessionIdList.length) {
      await responses().deleteMany({ session_id: { $in: sessionIdList } });
      await telemetry().deleteMany({ session_id: { $in: sessionIdList } });
      await clickTimeseries().deleteMany({ session_id: { $in: sessionIdList } });
    }

    await examSessions().deleteMany({ student_id: student.id });
    await students().deleteOne({ id: student.id });

    getIo().emit("student_deleted", { studentId: rawId });
    getIo().emit("session_deleted"); // Notify sessions list to refresh

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const items = await examSessions()
      .aggregate([
        { $sort: { started_at: -1 } },
        {
          $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "id",
            as: "student",
          },
        },
        {
          $lookup: {
            from: "exams",
            localField: "exam_id",
            foreignField: "id",
            as: "exam",
          },
        },
        {
          $lookup: {
            from: "click_timeseries",
            let: { sessionId: "$id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$session_id", "$$sessionId"] } } },
              {
                $group: {
                  _id: null,
                  total_clicks: { $sum: "$click_count" },
                  header_clicks: { $sum: "$header_clicks" },
                  stress_clicks: { $sum: "$stress_clicks" },
                  question_clicks: { $sum: "$question_clicks" },
                  navigation_clicks: { $sum: "$footer_clicks" },
                  other_clicks: { $sum: "$other_clicks" },
                  avg_stress_level: { $avg: "$stress_level" },
                },
              },
            ],
            as: "click_stats",
          },
        },
        {
          $lookup: {
            from: "telemetry_events",
            let: { sessionId: "$id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$session_id", "$$sessionId"] },
                      { $in: ["$type", VIOLATION_TYPES] },
                    ],
                  },
                },
              },
              { $count: "count" },
            ],
            as: "violation_stats",
          },
        },
        {
          $addFields: {
            student: { $first: "$student" },
            exam: { $first: "$exam" },
            click_stats: { $first: "$click_stats" },
            violation_stats: { $first: "$violation_stats" },
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            student_id: "$student.student_id",
            name: "$student.name",
            exam_title: "$exam.title",
            total_clicks: { $ifNull: ["$click_stats.total_clicks", 0] },
            header_clicks: { $ifNull: ["$click_stats.header_clicks", 0] },
            stress_clicks: { $ifNull: ["$click_stats.stress_clicks", 0] },
            question_clicks: { $ifNull: ["$click_stats.question_clicks", 0] },
            navigation_clicks: {
              $ifNull: ["$click_stats.navigation_clicks", 0],
            },
            other_clicks: { $ifNull: ["$click_stats.other_clicks", 0] },
            avg_stress_level: { $ifNull: ["$click_stats.avg_stress_level", 0] },
            violation_count: { $ifNull: ["$violation_stats.count", 0] },
            stress_level: 1,
            started_at: 1,
            submitted_at: 1,
          },
        },
      ])
      .toArray();

    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

export const getSessionDetail = async (req, res, next) => {
  try {
    const sessionId = toNumber(req.params.sessionId);
    if (!sessionId) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    const sessionRows = await examSessions()
      .aggregate([
        { $match: { id: sessionId } },
        {
          $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "id",
            as: "student",
          },
        },
        {
          $lookup: {
            from: "exams",
            localField: "exam_id",
            foreignField: "id",
            as: "exam",
          },
        },
        {
          $lookup: {
            from: "click_timeseries",
            let: { sessionId: "$id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$session_id", "$$sessionId"] } } },
              {
                $group: {
                  _id: null,
                  total_clicks: { $sum: "$click_count" },
                  avg_stress_level: { $avg: "$stress_level" },
                },
              },
            ],
            as: "click_stats",
          },
        },
        {
          $lookup: {
            from: "telemetry_events",
            let: { sessionId: "$id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$session_id", "$$sessionId"] },
                      { $in: ["$type", VIOLATION_TYPES] },
                    ],
                  },
                },
              },
              { $count: "count" },
            ],
            as: "violation_stats",
          },
        },
        {
          $addFields: {
            student: { $first: "$student" },
            exam: { $first: "$exam" },
            click_stats: { $first: "$click_stats" },
            violation_stats: { $first: "$violation_stats" },
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            student_id: "$student.student_id",
            exam_id: 1,
            started_at: 1,
            submitted_at: 1,
            total_clicks: { $ifNull: ["$click_stats.total_clicks", 0] },
            avg_stress_level: { $ifNull: ["$click_stats.avg_stress_level", 0] },
            violation_count: { $ifNull: ["$violation_stats.count", 0] },
            name: "$student.name",
            exam_title: "$exam.title",
            stress_level: 1,
            feedback: 1,
          },
        },
      ])
      .toArray();

    const session = sessionRows[0];
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const responsesList = await responses()
      .aggregate([
        { $match: { session_id: sessionId } },
        {
          $lookup: {
            from: "questions",
            localField: "question_id",
            foreignField: "id",
            as: "question",
          },
        },
        { $addFields: { question: { $first: "$question" } } },
        {
          $lookup: {
            from: "click_timeseries",
            let: {
              sessionId: "$session_id",
              questionId: "$question_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$session_id", "$$sessionId"] },
                      { $eq: ["$question_id", "$$questionId"] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  click_count: { $sum: "$click_count" },
                  header_clicks: { $sum: "$header_clicks" },
                  integrity_clicks: { $sum: "$integrity_clicks" },
                  stress_clicks: { $sum: "$stress_clicks" },
                  avg_stress_level: { $avg: "$stress_level" },
                  question_clicks: { $sum: "$question_clicks" },
                  footer_clicks: { $sum: "$footer_clicks" },
                  other_clicks: { $sum: "$other_clicks" },
                },
              },
            ],
            as: "click_stats",
          },
        },
        { $addFields: { click_stats: { $first: "$click_stats" } } },
        {
          $project: {
            _id: 0,
            id: 1,
            session_id: 1,
            question_id: 1,
            answer: 1,
            updated_at: 1,
            text: "$question.text",
            type: "$question.type",
            options: "$question.options",
            click_count: { $ifNull: ["$click_stats.click_count", 0] },
            header_clicks: { $ifNull: ["$click_stats.header_clicks", 0] },
            integrity_clicks: {
              $ifNull: ["$click_stats.integrity_clicks", 0],
            },
            stress_clicks: { $ifNull: ["$click_stats.stress_clicks", 0] },
            avg_stress_level: {
              $ifNull: ["$click_stats.avg_stress_level", 0],
            },
            question_clicks: { $ifNull: ["$click_stats.question_clicks", 0] },
            footer_clicks: { $ifNull: ["$click_stats.footer_clicks", 0] },
            other_clicks: { $ifNull: ["$click_stats.other_clicks", 0] },
          },
        },
      ])
      .toArray();

    const violations = await telemetry()
      .find(
        { session_id: sessionId, type: { $in: VIOLATION_TYPES } },
        { projection: { _id: 0, question_id: 1, created_at: 1, value: 1 } },
      )
      .toArray();

    const clickWindows = await clickTimeseries()
      .find(
        { session_id: sessionId, question_id: { $ne: null } },
        { projection: { _id: 0, question_id: 1, window_start: 1, window_end: 1 } },
      )
      .toArray();

    const resolveViolationQuestionId = (violation) => {
      if (Number.isFinite(violation.question_id)) {
        return violation.question_id;
      }

      if (violation.value) {
        try {
          const parsed = JSON.parse(violation.value);
          if (Number.isFinite(Number(parsed?.questionId))) {
            return Number(parsed.questionId);
          }
        } catch {
          // ignore invalid JSON
        }
      }

      if (!violation.created_at) {
        return null;
      }

      const eventTime = new Date(violation.created_at).getTime();
      if (!Number.isFinite(eventTime)) {
        return null;
      }

      const match = clickWindows.find((window) => {
        const start = new Date(window.window_start).getTime();
        const end = new Date(window.window_end).getTime();
        return Number.isFinite(start) && Number.isFinite(end)
          ? eventTime >= start && eventTime <= end
          : false;
      });

      return match?.question_id ?? null;
    };

    const violationCounts = violations.reduce((acc, violation) => {
      const questionId = resolveViolationQuestionId(violation);
      if (Number.isFinite(questionId)) {
        acc[questionId] = (acc[questionId] || 0) + 1;
      }
      return acc;
    }, {});

    return res.json({
      session,
      responses: responsesList.map((r) => ({
        ...r,
        violation_count: violationCounts[r.question_id] || 0,
        options: r.options || [],
      })),
    });
  } catch (error) {
    return next(error);
  }
};
