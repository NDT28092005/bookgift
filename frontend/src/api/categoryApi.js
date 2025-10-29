import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: () => axiosClient.get("/gift-categories"),
  get: (id) => axiosClient.get(`/gift-categories/${id}`),
  create: (data) => axiosClient.post("/gift-categories", data),
  update: (id, data) => axiosClient.put(`/gift-categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/gift-categories/${id}`),
};

export default categoryApi;