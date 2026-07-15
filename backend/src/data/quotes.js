// Original motivational lines written for this app (no copyrighted quotes reproduced).
export const QUOTES = [
  "Small steps, repeated daily, outrun big leaps taken rarely.",
  "You don't need to feel ready to begin. Beginning is what makes you ready.",
  "Progress hides inside boring, consistent days.",
  "Confusion is just your brain building a new shortcut. Keep going.",
  "The lesson doesn't have to be perfect. It just has to be started.",
  "Rest is part of the work, not the opposite of it.",
  "Every expert was once someone who refused to quit on a hard day.",
  "Your focus today is a muscle. It grows every time you use it, even briefly.",
  "A calm mind learns faster than a rushed one.",
  "You are allowed to feel behind and still move forward.",
];

// Mood -> suggested content. We recommend well-known titles by name only
// (never reproduce scripts, jokes, or copyrighted transcripts).
export const MOOD_SUGGESTIONS = {
  sad: {
    exercises: ["Breathing Reset (4-4-6 count)", "Gentle stretch break", "Write 3 things that went okay today"],
    mindGames: ["2-minute doodle break", "Simple number-matching puzzle"],
    standup: ["Look up a short clean stand-up clip from a comedian you already enjoy"],
    movies: ["A light-hearted comfort movie or feel-good sitcom episode"],
    note: "Feeling sad is worth noticing, not fixing on a schedule. Be gentle with yourself.",
  },
  anxious: {
    exercises: ["Box breathing (4-4-4-4)", "Grounding: name 5 things you can see", "Slow shoulder rolls"],
    mindGames: ["Simple sudoku or a slow puzzle game"],
    standup: ["A calm, low-energy stand-up special rather than high-energy hype comedy"],
    movies: ["A familiar, predictable movie you've already seen (reduces uncertainty)"],
    note: "Anxiety often eases with predictable, low-stimulation activities before returning to study.",
  },
  angry: {
    exercises: ["Brisk short walk", "Squeeze-and-release fist exercise 10x", "Write the frustration down, then set it aside"],
    mindGames: ["Fast-paced but simple tap/reaction game to release energy"],
    standup: ["High-energy stand-up to redirect the intensity into laughter"],
    movies: ["An action-comedy to burn off adrenaline productively"],
    note: "Anger is energy. Channeling it into a short physical or fast activity first helps.",
  },
  confusion: {
    exercises: ["Re-explain the topic out loud in your own words", "Draw a quick diagram of what you do understand"],
    mindGames: ["A simple pattern-matching game to reset your thinking"],
    standup: ["A short, easy stand-up clip as a mental reset"],
    movies: ["A light comedy you don't need to concentrate hard on"],
    note: "Confusion usually means you're one clarifying question away from clicking.",
  },
  calm: {
    exercises: ["Continue your current lesson at a steady pace", "Try a slightly harder practice activity"],
    mindGames: ["A medium-difficulty logic puzzle"],
    standup: ["Any stand-up special that matches your usual taste"],
    movies: ["Whatever's next on your watchlist"],
    note: "You're in a great state for deep, focused learning right now.",
  },
  happy: {
    exercises: ["Ride the momentum into a fast-paced lesson", "Try a slightly more challenging topic"],
    mindGames: ["A quick, energetic reaction-time game"],
    standup: ["A high-energy stand-up special to keep the mood going"],
    movies: ["An upbeat feel-good movie to end the day"],
    note: "Great mood for tackling something new or slightly harder.",
  },
  curious: {
    exercises: ["Explore a related sub-topic you haven't tried yet", "Try active recall on today's material"],
    mindGames: ["A trivia or exploration-style puzzle"],
    standup: ["A witty, idea-driven stand-up special"],
    movies: ["A documentary or mystery movie"],
    note: "Curiosity is one of the best states for learning something brand new.",
  },
};

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
