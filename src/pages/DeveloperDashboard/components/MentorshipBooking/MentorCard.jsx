import React from "react";
import SlotBadge from "./SlotBadge";

export default function MentorCard({ mentor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border px-8 py-6 mb-8">
      <div className="flex items-center gap-5 mb-1">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-500">
          {mentor.avatarInitials || "M"}
        </div>
        <div>
          <div className="font-bold text-lg text-gray-800">
            {mentor.name}
            {mentor.rating && (
              <span className="ml-2 text-yellow-600 font-semibold text-base">★ {mentor.rating}</span>
            )}
          </div>
          <div className="text-xs text-gray-500">{mentor.title}</div>
          <div className="flex gap-2 mt-2">
            {(mentor.skills || []).map(skill => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="text-sm font-semibold text-gray-700 mb-2">Available Time Slots</div>
        <div className="flex gap-4 flex-wrap">
          {(mentor.slots && mentor.slots.length > 0)
            ? mentor.slots.map((slot, idx) => <SlotBadge slot={slot} key={idx} />)
            : (
              <span className="text-xs text-gray-400">No slots available</span>
            )
          }
        </div>
      </div>
    </div>
  );
}
