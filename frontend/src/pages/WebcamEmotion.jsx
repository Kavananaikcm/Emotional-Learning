import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import api from "../api/api.js";

// face-api.js's expression model predicts these 7 categories. We map them
// onto MindLearn's emotion vocabulary so the whole app (dashboard, quiz,
// suggestions) shares one consistent emotion set.
const EXPRESSION_TO_APP_EMOTION = {
  happy: "happy",
  sad: "sad",
  angry: "angry",
  fearful: "anxious",
  disgusted: "confusion",
  surprised: "curious",
  neutral: "calm",
};

const EMOTION_EMOJI = {
  happy: "😄",
  sad: "😢",
  curious: "🤔",
  confusion: "😵",
  calm: "😌",
  anxious: "😰",
  angry: "😠",
};

export default function WebcamEmotion() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [status, setStatus] = useState("Loading models...");
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [error, setError] = useState("");

  // Load face-api.js models once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        if (!cancelled) {
          setModelsLoaded(true);
          setStatus("Models loaded. Click 'Start Camera' to begin.");
        }
      } catch {
        if (!cancelled) setError("Couldn't load the emotion detection model. Please refresh the page.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
      setStatus("Camera ready. Click 'Capture' to analyze.");
    } catch {
      setError(
        "Couldn't access your webcam. Please allow camera permission in your browser and try again."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !modelsLoaded) return;
    setAnalyzing(true);
    setStatus("Analyzing frame...");
    setError("");

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      // Draw the captured frame onto the canvas for a visual "capture" moment.
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
      }

      if (!detection) {
        setStatus("No face detected. Make sure your face is well-lit and centered, then try again.");
        setDetectedEmotion(null);
        setAnalyzing(false);
        return;
      }

      const expressions = detection.expressions;
      const topExpression = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
      const appEmotion = EXPRESSION_TO_APP_EMOTION[topExpression] || "calm";

      setDetectedEmotion(appEmotion);
      setStatus("Analysis complete.");

      await api.post("/user/emotion", { source: "webcam", emotion: appEmotion });
    } catch {
      setError("Something went wrong analyzing the frame. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Webcam Emotion Analysis</h1>
        <p className="text-gray-500">
          Use your webcam to capture a live frame and receive a simple emotion cue.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-100 p-6">
        <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
          <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
              Camera preview will appear here
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!cameraReady ? (
            <button
              onClick={startCamera}
              disabled={!modelsLoaded}
              className="px-5 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition disabled:opacity-60"
            >
              {modelsLoaded ? "Start Camera" : "Loading model..."}
            </button>
          ) : (
            <>
              <button
                onClick={captureAndAnalyze}
                disabled={analyzing}
                className="px-5 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition disabled:opacity-60"
              >
                {analyzing ? "Analyzing..." : "Capture & Analyze"}
              </button>
              <button
                onClick={stopCamera}
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
              >
                Stop Camera
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Status: <span className="font-medium text-gray-700">{status}</span>
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
            {error}
          </p>
        )}

        <div className="mt-5 p-4 rounded-xl bg-brand-50 border border-brand-100">
          <p className="text-sm text-gray-500">Detected Emotion:</p>
          <p className="text-2xl font-bold text-brand-700 mt-1">
            {detectedEmotion ? (
              <>
                {EMOTION_EMOJI[detectedEmotion]} {detectedEmotion}
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        This runs a real face-expression ML model entirely in your browser (nothing is uploaded
        as an image) — it's a lightweight cue for personalizing lessons, not a clinical or
        fully accurate emotion diagnosis.
      </p>
    </div>
  );
}
