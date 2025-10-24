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
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";

import Button from "../../components/Button";
import SidebarLink from "./components/SideBar";
import { PRIMARY_COLOR, sidebarItems } from "../../utils/constants";

import HomeFeed from "./HomeFeed";
import { useAuth } from "../../context/authContext";

export default function DeveloperDashboard() {
  const { user, logout } = useAuth();
  const [activeSlug, setActiveSlug] = useState("feed");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const SidebarToggleIcon = isSidebarCollapsed ? ChevronRight : ChevronLeft;

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

  const renderSection = () => {
    switch (activeSlug) {
      case "feed":
        return <HomeFeed />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col ${
          isSidebarCollapsed ? "w-20" : "w-72"
        } h-screen sticky top-0 overflow-y-auto pt-8 flex-shrink-0 transition-all duration-300`}
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        {/* Logo */}
        <div
          className={`flex items-center mb-10 p-4 ${
            isSidebarCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white mr-4 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-[#043873] font-semibold text-lg">DC</span>
          </div>
          {!isSidebarCollapsed && (
            <h1 className="text-2xl font-semibold tracking-wide text-white">
              DevConnect
            </h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-4 flex-1">
          {sidebarItemMap.map((item) => (
            <SidebarLink
              key={item.slug}
              icon={item.icon}
              name={item.name}
              isActive={activeSlug === item.slug}
              onClick={() => setActiveSlug(item.slug)}
              isCollapsed={isSidebarCollapsed}
            />
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`flex items-center w-full p-3 rounded-xl transition-colors text-gray-300 hover:bg-white/10 ${
              isSidebarCollapsed ? "justify-center" : "justify-end"
            }`}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <SidebarToggleIcon className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 md:p-8 w-full">
        {/* Top Header */}
        <header className="bg-gradient-to-r from-white via-sky-50 to-white p-5 lg:p-6 rounded-3xl shadow-xl mb-8 flex items-center justify-between sticky top-0 z-50 w-full border-2 border-sky-100 backdrop-blur-sm bg-opacity-95">
          {/* Search */}
          <div className="flex-1 w-full">
            <div className="relative group w-full">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-400 h-5 w-5 group-focus-within:text-sky-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search developers, mentors, or skills..."
                className="w-full pl-16 pr-6 py-3 border-2 border-sky-200 rounded-full text-base bg-gradient-to-r from-sky-50 to-blue-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-lg h-12 transition-all duration-300 hover:border-sky-300 hover:shadow-xl"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center flex-shrink-0 ml-auto space-x-8 pl-6">
            <Button
              variant="accent"
              className="text-sm font-medium px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.05] active:scale-95 flex items-center"
              style={{
                background: "linear-gradient(90deg, #FFD700, #FFCC33)",
                color: "#1a1a1a",
              }}
            >
              <Award className="w-4 h-4 mr-2 text-[#7a5c00]" /> Premium
            </Button>

            <div className="relative cursor-pointer p-3 rounded-full hover:bg-sky-100 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg">
              <Bell className="w-6 h-6 text-sky-600 hover:text-sky-700 transition-colors duration-200" />
              <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[10px] font-semibold text-white ring-2 ring-white shadow-lg">
                5
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-4 p-2 rounded-full hover:bg-sky-100 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm font-semibold text-white shadow-lg ring-2 ring-sky-200 overflow-hidden">
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
                <span className="hidden lg:inline text-gray-800 font-medium tracking-wide">
                  {user?.name || "User"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-sky-600 transition-transform hidden lg:inline ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-sky-100 rounded-xl shadow-2xl overflow-hidden z-30">
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

        {/* Render Section */}
        <div className="flex-1 w-full">{renderSection()}</div>
      </main>
    </div>
  );
}
