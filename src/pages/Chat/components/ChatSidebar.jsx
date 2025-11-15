// ChatSidebar.jsx
import React, { useState, useMemo } from "react";
import { useFriends } from "../../../hooks/useFriendRequests";
import { useAllUsers } from "../../../hooks/useAllUsers";
import useAuthStore from "../../../ZustandStore/useAuthStore";
import { useChatStore } from "../../../ZustandStore/chatStore";
import MentorBadge from "../../../components/shared/MentorBadge";
import PremiumBadge from "../../../components/shared/PremiumBadge";
import { getOrCreateConversation } from "../../../api/chatApi";
import { showError } from "../../../utils/toastManager";
import Shimmer from "../../../components/Shimmer";

export default function ChatSidebar({
  selectedFriend,
  onSelectFriend,
  userId,
  setActiveConversationId,
  onlineUsers,
}) {
  const { isPremium } = useAuthStore();
  const { friends, loading: friendsLoading } = useFriends();
  const { users: allUsers, loading: allUsersLoading } = useAllUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const { unreadConversations } = useChatStore();

  const usersToShow = useMemo(() => {
    if (isPremium) {
      return allUsers.filter(user => 
        user._id !== userId &&
        (user.role === "mentor" || user.role === "developer")
      );
    } else {
      return friends;
    }
  }, [isPremium, allUsers, friends, userId]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return usersToShow;
    
    return usersToShow.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usersToShow, searchTerm]);

  // Sort: unread conversations first, then online users, then offline
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aHasUnread = Object.values(unreadConversations).some(u => u.userId === a._id);
      const bHasUnread = Object.values(unreadConversations).some(u => u.userId === b._id);
      const aOnline = onlineUsers?.includes(a._id);
      const bOnline = onlineUsers?.includes(b._id);

      // Unread first
      if (aHasUnread && !bHasUnread) return -1;
      if (!aHasUnread && bHasUnread) return 1;

      // Then online
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;

      return 0;
    });
  }, [filteredUsers, unreadConversations, onlineUsers]);

  const loading = isPremium ? allUsersLoading : friendsLoading;

  if (loading)
    return (
      <div className="p-4 flex items-center justify-center">
        <Shimmer type="circle" className="h-6 w-6" />
        <span className="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    );

  if (!sortedUsers.length)
    return (
      <div className="p-4 text-gray-500 text-center">
        <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">
          {isPremium ? "No users found" : "No friends yet"}
        </p>
      </div>
    );

  const handleSelectFriend = async (friend) => {
    if (!userId || !friend._id) {
      showError("User ID or Friend ID missing!");
      return;
    }
    try {
      const res = await getOrCreateConversation(userId, friend._id);
      if (res?.conversation?._id) {
        setActiveConversationId(res.conversation._id);
        onSelectFriend(friend);
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
      showError("Failed to start conversation");
    }
  };

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="relative">
          <svg className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={isPremium ? "Search users..." : "Search friends..."}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#032f60] focus:bg-white border border-transparent focus:border-[#032f60]/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="p-1.5 sm:p-2">
          {sortedUsers.map((user) => {
            const isOnline = onlineUsers?.includes(user._id);
            const hasUnread = Object.values(unreadConversations).some(u => u.userId === user._id);

            return (
              <div
                key={user._id}
                onClick={() => handleSelectFriend(user)}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-150 mb-0.5 sm:mb-1 relative group ${
                  selectedFriend?._id === user._id
                    ? "bg-[#032f60] text-white shadow-md"
                    : `hover:bg-gray-50 ${hasUnread ? "bg-blue-50" : ""}`
                }`}
              >
                {/* Unread indicator */}
                {hasUnread && selectedFriend?._id !== user._id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-lg" />
                )}

                <div className="relative shrink-0">
                  <img
                    src={user.profilePhoto || "/default-avatar.png"}
                    alt={user.name}
                    className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg sm:rounded-xl object-cover border border-gray-200"
                  />
                  {/* Online status dot */}
                  <span
                    className={`absolute bottom-0 right-0 block w-2 sm:w-2.5 h-2 sm:h-2.5 border-2 rounded-full transition-colors ${
                      isOnline
                        ? selectedFriend?._id === user._id
                          ? "bg-green-300 border-white"
                          : "bg-green-500 border-white"
                        : "bg-gray-300 border-white"
                    }`}
                    title={isOnline ? "Online" : "Offline"}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 justify-between">
                    <span className="font-medium text-xs sm:text-sm truncate">
                      {user.name}
                    </span>
                    {hasUnread && (
                      <div className="shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                        selectedFriend?._id === user._id
                          ? "bg-white/20 text-white/90"
                          : user.role === "mentor" 
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role === "mentor" ? "Mentor" : "Dev"}
                    </span>
                    {isOnline && (
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          selectedFriend?._id === user._id
                            ? "text-green-200"
                            : "text-green-600"
                        }`}
                      >
                        Online
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}