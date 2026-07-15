import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/learning", label: "Learning Hub" },
  { to: "/practice", label: "Practice" },
  { to: "/webcam-emotion", label: "Webcam Emotion" },
  { to: "/voice-mood", label: "Voice Mood" },
  { to: "/quiz", label: "Quiz" },
  { to: "/suggestions", label: "Suggestions" },
];

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-brand-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="font-bold text-lg text-brand-700">
            🧠 MindLearn
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-500 text-white"
                      : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
            >
              Log out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-brand-50"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? "bg-brand-500 text-white" : "text-gray-600 hover:bg-brand-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
            >
              Log out{user?.name ? ` (${user.name})` : ""}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
