import React, { useState } from "react";
import {
  Home,
  Search as SearchIcon,
  CalendarPlus,
  CalendarCheck,
  MessageSquare,
  Users,
  User,
  Bell,
  ChevronDown,
  LogOut,
  Award,
} from "lucide-react";

import HomeFeed from "./HomeFeed";
import FindMentorsUsers from "./FindMentorsUsers";
import MyProfilePage from "../Profile/MyProfilePag";  
import SidebarLink from "./components/SideBar";
import { PRIMARY_COLOR, sidebarItems } from "../../utils/constants";
import Button from "../../components/Button";
import { useAuth } from "../../context/authContext";

export default function DeveloperDashboard() {
  const { user, logout } = useAuth();
  const [activeSlug, setActiveSlug] = useState("feed");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sidebarItemMap = sidebarItems.map((item) => ({
    ...item,
    icon:
      {
        feed: Home,
        find: SearchIcon,
        book: CalendarPlus,
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
            <span
              className="font-semibold text-lg"
              style={{ color: "#043873" }}
            >
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
        {/* Header */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm flex-shrink-0">
          <div className="flex-1 max-w-lg">
            <div className="relative group w-full">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 h-5 w-5 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search developers, mentors, or skills..."
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm transition-all duration-300"
                style={{ color: "#043873" }}
              />
            </div>
          </div>

          <div className="flex items-center ml-auto space-x-6">
            <Button
              variant="accent"
              className="text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
              style={{
                background: "linear-gradient(90deg, #FFD700, #FFCC33)",
                color: "#1a1a1a",
              }}
            >
              <Award className="w-4 h-4 mr-2 text-[#7a5c00]" /> Premium
            </Button>

            <div className="relative cursor-pointer p-3 rounded-full hover:bg-sky-100 transition-all duration-200 flex items-center justify-center shadow-md">
              <Bell className="w-6 h-6 text-sky-600 hover:text-sky-700 transition-colors duration-200" />
              <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white ring-2 ring-white">
                5
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-full hover:bg-sky-100 transition-all duration-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm font-semibold text-white shadow-md overflow-hidden">
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (user?.name || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  )}
                </div>
                <span
                  className="hidden lg:inline font-medium"
                  style={{ color: "#043873" }}
                >
                  {user?.name || "User"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-sky-600 transition-transform hidden lg:inline ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-sky-100 rounded-xl shadow-lg z-30">
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 min-h-0">
          <div className="p-6">
            {activeSlug === "feed" && <HomeFeed />}
            {activeSlug === "find" && <FindMentorsUsers />}
            {activeSlug === "profile" && <MyProfilePage />}

            {!["feed", "find", "profile"].includes(activeSlug) && (
              <div
                className="p-10 text-center bg-white rounded-xl shadow-lg mt-4"
                style={{ color: "#043873" }}
              >
                Content for "{activeSlug}" goes here.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
