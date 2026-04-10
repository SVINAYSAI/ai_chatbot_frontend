import StatusBadge from "./StatusBadge";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function BookingTable({ bookings, isLoading, onRowClick }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow p-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-12 text-center">
        <p className="text-stone-500">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-500 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Reference</th>
              <th className="px-6 py-3 font-medium">Guest</th>
              <th className="px-6 py-3 font-medium">Date & Time</th>
              <th className="px-6 py-3 font-medium">Party</th>
              <th className="px-6 py-3 font-medium">Table</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bookings.map((b) => (
              <tr
                key={b._id}
                onClick={() => onRowClick(b)}
                className="hover:bg-stone-50 cursor-pointer transition"
              >
                <td className="px-6 py-4 font-mono text-stone-600">{b.booking_ref}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-stone-800">{b.guest_info?.name}</div>
                  <div className="text-stone-400 text-xs">{b.guest_info?.email}</div>
                </td>
                <td className="px-6 py-4 text-stone-700">
                  {b.booking_date} <span className="text-stone-400">at</span> {b.booking_time}
                </td>
                <td className="px-6 py-4 text-stone-700">{b.party_size} guests</td>
                <td className="px-6 py-4 text-stone-700">{b.table_number}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
