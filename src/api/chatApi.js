import client from "./axiosClient";

export const sendMessage = (sessionToken, message) =>
  client.post("/api/chat/message", { session_token: sessionToken, message });

export const getSession = (sessionToken) =>
  client.get(`/api/chat/session/${sessionToken}`);

export const clearSession = (sessionToken) =>
  client.delete(`/api/chat/session/${sessionToken}`);
