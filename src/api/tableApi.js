import client from "./axiosClient";

export const getTables = () =>
  client.get("/api/tables");

export const getTable = (id) =>
  client.get(`/api/tables/${id}`);
