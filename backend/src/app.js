import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", sessionRoutes);

app.use(errorHandler);

export default app;
