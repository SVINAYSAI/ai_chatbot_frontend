import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminBookings, updateBookingStatus, deleteBooking } from "../../api/adminApi";
import AdminLayout from "../../components/admin/AdminLayout";
import BookingTable from "../../components/admin/BookingTable";
import BookingModal from "../../components/admin/BookingModal";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const [filters, setFilters] = useState({ status: "", date: "", page: 1 });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", filters],
    queryFn: () => getAdminBookings(filters).then(r => r.data)
  });

  const cancelMutation = useMutation({
    mutationFn: (ref) => deleteBooking(ref, "Cancelled by admin"),
    onSuccess: () => {
      toast.success("Booking cancelled");
      qc.invalidateQueries(["admin-bookings"]);
      setSelectedBooking(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to cancel booking");
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ ref, status }) => updateBookingStatus(ref, status),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries(["admin-bookings"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to update status");
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-6">Bookings</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filters.status}
            onChange={e => handleFilterChange("status", e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
          </select>
          
          <input
            type="date"
            value={filters.date}
            onChange={e => handleFilterChange("date", e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
          />
          
          <button
            onClick={() => setFilters({ status: "", date: "", page: 1 })}
            className="px-3 py-2 text-sm text-stone-600 hover:text-stone-800 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Bookings Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <BookingTable
              bookings={data?.bookings || []}
              isLoading={isLoading}
              onRowClick={setSelectedBooking}
            />
            
            {/* Pagination */}
            {data && data.pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handleFilterChange("page", page)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      filters.page === page
                        ? "bg-stone-900 text-white"
                        : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Booking Modal */}
        {selectedBooking && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onCancel={(ref) => cancelMutation.mutate(ref)}
            onStatusChange={(ref, status) => statusMutation.mutate({ ref, status })}
          />
        )}
      </div>
    </AdminLayout>
  );
}
