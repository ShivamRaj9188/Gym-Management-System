import apiClient from "./api";

export const getTrainers = async (page = 0, size = 10) => {
  const response = await apiClient.get(`/trainers?page=${page}&size=${size}`);
  return response.data;
};

export const createTrainer = async payload => {
  const response = await apiClient.post("/trainers", payload);
  return response.data;
};

export const updateTrainer = async (id, payload) => {
  const response = await apiClient.put(`/trainers/${id}`, payload);
  return response.data;
};

export const deleteTrainer = async id => {
  await apiClient.delete(`/trainers/${id}`);
};
