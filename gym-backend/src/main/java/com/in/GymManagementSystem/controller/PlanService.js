import axios from "axios";

const API_URL = "http://localhost:9999/api/plans";

export const getAllPlans = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getActivePlans = async () => {
  const response = await axios.get(`${API_URL}/active`);
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await axios.post(API_URL, planData);
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const response = await axios.put(`${API_URL}/${id}`, planData);
  return response.data;
};

export const deletePlan = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
