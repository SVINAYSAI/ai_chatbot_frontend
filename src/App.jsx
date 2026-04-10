import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Customer pages
import HomePage from "./pages/customer/HomePage";
import BookingConfirmPage from "./pages/customer/BookingConfirmPage";
import MyBookingsPage from "./pages/customer/MyBookingsPage";

// Admin pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import BookingsPage from "./pages/admin/BookingsPage";
import TablesPage from "./pages/admin/TablesPage";
import ChatSessionsPage from "./pages/admin/ChatSessionsPage";
import SettingsPage from "./pages/admin/SettingsPage";

import ProtectedRoute from "./components/shared/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          {/* Customer-facing routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/booking/confirm/:ref" element={<BookingConfirmPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="tables" element={<TablesPage />} />
            <Route path="chat-sessions" element={<ChatSessionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
