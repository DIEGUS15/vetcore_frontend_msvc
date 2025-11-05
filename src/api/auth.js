import axiosInstance from "./axios.js";

export const registerRequest = (userData) =>
  axiosInstance.post("/auth/register", userData);

export const loginRequest = (credentials) =>
  axiosInstance.post("/auth/login", credentials);

export const verifyTokenRequest = () => axiosInstance.get("/auth/verify");

export const changePasswordRequest = (passwordData) =>
  axiosInstance.post("/auth/change-password", passwordData);
