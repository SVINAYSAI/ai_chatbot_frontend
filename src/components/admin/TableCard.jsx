export default function TableCard({ table, colorClass, onClick }) {
  const locationIcons = {
    indoor: "🏠",
    outdoor: "🌳",
    bar: "🍸",
    private: "🔒"
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-xl border-2 p-4 text-left w-full transition ${colorClass}`}
    >
      <div className="flex justify-between items-start">
        <div className="font-bold text-lg">{table.table_number}</div>
        <span className="text-lg" title={table.location}>
          {locationIcons[table.location] || "🪑"}
        </span>
      </div>
      <div className="text-sm opacity-70 mt-1">{table.label}</div>
      <div className="text-xs mt-3 flex items-center gap-2">
        <span>👥 {table.capacity} seats</span>
        {table.min_capacity > 1 && (
          <span className="opacity-60">(min {table.min_capacity})</span>
        )}
      </div>
      <div className="text-xs capitalize mt-1 opacity-80">{table.status}</div>
      
      {/* Current booking indicator */}
      {table.current_booking && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <p className="text-xs opacity-80 truncate">
            {table.current_booking.guest_name}
          </p>
          <p className="text-xs opacity-60">
            until {table.current_booking.end_time}
          </p>
        </div>
      )}
    </button>
  );
}
