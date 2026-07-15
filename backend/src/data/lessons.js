// Lesson catalog. In a real production app this would come from a CMS or DB table.
// Each lesson is tagged with the moods/paces it best suits, which the
// LearningHub route uses to personalize the order lessons are shown in.

export const LESSONS = [
  {
    id: "l1",
    topic: "Introduction to Focus",
    description: "A gentle warm-up lesson on what focus feels like and why it drifts.",
    bestMoods: ["calm", "curious", "anxious"],
    pace: "calm",
    durationMin: 5,
  },
  {
    id: "l2",
    topic: "Speed Reading Basics",
    description: "Quick techniques to read faster without losing comprehension.",
    bestMoods: ["happy", "curious"],
    pace: "fast",
    durationMin: 8,
  },
  {
    id: "l3",
    topic: "Calming the Mind Before Study",
    description: "Breathing and grounding techniques for anxious or overwhelmed moments.",
    bestMoods: ["anxious", "sad", "angry"],
    pace: "calm",
    durationMin: 6,
  },
  {
    id: "l4",
    topic: "Active Recall Fundamentals",
    description: "Learn the science-backed method of testing yourself to remember more.",
    bestMoods: ["curious", "calm"],
    pace: "fast",
    durationMin: 10,
  },
  {
    id: "l5",
    topic: "Working Through Confusion",
    description: "A step-by-step approach for when a topic just isn't clicking.",
    bestMoods: ["confusion", "anxious"],
    pace: "calm",
    durationMin: 7,
  },
  {
    id: "l6",
    topic: "Momentum & Fast-Paced Practice",
    description: "Short, energetic drills for when you're feeling motivated and quick.",
    bestMoods: ["happy", "curious"],
    pace: "fast",
    durationMin: 6,
  },
  {
    id: "l7",
    topic: "Reframing Frustration",
    description: "Turning frustration into curiosity using small mindset shifts.",
    bestMoods: ["angry", "confusion"],
    pace: "calm",
    durationMin: 6,
  },
  {
    id: "l8",
    topic: "Deep Work Sprints",
    description: "Structuring short, distraction-free sprints of focused study.",
    bestMoods: ["calm", "happy"],
    pace: "fast",
    durationMin: 12,
  },
  {
    id: "l9",
    topic: "Emotional Check-ins for Learners",
    description: "Why noticing your own mood before a session improves retention.",
    bestMoods: ["sad", "anxious", "calm"],
    pace: "calm",
    durationMin: 5,
  },
  {
    id: "l10",
    topic: "Celebrating Small Wins",
    description: "A short, upbeat lesson on recognizing progress to build motivation.",
    bestMoods: ["happy", "calm"],
    pace: "fast",
    durationMin: 5,
  },
];

export const PRACTICE_ACTIVITIES = [
  { id: "p1", topic: "5-Minute Focus Sprint", instructions: "Pick one small task. Set a 5 minute timer. Work on only that task until it rings." },
  { id: "p2", topic: "Breathing Reset", instructions: "Breathe in for 4 seconds, hold for 4, out for 6. Repeat 5 times before you start studying." },
  { id: "p3", topic: "Two-Minute Brain Dump", instructions: "Write down everything on your mind for 2 minutes, then set it aside and begin your lesson." },
  { id: "p4", topic: "Single-Tab Challenge", instructions: "Close every tab and app except this one for the next 10 minutes." },
  { id: "p5", topic: "Recall Without Notes", instructions: "Without looking at your notes, write down everything you remember from your last lesson." },
];
