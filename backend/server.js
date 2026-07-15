import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./src/db/lowdb.js";
import { requireAuth } from "./src/middleware/auth.js";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MindLearn API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", requireAuth, userRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Central error handler (so an unexpected error never crashes the server)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`MindLearn backend running on http://localhost:${PORT}`);
  });
}

start();
