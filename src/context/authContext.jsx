import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../api/axios";
import React from "react";

const AuthContext = createContext();

// Helper: unify mentor status
const getMentorStatus = (user) => {
  if (!user || !user.role) return "pending";       // completely null user
  if (user.role !== "mentor") return "approved";  // developer/admin
  return user.status || "pending";                // mentor status
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);

  // Fetch & update profile
  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/auth/profile", { withCredentials: true });
      const fetchedUser = res.data.user || null;
      if (!fetchedUser) {
        setUser(null);
        return;
      }
      fetchedUser.status = getMentorStatus(fetchedUser);
      setUser(fetchedUser);
    } catch (err) {
      console.error("Fetch profile failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check login on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Poll profile every 10s if mentor is pending
  useEffect(() => {
    if (user?.role === "mentor" && user?.status === "pending") {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(fetchUserProfile, 10000);
      }
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [user?.role, user?.status]);

  // SIGNUP
  const signup = async (formData) => {
    try {
      const res = await api.post("/auth/signup", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUser = res.data.user || null;
      if (!newUser) throw new Error("Signup failed: no user returned");
      newUser.status = getMentorStatus(newUser);
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  // LOGIN
  const login = async (values) => {
    try {
      const res = await api.post("/auth/login", values, { withCredentials: true });
      const loggedUser = res.data.user || null;
      if (!loggedUser) throw new Error("Login failed: no user returned");
      loggedUser.status = getMentorStatus(loggedUser);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
