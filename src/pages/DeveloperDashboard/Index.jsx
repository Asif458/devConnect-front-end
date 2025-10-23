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
  Award
} from "lucide-react";

import Button from "../../components/Button";
import SidebarLink from "../../components/SideBar";
import { PRIMARY_COLOR, sidebarItems } from "../../utils/constants";

import HomeFeed from "./HomeFeed";
// import Messages from "./Messages";
// import Bookings from "./Bookings";
// import Profile from "./Profile";

export default function DeveloperDashboard() {
  const [activeSlug, setActiveSlug] = useState("feed");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const SidebarToggleIcon = isSidebarCollapsed ? ChevronRight : ChevronLeft;

  const handleLogout = () => console.log("User logged out.");

  // Map sidebar items to icons
  const sidebarItemMap = sidebarItems.map(item => ({
    ...item,
    icon: {
      feed: Home,
      find: SearchIcon,
      book: CalendarPlus,
      bookings: CalendarCheck,
      messages: MessageSquare,
      groups: Users,
      profile: User
    }[item.slug] || Home
  }));

  const renderSection = () => {
    switch (activeSlug) {
      case "feed":
        return <HomeFeed />;
      // case "messages":
      //   return <Messages />;
      // case "bookings":
      //   return <Bookings />;
      // case "profile":
      //   return <Profile />;
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
        <div className={`flex items-center mb-10 p-4 ${isSidebarCollapsed ? "justify-center" : ""}`}>
          <div className="w-12 h-12 rounded-full bg-white mr-4 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-[#043873] font-semibold text-lg">DC</span>
          </div>
          {!isSidebarCollapsed && <h1 className="text-2xl font-semibold tracking-wide text-white">DevConnect</h1>}
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-4 flex-1">
          {sidebarItemMap.map(item => (
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
      <main className="flex-1 flex flex-col p-4 md:p-8">
        {/* Top Header */}
        <header className="bg-white p-5 lg:p-6 rounded-3xl shadow-lg mb-8 flex items-center justify-between sticky top-0 z-50 w-full border border-gray-100">
          {/* Search */}
          <div className="flex-1 max-w-4xl mx-auto px-6">
            <div className="relative group">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-sky-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search developers, mentors, or skills..."
                className="w-full pl-16 pr-6 py-3 border border-gray-200 rounded-full text-base bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm h-12 transition-all duration-300 hover:border-gray-300 focus:w-full lg:focus:w-[calc(100%+120px)]"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center flex-shrink-0 ml-auto space-x-8 pl-6">
            {/* Premium Button */}
            <Button
              variant="accent"
              className="text-sm font-medium px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.05] active:scale-95 flex items-center"
              style={{ background: "linear-gradient(90deg, #FFD700, #FFCC33)", color: "#1a1a1a" }}
            >
              <Award className="w-4 h-4 mr-2 text-[#7a5c00]" /> Premium
            </Button>

            {/* Notification Icon */}
            <div className="relative cursor-pointer p-3 rounded-full hover:bg-gray-100 transition-all duration-200 flex items-center justify-center">
              <Bell className="w-6 h-6 text-gray-600 hover:text-sky-600 transition-colors duration-200" />
              <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white ring-2 ring-white shadow">
                5
              </span>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-4 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-sm font-semibold text-white shadow-md">
                  JD
                </div>
                <span className="hidden lg:inline text-gray-800 font-medium tracking-wide">John Doe</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform hidden lg:inline ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-30">
                  <button
                    onClick={handleLogout}
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

        {/* Spacer */}
        <div className="h-28 lg:h-32"></div>

        {/* Render Section */}
        {renderSection()}
      </main>
    </div>
  );
}
