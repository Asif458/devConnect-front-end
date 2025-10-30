import React, { useState } from "react";
import useMentorshipStore from "../../../../ZustandStore/mentorshipStore";
import useAuthStore from "../../../../ZustandStore/useAuthStore";
import toast from "react-hot-toast";

function getSlotDayLabel(slot, day) {
  // Prefer ISO date for weekday, else fallback to explicit day label
  let label = "";
  if (slot.date) {
    try {
      const jsDate = new Date(slot.date);
      label = jsDate.toLocaleDateString("en-US", { weekday: "short" });
      return label;
    } catch { /* empty */ }
  }
  if (day && day.day) return day.day;
  return "Day?";
}

function getSlotTimeLabel(slot) {
  if (slot.time) return slot.time;
  if (slot.startTime && slot.endTime) return `${slot.startTime} - ${slot.endTime}`;
  if (slot.startTime) return slot.startTime;
  return "Time?";
}

function getBackendDate(slot, day) {
  // Return an ISO string date for backend if available, else null
  if (slot.date) return slot.date;
  // If no date, but we have a weekday label, calculate next date for this weekday
  if (day && day.day) {
    try {
      // Use a simple mapping to next weekday
      const targetDay = day.day;
      const allDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const today = new Date();
      let dayNum = allDays.indexOf(targetDay);
      let diff = dayNum - today.getDay();
      if(diff <= 0) diff += 7;
      let candidate = new Date(today);
      candidate.setDate(today.getDate() + diff);
      // Return in YYYY-MM-DD format
      return candidate.toISOString().slice(0,10);
    } catch { /* empty */ }
  }
  return null;
}

export default function SlotBadge({ slot, day, mentorId, availabilityId }) {
  const { bookSession, fetchMentors } = useMentorshipStore();
  const { user } = useAuthStore();
  const [isBooking, setIsBooking] = useState(false);
  const isUserReady = !!(user && user._id);

  const slotDay = getSlotDayLabel(slot, day);
  const slotTime = getSlotTimeLabel(slot);
  const backendDate = getBackendDate(slot, day);

  const bookedByYou = slot.isBooked && slot.bookedBy && user && String(slot.bookedBy) === String(user._id);

  const handleBook = async () => {
    // Defensive checks
    if (!user || !user._id) {
      toast.error("You must be logged in to book a session.");
      return;
    }
    if (!backendDate || !slotTime) {
      toast.error("Cannot book: missing date or time for this slot. Please choose another.");
      return;
    }
    setIsBooking(true);
    try {
      await bookSession(mentorId, user._id, availabilityId, slotTime, backendDate);
      toast.success(`Session booked for ${slotDay} at ${slotTime}`);
      await fetchMentors();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to book session. Please try another slot."
      );
    } finally {
      setIsBooking(false);
    }
  };

  // Already Booked
  if (slot.isBooked) {
    return (
      <div
        className={`flex items-center gap-2 rounded px-4 py-2 text-xs border select-none
          ${bookedByYou ? "bg-green-50 border-green-200 text-green-800" : "bg-gray-100 border-gray-200 text-gray-500"}
        `}
      >
        <span>{slotDay}, {slotTime}</span>
        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold
          ${bookedByYou ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}
        `}>
          {bookedByYou ? "Your Session" : "Booked"}
        </span>
      </div>
    );
  }
  // Not booked
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded px-4 py-2 shadow text-xs transition hover:shadow-md">
      <span className="text-gray-900">{slotDay}, {slotTime}</span>
      <div className="flex items-center gap-2 mt-1">
        <span className="px-2 py-0.5 rounded bg-green-500 text-white text-xs">Available</span>
        {slot.premium && (
          <span className="text-yellow-700 text-xs flex items-center gap-1">
            <svg width={12} height={12} fill="none"><circle cx="6" cy="6" r="6" fill="#FFD700" /></svg>
            Premium Only
          </span>
        )}
        <button
          onClick={handleBook}
          disabled={isBooking || !isUserReady}
          className={`ml-2 px-3 py-0.5 rounded text-white text-xs font-semibold ${
            isBooking || !isUserReady ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isBooking ? "Booking..." : !isUserReady ? "Sign in to Book" : "Book"}
        </button>
      </div>
    </div>
  );
}
