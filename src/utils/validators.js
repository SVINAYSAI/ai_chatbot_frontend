export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  // Basic phone validation - allows various formats
  const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
  return phoneRegex.test(phone);
};

export const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

export const isValidTime = (timeStr) => {
  if (!timeStr) return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
};

export const isValidPartySize = (size, min = 1, max = 20) => {
  const num = parseInt(size);
  return !isNaN(num) && num >= min && num <= max;
};

export const isValidBookingRef = (ref) => {
  if (!ref) return false;
  // Format: BK-YYYYMMDD-XXXX
  const refRegex = /^BK-\d{8}-[A-Z0-9]{4}$/;
  return refRegex.test(ref);
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "");
};
