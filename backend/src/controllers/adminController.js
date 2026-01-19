import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { all, get, run } from "../db/database.js";

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = get("SELECT * FROM admins WHERE username = @username", {
      username,
    });

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

export const getDashboardLive = (req, res, next) => {
  try {
    const activeCount = get(
      "SELECT COUNT(*) as count FROM exam_sessions WHERE submitted_at IS NULL"
    );
    const submittedCount = get(
      "SELECT COUNT(*) as count FROM exam_sessions WHERE submitted_at IS NOT NULL"
    );
    const avgStress = get(
      "SELECT AVG(stress_level) as avg FROM exam_sessions WHERE stress_level > 0"
    );
    const avgClicks = get(
      "SELECT AVG(total_clicks) as avg FROM exam_sessions"
    );

    const sessions = all(
      `SELECT es.id, s.student_id, s.name, e.title as exam_title,
              es.total_clicks, es.stress_level, es.started_at, es.submitted_at
       FROM exam_sessions es
       JOIN students s ON s.id = es.student_id
       JOIN exams e ON e.id = es.exam_id
       ORDER BY es.started_at DESC
       LIMIT 100`
    );

    return res.json({
      metrics: {
        activeStudents: activeCount.count,
        submittedStudents: submittedCount.count,
        averageStress: Number(avgStress.avg || 0).toFixed(2),
        averageClicks: Number(avgClicks.avg || 0).toFixed(2),
      },
      sessions,
    });
  } catch (error) {
    return next(error);
  }
};

export const getExams = (req, res, next) => {
  try {
    const exams = all("SELECT * FROM exams ORDER BY created_at DESC");
    return res.json(exams);
  } catch (error) {
    return next(error);
  }
};

export const createExam = (req, res, next) => {
  try {
    const { title } = req.body;
    const info = run("INSERT INTO exams (title) VALUES (@title)", { title });
    const exam = get("SELECT * FROM exams WHERE id = @id", {
      id: info.lastInsertRowid,
    });
    return res.status(201).json(exam);
  } catch (error) {
    return next(error);
  }
};

export const deleteExam = (req, res, next) => {
  try {
    run("DELETE FROM exams WHERE id = @id", { id: req.params.id });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getExamQuestions = (req, res, next) => {
  try {
    const questions = all(
      "SELECT * FROM questions WHERE exam_id = @exam_id ORDER BY created_at DESC",
      { exam_id: req.params.id }
    );
    return res.json(questions.map((q) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : [],
    })));
  } catch (error) {
    return next(error);
  }
};

export const createQuestion = (req, res, next) => {
  try {
    const { examId, text, type, options } = req.body;
    const optionsJson = options ? JSON.stringify(options) : null;
    const info = run(
      "INSERT INTO questions (exam_id, text, type, options) VALUES (@exam_id, @text, @type, @options)",
      {
        exam_id: examId,
        text,
        type,
        options: optionsJson,
      }
    );
    const question = get("SELECT * FROM questions WHERE id = @id", {
      id: info.lastInsertRowid,
    });
    return res.status(201).json({
      ...question,
      options: question.options ? JSON.parse(question.options) : [],
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteQuestion = (req, res, next) => {
  try {
    run("DELETE FROM questions WHERE id = @id", { id: req.params.id });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getStudents = (req, res, next) => {
  try {
    const students = all("SELECT * FROM students ORDER BY created_at DESC");
    return res.json(students);
  } catch (error) {
    return next(error);
  }
};

export const deleteStudent = (req, res, next) => {
  try {
    run("DELETE FROM students WHERE id = @id", { id: req.params.id });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getSessions = (req, res, next) => {
  try {
    const sessions = all(
      `SELECT es.id, s.student_id, s.name, e.title as exam_title,
              es.total_clicks, es.stress_level, es.started_at, es.submitted_at
       FROM exam_sessions es
       JOIN students s ON s.id = es.student_id
       JOIN exams e ON e.id = es.exam_id
       ORDER BY es.started_at DESC`
    );
    return res.json(sessions);
  } catch (error) {
    return next(error);
  }
};

export const getSessionDetail = (req, res, next) => {
  try {
    const session = get(
      `SELECT es.*, s.student_id, s.name, e.title as exam_title
       FROM exam_sessions es
       JOIN students s ON s.id = es.student_id
       JOIN exams e ON e.id = es.exam_id
       WHERE es.id = @id`,
      { id: req.params.sessionId }
    );

    const responses = all(
      `SELECT r.*, q.text, q.type, q.options
       FROM responses r
       JOIN questions q ON q.id = r.question_id
       WHERE r.session_id = @session_id`,
      { session_id: req.params.sessionId }
    ).map((r) => ({
      ...r,
      options: r.options ? JSON.parse(r.options) : [],
    }));

    return res.json({ session, responses });
  } catch (error) {
    return next(error);
  }
};
