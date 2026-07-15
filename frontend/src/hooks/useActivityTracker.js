import { useEffect, useRef } from "react";
import api from "../api/api.js";

// Reports minutes of active app usage to the backend every REPORT_INTERVAL_MS,
// but only while the tab is visible/focused. This is what powers the
// Dashboard's "Focus Level" percentage (time spent in-app vs. daily goal).
const REPORT_INTERVAL_MS = 30000; // 30 seconds
const REPORT_MINUTES = REPORT_INTERVAL_MS / 60000;

export function useActivityTracker(enabled) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const sendActivity = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        await api.post("/user/activity", { minutes: REPORT_MINUTES });
      } catch {
        // Silently ignore — activity tracking should never disrupt the UI.
      }
    };

    intervalRef.current = setInterval(sendActivity, REPORT_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled]);
}
