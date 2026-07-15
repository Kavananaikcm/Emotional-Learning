import { Router } from "express";
import { db } from "../db/lowdb.js";
import { LESSONS, PRACTICE_ACTIVITIES } from "../data/lessons.js";
import { QUOTES, MOOD_SUGGESTIONS, getRandomQuote } from "../data/quotes.js";

const router = Router();

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function findUser(req) {
  return db.data.users.find((u) => u.id === req.userId);
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

// ---------- Profile ----------
router.get("/me", async (req, res) => {
  await db.read();
  const user = findUser(req);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(user) });
});

// ---------- Activity logging (used to compute Focus Level) ----------
// The client pings this periodically (e.g. every 30s while the app tab is
// active/focused) with how many minutes were spent. Focus Level is then
// calculated as: (minutes spent today / daily goal minutes) * 100, capped at 100.
router.post("/activity", async (req, res) => {
  const { minutes } = req.body;
  if (typeof minutes !== "number" || minutes < 0 || minutes > 180) {
    return res.status(400).json({ error: "minutes must be a reasonable number between 0 and 180." });
  }
  await db.read();
  const user = findUser(req);
  if (!user) return res.status(404).json({ error: "User not found." });

  const today = todayStr();
  let entry = user.activityLog.find((a) => a.date === today);
  if (!entry) {
    entry = { date: today, minutes: 0 };
    user.activityLog.push(entry);
  }
  entry.minutes += minutes;

  await db.write();
  res.json({ activityLog: user.activityLog });
});

// ---------- Lesson completion ----------
router.post("/lessons/:lessonId/complete", async (req, res) => {
  const { lessonId } = req.params;
  const lessonExists = LESSONS.some((l) => l.id === lessonId);
  if (!lessonExists) {
    return res.status(404).json({ error: "That lesson does not exist." });
  }
  await db.read();
  const user = findUser(req);
  if (!user) return res.status(404).json({ error: "User not found." });

  if (!user.lessonsCompleted.includes(lessonId)) {
    user.lessonsCompleted.push(lessonId);
    await db.write();
  }
  res.json({ lessonsCompleted: user.lessonsCompleted });
});

router.get("/lessons", async (req, res) => {
  await db.read();
  const user = findUser(req);
  if (!user) return res.status(404).json({ error: "User not found." });

  const lastEmotion = user.emotionHistory.length
    ? user.emotionHistory[user.emotionHistory.length - 1].emotion
    : null;
  const preferredPace = user.quizAnswers?.pace || null;

  // Personalize order: lessons matching the user's last known emotion
  // and/or preferred pace are surfaced first.
  const scored = LESSONS.map((l) => {
    let score = 0;
    if (lastEmotion && l.bestMoods.includes(lastEmotion)) score += 2;
    if (preferredPace && l.pace === preferredPace) score += 1;
    return { ...l, _score: score, completed: user.lessonsCompleted.includes(l.id) };
  }).sort((a, b) => b._score - a._score);

  res.json({ lessons: scored, lastEmotion, preferredPace });
});

router.get("/practice-activities", (req, res) => {
  res.json({ activities: PRACTICE_ACTIVITIES });
});

// ---------- Emotion detection results (from webcam or voice) ----------
router.post("/emotion", async (req, res) => {
  const { source, emotion } = req.body;
  const validSources = ["webcam", "voice", "quiz"];
  const validEmotions = ["happy", "sad", "curious", "confusion", "calm", "anxious", "angry"];
  if (!validSources.includes(source) || !validEmotions.includes(emotion)) {
    return res.status(400).json({ error: "Invalid source or emotion value." });
  }
  await db.read();
  const user = findUser(req);
  if (!user) return res.status(404).json({ error: "User not found." });

  user.emotionHistory.push({ source, emotion, timestamp: new Date().toISOString() });
  // Keep the log from growing unbounded
  if (user.emotionHistory.length > 200) {
    user.emotionHistory = user.emotionHistory.slice(-200);
  }
  await db.write();
  res.json({ emotionHistory: user.emotionHistory });
});

// ---------- Quiz answers ----------
router.post("/quiz", async (req, res) => {
  const { startFeeling, pace } = req.body;
  await db.read();
  const user = findUser(req);
  if (!user) return res.status(404).json({ error: "User not found." });

  user.quizAnswers = { ...user.quizAnswers, startFeeling, pace };
  if (startFeeling) {
    user.emotionHistory.push({ source: "quiz", emotion: startFeeling, timestamp: new Date().toISOString() });
  }
  await db.write();

  const suggestion = MOOD_SUGGESTIONS[startFeeling] || MOOD_SUGGESTIONS.calm;
  res.json({ quizAnswers: user.quizAnswers, suggestion, quote: getRandomQuote() });
});

// ---------- Suggestions page ----------
router.get("/suggestions", async (req, res) => {
  await db.read();
  const user = findUser(req);
  if (!user) return res.status(404).json({ error: "User not found." });
  const lastEmotion = user.emotionHistory.length
    ? user.emotionHistory[user.emotionHistory.length - 1].emotion
    : "calm";
  const suggestion = MOOD_SUGGESTIONS[lastEmotion] || MOOD_SUGGESTIONS.calm;
  res.json({ emotion: lastEmotion, suggestion, quote: getRandomQuote(), allQuotes: QUOTES });
});

// ---------- Dashboard stats: Focus Level % and Lesson Completion % ----------
router.get("/stats", async (req, res) => {
  await db.read();
  const user = findUser(req);
  if (!user) return res.status(404).json({ error: "User not found." });

  // Focus Level = average, over the last 7 days, of (minutes spent / daily goal),
  // expressed as a percentage capped at 100.
  const goal = user.dailyGoalMinutes || 60;
  const now = new Date();
  const last7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    last7.push(d.toISOString().slice(0, 10));
  }
  const minutesByDay = last7.map((date) => {
    const entry = user.activityLog.find((a) => a.date === date);
    return entry ? entry.minutes : 0;
  });
  const dailyPercents = minutesByDay.map((m) => Math.min(100, (m / goal) * 100));
  const focusLevel = Math.round(
    dailyPercents.reduce((sum, p) => sum + p, 0) / dailyPercents.length
  );

  // Lesson Completion = (lessons completed / total lessons) * 100
  const totalLessons = LESSONS.length;
  const completedCount = user.lessonsCompleted.length;
  const lessonCompletion = Math.round((completedCount / totalLessons) * 100);

  const recentEmotions = user.emotionHistory.slice(-10);
  const currentEmotion = recentEmotions.length
    ? recentEmotions[recentEmotions.length - 1].emotion
    : null;

  res.json({
    focusLevel,
    todayMinutes: minutesByDay[0],
    dailyGoalMinutes: goal,
    lessonCompletion,
    completedCount,
    totalLessons,
    currentEmotion,
    recentEmotions,
  });
});

export default router;
