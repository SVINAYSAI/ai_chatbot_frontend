import { X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ConfirmDialog from "../shared/ConfirmDialog";
import { useState } from "react";

export default function BookingModal({ booking, onClose, onCancel, onStatusChange }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [newStatus, setNewStatus] = useState(booking.status);

  const handleStatusChange = () => {
    if (newStatus !== booking.status) {
      onStatusChange(booking.booking_ref, newStatus);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-stone-100">
            <h3 className="text-lg font-semibold text-stone-800">Booking Details</h3>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Reference */}
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-wide">Reference</label>
              <p className="font-mono text-stone-800">{booking.booking_ref}</p>
            </div>

            {/* Guest Info */}
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-wide">Guest</label>
              <p className="font-medium text-stone-800">{booking.guest_info?.name}</p>
              <p className="text-stone-500 text-sm">{booking.guest_info?.email}</p>
              {booking.guest_info?.phone && (
                <p className="text-stone-500 text-sm">{booking.guest_info.phone}</p>
              )}
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wide">Date</label>
                <p className="text-stone-800">{booking.booking_date}</p>
              </div>
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wide">Time</label>
                <p className="text-stone-800">{booking.booking_time}</p>
              </div>
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wide">Party Size</label>
                <p className="text-stone-800">{booking.party_size} guests</p>
              </div>
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wide">Table</label>
                <p className="text-stone-800">{booking.table_number}</p>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-wide">Status</label>
              <div className="flex items-center gap-3 mt-1">
                <StatusBadge status={booking.status} />
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
                {newStatus !== booking.status && (
                  <button
                    onClick={handleStatusChange}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Update
                  </button>
                )}
              </div>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wide">Special Requests</label>
                <p className="text-stone-700 text-sm bg-stone-50 p-3 rounded-lg mt-1">
                  {booking.special_requests}
                </p>
              </div>
            )}

            {/* Source */}
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-wide">Source</label>
              <p className="text-stone-700 text-sm capitalize">{booking.source}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-stone-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition"
            >
              Close
            </button>
            {booking.status !== "cancelled" && booking.status !== "completed" && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          onCancel(booking.booking_ref);
          setShowCancelConfirm(false);
        }}
        title="Cancel Booking"
        message={`Are you sure you want to cancel booking ${booking.booking_ref}? This action cannot be undone.`}
        confirmText="Cancel Booking"
        confirmVariant="danger"
      />
    </>
  );
}
