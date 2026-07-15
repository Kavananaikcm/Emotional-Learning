# MindLearn — Emotion-Adaptive Learning Platform

A full-stack web app that adapts lessons, pace, and suggestions to how a
learner is feeling — combining a real in-browser face-expression ML model,
browser speech recognition, focus-time tracking, and a mood-aware content
engine.

**Stack:** React (Vite) + Tailwind CSS v4 on the frontend, Node.js + Express
+ JWT auth on the backend, `face-api.js` (TensorFlow.js under the hood) for
webcam emotion detection, and the Web Speech API for voice transcription.

---

## 1. What's actually "real" here (read this before your interview/demo)

Being upfront about this will make you sound *more* credible in interviews,
not less:

- **Webcam emotion detection is a real ML model** (`face-api.js`, a
  TensorFlow.js-based face detector + expression classifier) running
  entirely in the browser. It predicts 7 expressions (happy, sad, angry,
  fearful, disgusted, surprised, neutral), which this app maps onto its own
  7-emotion vocabulary (happy, sad, angry, anxious, confusion, curious, calm).
  It is genuinely useful but **not clinically accurate** — lighting, camera
  angle, and glasses all affect it. No serious engineer claims 100% accuracy
  on facial emotion recognition, and you shouldn't either in an interview —
  instead, explain the trade-off, which shows maturity.
- **Voice mood detection uses real speech-to-text** (the browser's built-in
  Web Speech API), then a **transparent keyword lexicon** (rule-based, not
  ML) to guess a mood from the words used. This is simple by design — it's
  explainable, works offline once transcribed, and is honest about its
  limits.
- **Focus Level %** is computed from real usage data: the frontend pings the
  backend every 30 seconds while the tab is visible, the backend logs actual
  minutes per day, and Focus Level = (minutes spent today ÷ daily goal) × 100,
  averaged over the last 7 days.
- **Lesson Completion %** = (lessons marked complete ÷ total lessons) × 100,
  tracked per user in the database.

This gives you a genuinely defensible, demoable project — not a project that
falls apart under a single follow-up question.

---

## 2. Features included

- Welcome page → Sign in / Sign up (email + password, JWT auth, hashed
  passwords)
- **Dashboard**: Focus Level %, Lesson Completion %, current detected
  emotion, recent emotion history
- **Learning Hub**: personalized lesson list (sorted by your last detected
  mood + preferred pace) + an emotion-aware interactive reading exercise
  with instant feedback
- **Practice Activities**: pick a topic, run a short timed focus activity
- **Webcam Emotion Analysis**: start camera → capture frame → real ML
  emotion detection (happy / sad / curious / confusion / calm / anxious /
  angry)
- **Voice Mood Check**: start listening → live transcript → inferred mood
- **Quiz Practice**: 2-question quiz → emotion + pace preference saved
- **Suggestions**: motivational quote, exercises, mind games, stand-up
  comedy & movie recommendations — all personalized to your latest mood
- Fully responsive (mobile hamburger menu, responsive grids) — works on
  phone, tablet, and desktop

---

## 3. Project structure

```
mindlearn/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── db/lowdb.js        # simple file-based JSON database
│       ├── data/lessons.js    # lesson + practice activity catalog
│       ├── data/quotes.js     # quotes + mood-based suggestions
│       ├── middleware/auth.js # JWT auth middleware
│       ├── routes/auth.js     # signup / login
│       └── routes/user.js     # stats, lessons, emotion, quiz, suggestions
└── frontend/
    ├── index.html
    ├── package.json
    ├── .env.example
    ├── public/models/         # face-api.js ML model weight files
    └── src/
        ├── main.jsx, App.jsx
        ├── api/api.js          # axios client with JWT interceptor
        ├── context/AuthContext.jsx
        ├── hooks/useActivityTracker.js
        ├── components/        # Navbar, AppLayout, ProtectedRoute
        └── pages/              # Welcome, Login, Signup, Dashboard,
                                 # LearningHub, Practice, WebcamEmotion,
                                 # VoiceMood, Quiz, Suggestions, NotFound
```

---

## 4. Step-by-step setup (VS Code)

### Prerequisites
- Install **Node.js 18+** from https://nodejs.org (this includes npm)
- Install **VS Code** from https://code.visualstudio.com

### Step 1 — Open the project
1. Unzip the project folder.
2. Open VS Code → File → Open Folder → select the unzipped `mindlearn` folder.
3. Open a terminal in VS Code: **Terminal → New Terminal**.

### Step 2 — Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and (optionally) change `JWT_SECRET` to your own random string.

Start the backend:
```bash
npm start
```
You should see:
```
MindLearn backend running on http://localhost:5000
```
Leave this terminal running. Test it worked by visiting
`http://localhost:5000/api/health` in your browser — you should see
`{"status":"ok", ...}`.

### Step 3 — Frontend setup
Open a **second terminal** in VS Code (don't close the backend one):
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
You should see something like:
```
VITE ready in ...ms
Local:   http://localhost:5173/
```

### Step 4 — Use the app
Open `http://localhost:5173` in **Google Chrome** (recommended — it has the
best support for both the webcam ML model and the Web Speech API used for
voice mood detection). Sign up with any name/email/password (min 6
characters) and explore every feature from the nav bar.

> **Note on browser support:** Voice Mood Check uses the Web Speech API,
> which is currently best supported in Chrome and Chromium-based browsers
> (Edge, Brave). It will show a clear "not supported" message on browsers
> without support (e.g. Firefox) instead of crashing.

> **Note on webcam/mic permissions:** Your browser will ask for camera/
> microphone permission the first time you use those pages — click Allow.

### Step 5 (optional) — Build for production
```bash
cd frontend
npm run build
npm run preview   # serves the production build locally to test it
```
For the backend, `npm start` already runs the production server (there's no
separate build step for plain Node/Express).

---

## 5. Deploying (for your resume / live demo link)

- **Backend**: deploy `backend/` to Render, Railway, or Fly.io (set the
  `JWT_SECRET` and `PORT` environment variables there).
- **Frontend**: deploy `frontend/` to Vercel or Netlify. Set the
  `VITE_API_URL` environment variable to your deployed backend's URL
  (e.g. `https://your-backend.onrender.com/api`).
- This app's database (`lowdb`, a JSON file) is fine for a demo/resume
  project but **not for production traffic** — for a real deployment, swap
  it for PostgreSQL/MongoDB. This is worth mentioning proactively in an
  interview as "next steps I'd take to production-harden it."

---

## 6. Why this is a strong resume project

- Full JWT authentication flow with hashed passwords
- A real, working, in-browser ML model (not a mocked API call)
- Genuine browser APIs (camera, microphone, speech recognition)
- A meaningful, explainable metric (Focus Level) computed from real usage
  data, not a random number
- Clean separation of concerns (routes / middleware / data layer)
- Fully responsive, mobile-friendly UI
- Honest, defensible scope — you can explain every line of it under
  interview questioning
