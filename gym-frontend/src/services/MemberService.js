import apiClient from "./api";

export const getMembers = async () => {
  const response = await apiClient.get("/members");
  return response.data;
};

export const createMember = async payload => {
  const response = await apiClient.post("/members", payload);
  return response.data;
};

export const updateMember = async (id, payload) => {
  const response = await apiClient.put(`/members/${id}`, payload);
  return response.data;
};

export const deleteMember = async id => {
  await apiClient.delete(`/members/${id}`);
};

export const assignTrainerToMember = async (memberId, trainerId) => {
  const response = await apiClient.post(`/members/${memberId}/trainers/${trainerId}`);
  return response.data;
};

export const removeTrainerFromMember = async (memberId, trainerId) => {
  const response = await apiClient.delete(`/members/${memberId}/trainers/${trainerId}`);
  return response.data;
};
