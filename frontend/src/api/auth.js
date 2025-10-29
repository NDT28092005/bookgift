import axiosClient from "./axiosClient";

export const register = (data) => axiosClient.post("/register", data);
export const login = (data) => axiosClient.post("/login", data);
export const getMe = () => axiosClient.get("/me");
export const logout = () => axiosClient.post("/logout");