import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, "../../exam-portal.db");

export const db = new Database(dbPath);

export const run = (sql, params = {}) => db.prepare(sql).run(params);
export const get = (sql, params = {}) => db.prepare(sql).get(params);
export const all = (sql, params = {}) => db.prepare(sql).all(params);
