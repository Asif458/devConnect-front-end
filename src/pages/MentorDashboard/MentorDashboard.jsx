import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../ZustandStore/useAuthStore"; // ✅ Zustand
import toast from "react-hot-toast";

import PendingApproval from "../PendingApproval";
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import HomeFeed from "../DeveloperDashboard/HomeFeed";
import MyProfilePage from "../Profile/MyProfilePag";
import MentorConnections from "../MentorDashboard/MentorConnections";
import MentorMyBookings from "./components/MentorMyBookings";

import {
  Home,
  Calendar,
  BookOpen,
  MessageSquare,
  Users,
  User,
  DollarSign,
} from "lucide-react";

const sidebarItems = [
  { name: "Home / Feed", slug: "home", icon: Home },
  { name: "Availability", slug: "availability", icon: Calendar },
  { name: "My Bookings", slug: "bookings", icon: BookOpen },
  { name: "Messages", slug: "messages", icon: MessageSquare },
  { name: "Connection Requests", slug: "connections", icon: Users },
  { name: "Profile", slug: "profile", icon: User },
  { name: "Earnings", slug: "earnings", icon: DollarSign },
];

export default function MentorDashboard() {
  const { user } = useAuthStore(); // ✅ Zustand
  const [activeTab, setActiveTab] = useState("home");

  // ✅ Handle user not found
  if (!user) {
    toast.error("Please log in to access your mentor dashboard");
    return <Navigate to="/login" />;
  }

  // ✅ Handle pending/rejected mentor status
  if (user.role === "mentor" && user.status !== "approved") {
    toast("Your mentor profile is pending approval", { icon: "⏳" });
    return <PendingApproval />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        items={sidebarItems}
        activeSlug={activeTab}
        setActiveSlug={setActiveTab}
        header="Mentor Panel"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Mentor Dashboard" />

        <main className="flex-1 overflow-y-auto px-8 py-10">
          {activeTab === "home" && <HomeFeed />}
          {activeTab === "profile" && <MyProfilePage />}
          {activeTab === "availability" && (
            <div>Set up your available sessions schedule here.</div>
          )}
          {activeTab === "bookings" && <MentorMyBookings />}
          {activeTab === "messages" && <div>Your mentor messages here.</div>}
          {activeTab === "connections" && <MentorConnections />}
          {activeTab === "earnings" && <div>Your earnings analytics here.</div>}
        </main>
      </div>
    </div>
  );
}
