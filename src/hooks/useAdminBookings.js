import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminBookings, updateBookingStatus, deleteBooking } from "../api/adminApi";
import toast from "react-hot-toast";

export const useAdminBookings = (filters = {}) => {
  return useQuery({
    queryKey: ["admin-bookings", filters],
    queryFn: () => getAdminBookings(filters).then(r => r.data),
  });
};

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ref, status }) => updateBookingStatus(ref, status),
    onSuccess: () => {
      toast.success("Status updated successfully");
      qc.invalidateQueries(["admin-bookings"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to update status");
    },
  });
};

export const useDeleteBooking = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (ref) => deleteBooking(ref),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      qc.invalidateQueries(["admin-bookings"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to cancel booking");
    },
  });
};
