import api from "./axios";

/**
 * Fetch user profile by user ID.
 * @param {string} userId
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  const { data } = await api.get(`/users/${userId}/profile`);
  return data;
};

/**
 * Search users with filters.
 * Supports role, search text, skills, etc.
 *
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>} Search results containing users array
 */
export const searchUsers = async (params) => {
  const { data } = await api.get("/users/search", { params });
  return data;
};

/**
 * Follow a user.
 *
 * @param {string} userId - User ID to follow
 * @returns {Promise<Object>} Updated following info
 */
export const followUser = async (userId) => {
  const { data } = await api.post(`/follow/${userId}/follow`);
  return data;
};

/**
 * Unfollow a user.
 *
 * @param {string} userId - User ID to unfollow
 * @returns {Promise<Object>} Updated following info
 */
export const unfollowUser = async (userId) => {
  const { data } = await api.delete(`/follow/${userId}/unfollow`);
  return data;
};

/**
 * Send a friend or connection request.
 *
 * @param {string} recipientId - Recipient user ID
 * @param {string} message - Optional connection message
 * @returns {Promise<Object>} Friend request response
 */
export const sendFriendRequest = async (recipientId, message = "") => {
  const { data } = await api.post("/friend-requests/send", {
    recipientId,
    message,
  });
  return data;
};

/**
 * Update user profile fields.
 *
 * @param {string} userId - ID of user to update
 * @param {Object} updateData - Fields to update (e.g. name, bio, skills)
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (userId, updateData) => {
  const { data } = await api.put(`/users/${userId}`, updateData);
  return data;
};

/**
 * Upload user profile photo.
 * @param {FormData} formData - FormData object with profilePhoto file field
 * @returns {Promise<Object>} Updated profile photo data and user
 */
export const uploadProfilePhoto = async (formData) => {
  const { data } = await api.post("/users/profile-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};