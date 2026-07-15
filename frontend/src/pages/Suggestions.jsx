import { useEffect, useState } from "react";
import api from "../api/api.js";

const EMOTION_EMOJI = {
  happy: "😄",
  sad: "😢",
  curious: "🤔",
  confusion: "😵",
  calm: "😌",
  anxious: "😰",
  angry: "😠",
};

export default function Suggestions() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/user/suggestions")
      .then(({ data }) => setData(data))
      .catch(() => setError("Couldn't load suggestions right now."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-500 py-20">Loading suggestions...</div>;
  if (error) return <div className="text-center text-red-600 py-20">{error}</div>;

  const { emotion, suggestion, quote } = data;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Suggestions</h1>
        <p className="text-gray-500">
          Personalized based on your latest mood: {EMOTION_EMOJI[emotion]} {emotion}
        </p>
      </div>

      <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl p-6 shadow-lg">
        <p className="text-sm opacity-80 mb-2">Motivational quote</p>
        <p className="text-xl font-semibold leading-snug">"{quote}"</p>
      </div>

      {suggestion.note && (
        <p className="text-gray-600 italic text-center">{suggestion.note}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SuggestionCard title="🧘 Exercises" items={suggestion.exercises} />
        <SuggestionCard title="🎮 Mind Games" items={suggestion.mindGames} />
        <SuggestionCard title="😂 Stand-Up Comedy" items={suggestion.standup} />
        <SuggestionCard title="🎬 Movie Suggestions" items={suggestion.movies} />
      </div>
    </div>
  );
}

function SuggestionCard({ title, items }) {
  return (
    <div className="bg-white rounded-xl border border-brand-100 p-5">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
