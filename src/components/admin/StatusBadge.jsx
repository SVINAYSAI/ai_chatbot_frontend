const colors = {
  confirmed:   "bg-green-100 text-green-700",
  pending:     "bg-yellow-100 text-yellow-700",
  cancelled:   "bg-red-100 text-red-700",
  completed:   "bg-blue-100 text-blue-700",
  no_show:     "bg-stone-100 text-stone-500",
  available:   "bg-green-100 text-green-700",
  reserved:    "bg-yellow-100 text-yellow-700",
  occupied:    "bg-red-100 text-red-700",
  maintenance: "bg-stone-100 text-stone-500",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${colors[status] || "bg-stone-100"}`}>
      {status?.replace("_", " ")}
    </span>
  );
}
