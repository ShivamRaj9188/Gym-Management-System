import apiClient from "./api";

export const getPayments = async (page = 0, size = 10) => {
  const response = await apiClient.get(`/payments?page=${page}&size=${size}`);
  return response.data;
};

export const getPaymentsByMember = async memberId => {
  const response = await apiClient.get(`/payments/member/${memberId}`);
  return response.data;
};

export const getPaymentsByStatus = async status => {
  const response = await apiClient.get(`/payments/status/${status}`);
  return response.data;
};

export const createPayment = async payload => {
  const response = await apiClient.post("/payments", payload);
  return response.data;
};

export const updatePaymentStatus = async (id, status) => {
  const response = await apiClient.put(`/payments/${id}/status`, { status });
  return response.data;
};

export const deletePayment = async id => {
  await apiClient.delete(`/payments/${id}`);
};
