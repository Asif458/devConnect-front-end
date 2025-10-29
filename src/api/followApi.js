import api from "./axios";

// Follow user
export const followUser = async (userId) => {
  const { data } = await api.post(`/follow/${userId}/follow`);
  return data;
};

// Unfollow user
export const unfollowUser = async (userId) => {
  const { data } = await api.delete(`/follow/${userId}/unfollow`);
  return data;
};
