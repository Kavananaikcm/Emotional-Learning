import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const Q1_OPTIONS = [
  { value: "happy", label: "😄 Excited and happy" },
  { value: "curious", label: "🤔 Curious to learn" },
  { value: "anxious", label: "😰 A little anxious" },
  { value: "confusion", label: "😵 Confused about where to start" },
  { value: "calm", label: "😌 Calm and ready" },
  { value: "sad", label: "😢 Low energy / down" },
  { value: "angry", label: "😠 Frustrated already" },
];

const Q2_OPTIONS = [
  { value: "calm", label: "🌊 Calm & steady" },
  { value: "fast", label: "⚡ Fast-paced" },
];

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [startFeeling, setStartFeeling] = useState(null);
  const [pace, setPace] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await api.post("/user/quiz", { startFeeling, pace });
      navigate("/suggestions");
    } catch {
      setError("Couldn't save your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quiz Practice</h1>
        <p className="text-gray-500">
          Answer a couple of quick questions to receive emotion-aware recommendations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-100 p-6">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
          <span className={step >= 1 ? "text-brand-600 font-semibold" : ""}>Question 1</span>
          <span>→</span>
          <span className={step >= 2 ? "text-brand-600 font-semibold" : ""}>Question 2</span>
        </div>

        {step === 1 && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">
              How do you feel when you start a new lesson?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Q1_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStartFeeling(opt.value)}
                  className={`text-left px-4 py-3 rounded-lg border transition ${
                    startFeeling === opt.value
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-white border-gray-300 hover:border-brand-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!startFeeling}
              className="mt-6 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">
              Would you like a calm or fast-paced lesson pace?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Q2_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPace(opt.value)}
                  className={`text-left px-4 py-3 rounded-lg border transition ${
                    pace === opt.value
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-white border-gray-300 hover:border-brand-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!pace || submitting}
                className="flex-1 px-6 py-2.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition disabled:opacity-50"
              >
                {submitting ? "Saving..." : "See My Suggestions"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
