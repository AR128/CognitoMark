import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import {
  clicksSchema,
  responseSchema,
  stressSchema,
  submitSchema,
} from "../utils/validators.js";
import {
  saveResponse,
  submitExam,
  updateClicks,
  updateStress,
} from "../controllers/sessionController.js";

const router = Router();

router.post("/sessions/:sessionId/response", validate(responseSchema), saveResponse);
router.post("/sessions/:sessionId/clicks", validate(clicksSchema), updateClicks);
router.post("/sessions/:sessionId/stress", validate(stressSchema), updateStress);
router.post("/sessions/:sessionId/submit", validate(submitSchema), submitExam);

export default router;
