import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookingByRef, getMyBookings, cancelBooking, createBooking } from "../api/bookingApi";
import toast from "react-hot-toast";

export const useBooking = (ref) => {
  return useQuery({
    queryKey: ["booking", ref],
    queryFn: () => getBookingByRef(ref).then(r => r.data),
    enabled: !!ref,
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => getMyBookings().then(r => r.data),
  });
};

export const useCancelBooking = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ref, reason }) => cancelBooking(ref, reason),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      qc.invalidateQueries(["my-bookings"]);
      qc.invalidateQueries(["booking"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to cancel booking");
    },
  });
};

export const useCreateBooking = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => createBooking(data),
    onSuccess: () => {
      toast.success("Booking created successfully");
      qc.invalidateQueries(["my-bookings"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to create booking");
    },
  });
};
