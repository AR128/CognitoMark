import bcrypt from "bcryptjs";
import { connectDb, getCollection, getNextSequence } from "./database.js";

const ensureIndexes = async () => {
  await getCollection("admins").createIndex({ id: 1 }, { unique: true });
  await getCollection("admins").createIndex({ username: 1 }, { unique: true });
  await getCollection("students").createIndex({ id: 1 }, { unique: true });
  await getCollection("students").createIndex(
    { student_id: 1 },
    { unique: true },
  );
  await getCollection("exams").createIndex({ id: 1 }, { unique: true });
  await getCollection("questions").createIndex({ id: 1 }, { unique: true });
  await getCollection("exam_sessions").createIndex({ id: 1 }, { unique: true });
  await getCollection("responses").createIndex({ id: 1 }, { unique: true });
  await getCollection("telemetry_events").createIndex({ id: 1 }, { unique: true });
  await getCollection("click_timeseries").createIndex({ id: 1 }, { unique: true });
  await getCollection("responses").createIndex(
    { session_id: 1, question_id: 1 },
    { unique: true },
  );
  await getCollection("exam_sessions").createIndex({ exam_id: 1 });
  await getCollection("exam_sessions").createIndex({ student_id: 1 });
  await getCollection("click_timeseries").createIndex({ session_id: 1 });
  await getCollection("telemetry_events").createIndex({ session_id: 1 });
  await getCollection("questions").createIndex({ exam_id: 1 });
};

const syncCounter = async (sequenceName, collectionName) => {
  const collection = getCollection(collectionName);
  const counters = getCollection("counters");

  const maxRows = await collection
    .aggregate([
      {
        $project: {
          idNum: {
            $convert: {
              input: "$id",
              to: "long",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      { $group: { _id: null, maxId: { $max: "$idNum" } } },
    ])
    .toArray();

  const maxId = maxRows?.[0]?.maxId;
  if (!Number.isFinite(maxId)) {
    return;
  }

  const current = await counters.findOne({ _id: sequenceName });
  const currentSeq = Number.isFinite(current?.seq) ? current.seq : 0;
  if (maxId > currentSeq) {
    await counters.updateOne(
      { _id: sequenceName },
      { $set: { seq: Number(maxId) } },
      { upsert: true },
    );
  }
};

export const initDb = async () => {
  await connectDb();
  await ensureIndexes();

  await Promise.all([
    syncCounter("admins", "admins"),
    syncCounter("students", "students"),
    syncCounter("exams", "exams"),
    syncCounter("questions", "questions"),
    syncCounter("exam_sessions", "exam_sessions"),
    syncCounter("responses", "responses"),
    syncCounter("telemetry_events", "telemetry_events"),
    syncCounter("click_timeseries", "click_timeseries"),
  ]);

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const admins = getCollection("admins");
  const adminExists = await admins.findOne({ username: adminUsername });

  if (!adminExists) {
    const hash = await bcrypt.hash(adminPassword, 10);
    const id = await getNextSequence("admins");
    await admins.insertOne({
      id,
      username: adminUsername,
      password_hash: hash,
      created_at: new Date().toISOString(),
    });
  }
};
