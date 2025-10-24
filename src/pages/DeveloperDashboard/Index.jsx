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
    <div className="flex h-screen w-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 transition-all duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-72"
        } overflow-y-auto pt-8 z-40`}
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

      {/* Main Section */}
      <div
        className={`flex flex-col flex-1 h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative group w-full">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 h-5 w-5 group-focus-within:text-sky-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search developers, mentors, or skills..."
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center ml-auto space-x-6">
            <Button
              variant="accent"
              className="text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.05] active:scale-95 flex items-center"
              style={{
                background: "linear-gradient(90deg, #FFD700, #FFCC33)",
                color: "#1a1a1a",
              }}
            >
              <Award className="w-4 h-4 mr-2 text-[#7a5c00]" /> Premium
            </Button>

            <div className="relative cursor-pointer p-3 rounded-full hover:bg-sky-100 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg">
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
                <span className="hidden lg:inline text-gray-800 font-medium">
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
    
<main className="flex-1 overflow-hidden bg-gray-100">
  <div className="h-full overflow-y-auto p-6">
    {renderSection()}
  </div>
</main>

      </div>
    </div>
  );
}
