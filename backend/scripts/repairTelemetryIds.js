import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "exam_portal";

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const main = async () => {
  await mongoose.connect(uri, { dbName });
  const db = mongoose.connection.db;
  const telemetry = db.collection("telemetry_events");
  const counters = db.collection("counters");

  const docs = await telemetry
    .find({}, { projection: { _id: 1, id: 1 } })
    .sort({ _id: 1 })
    .toArray();

  let nextId = 1;
  const updates = [];

  for (const doc of docs) {
    const numericId = toNumber(doc.id);
    if (numericId !== nextId) {
      updates.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { id: nextId } },
        },
      });
    }
    nextId += 1;
  }

  if (updates.length) {
    await telemetry.bulkWrite(updates, { ordered: true });
  }

  await counters.updateOne(
    { _id: "telemetry_events" },
    { $set: { seq: nextId - 1 } },
    { upsert: true },
  );

  await mongoose.disconnect();
};

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
