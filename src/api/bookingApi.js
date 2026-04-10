import client from "./axiosClient";

export const createBooking = (data) =>
  client.post("/api/bookings", data);

export const getBookingByRef = (ref) =>
  client.get(`/api/bookings/${ref}`);

export const getMyBookings = () =>
  client.get("/api/bookings/user/me");

export const cancelBooking = (ref, reason) =>
  client.patch(`/api/bookings/${ref}/cancel`, { reason });

export const checkAvailability = (date, time, partySize) =>
  client.get("/api/bookings/availability", {
    params: { date, time, party_size: partySize }
  });
