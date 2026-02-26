import apiClient from "./api";

export const getDashboardData = async () => {
  try {
    const response = await apiClient.get("/home/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
