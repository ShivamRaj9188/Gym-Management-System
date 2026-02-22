import axios from "axios";

const API_URL = "http://localhost:9999/api/payments";

export const getAllPayments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPaymentsByMember = async (memberId) => {
  const response = await axios.get(`${API_URL}/member/${memberId}`);
  return response.data;
};

export const getPaymentsByStatus = async (status) => {
  const response = await axios.get(`${API_URL}/status/${status}`);
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await axios.post(API_URL, paymentData);
  return response.data;
};

export const updatePaymentStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { status });
  return response.data;
};
