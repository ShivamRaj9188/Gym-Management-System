import apiClient from "./api";

export const getUsers = async (page = 0, size = 20) => {
  const response = await apiClient.get("/admin/users", { params: { page, size, sort: "username" } });
  return response.data; // Page<AdminUserDTO>
};

export const verifyUser = async id => {
  const response = await apiClient.put(`/admin/users/${id}/verify`);
  return response.data;
};

export const unverifyUser = async id => {
  const response = await apiClient.put(`/admin/users/${id}/unverify`);
  return response.data;
};

export const deleteUser = async id => {
  await apiClient.delete(`/admin/users/${id}`);
};
