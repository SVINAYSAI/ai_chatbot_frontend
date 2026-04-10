import client from "./axiosClient";

export const getRestaurant = () =>
  client.get("/api/restaurant");

export const updateRestaurantSettings = (data) =>
  client.put("/api/restaurant", data);

export const updateOperatingHours = (hours) =>
  client.put("/api/restaurant/operating-hours", hours);

export const updateBookingRules = (rules) =>
  client.put("/api/restaurant/booking-rules", rules);

export const updateAIPrompt = (prompt) =>
  client.put("/api/restaurant/ai-prompt", { prompt });

export const setupRestaurant = (data) =>
  client.post("/api/restaurant/setup", data);
