import axios from "axios";

const AUTH_API_URL = "http://localhost:9999/api/auth";
const AUTH_USER_KEY = "gymUser";

export const loginUser = async credentials => {
  const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data));
  return response.data;
};

export const signupUser = async credentials => {
  const response = await axios.post(`${AUTH_API_URL}/signup`, credentials);
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

export const isAuthenticated = () => Boolean(getStoredUser());

export const logoutUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};
