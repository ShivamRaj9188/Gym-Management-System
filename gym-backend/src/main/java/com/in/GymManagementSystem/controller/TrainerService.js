import axios from "axios";

const API_URL = "http://localhost:9999/api/trainers";

export const getAllTrainers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getTrainerById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createTrainer = async (trainerData) => {
  const response = await axios.post(API_URL, trainerData);
  return response.data;
};

export const updateTrainer = async (id, trainerData) => {
  const response = await axios.put(`${API_URL}/${id}`, trainerData);
  return response.data;
};

export const deleteTrainer = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
