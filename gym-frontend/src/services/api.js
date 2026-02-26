import axios from "axios";
import { getAuthToken, getStoredUser, logoutUser } from "./AuthService";

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

// Auto-refresh token on 401 before logging out
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      const user = getStoredUser();
      const refreshToken = user?.refreshToken;

      if (!refreshToken) {
        logoutUser();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post("http://localhost:9999/api/auth/refresh", {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        // Update stored user with new tokens
        const updatedUser = { ...user, token: newToken, refreshToken: newRefreshToken };
        localStorage.setItem("gymUser", JSON.stringify(updatedUser));

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logoutUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
