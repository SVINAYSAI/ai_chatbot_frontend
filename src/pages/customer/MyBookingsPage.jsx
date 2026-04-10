import { useQuery } from "@tanstack/react-query";
import { getMyBookings, cancelBooking } from "../../api/bookingApi";
import { getMe } from "../../api/authApi";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function MyBookingsPage() {
  const queryClient = useQueryClient();
  const [cancelBookingRef, setCancelBookingRef] = useState(null);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe().then(r => r.data),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => getMyBookings().then(r => r.data),
    enabled: !!user,
  });

  const handleCancel = async (ref) => {
    try {
      await cancelBooking(ref, "Cancelled by customer");
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries(["my-bookings"]);
      setCancelBookingRef(null);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to cancel booking");
    }
  };

  if (userLoading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold text-stone-800">Please Log In</h2>
          <p className="text-stone-500 mt-2">
            You need to be logged in to view your bookings
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-stone-900 text-white px-6 py-2 rounded-lg hover:bg-stone-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const bookings = bookingsData?.bookings || [];
  const upcomingBookings = bookings.filter(b => 
    ["confirmed", "pending"].includes(b.status)
  );
  const pastBookings = bookings.filter(b => 
    ["completed", "cancelled", "no_show"].includes(b.status)
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-stone-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-serif">My Bookings</h1>
          <p className="text-stone-400 mt-1">Welcome back, {user.name}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Upcoming Bookings */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Upcoming Reservations</h2>
          
          {upcomingBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <p className="text-stone-500">No upcoming reservations</p>
              <Link
                to="/"
                className="mt-4 inline-block text-stone-900 font-medium hover:underline"
              >
                Book a table →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-mono text-stone-500 text-sm">{booking.booking_ref}</p>
                      <h3 className="text-lg font-semibold text-stone-800">
                        {booking.booking_date} at {booking.booking_time}
                      </h3>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Users size={18} />
                      <span>{booking.party_size} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <MapPin size={18} />
                      <span>Table {booking.table_number}</span>
                    </div>
                  </div>

                  {booking.special_requests && (
                    <p className="text-sm text-stone-500 mb-4">
                      Note: {booking.special_requests}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Link
                      to={`/booking/confirm/${booking.booking_ref}`}
                      className="text-stone-900 font-medium text-sm hover:underline"
                    >
                      View Details →
                    </Link>
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => setCancelBookingRef(booking.booking_ref)}
                        className="text-red-600 font-medium text-sm hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-4">Past Reservations</h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow p-6 opacity-75"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-stone-500 text-sm">{booking.booking_ref}</p>
                      <h3 className="text-lg font-semibold text-stone-800">
                        {booking.booking_date} at {booking.booking_time}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-stone-600 text-sm">
                        <span>{booking.party_size} guests</span>
                        <span>Table {booking.table_number}</span>
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancelBookingRef}
        onClose={() => setCancelBookingRef(null)}
        onConfirm={() => handleCancel(cancelBookingRef)}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        confirmVariant="danger"
      />
    </div>
  );
}
