import axios from "axios";
import { useAuthStore } from "../store/authStore";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request if present
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — clear token and redirect to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const { logout, role } = useAuthStore.getState();
      logout();
      // Only redirect to admin login if it was an admin route
      if (role && ["super_admin", "manager", "staff"].includes(role)) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default client;
