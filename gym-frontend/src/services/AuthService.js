import apiClient from "./api";

const AUTH_USER_KEY = "gymUser";
const AUTH_CHANGE_EVENT = "auth-changed";

export const loginUser = async credentials => {
  const response = await apiClient.post("/auth/login", credentials);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  return response.data;
};

export const signupUser = async credentials => {
  const response = await apiClient.post("/auth/signup", credentials);
  return response.data;
};

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const isAuthenticated = () => Boolean(getStoredUser()?.token);

export const getAuthToken = () => getStoredUser()?.token || "";

export const isAdmin = () => (getStoredUser()?.role || "").toUpperCase() === "ADMIN";

export const logoutUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};
