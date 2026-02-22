import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:9999/api",
});

export default apiClient;
