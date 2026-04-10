import { format, parseISO, isValid } from "date-fns";

export const formatDate = (dateStr, formatStr = "MMM d, yyyy") => {
  if (!dateStr) return "N/A";
  try {
    const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    return isValid(date) ? format(date, formatStr) : dateStr;
  } catch {
    return dateStr;
  }
};

export const formatTime = (timeStr, formatStr = "h:mm a") => {
  if (!timeStr) return "N/A";
  try {
    // Handle "HH:MM" format
    if (typeof timeStr === "string" && timeStr.includes(":")) {
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, formatStr);
    }
    return timeStr;
  } catch {
    return timeStr;
  }
};

export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "N/A";
  try {
    const date = typeof dateTimeStr === "string" ? parseISO(dateTimeStr) : dateTimeStr;
    return isValid(date) ? format(date, "MMM d, yyyy h:mm a") : dateTimeStr;
  } catch {
    return dateTimeStr;
  }
};

export const parseTime = (timeStr) => {
  if (!timeStr) return null;
  try {
    const [hours, minutes] = timeStr.split(":");
    return { hours: parseInt(hours), minutes: parseInt(minutes) };
  } catch {
    return null;
  }
};

export const isTimeInRange = (time, startTime, endTime) => {
  const t = parseTime(time);
  const s = parseTime(startTime);
  const e = parseTime(endTime);
  
  if (!t || !s || !e) return false;
  
  const tMinutes = t.hours * 60 + t.minutes;
  const sMinutes = s.hours * 60 + s.minutes;
  const eMinutes = e.hours * 60 + e.minutes;
  
  return tMinutes >= sMinutes && tMinutes <= eMinutes;
};
