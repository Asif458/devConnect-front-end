import React, { useState } from "react";
import { useFriends } from "../../hooks/useFriendRequests";
import UserRoleBadge from "../shared/UserRoleBadge";
import UserProfileModal from "../../components/UserProfileModal";
import { ChevronRight, Users, Code } from "lucide-react"; 

export default function FriendList() {
  const { friends } = useFriends(); 
  const [openProfileId, setOpenProfileId] = useState(null);

  if (!friends.length)
    return (
      // Clean, Left-Aligned Empty State
      <div className="p-6 mt-8 bg-white border border-dashed border-gray-300 rounded-xl shadow-inner text-left">
        <Users className="w-6 h-6 text-blue-500 mb-3" />
        <p className="text-gray-700 text-lg font-semibold">
          No Connections Yet.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Start building your developer network by sending your first friend request!
        </p>
      </div>
    );

  return (
    // Main container for the friend list
    <div className="space-y-3 p-4"> 
      {friends.map(friend => (
        // Modern Card Design: Hover highlights the entire row for interaction
        <div
          key={friend._id}
          className="flex items-center justify-between p-4 sm:p-5 bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:border-blue-300"
          onClick={() => setOpenProfileId(friend._id)} // Card click opens profile
        >
          
          {/* Left Section: Avatar and Info Block */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Avatar with Status Ring */}
            <div className="relative flex-shrink-0">
              <img
                src={friend.profilePhoto || "/default-avatar.png"}
                alt={friend.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white ring-2 ring-blue-500/50 shadow-md bg-gray-100"
              />
              {/* Online status indicator */}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white transform translate-x-1 translate-y-1"></span>
            </div>
            
            {/* Name, Username, and Role Hierarchy */}
            <div className="flex flex-col truncate min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-xl text-gray-900 truncate tracking-tight">{friend.name}</span>
                <UserRoleBadge role={friend.role} />
              </div>
              {friend.username && (
                <p className="text-sm text-gray-600 font-medium mt-0.5 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-blue-500" />
                  @{friend.username}
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Action Button with Custom Color */}
          <button
            aria-label={`View profile of ${friend.name}`}
            // --- UPDATED BUTTON STYLE ---
            style={{ backgroundColor: '#032f60' }} // Custom deep navy blue
            className="flex items-center gap-1 text-sm font-semibold text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition duration-150 transform hover:scale-[1.02] flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation(); // Prevents the card's onClick from firing
              setOpenProfileId(friend._id);
            }}
          >
            <span className="hidden sm:inline">View Profile</span>
            <ChevronRight className="w-5 h-5" /> 
          </button>

          {/* User Profile Modal (Logic is untouched) */}
          {openProfileId === friend._id && (
            <UserProfileModal
              userId={friend._id}
              isOpen={!!openProfileId}
              onClose={() => setOpenProfileId(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}