import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import React from "react";
// role can be single string or array of allowed roles
export default function PrivateRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>; // optional spinner

  if (!isAuthenticated) return <Navigate to="/login" />;

  // role check
  if (role && ![...([role].flat())].includes(user.role)) {
    return <Navigate to="/login" />; // or a 403 page
  }

  return children;
}
