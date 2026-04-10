import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

export default function Toast({ type = "info", message, onClose }) {
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertTriangle className="text-yellow-500" size={20} />
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-yellow-50 border-yellow-200"
  };

  return (
    <div className={`rounded-lg border p-4 shadow-lg flex items-center gap-3 min-w-[300px] ${bgColors[type]}`}>
      {icons[type]}
      <p className="text-stone-800 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-stone-400 hover:text-stone-600 transition"
      >
        ✕
      </button>
    </div>
  );
}
