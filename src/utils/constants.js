// Booking status colors for Tailwind
export const BOOKING_STATUS_COLORS = {
  confirmed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  no_show: "bg-stone-100 text-stone-500 border-stone-200",
};

// Table status colors
export const TABLE_STATUS_COLORS = {
  available: "bg-green-100 text-green-700 border-green-200",
  reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
  occupied: "bg-red-100 text-red-700 border-red-200",
  maintenance: "bg-stone-100 text-stone-500 border-stone-200",
};

// Location icons
export const LOCATION_ICONS = {
  indoor: "🏠",
  outdoor: "🌳",
  bar: "🍸",
  private: "🔒",
};

// Admin role labels
export const ADMIN_ROLES = {
  super_admin: "Super Admin",
  manager: "Manager",
  staff: "Staff",
};

// Permission labels
export const PERMISSION_LABELS = {
  view_bookings: "View Bookings",
  edit_bookings: "Edit Bookings",
  cancel_bookings: "Cancel Bookings",
  manage_tables: "Manage Tables",
  view_reports: "View Reports",
  manage_admins: "Manage Admins",
  manage_settings: "Manage Settings",
  view_chat_sessions: "View Chat Sessions",
};

// Days of week
export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
