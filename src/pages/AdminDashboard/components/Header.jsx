import React, { useState } from "react";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import useAuthStore from "../../../ZustandStore/useAuthStore";
import { toast } from "react-hot-toast";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="bg-white p-4 rounded-2xl mb-6 shadow flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        <Bell className="w-6 h-6 text-gray-600" />

        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white font-medium"
          >
            <span>{user?.name || "Admin"}</span>
            <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-20">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
