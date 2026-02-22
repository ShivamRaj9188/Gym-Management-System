import apiClient from "./api";

export const getAttendance = async () => {
  const response = await apiClient.get("/attendance");
  return response.data;
};

export const getAttendanceByDate = async date => {
  const response = await apiClient.get(`/attendance/date/${date}`);
  return response.data;
};

export const getAttendanceByMember = async memberId => {
  const response = await apiClient.get(`/attendance/member/${memberId}`);
  return response.data;
};

export const createAttendance = async payload => {
  const response = await apiClient.post("/attendance", payload);
  return response.data;
};

export const checkOutAttendance = async id => {
  const response = await apiClient.put(`/attendance/${id}/checkout`);
  return response.data;
};
