import { X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger" // "danger" | "primary"
}) {
  if (!isOpen) return null;

  const confirmClasses = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    primary: "bg-stone-900 hover:bg-stone-700 text-white"
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-stone-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition ${confirmClasses[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
