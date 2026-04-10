import TableCard from "./TableCard";

export default function TableMap({ tables, onTableClick }) {
  const statusColor = {
    available: "bg-green-100 border-green-300 text-green-800 hover:bg-green-200",
    reserved:  "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200",
    occupied:  "bg-red-100 border-red-300 text-red-800 hover:bg-red-200",
    maintenance: "bg-stone-100 border-stone-300 text-stone-500 hover:bg-stone-200"
  };

  if (!tables || tables.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        No tables configured
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tables.map((table) => (
        <TableCard
          key={table._id}
          table={table}
          colorClass={statusColor[table.status] || statusColor.available}
          onClick={() => onTableClick(table)}
        />
      ))}
    </div>
  );
}
