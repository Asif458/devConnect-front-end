// import { create } from "zustand";
// import api from "../api/axios";
// import toast from "react-hot-toast";

// // Helper for mentor status
// const getMentorStatus = (user) => {
//   if (!user || !user.role) return "pending";
//   if (user.role !== "mentor") return "approved";
//   return user.status || "pending";
// };

// const useAuthStore = create((set, get) => ({
//   user: null,
//   loading: false,
//   isAuthenticated: false,
//   error: null,
//   pollingRef: null,
//   initialized: false, // 🚀 Added: stops infinite fetching

//   // ✅ Fetch logged-in user via cookie
//   fetchUserProfile: async () => {
//     const { initialized } = get();
//     if (initialized) return; // 🚫 Don't fetch again if already fetched once

//     set({ loading: true, error: null });
//     try {
//       const res = await api.get("/auth/profile", { withCredentials: true });
//       const user = res?.data?.user;

//       if (!user) {
//         set({
//           user: null,
//           isAuthenticated: false,
//           loading: false,
//           initialized: true, // Mark initialized even if not authenticated
//         });
//         return;
//       }

//       user.status = getMentorStatus(user);
//       set({
//         user,
//         isAuthenticated: true,
//         loading: false,
//         initialized: true, // ✅ prevent further refetches
//       });
//     } catch (err) {
//       console.error("❌ Fetch user failed:", err);
//       set({
//         user: null,
//         isAuthenticated: false,
//         error: err.response?.data?.message || "Failed to load user profile",
//         loading: false,
//         initialized: true,
//       });
//     }
//   },

//   // ✅ Signup (OTP sent)
//   signup: async (formData) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await api.post("/auth/signup", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("OTP sent to your email for verification!");
//       return res.data;
//     } catch (err) {
//       const msg = err.response?.data?.message || "Signup failed";
//       toast.error(msg);
//       set({ error: msg });
//       throw err;
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // ✅ Verify OTP
//   verifyOtp: async (email, otp) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await api.post("/auth/verify-otp", { email, otp }, { withCredentials: true });
//       toast.success(res?.data?.message || "OTP verified successfully!");
//       return res.data;
//     } catch (err) {
//       const msg = err.response?.data?.message || "Invalid OTP";
//       toast.error(msg);
//       set({ error: msg });
//       throw err;
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // ✅ Login (sets cookie on backend)
//   login: async (values) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await api.post("/auth/login", values, { withCredentials: true });
//       const user = res?.data?.user;
//       if (!user) throw new Error("Login failed: no user returned");

//       user.status = getMentorStatus(user);
//       set({ user, isAuthenticated: true, loading: false, initialized: true });
//       toast.success("Login successful!");
//       return user;
//     } catch (err) {
//       const msg = err.response?.data?.message || "Login failed";
//       toast.error(msg);
//       set({ error: msg, loading: false });
//       throw err;
//     }
//   },

//   // ✅ Logout
//   logout: async () => {
//     try {
//       await api.post("/auth/logout", {}, { withCredentials: true });
//       set({
//         user: null,
//         isAuthenticated: false,
//         loading: false,
//         initialized: false, // reset on logout
//       });
//       toast.success("Logged out successfully!");
//     } catch (err) {
//       toast.error("Logout failed");
//       console.error("Logout failed:", err);
//     }
//   },

//   // ✅ Mentor polling
//   startPolling: () => {
//     const { user, fetchUserProfile, pollingRef } = get();
//     if (user?.role === "mentor" && user?.status === "pending" && !pollingRef) {
//       const interval = setInterval(fetchUserProfile, 10000);
//       set({ pollingRef: interval });
//     }
//   },

//   stopPolling: () => {
//     const { pollingRef } = get();
//     if (pollingRef) {
//       clearInterval(pollingRef);
//       set({ pollingRef: null });
//     }
//   },
// }));

// export default useAuthStore;

import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

// Helper for mentor status
const getMentorStatus = (user) => {
  if (!user || !user.role) return "pending";
  if (user.role !== "mentor") return "approved";
  return user.status || "pending";
};

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  pollingRef: null,
  initialized: false, // 🚀 Added: stops infinite fetching

  // ✅ Fetch logged-in user via cookie
  fetchUserProfile: async () => {
    const { initialized } = get();
    if (initialized) return; // 🚫 Don't fetch again if already fetched once

    set({ loading: true, error: null });
    try {
      const res = await api.get("/auth/profile", { withCredentials: true });
      const user = res?.data?.user;

      if (!user) {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          initialized: true, // Mark initialized even if not authenticated
        });
        return;
      }

      user.status = getMentorStatus(user);
      set({
        user,
        isAuthenticated: true,
        loading: false,
        initialized: true, // ✅ prevent further refetches
      });
    } catch (err) {
      console.error("❌ Fetch user failed:", err);
      set({
        user: null,
        isAuthenticated: false,
        error: err.response?.data?.message || "Failed to load user profile",
        loading: false,
        initialized: true,
      });
    }
  },

  // ✅ Signup (OTP sent)
  signup: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/signup", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("OTP sent to your email for verification!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg);
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Verify OTP
  verifyOtp: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/verify-otp", { email, otp }, { withCredentials: true });
      toast.success(res?.data?.message || "OTP verified successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      toast.error(msg);
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Login (sets cookie on backend)
  login: async (values) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", values, { withCredentials: true });
      const user = res?.data?.user;
      if (!user) throw new Error("Login failed: no user returned");
      user.status = getMentorStatus(user);
      set({ user, isAuthenticated: true, loading: false, initialized: true });
      toast.success("Login successful!");
      // <-- Fetch/refresh actual backend profile state post-login (set cookie then fetch true profile)
      await get().fetchUserProfile();
      return user;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      set({ error: msg, loading: false });
      throw err;
    }
  },

  // ✅ Logout
  logout: async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      // stop any background polling timers
      const { stopPolling } = get();
      if (stopPolling) stopPolling();
      // immediately mark unauthenticated and initialized so guards redirect without hanging
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        initialized: true,
      });
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout failed:", err);
    }
  },

  // ✅ Mentor polling
  startPolling: () => {
    const { user, fetchUserProfile, pollingRef } = get();
    if (user?.role === "mentor" && user?.status === "pending" && !pollingRef) {
      const interval = setInterval(fetchUserProfile, 10000);
      set({ pollingRef: interval });
    }
  },

  stopPolling: () => {
    const { pollingRef } = get();
    if (pollingRef) {
      clearInterval(pollingRef);
      set({ pollingRef: null });
    }
  },
}));

export default useAuthStore;
