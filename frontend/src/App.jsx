import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LearningHub from "./pages/LearningHub.jsx";
import Practice from "./pages/Practice.jsx";
import WebcamEmotion from "./pages/WebcamEmotion.jsx";
import VoiceMood from "./pages/VoiceMood.jsx";
import Quiz from "./pages/Quiz.jsx";
import Suggestions from "./pages/Suggestions.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Welcome />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning" element={<LearningHub />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/webcam-emotion" element={<WebcamEmotion />} />
        <Route path="/voice-mood" element={<VoiceMood />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/suggestions" element={<Suggestions />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
