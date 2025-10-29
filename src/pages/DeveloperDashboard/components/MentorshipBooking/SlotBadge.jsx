import React from "react";

export default function SlotBadge({ slot }) {
  return slot.status === "Booked" ? (
    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded px-4 py-2 text-xs text-gray-500">
      <span>{slot.date}, {slot.time}</span>
      <span className="ml-2 px-2 py-0.5 rounded bg-gray-300 text-xs text-gray-600">Booked</span>
    </div>
  ) : (
    <div className="flex flex-col bg-white border border-gray-200 rounded px-4 py-2 shadow text-xs">
      <span className="text-gray-900">{slot.date}, {slot.time}</span>
      <div className="flex items-center gap-2 mt-1">
        <span className="px-2 py-0.5 rounded bg-green-500 text-white text-xs">Available</span>
        {slot.premium && (
          <span className="text-yellow-700 text-xs flex items-center gap-1">
            <svg width={12} height={12} fill="none">
              <circle cx="6" cy="6" r="6" fill="#FFD700" />
            </svg>
            Premium Only
          </span>
        )}
      </div>
    </div>
  );
}
