import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("mindlearn_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("mindlearn_token"));

  const persist = (newToken, newUser) => {
    localStorage.setItem("mindlearn_token", newToken);
    localStorage.setItem("mindlearn_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const signup = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("mindlearn_token");
    localStorage.removeItem("mindlearn_user");
    setToken(null);
    setUser(null);
  }, []);

  const value = { user, token, isAuthenticated: !!token, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
