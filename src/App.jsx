import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import DeveloperDashboard from "./pages/DeveloperDashboard/Index";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import PendingApproval from "./pages/PendingApproval"; // NEW

import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/landingpage" replace />} />

        {/* Public routes */}
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Pending Approval page */}
        <Route path="/pending-approval" element={<PendingApproval />} />

        {/* Protected dashboards */}
        <Route
          path="/developer-dashboard"
          element={
            <PrivateRoute role="developer">
              <DeveloperDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/mentor-dashboard"
          element={
            <PrivateRoute role="mentor">
              <MentorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
