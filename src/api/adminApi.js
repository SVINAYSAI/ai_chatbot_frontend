import client from "./axiosClient";

// Bookings
export const getAdminBookings = (params) =>
  client.get("/api/admin/bookings", { params });

export const getAdminBookingByRef = (ref) =>
  client.get(`/api/admin/bookings/${ref}`);

export const updateBookingStatus = (ref, status) =>
  client.patch(`/api/admin/bookings/${ref}/status`, { status });

export const deleteBooking = (ref, reason) =>
  client.delete(`/api/admin/bookings/${ref}`, { data: { reason } });

// Dashboard
export const getDashboardStats = () =>
  client.get("/api/admin/dashboard/stats");

// Tables
export const getAdminTables = () =>
  client.get("/api/tables/status/live");

export const createTable = (data) =>
  client.post("/api/tables", data);

export const updateTable = (id, data) =>
  client.put(`/api/tables/${id}`, data);

export const deleteTable = (id) =>
  client.delete(`/api/tables/${id}`);

// Chat Sessions
export const getChatSessions = (params) =>
  client.get("/api/admin/chat-sessions", { params });

// Users
export const getUsers = (params) =>
  client.get("/api/admin/users", { params });

// Admins
export const createAdmin = (data) =>
  client.post("/api/admin/admins", data);

export const updateAdmin = (id, data) =>
  client.put(`/api/admin/admins/${id}`, data);
