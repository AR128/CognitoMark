import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { requireAdmin } from "../middlewares/auth.js";
import {
  createExam,
  createQuestion,
  deleteExam,
  deleteQuestion,
  deleteStudent,
  getDashboardLive,
  getExamQuestions,
  getExams,
  getSessionDetail,
  getSessions,
  getStudents,
  loginAdmin,
} from "../controllers/adminController.js";
import {
  adminLoginSchema,
  examCreateSchema,
  questionCreateSchema,
} from "../utils/validators.js";

const router = Router();

router.post("/login", validate(adminLoginSchema), loginAdmin);

router.get("/dashboard/live", requireAdmin, getDashboardLive);
router.get("/exams", requireAdmin, getExams);
router.post("/exams", requireAdmin, validate(examCreateSchema), createExam);
router.delete("/exams/:id", requireAdmin, deleteExam);
router.get("/exams/:id/questions", requireAdmin, getExamQuestions);
router.post(
  "/questions",
  requireAdmin,
  validate(questionCreateSchema),
  createQuestion
);
router.delete("/questions/:id", requireAdmin, deleteQuestion);
router.get("/students", requireAdmin, getStudents);
router.delete("/students/:id", requireAdmin, deleteStudent);
router.get("/sessions", requireAdmin, getSessions);
router.get("/sessions/:sessionId", requireAdmin, getSessionDetail);

export default router;
