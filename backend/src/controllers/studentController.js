import { getCollection, getNextSequence } from "../db/database.js";
import { getIo } from "../sockets/index.js";

const students = () => getCollection("students");
const exams = () => getCollection("exams");
const questions = () => getCollection("questions");
const examSessions = () => getCollection("exam_sessions");

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const studentLogin = async (req, res, next) => {
  try {
    const { studentId, name } = req.body;
    let student = await students().findOne(
      { student_id: studentId },
      { projection: { _id: 0 } },
    );

    if (!student) {
      const id = await getNextSequence("students");
      student = {
        id,
        student_id: studentId,
        name,
        created_at: new Date().toISOString(),
      };
      await students().insertOne(student);
    }

    const examsList = await exams()
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray();

    getIo().emit("student_created", {
      student,
    });

    return res.json({ student, exams: examsList });
  } catch (error) {
    return next(error);
  }
};

export const startExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { studentId } = req.body;
    const parsedExamId = toNumber(examId);
    if (!parsedExamId) {
      return res.status(400).json({ error: "Invalid exam id" });
    }

    const student = await students().findOne(
      { student_id: studentId },
      { projection: { _id: 0 } },
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const exam = await exams().findOne(
      { id: parsedExamId },
      { projection: { _id: 0 } },
    );
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const session = {
      id: await getNextSequence("exam_sessions"),
      student_id: student.id,
      exam_id: parsedExamId,
      started_at: new Date().toISOString(),
      submitted_at: null,
      total_clicks: 0,
      stress_level: 0,
      feedback: null,
    };

    await examSessions().insertOne(session);

    const questionsList = await questions()
      .find({ exam_id: parsedExamId }, { projection: { _id: 0 } })
      .sort({ created_at: 1 })
      .toArray();

    getIo().emit("student_started", {
      sessionId: session.id,
      studentId: student.student_id,
      studentName: student.name,
      examTitle: exam.title,
      startedAt: session.started_at,
    });

    return res.json({
      session,
      exam,
      questions: questionsList.map((q) => ({
        ...q,
        options: q.options || [],
      })),
    });
  } catch (error) {
    return next(error);
  }
};
