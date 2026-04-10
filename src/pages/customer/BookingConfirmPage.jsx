import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingByRef } from "../../api/bookingApi";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { Calendar, Clock, Users, Armchair, Mail, CheckCircle } from "lucide-react";

export default function BookingConfirmPage() {
  const { ref } = useParams();
  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["booking", ref],
    queryFn: () => getBookingByRef(ref).then(r => r.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-stone-800">Booking Not Found</h2>
          <p className="text-stone-500 mt-2">
            We couldn't find a booking with reference <strong>{ref}</strong>
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

  const isCancelled = booking.status === "cancelled";

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-6">
          {isCancelled ? (
            <div className="text-5xl mb-4">⚠️</div>
          ) : (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          )}
          <h2 className={`text-2xl font-semibold ${isCancelled ? "text-stone-800" : "text-stone-800"}`}>
            {isCancelled ? "Booking Cancelled" : "Booking Confirmed!"}
          </h2>
          <p className="text-stone-500 mt-2">
            Reference: <span className="font-mono font-medium">{booking.booking_ref}</span>
          </p>
        </div>

        {/* Booking Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
            <Calendar className="text-stone-400" size={20} />
            <div>
              <p className="text-xs text-stone-500 uppercase">Date</p>
              <p className="text-stone-800 font-medium">{booking.booking_date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
            <Clock className="text-stone-400" size={20} />
            <div>
              <p className="text-xs text-stone-500 uppercase">Time</p>
              <p className="text-stone-800 font-medium">{booking.booking_time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
            <Users className="text-stone-400" size={20} />
            <div>
              <p className="text-xs text-stone-500 uppercase">Party Size</p>
              <p className="text-stone-800 font-medium">{booking.party_size} guests</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
            <Armchair className="text-stone-400" size={20} />
            <div>
              <p className="text-xs text-stone-500 uppercase">Table</p>
              <p className="text-stone-800 font-medium">{booking.table_number}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
            <Mail className="text-stone-400" size={20} />
            <div>
              <p className="text-xs text-stone-500 uppercase">Confirmation sent to</p>
              <p className="text-stone-800 font-medium">{booking.guest_info?.email}</p>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.special_requests && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <p className="text-xs text-amber-600 uppercase mb-1">Special Requests</p>
            <p className="text-stone-700 text-sm">{booking.special_requests}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-stone-900 text-white px-6 py-3 rounded-lg text-center hover:bg-stone-700 transition"
          >
            Back to Home
          </Link>
          
          {!isCancelled && (
            <button
              onClick={() => window.print()}
              className="block w-full border border-stone-300 text-stone-700 px-6 py-3 rounded-lg text-center hover:bg-stone-50 transition"
            >
              Print Confirmation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
