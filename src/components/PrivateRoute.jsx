import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import React from "react";

export default function PrivateRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Role check
  if (role && ![...([role].flat())].includes(user.role)) {
    return <Navigate to="/login" />;
  }

  // Mentor approval check
  if (user.role === "mentor") {
    if (user.status === "pending" || user.status === "rejected") {
      return <Navigate to="/pending-approval" />;
    }
  }

  return children; // developers/admins or approved mentors
}
