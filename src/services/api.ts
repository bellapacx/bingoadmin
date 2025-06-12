import axios from "axios";

const API_URL = "https://bingoapi-qtai.onrender.com"; // Change if your backend runs elsewhere

const api = axios.create({
  baseURL: API_URL,
});

// Add JWT token to each request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
