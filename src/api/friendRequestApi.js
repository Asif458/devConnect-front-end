import api from "./axios";

export const getPendingFriendRequests = async () => {
  const res = await api.get("/friend-requests/received");
  return res.data;
};

export const getSentFriendRequests = async () => {
  const res = await api.get("/friend-requests/sent");
  return res.data;
};

export const sendFriendRequest = async (recipientId) => {
  const res = await api.post("/friend-requests/send", { recipientId });
  return res.data;
};

export const acceptFriendRequest = async (requesterId) => {
  const res = await api.put(`/friend-requests/${requesterId}/accept`);
  return res.data;
};

export const rejectFriendRequest = async (requesterId) => {
  const res = await api.put(`/friend-requests/${requesterId}/reject`);
  return res.data;
};

export const cancelFriendRequest = async (recipientId) => {
  const res = await api.delete(`/friend-requests/${recipientId}/cancel`);
  return res.data;
};

export const getFriends = async () => {
  const res = await api.get("/friend-requests/friends");
  return res.data;
};
