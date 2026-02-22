import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initDb } from "./db/initDb.js";
import { initSockets } from "./sockets/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

await initDb();
initSockets(server);

server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${PORT}`);
});
