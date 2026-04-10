import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/adminApi";
import AdminLayout from "../../components/admin/AdminLayout";
import StatsCard from "../../components/admin/StatsCard";
import TableMap from "../../components/admin/TableMap";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { getAdminTables } from "../../api/adminApi";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats().then(r => r.data),
    refetchInterval: 30000  // refresh every 30s
  });

  const { data: tablesData, isLoading: tablesLoading } = useQuery({
    queryKey: ["admin-tables"],
    queryFn: () => getAdminTables().then(r => r.data),
    refetchInterval: 15000  // refresh every 15s
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-6">Dashboard</h2>

        {/* Today's stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            label="Today's Bookings" 
            value={stats?.today?.total_bookings} 
            color="blue" 
          />
          <StatsCard 
            label="Confirmed" 
            value={stats?.today?.confirmed} 
            color="green" 
          />
          <StatsCard 
            label="Cancelled" 
            value={stats?.today?.cancelled} 
            color="red" 
          />
          <StatsCard 
            label="Total Covers" 
            value={stats?.today?.covers} 
            color="purple" 
          />
        </div>

        {/* Weekly stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            label="This Week" 
            value={stats?.this_week?.total_bookings} 
            color="stone" 
          />
          <StatsCard 
            label="Confirmed" 
            value={stats?.this_week?.confirmed} 
            color="green" 
          />
          <StatsCard 
            label="This Month" 
            value={stats?.this_month?.total_bookings} 
            color="stone" 
          />
          <StatsCard 
            label="Confirmed" 
            value={stats?.this_month?.confirmed} 
            color="green" 
          />
        </div>

        {/* Table status map */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-stone-700">Live Table Status</h3>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-100 border border-green-300 rounded"></span>
                Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></span>
                Reserved
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-100 border border-red-300 rounded"></span>
                Occupied
              </span>
            </div>
          </div>
          
          {tablesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <TableMap 
              tables={tablesData?.tables || []} 
              onTableClick={(t) => console.log("Table clicked:", t)} 
            />
          )}
        </div>

        {/* Popular times */}
        {stats?.popular_times && stats.popular_times.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-medium text-stone-700 mb-4">Popular Times (This Month)</h3>
            <div className="flex gap-4">
              {stats.popular_times.map((time) => (
                <div
                  key={time.hour}
                  className="bg-stone-100 rounded-lg px-4 py-2 text-center"
                >
                  <p className="text-sm font-medium text-stone-800">{time.hour}</p>
                  <p className="text-xs text-stone-500">{time.bookings} bookings</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
