import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl">
        <div className="text-6xl mb-6">🧠✨</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-700 mb-4">
          MindLearn
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          The emotion-adaptive learning app that learns how you feel
        </p>
        <p className="text-gray-500 mb-10">
          Lessons that adapt to your mood and pace. Webcam and voice mood
          check-ins. Focus tracking. Personalized suggestions when you need
          them most.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition shadow-lg shadow-brand-500/30"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 rounded-xl bg-white text-brand-700 font-semibold border border-brand-200 hover:bg-brand-50 transition"
          >
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 text-sm text-gray-500">
          <Feature emoji="🎯" label="Focus Tracking" />
          <Feature emoji="📚" label="Adaptive Lessons" />
          <Feature emoji="📷" label="Webcam Mood" />
          <Feature emoji="🎙️" label="Voice Mood" />
        </div>
      </div>
    </div>
  );
}

function Feature({ emoji, label }) {
  return (
    <div className="bg-white/70 rounded-xl p-4 border border-brand-100">
      <div className="text-2xl mb-1">{emoji}</div>
      <div>{label}</div>
    </div>
  );
}
