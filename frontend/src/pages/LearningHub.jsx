import { useEffect, useState } from "react";
import api from "../api/api.js";

const READING_PASSAGE = {
  title: "Why Small Habits Compound",
  text: `Most people overestimate what a single day of studying can do, and
  underestimate what a small daily habit can do over a month. A twenty
  minute session repeated daily builds a kind of momentum that a single
  three hour cram session never can, because your brain gets repeated
  chances to reinforce the same pathway instead of overloading it once.`,
  questions: [
    {
      id: "q1",
      prompt: "According to the passage, what builds momentum better than a single long session?",
      options: ["A small daily habit", "Studying only on weekends", "Cramming once a month"],
      correct: "A small daily habit",
    },
    {
      id: "q2",
      prompt: "Why does repetition help the brain, based on the passage?",
      options: [
        "It overloads the brain in one go",
        "It gives repeated chances to reinforce the same pathway",
        "It has no real effect",
      ],
      correct: "It gives repeated chances to reinforce the same pathway",
    },
  ],
};

export default function LearningHub() {
  const [lessons, setLessons] = useState([]);
  const [lastEmotion, setLastEmotion] = useState(null);
  const [preferredPace, setPreferredPace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingId, setCompletingId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  const load = async () => {
    try {
      const { data } = await api.get("/user/lessons");
      setLessons(data.lessons);
      setLastEmotion(data.lastEmotion);
      setPreferredPace(data.preferredPace);
    } catch {
      setError("Couldn't load your lessons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markComplete = async (lessonId) => {
    setCompletingId(lessonId);
    try {
      await api.post(`/user/lessons/${lessonId}/complete`);
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, completed: true } : l))
      );
    } catch {
      // no-op, keep UI responsive
    } finally {
      setCompletingId(null);
    }
  };

  const handleAnswer = (qId, choice, correct) => {
    setAnswers((prev) => ({ ...prev, [qId]: choice }));
    setFeedback((prev) => ({
      ...prev,
      [qId]: choice === correct ? "correct" : "incorrect",
    }));
  };

  if (loading) return <div className="text-center text-gray-500 py-20">Loading your learning hub...</div>;
  if (error) return <div className="text-center text-red-600 py-20">{error}</div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Learning Hub</h1>
        <p className="text-gray-500">
          Lessons personalized to your mood{lastEmotion ? ` (${lastEmotion})` : ""} and pace
          {preferredPace ? ` (${preferredPace})` : ""}.
        </p>
      </div>

      {/* Personalized lessons */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-3">Your Lessons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`rounded-xl border p-5 bg-white ${
                lesson.completed ? "border-emerald-300" : "border-brand-100"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-800">{lesson.topic}</h3>
                {lesson.completed && <span className="text-emerald-600 text-sm">✓ Done</span>}
              </div>
              <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <span>{lesson.durationMin} min</span>
                <span>·</span>
                <span className="capitalize">{lesson.pace} pace</span>
              </div>
              {!lesson.completed && (
                <button
                  onClick={() => markComplete(lesson.id)}
                  disabled={completingId === lesson.id}
                  className="mt-3 text-sm px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition disabled:opacity-60"
                >
                  {completingId === lesson.id ? "Marking..." : "Mark Complete"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Emotion-aware reading exercise */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-3">Emotion-Aware Reading</h2>
        <div className="bg-white rounded-xl border border-brand-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">{READING_PASSAGE.title}</h3>
          <p className="text-gray-600 leading-relaxed mb-5">{READING_PASSAGE.text}</p>

          <div className="space-y-5">
            {READING_PASSAGE.questions.map((q) => (
              <div key={q.id}>
                <p className="font-medium text-gray-700 mb-2">{q.prompt}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const chosen = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(q.id, opt, q.correct)}
                        className={`text-sm px-3 py-1.5 rounded-lg border transition ${
                          chosen
                            ? feedback[q.id] === "correct"
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-red-500 text-white border-red-500"
                            : "bg-white border-gray-300 hover:border-brand-400"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {feedback[q.id] && (
                  <p
                    className={`text-sm mt-2 ${
                      feedback[q.id] === "correct" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {feedback[q.id] === "correct"
                      ? "Correct — nice reading comprehension!"
                      : `Not quite. The answer is: ${q.correct}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
