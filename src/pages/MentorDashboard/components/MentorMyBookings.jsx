import React, { useEffect, useState } from "react";
import useMentorshipStore from "../../../ZustandStore/mentorshipStore";
import useAuthStore from "../../../ZustandStore/useAuthStore";
import BookingCard from "../../DeveloperDashboard/components/MyBookings/BookingCard";
import BookingFilter from "../../DeveloperDashboard/components/MyBookings/BookingFilter";

export default function MentorMyBookings() {
  const { user, fetchUserProfile } = useAuthStore();
  const { bookings, loadingBookings, fetchBookings } = useMentorshipStore();
  const [filter, setFilter] = useState({ search: "", status: "" });

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user?._id) fetchBookings(user._id);
  }, [user?._id, fetchBookings]);

  if (!user?._id) {
    return (
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="p-4 text-center text-gray-500">Loading your bookings...</div>
      </div>
    );
  }

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

  // Mentor sees all sessions where they are the mentor (API already gives all sessions for this mentor)
  const filtered = bookings
    .filter((session) => !!session)
    .filter((session) => {
      // status filter
      const matchesStatus = !filter.status || session.status === filter.status;
      // search filter
      const search = filter.search?.toLowerCase() || "";
      const menteeName = session.menteeId?.name?.toLowerCase() || session.mentee?.name?.toLowerCase() || "";
      const title = session.title?.toLowerCase() || "";
      const dateString = formatDateForSearch(session.date, session.sessionDate);

      const matchesText =
        !search ||
        title.includes(search) ||
        menteeName.includes(search) ||
        dateString.includes(search);

      return matchesStatus && matchesText;
    })
    // upcoming first
    .sort((a, b) => new Date(a.date || a.sessionDate) - new Date(b.date || b.sessionDate));

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Upcoming Sessions with Mentees</h2>
      <p className="mb-8 text-gray-500">See your mentorship sessions, status, and past session history</p>

      <BookingFilter filter={filter} setFilter={setFilter} />

      {loadingBookings ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="p-4 text-center text-gray-400 bg-white rounded-xl shadow border">
          No sessions match your filters.
        </div>
      ) : (
        filtered.map((session) => (
          <BookingCard key={session._id} session={session} showMenteeInfo />
        ))
      )}
    </div>
  );
}
