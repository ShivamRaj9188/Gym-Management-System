import apiClient from "./api";

export const getMembers = async (page = 0, size = 10) => {
  const response = await apiClient.get(`/members?page=${page}&size=${size}`);
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

export const exportMembersToExcel = async () => {
  const response = await apiClient.get('/export/members/excel', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'members.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportMembersToPdf = async () => {
  const response = await apiClient.get('/export/members/pdf', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'members.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
