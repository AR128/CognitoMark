import { all, get, run } from "../db/database.js";
import { getIo } from "../sockets/index.js";

export const studentLogin = (req, res, next) => {
  try {
    const { studentId, name } = req.body;
    let student = get("SELECT * FROM students WHERE student_id = @student_id", {
      student_id: studentId,
    });

    if (!student) {
      const info = run(
        "INSERT INTO students (student_id, name) VALUES (@student_id, @name)",
        { student_id: studentId, name }
      );
      student = get("SELECT * FROM students WHERE id = @id", {
        id: info.lastInsertRowid,
      });
    }

    const exams = all("SELECT * FROM exams ORDER BY created_at DESC");

    return res.json({ student, exams });
  } catch (error) {
    return next(error);
  }
};

export const startExam = (req, res, next) => {
  try {
    const { examId } = req.params;
    const { studentId } = req.body;

    const student = get("SELECT * FROM students WHERE student_id = @student_id", {
      student_id: studentId,
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const exam = get("SELECT * FROM exams WHERE id = @id", { id: examId });
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const info = run(
      "INSERT INTO exam_sessions (student_id, exam_id) VALUES (@student_id, @exam_id)",
      { student_id: student.id, exam_id: examId }
    );

    const session = get("SELECT * FROM exam_sessions WHERE id = @id", {
      id: info.lastInsertRowid,
    });

    const questions = all(
      "SELECT * FROM questions WHERE exam_id = @exam_id ORDER BY created_at ASC",
      { exam_id: examId }
    ).map((q) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : [],
    }));

    getIo().emit("student_started", {
      sessionId: session.id,
      studentId: student.student_id,
      studentName: student.name,
      examTitle: exam.title,
      startedAt: session.started_at,
    });

    return res.json({ session, exam, questions });
  } catch (error) {
    return next(error);
  }
};
