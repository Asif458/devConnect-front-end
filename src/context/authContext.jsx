import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 // ===============================
  // Check login status on refresh
  // ===============================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/profile", { withCredentials: true });
        setUser(res.data.user);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  // ===============================
  // SIGNUP (no navigate inside context)
  // ===============================
  const signup = async (values) => {
    try {
      const res = await api.post("/auth/signup", values, { withCredentials: true });
      
      if (!res?.data?.user) throw new Error("No user returned from server");
      
      const user = res.data.user;
      setUser(user);

      return user; // return user to handle redirect in component
    } catch (err) {
      console.error("Signup failed:", err);
      throw err; // will be caught by Formik in component
    }
  };

  // ===============================
  // LOGIN (no navigate inside context)
  // ===============================
  const login = async (values) => {
    try {
      const res = await api.post("/auth/login", values, { withCredentials: true });
      
      if (!res?.data?.user) throw new Error("No user returned from server");
      
      const user = res.data.user;
      setUser(user);

      return user; // return user to handle redirect in component
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
