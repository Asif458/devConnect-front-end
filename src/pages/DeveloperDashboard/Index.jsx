import React, { useState } from "react";
import {
  Home,
  Search as SearchIcon,
  CalendarPlus,
  CalendarCheck,
  MessageSquare,
  Users,
  User,
} from "lucide-react";

import HomeFeed from "./HomeFeed";
import FindMentorsUsers from "./FindMentorsUsers";
import MyProfilePage from "../Profile/MyProfilePag";
import SidebarLink from "./components/SideBar";
import Header from "./components/Header";
import DeveloperConnections from "./DeveloperConnections";
import BookMentorship from "../DeveloperDashboard/components/MentorshipBooking/BookMentorship" 
import { PRIMARY_COLOR, sidebarItems } from "../../utils/constants";

export default function DeveloperDashboard() {
  const [activeSlug, setActiveSlug] = useState("feed");

  const sidebarItemMap = sidebarItems.map((item) => ({
    ...item,
    icon: {
      feed: Home,
      find: SearchIcon,
      book: CalendarPlus,         // Ensure 'book' exists in your sidebarItems and uses this slug
      bookings: CalendarCheck,
      messages: MessageSquare,
      groups: Users,
      profile: User,
    }[item.slug] || Home,
  }));

  return (
    <div className="flex h-screen w-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-72 pt-8 z-40"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <div className="flex items-center mb-10 p-4">
          <div className="w-12 h-12 rounded-full bg-white mr-4 flex items-center justify-center shadow-md">
            <span className="font-semibold text-lg" style={{ color: "#043873" }}>
              DC
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-wide text-white">
            DevConnect
          </h1>
        </div>

        <nav className="space-y-2 px-4">
          {sidebarItemMap.map((item) => (
            <SidebarLink
              key={item.slug}
              icon={item.icon}
              name={item.name}
              isActive={activeSlug === item.slug}
              onClick={() => setActiveSlug(item.slug)}
            />
          ))}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1 ml-0 md:ml-72">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-100 min-h-0">
          <div className="p-6">
            {activeSlug === "feed" && <HomeFeed />}
            {activeSlug === "find" && <FindMentorsUsers />}
            {activeSlug === "profile" && <MyProfilePage />}
            {activeSlug === "Connections" && <DeveloperConnections />}
            {activeSlug === "book" && <BookMentorship />} {/* <-- Add this line */}

            {!["feed", "find", "profile", "Connections", "book"].includes(activeSlug) && (
              <div
                className="p-10 text-center bg-white rounded-xl shadow-lg mt-4"
                style={{ color: "#043873" }}
              ></div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
