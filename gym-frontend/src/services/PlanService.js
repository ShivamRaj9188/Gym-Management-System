import apiClient from "./api";

export const getPlans = async (page = 0, size = 10) => {
  const response = await apiClient.get("/plans", { params: { page, size, sort: "name" } });
  return response.data; // Page<PlanDTO>
};

export const getActivePlans = async () => {
  const response = await apiClient.get("/plans/active");
  return response.data; // List<PlanDTO> — for dropdowns
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
