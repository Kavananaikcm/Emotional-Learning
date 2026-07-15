import { useEffect, useRef, useState } from "react";
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

// A simple, transparent keyword lexicon used to infer mood from what was said.
// This is a rule-based heuristic (not a deep-learning model) — it's fast,
// explainable, and works fully offline once speech has been transcribed.
const LEXICON = {
  happy: ["happy", "great", "excited", "awesome", "good", "glad", "joy", "fun", "love"],
  sad: ["sad", "down", "tired", "unhappy", "depressed", "lonely", "upset", "cry"],
  angry: ["angry", "mad", "furious", "annoyed", "frustrated", "irritated", "hate"],
  anxious: ["anxious", "nervous", "worried", "scared", "afraid", "stressed", "overwhelmed"],
  confusion: ["confused", "lost", "stuck", "unclear", "don't understand", "not sure"],
  curious: ["curious", "wonder", "interested", "why", "how does", "what if"],
  calm: ["calm", "fine", "okay", "relaxed", "peaceful", "steady", "alright"],
};

function inferEmotion(transcript) {
  const text = transcript.toLowerCase();
  const scores = {};
  for (const [emotion, words] of Object.entries(LEXICON)) {
    scores[emotion] = words.reduce((count, w) => count + (text.includes(w) ? 1 : 0), 0);
  }
  const [topEmotion, topScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return topScore > 0 ? topEmotion : "calm"; // default to calm if no keyword matched
}

export default function VoiceMood() {
  const recognitionRef = useRef(null);
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Ready to listen");
  const [transcript, setTranscript] = useState("");
  const [inferredEmotion, setInferredEmotion] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      setStatus("Voice recognition is not supported in this browser. Try Chrome on desktop or Android.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setStatus("Listening...");
      setError("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onerror = (event) => {
      setError(
        event.error === "not-allowed"
          ? "Microphone permission was denied. Please allow microphone access and try again."
          : "Something went wrong with voice recognition. Please try again."
      );
      setListening(false);
      setStatus("Ready to listen");
    };

    recognition.onend = () => {
      setListening(false);
      setStatus("Analysis complete");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    setTranscript("");
    setInferredEmotion(null);
    setError("");
    recognitionRef.current?.start();
  };

  useEffect(() => {
    // Once listening stops and we have a transcript, infer + save the emotion.
    if (!listening && transcript.trim().length > 0 && !inferredEmotion) {
      const emotion = inferEmotion(transcript);
      setInferredEmotion(emotion);
      api.post("/user/emotion", { source: "voice", emotion }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Voice Mood Check</h1>
        <p className="text-gray-500">
          Say a sentence and the app will analyze your tone and mood.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-100 p-6 space-y-5">
        <button
          onClick={startListening}
          disabled={!supported || listening}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition disabled:opacity-60"
        >
          {listening ? "Listening..." : "🎙️ Start Listening"}
        </button>

        <p className="text-sm text-gray-500">
          Status: <span className="font-medium text-gray-700">{status}</span>
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Transcript:</p>
          <p className="text-gray-700">{transcript || "No speech captured yet."}</p>
        </div>

        <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
          <p className="text-sm text-gray-500">Inferred Emotion:</p>
          <p className="text-2xl font-bold text-brand-700 mt-1">
            {inferredEmotion ? (
              <>
                {EMOTION_EMOJI[inferredEmotion]} {inferredEmotion}
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        This uses your browser's built-in speech recognition to transcribe what you say, then a
        transparent keyword-based check for mood words — it's a lightweight cue, not a clinical
        voice-tone analysis.
      </p>
    </div>
  );
}
