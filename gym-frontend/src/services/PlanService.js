import apiClient from "./api";

export const getPlans = async () => {
  const response = await apiClient.get("/plans");
  return response.data;
};

export const createPlan = async payload => {
  const response = await apiClient.post("/plans", payload);
  return response.data;
};

export const updatePlan = async (id, payload) => {
  const response = await apiClient.put(`/plans/${id}`, payload);
  return response.data;
};

export const deletePlan = async id => {
  await apiClient.delete(`/plans/${id}`);
};
