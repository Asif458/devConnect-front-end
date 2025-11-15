// ChatHeader.jsx
import React from "react";

export default function ChatHeader({ onlineUsers, selectedFriend }) {
  return (
    <div className="flex items-center justify-between px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 min-w-0">
        {selectedFriend && (
          <>
            <div className="relative shrink-0">
              <img
                src={selectedFriend.profilePhoto || "/default-avatar.png"}
                alt={selectedFriend.name}
                className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 rounded-full object-cover border border-gray-200"
              />
              {onlineUsers?.includes(selectedFriend._id) && (
                <span className="absolute bottom-0 right-0 block w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base truncate">{selectedFriend.name}</h3>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                <span className="text-gray-500 truncate">
                  {selectedFriend.role === "mentor" ? "Mentor" : "Developer"}
                </span>
                {onlineUsers?.includes(selectedFriend._id) && (
                  <span className="text-green-600 font-medium whitespace-nowrap">• Online</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-4 shrink-0">
        <button className="p-1.5 sm:p-2 text-gray-500 hover:text-[#032f60] transition-colors rounded-lg hover:bg-gray-100" title="Call">
          <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="p-1.5 sm:p-2 text-gray-500 hover:text-[#032f60] transition-colors rounded-lg hover:bg-gray-100 hidden md:block" title="Search">
          <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="p-1.5 sm:p-2 text-gray-500 hover:text-[#032f60] transition-colors rounded-lg hover:bg-gray-100" title="Options">
          <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}