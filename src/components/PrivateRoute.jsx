import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../ZustandStore/useAuthStore";
import toast from "react-hot-toast";

export default function PrivateRoute({ children, role }) {
  const { user, isAuthenticated, loading, fetchUserProfile, initialized } = useAuthStore();

  // Only fetch profile once on first mount
  useEffect(() => {
    if (!initialized) {
      fetchUserProfile();
    }
  }, [initialized, fetchUserProfile]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!isAuthenticated) {
    toast.error("Please login to continue");
    return <Navigate to="/login" replace />;
  }

  if (role && ![role].flat().includes(user?.role)) {
    toast.error("Access denied");
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "mentor" && ["pending", "rejected"].includes(user.status)) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}
