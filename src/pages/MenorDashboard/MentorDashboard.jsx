// pages/MentorDashboard.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import PendingApproval from "../PendingApproval";

export default function MentorDashboard() {
  const { user, loading } = useAuth(); // ✅ correct destructuring

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (user.role === "mentor" && user.status !== "approved") {
    return <PendingApproval />;
  }

  return (
    <div>
      {/* Your actual mentor dashboard here */}
      <h1>Welcome to Mentor Dashboard, {user.name}</h1>
    </div>
  );
}
