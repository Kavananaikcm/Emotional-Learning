import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const EMOTION_EMOJI = {
  happy: "😄",
  sad: "😢",
  curious: "🤔",
  confusion: "😵",
  calm: "😌",
  anxious: "😰",
  angry: "😠",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const { data } = await api.get("/user/stats");
      setStats(data);
      setError("");
    } catch {
      setError("Couldn't load your stats right now. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // Refresh stats periodically so the focus level updates live as time is tracked.
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-20">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-20">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-gray-500">Here's how your learning is going.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Focus Level"
          value={`${stats.focusLevel}%`}
          sub={`${stats.todayMinutes.toFixed(1)} / ${stats.dailyGoalMinutes} min today`}
          color="from-brand-500 to-brand-400"
        />
        <StatCard
          label="Lesson Completion"
          value={`${stats.lessonCompletion}%`}
          sub={`${stats.completedCount} / ${stats.totalLessons} lessons`}
          color="from-emerald-500 to-emerald-400"
        />
        <StatCard
          label="Current Emotion"
          value={
            stats.currentEmotion
              ? `${EMOTION_EMOJI[stats.currentEmotion] || "🙂"} ${stats.currentEmotion}`
              : "Not detected yet"
          }
          sub="From your latest check-in"
          color="from-amber-500 to-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLink to="/learning" emoji="📚" label="Learning Hub" />
        <QuickLink to="/webcam-emotion" emoji="📷" label="Webcam Emotion" />
        <QuickLink to="/voice-mood" emoji="🎙️" label="Voice Mood Check" />
        <QuickLink to="/quiz" emoji="📝" label="Quiz Practice" />
      </div>

      {stats.recentEmotions?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-brand-100">
          <h2 className="font-semibold text-gray-700 mb-3">Recent Emotion Check-ins</h2>
          <div className="flex flex-wrap gap-2">
            {stats.recentEmotions.slice().reverse().map((e, i) => (
              <span
                key={i}
                className="text-sm px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100"
              >
                {EMOTION_EMOJI[e.emotion] || "🙂"} {e.emotion}{" "}
                <span className="text-gray-400">· {e.source}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className={`rounded-2xl p-6 text-white bg-gradient-to-br ${color} shadow-lg`}>
      <div className="text-sm opacity-90">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      <div className="text-xs opacity-80 mt-2">{sub}</div>
    </div>
  );
}

function QuickLink({ to, emoji, label }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl p-5 border border-brand-100 hover:shadow-md hover:border-brand-300 transition text-center"
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
    </Link>
  );
}
