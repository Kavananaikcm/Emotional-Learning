import { useEffect, useState } from "react";
import api from "../api/api.js";

export default function Practice() {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/user/practice-activities")
      .then(({ data }) => setActivities(data.activities))
      .catch(() => setError("Couldn't load practice activities."));
  }, []);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, timeLeft]);

  useEffect(() => {
    if (running && timeLeft === 0) {
      setRunning(false);
      setDone(true);
    }
  }, [timeLeft, running]);

  const startActivity = (activity) => {
    setSelected(activity);
    setTimeLeft(120); // 2-minute short practice activity
    setRunning(true);
    setDone(false);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(1, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Practice Activities</h1>
        <p className="text-gray-500">Choose a topic and complete a short activity to improve focus.</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {!selected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => startActivity(a)}
              className="text-left bg-white rounded-xl border border-brand-100 p-5 hover:shadow-md hover:border-brand-300 transition"
            >
              <h3 className="font-semibold text-gray-800">{a.topic}</h3>
              <p className="text-sm text-gray-500 mt-1">{a.instructions}</p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="bg-white rounded-2xl border border-brand-100 p-8 text-center max-w-md mx-auto">
          <h2 className="font-semibold text-gray-800 text-lg">{selected.topic}</h2>
          <p className="text-gray-500 mt-2 mb-6">{selected.instructions}</p>

          {!done ? (
            <>
              <div className="text-5xl font-bold text-brand-600 mb-6">
                {minutes}:{seconds}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setRunning((r) => !r)}
                  className="px-5 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition"
                >
                  {running ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={() => {
                    setSelected(null);
                    setRunning(false);
                  }}
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">✅</div>
              <p className="text-emerald-600 font-medium mb-6">Activity complete. Nice focus!</p>
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition"
              >
                Choose another activity
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
