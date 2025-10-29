// src/api/packageApi.js
import axiosClient from "./axiosClient";

const packageApi = {
  getAll: () => axiosClient.get("/gift-packages"),
  get: (id) => axiosClient.get(`/gift-packages/${id}`),
  create: (data) => axiosClient.post("/gift-packages", data),
  update: (id, data) => axiosClient.put(`/gift-packages/${id}`, data),
  delete: (id) => axiosClient.delete(`/gift-packages/${id}`),
};

export default packageApi;