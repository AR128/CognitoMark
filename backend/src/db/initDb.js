import bcrypt from "bcryptjs";
import { db, run, get } from "./database.js";

const schema = `
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  type TEXT NOT NULL,
  options TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);

CREATE TABLE IF NOT EXISTS exam_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  exam_id INTEGER NOT NULL,
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  submitted_at TEXT,
  total_clicks INTEGER DEFAULT 0,
  stress_level INTEGER DEFAULT 0,
  feedback TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);

CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  answer TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, question_id),
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS telemetry_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  value TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id)
);
`;

export const initDb = async () => {
  db.exec(schema);

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const adminExists = get("SELECT id FROM admins WHERE username = @username", {
    username: adminUsername,
  });

  if (!adminExists) {
    const hash = await bcrypt.hash(adminPassword, 10);
    run(
      "INSERT INTO admins (username, password_hash) VALUES (@username, @password_hash)",
      { username: adminUsername, password_hash: hash }
    );
  }
};
