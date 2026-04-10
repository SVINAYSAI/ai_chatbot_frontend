import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Table2, MessageSquare, Settings } from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/bookings",      icon: CalendarDays, label: "Bookings" },
  { to: "/admin/tables",        icon: Table2,       label: "Tables" },
  { to: "/admin/chat-sessions", icon: MessageSquare, label: "Chat Sessions" },
  { to: "/admin/settings",      icon: Settings,     label: "Settings" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className="w-60 bg-stone-900 text-white flex flex-col py-6">
        <div className="px-6 mb-8">
          <h1 className="text-lg font-semibold">🍽️ Admin Panel</h1>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                 ${isActive ? "bg-stone-700 text-white" : "text-stone-400 hover:text-white hover:bg-stone-800"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        
        {/* Logout button */}
        <div className="px-3 mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("auth-storage");
              window.location.href = "/admin/login";
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
}
