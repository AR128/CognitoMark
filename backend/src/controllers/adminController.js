import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { all, db, get, run } from "../db/database.js";
import { getIo } from "../sockets/index.js";

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
      "SELECT COUNT(*) as count FROM exam_sessions WHERE submitted_at IS NULL",
    );
    const submittedCount = get(
      "SELECT COUNT(*) as count FROM exam_sessions WHERE submitted_at IS NOT NULL",
    );
    const avgStress = get(
      "SELECT AVG(stress_level) as avg FROM exam_sessions WHERE stress_level > 0",
    );
    const avgClicks = get(
      `SELECT AVG(total) as avg
       FROM (
         SELECT es.id, COALESCE(SUM(ct.click_count), 0) AS total
         FROM exam_sessions es
         LEFT JOIN click_timeseries ct ON ct.session_id = es.id
         GROUP BY es.id
       )`,
    );

    const sessions = all(
      `SELECT es.id,
              s.student_id,
              s.name,
              e.title as exam_title,
              es.stress_level,
              es.started_at,
              es.submitted_at,
              COALESCE((
                SELECT SUM(ct.click_count)
                FROM click_timeseries ct
                WHERE ct.session_id = es.id
              ), 0) AS total_clicks,
              COALESCE((
                SELECT ct.click_count
                FROM click_timeseries ct
                WHERE ct.session_id = es.id
                ORDER BY ct.window_end DESC
                LIMIT 1
              ), 0) AS last_window_clicks,
              (
                SELECT ct.window_start
                FROM click_timeseries ct
                WHERE ct.session_id = es.id
                ORDER BY ct.window_end DESC
                LIMIT 1
              ) AS last_window_start,
              (
                SELECT ct.window_end
                FROM click_timeseries ct
                WHERE ct.session_id = es.id
                ORDER BY ct.window_end DESC
                LIMIT 1
              ) AS last_window_end
       FROM exam_sessions es
       JOIN students s ON s.id = es.student_id
       JOIN exams e ON e.id = es.exam_id
       ORDER BY es.started_at DESC
       LIMIT 100`,
    );

    const clickSeries = all(
      `SELECT ct.session_id,
              ct.window_start,
              ct.window_end,
              ct.click_count,
              ct.question_id,
              q.text as question_text,
              s.student_id,
              s.name,
              e.title as exam_title
       FROM click_timeseries ct
       JOIN exam_sessions es ON es.id = ct.session_id
       JOIN students s ON s.id = es.student_id
       JOIN exams e ON e.id = es.exam_id
       LEFT JOIN questions q ON q.id = ct.question_id
       ORDER BY ct.window_start DESC
       LIMIT 50`,
    );

    return res.json({
      metrics: {
        activeStudents: activeCount.count,
        submittedStudents: submittedCount.count,
        averageStress: Number(avgStress.avg || 0).toFixed(2),
        averageClicks: Number(avgClicks.avg || 0).toFixed(2),
      },
      sessions,
      clickSeries,
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
    const examId = Number(req.params.id);

    const tx = db.transaction((id) => {
      run(
        "DELETE FROM responses WHERE question_id IN (SELECT id FROM questions WHERE exam_id = @exam_id)",
        { exam_id: id },
      );
      run(
        "DELETE FROM responses WHERE session_id IN (SELECT id FROM exam_sessions WHERE exam_id = @exam_id)",
        { exam_id: id },
      );
      run(
        "DELETE FROM telemetry_events WHERE session_id IN (SELECT id FROM exam_sessions WHERE exam_id = @exam_id)",
        { exam_id: id },
      );
      run(
        "DELETE FROM click_timeseries WHERE session_id IN (SELECT id FROM exam_sessions WHERE exam_id = @exam_id)",
        { exam_id: id },
      );
      run("DELETE FROM exam_sessions WHERE exam_id = @exam_id", {
        exam_id: id,
      });
      run("DELETE FROM questions WHERE exam_id = @exam_id", {
        exam_id: id,
      });
      return run("DELETE FROM exams WHERE id = @exam_id", { exam_id: id });
    });

    const result = tx(examId);
    if (!result.changes) {
      return res.status(404).json({ error: "Exam not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getExamQuestions = (req, res, next) => {
  try {
    const questions = all(
      "SELECT * FROM questions WHERE exam_id = @exam_id ORDER BY created_at DESC",
      { exam_id: req.params.id },
    );
    return res.json(
      questions.map((q) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : [],
      })),
    );
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
      },
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
    const questionId = Number(req.params.id);

    const tx = db.transaction((id) => {
      const tables = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
        )
        .all();

      tables.forEach(({ name }) => {
        const fks = db.prepare(`PRAGMA foreign_key_list(${name})`).all();
        fks
          .filter((fk) => fk.table === "questions" && fk.to === "id")
          .forEach((fk) => {
            run(`DELETE FROM "${name}" WHERE "${fk.from}" = @question_id`, {
              question_id: id,
            });
          });
      });

      return run("DELETE FROM questions WHERE id = @question_id", {
        question_id: id,
      });
    });

    const result = tx(questionId);
    if (!result.changes) {
      return res.status(404).json({ error: "Question not found" });
    }
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
    const studentId = Number(req.params.id);

    const tx = db.transaction((id) => {
      run(
        "DELETE FROM responses WHERE session_id IN (SELECT id FROM exam_sessions WHERE student_id = @student_id)",
        { student_id: id },
      );
      run(
        "DELETE FROM telemetry_events WHERE session_id IN (SELECT id FROM exam_sessions WHERE student_id = @student_id)",
        { student_id: id },
      );
      run(
        "DELETE FROM click_timeseries WHERE session_id IN (SELECT id FROM exam_sessions WHERE student_id = @student_id)",
        { student_id: id },
      );
      run("DELETE FROM exam_sessions WHERE student_id = @student_id", {
        student_id: id,
      });
      return run("DELETE FROM students WHERE id = @student_id", {
        student_id: id,
      });
    });

    const result = tx(studentId);
    if (!result.changes) {
      return res.status(404).json({ error: "Student not found" });
    }

    getIo().emit("student_deleted", { studentId });
    getIo().emit("session_deleted"); // Notify sessions list to refresh

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getSessions = (req, res, next) => {
  try {
    const sessions = all(
      `SELECT es.id, s.student_id, s.name, e.title as exam_title,
              (SELECT COALESCE(SUM(click_count), 0) FROM click_timeseries WHERE session_id = es.id) as total_clicks,
              es.stress_level, es.started_at, es.submitted_at
       FROM exam_sessions es
       JOIN students s ON s.id = es.student_id
       JOIN exams e ON e.id = es.exam_id
       ORDER BY es.started_at DESC`,
    );
    return res.json(sessions);
  } catch (error) {
    return next(error);
  }
};

export const getSessionDetail = (req, res, next) => {
  try {
    const session = get(
      `SELECT es.*, s.student_id, s.name, e.title as exam_title,
              (SELECT COALESCE(SUM(click_count), 0) FROM click_timeseries WHERE session_id = es.id) as total_clicks
       FROM exam_sessions es
       JOIN students s ON s.id = es.student_id
       JOIN exams e ON e.id = es.exam_id
       WHERE es.id = @id`,
      { id: req.params.sessionId },
    );

    const responses = all(
      `SELECT r.*, q.text, q.type, q.options,
              (SELECT COALESCE(SUM(click_count), 0) 
               FROM click_timeseries 
               WHERE session_id = r.session_id AND question_id = r.question_id) as click_count,
              (SELECT COALESCE(SUM(header_clicks), 0) 
               FROM click_timeseries 
               WHERE session_id = r.session_id AND question_id = r.question_id) as header_clicks,
              (SELECT COALESCE(SUM(integrity_clicks), 0) 
               FROM click_timeseries 
               WHERE session_id = r.session_id AND question_id = r.question_id) as integrity_clicks,
              (SELECT COALESCE(SUM(stress_clicks), 0) 
               FROM click_timeseries 
               WHERE session_id = r.session_id AND question_id = r.question_id) as stress_clicks,
              (SELECT COALESCE(SUM(question_clicks), 0) 
               FROM click_timeseries 
               WHERE session_id = r.session_id AND question_id = r.question_id) as question_clicks,
              (SELECT COALESCE(SUM(footer_clicks), 0) 
               FROM click_timeseries 
               WHERE session_id = r.session_id AND question_id = r.question_id) as footer_clicks,
              (SELECT COALESCE(SUM(other_clicks), 0) 
               FROM click_timeseries 
               WHERE session_id = r.session_id AND question_id = r.question_id) as other_clicks
       FROM responses r
       JOIN questions q ON q.id = r.question_id
       WHERE r.session_id = @session_id`,
      { session_id: req.params.sessionId },
    ).map((r) => ({
      ...r,
      options: r.options ? JSON.parse(r.options) : [],
    }));

    return res.json({ session, responses });
  } catch (error) {
    return next(error);
  }
};
