import axios from "axios";
import { getAuthToken, logoutUser } from "./AuthService";

const apiClient = axios.create({
  baseURL: "http://localhost:9999/api",
});

apiClient.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
