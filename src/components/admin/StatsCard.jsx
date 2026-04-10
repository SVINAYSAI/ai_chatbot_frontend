export default function StatsCard({ label, value, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    red: "bg-red-50 border-red-200 text-red-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    stone: "bg-stone-50 border-stone-200 text-stone-800"
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color] || colorClasses.blue}`}>
      <p className="text-sm opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}
