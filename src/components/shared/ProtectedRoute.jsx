import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute() {
  const { isAuthenticated, role } = useAuthStore();

  // Check if user is authenticated and has admin role
  const isAdmin = role && ["super_admin", "manager", "staff"].includes(role);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
