import React, { useEffect, useState } from "react";
import useMentorshipStore from "../../../../ZustandStore/mentorshipStore";
import useAuthStore from "../../../../ZustandStore/useAuthStore";
import BookingCard from "./BookingCard";
import BookingFilter from "./BookingFilter";

export default function MyBookings() {
  const { user, initialized, fetchUserProfile } = useAuthStore();
  const { bookings, loadingBookings, fetchBookings } = useMentorshipStore();
  const [filter, setFilter] = useState({ search: "", status: "" });

  useEffect(() => {
    fetchUserProfile(); // Always fetch user profile on mount
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user?._id) fetchBookings(user._id);
  }, [user?._id, fetchBookings]);

  console.log('[MyBookings] user:', user, 'initialized:', initialized);

  // ✅ Convert date safely
  const formatDateForSearch = (dateValue, altValue) => {
    const value = dateValue || altValue;
    if (!value) return "";
    try {
      const date = new Date(value);
      if (isNaN(date)) return "";
      return date
        .toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })
        .toLowerCase();
    } catch {
      return "";
    }
  };
   console.log(user?._id)

  const filtered = bookings
    .filter((session) => !!session)
    .filter((session) => {
      const matchesStatus =
        !filter.status || session.status === filter.status;

      const search = filter.search?.toLowerCase() || "";
      const mentorName =
        session.mentorId?.name?.toLowerCase() ||
        session.mentor?.name?.toLowerCase() ||
        "";
      const title = session.title?.toLowerCase() || "";
      const dateString = formatDateForSearch(session.date, session.sessionDate); // <-- FIXED

      const matchesText =
        !search ||
        title.includes(search) ||
        mentorName.includes(search) ||
        dateString.includes(search);

      return matchesStatus && matchesText;
    })
    // ✅ Sort by upcoming date
    .sort((a, b) => new Date(a.date || a.sessionDate) - new Date(b.date || b.sessionDate));

  if (!user?._id) {
    return (
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="p-4 text-center text-gray-500">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">My Bookings</h2>
      <p className="mb-8 text-gray-500">
        Manage your mentorship sessions and view session history
      </p>

      <BookingFilter filter={filter} setFilter={setFilter} />

      {loadingBookings ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="p-4 text-center text-gray-400 bg-white rounded-xl shadow border">
          No sessions match your filters.
        </div>
      ) : (
        filtered.map((session) => (
          <BookingCard key={session._id} session={session} />
        ))
      )}
    </div>
  );
}
