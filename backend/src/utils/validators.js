import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
});

export const studentLoginSchema = z.object({
  studentId: z.string().min(2),
  name: z.string().min(2),
});

export const examCreateSchema = z.object({
  title: z.string().min(3),
});

export const questionCreateSchema = z.object({
  examId: z.number().int(),
  text: z.string().min(3),
  type: z.enum(["mcq", "text"]),
  options: z.array(z.string()).optional(),
});

export const responseSchema = z.object({
  questionId: z.number().int(),
  answer: z.string().optional(),
});

export const clicksSchema = z.object({
  totalClicks: z.number().int().nonnegative(),
});

export const clickFrequencySchema = z.object({
  windowStart: z.string().min(1),
  windowEnd: z.string().min(1),
  questionId: z.number().int().optional(),
  headerClicks: z.number().int().nonnegative().optional(),
  integrityClicks: z.number().int().nonnegative().optional(),
  stressClicks: z.number().int().nonnegative().optional(),
  questionClicks: z.number().int().nonnegative().optional(),
  footerClicks: z.number().int().nonnegative().optional(),
  otherClicks: z.number().int().nonnegative().optional(),
  clickCount: z.number().int().nonnegative(),
});

export const stressSchema = z.object({
  stressLevel: z.number().int().min(1).max(10),
});

export const submitSchema = z.object({
  feedback: z.string().optional(),
});

export const violationSchema = z.object({
  type: z.enum(["TAB_SWITCH", "MINIMIZE", "FULLSCREEN_EXIT"]),
});
