import client from "./axiosClient";

export const adminLogin = (email, password) =>
  client.post("/api/auth/admin/login", { email, password });

export const userRegister = (data) =>
  client.post("/api/auth/register", data);

export const userLogin = (email, password) =>
  client.post("/api/auth/login", { email, password });

export const getMe = () =>
  client.get("/api/auth/me");
