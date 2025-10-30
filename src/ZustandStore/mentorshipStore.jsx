// // src/store/mentorshipStore.js
// import { create } from "zustand";
// import api from "../api/axios";
// import toast from "react-hot-toast";

// const useMentorshipStore = create((set, get) => ({
//   mentors: [],
//   loading: false,
//   error: null,
//   bookings: [],
  
//   // Fetch mentor list from backend
//   fetchMentors: async () => {
//     set({ loading: true, error: null });
//     try {
//       const res = await api.get("/mentors", { withCredentials: true });
//       set({ mentors: res.data.mentors || [], loading: false });
//     } catch (err) {
//       set({ error: err.response?.data?.message || "Failed to load mentors", loading: false });
//       toast.error("Mentor fetch failed");
//     }
//   },

//   // Book a mentorship session
//   bookSession: async (mentorId, menteeId, availabilityId, slot) => {
//     set({ loading: true, error: null });
//     try {
//       const payload = {
//         mentorId,
//         menteeId,
//         availabilityId,
//         slot,
//         sessionType: "one-on-one"
//       };
//       const res = await api.post("/sessions", payload, { withCredentials: true });
//       toast.success("Session booked!");

//       // Instantly refresh bookings for this mentee (if user is present)
//       // Only runs fetchBookings if menteeId is provided
//       if (menteeId) await get().fetchBookings(menteeId);

//       // Optionally refetch mentors so slots show as booked instantly
//       get().fetchMentors();

//       set({ loading: false });
//       return res.data;
//     } catch (err) {
//       set({ error: err.response?.data?.message || "Could not book session", loading: false });
//       toast.error("Booking failed");
//       throw err;
//     }
//   },

//   // Fetch sessions for current user (use in bookings dashboard)
//   fetchBookings: async (userId) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await api.get(`/sessions/${userId}`, { withCredentials: true });
//       set({ bookings: res.data.sessions || [], loading: false });
//     } catch (err) {
//       set({ error: err.response?.data?.message || "Could not fetch bookings", loading: false });
//       toast.error("Failed to load bookings");
//     }
//   }
// }));

// export default useMentorshipStore;

import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

const useMentorshipStore = create((set, get) => ({
  mentors: [],
  bookings: [],
  loadingMentors: false,
  loadingBookings: false,
  bookingSessionLoading: false,
  error: null,

  // ✅ Fetch mentor list from backend
  fetchMentors: async () => {
    set({ loadingMentors: true, error: null });
    try {
      const res = await api.get("/mentors", { withCredentials: true });
      set({ mentors: res.data.mentors || [], loadingMentors: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load mentors",
        loadingMentors: false,
      });
      toast.error("Mentor fetch failed");
    }
  },

// ✅ Book a mentorship session
bookSession: async (mentorId, menteeId, availabilityId, slotTime, date) => {
  set({ bookingSessionLoading: true, error: null });
  try {
    const payload = {
      mentorId,
      menteeId,
      availabilityId,
      slot: slotTime,
      date, // <-- FIXED: Now sent as required!
      sessionType: 'one-on-one',
    };
// console.log("heyheyheye");
    const res = await api.post("/sessions", payload, { withCredentials: true });
    toast.success("Session booked!");

    // ⚡ INSTANT LOCAL UI UPDATE
    const updatedMentors = get().mentors.map((mentor) => {
      if (mentor._id === mentorId) {
        const updatedAvailability = mentor.mentorProfile.availability.map((a) =>
          a._id === availabilityId
            ? {
                ...a,
                slots: a.slots.map((s) =>
                  s.time === slotTime
                    ? { ...s, isBooked: true, bookedBy: menteeId }
                    : s
                ),
              }
            : a
        );
        return {
          ...mentor,
          mentorProfile: {
            ...mentor.mentorProfile,
            availability: updatedAvailability,
          },
        };
      }
      return mentor;
    });

    set({ mentors: updatedMentors });

    // ✅ Refresh bookings for current user
    if (menteeId) await get().fetchBookings(menteeId);

    set({ bookingSessionLoading: false });
    return res.data;
  } catch (err) {
    set({
      error: err.response?.data?.message || "Could not book session",
      bookingSessionLoading: false,
    });
    toast.error("Booking failed");
    throw err;
  }
},

  // ✅ Fetch sessions for current user
  fetchBookings: async (userId) => {
    console.log(userId)
    set({ loadingBookings: true, error: null });
    try {
      const res = await api.get(`/sessions/${userId}`, { withCredentials: true });
      set({ bookings: res.data.sessions || [], loadingBookings: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Could not fetch bookings",
        loadingBookings: false,
      });
      toast.error("Failed to load bookings");
    }
  },
}));

export default useMentorshipStore;
