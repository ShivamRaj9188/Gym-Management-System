import axios from "axios";

const API_URL = "http://localhost:9999/api/attendance";

export const getAllAttendance = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getAttendanceByDate = async (date) => {
  const response = await axios.get(`${API_URL}/date/${date}`);
  return response.data;
};

export const getAttendanceByMember = async (memberId) => {
  const response = await axios.get(`${API_URL}/member/${memberId}`);
  return response.data;
};

export const createAttendance = async (attendanceData) => {
  const response = await axios.post(API_URL, attendanceData);
  return response.data;
};

export const checkOut = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/checkout`);
  return response.data;
};
