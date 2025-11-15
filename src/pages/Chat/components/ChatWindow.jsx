// ChatWindow.jsx
import React, { useEffect, useRef, useMemo } from "react";

export default function ChatWindow({
  messages = [],
  userId,
  typingUsers,
  usersMap,
}) {
  const bottomRef = useRef(null);

  const safeMessages = useMemo(
    () => (Array.isArray(messages) ? messages : []),
    [messages]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages, typingUsers]);

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-linear-to-br from-gray-50 via-white to-blue-50/30 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {safeMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 md:p-6">
          <div className="w-20 md:w-28 h-20 md:h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-4 md:mb-6 border border-gray-100">
            <svg className="w-10 md:w-14 h-10 md:h-14 text-[#032f60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-3">No messages yet</h3>
          <p className="text-gray-500 text-center max-w-sm text-sm md:text-base">
            Start a conversation by sending your first message. 
            Your messages will appear here once you start chatting.
          </p>
        </div>
      ) : (
        <>
          {/* Date separator */}
          <div className="flex items-center justify-center my-3 sm:my-4 md:my-6 px-2 sm:px-4">
            <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-500">Today</span>
            </div>
          </div>

          {safeMessages.map((msg, index) => {
            const sender =
              typeof msg.senderId === "object"
                ? msg.senderId
                : usersMap[msg.senderId] || {};
            const isMine =
              (typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId) === userId;

            const showAvatar = !isMine && (
              index === 0 || 
              safeMessages[index - 1]?.senderId !== msg.senderId
            );

            return (
              <div
                key={msg._id || Math.random()}
                className={`flex mb-1.5 sm:mb-2 md:mb-3 px-2 sm:px-3 md:px-6 ${isMine ? "justify-end" : "justify-start"} group`}
              >
                <div className={`flex max-w-[90%] sm:max-w-[85%] md:max-w-[75%] ${isMine ? "flex-row-reverse" : "flex-row"} items-end gap-1.5 sm:gap-2`}>
                  {!isMine && showAvatar && (
                    <img
                      src={sender.profilePhoto || "/default-avatar.png"}
                      alt={sender.name}
                      className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-lg sm:rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                    />
                  )}
                  
                  {!isMine && !showAvatar && (
                    <div className="w-6 sm:w-7 md:w-8 shrink-0"></div>
                  )}
                  
                  <div className="flex flex-col">
                    {!isMine && showAvatar && (
                      <span className="text-xs text-gray-500 mb-0.5 sm:mb-1 ml-0.5 sm:ml-1 font-medium">
                        {sender.name}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl sm:rounded-3xl px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 shadow-sm transition-all duration-200 text-xs sm:text-sm md:text-base ${
                        isMine
                          ? "bg-[#032f60] text-white rounded-br-md hover:shadow-md"
                          : "bg-white text-gray-800 rounded-bl-md border border-gray-100 hover:shadow-md"
                      } group-hover:shadow-md`}
                    >
                      <div className="leading-relaxed whitespace-pre-wrap overflow-wrap break-word">
                        {msg.text || msg.message}
                      </div>
                      <div
                        className={`text-xs mt-0.5 sm:mt-1 md:mt-2 flex justify-end ${
                          isMine ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {typingUsers.size > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 md:mt-4 ml-2 sm:ml-3 md:ml-6 mr-2 sm:mr-3 md:mr-6 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-sm border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="font-medium">
                {Array.from(typingUsers)
                  .map((id) => usersMap[id]?.name || "Someone")
                  .join(", ")}
              </span>
              <span className="text-gray-400 hidden sm:inline">is typing...</span>
            </div>
          )}
          <div ref={bottomRef} className="h-4"></div>
        </>
      )}
    </div>
  );
}