import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { useActivityTracker } from "../hooks/useActivityTracker.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  useActivityTracker(isAuthenticated);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
