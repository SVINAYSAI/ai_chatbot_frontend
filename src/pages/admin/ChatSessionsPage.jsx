import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChatSessions } from "../../api/adminApi";
import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import StatusBadge from "../../components/admin/StatusBadge";
import { format } from "date-fns";

export default function ChatSessionsPage() {
  const [filters, setFilters] = useState({ status: "", page: 1 });
  const [selectedSession, setSelectedSession] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chat-sessions", filters],
    queryFn: () => getChatSessions(filters).then(r => r.data)
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM d, yyyy h:mm a");
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-6">Chat Sessions</h2>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        {/* Sessions Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-left">
                <tr>
                  <th className="px-6 py-3">Session Token</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Intent</th>
                  <th className="px-6 py-3">Messages</th>
                  <th className="px-6 py-3">Started</th>
                  <th className="px-6 py-3">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(data?.sessions || []).map((session) => (
                  <tr
                    key={session._id}
                    onClick={() => setSelectedSession(session)}
                    className="hover:bg-stone-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-mono text-stone-600 text-xs">
                      {session.session_token?.substring(0, 16)}...
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={session.status} />
                    </td>
                    <td className="px-6 py-4 capitalize text-stone-700">{session.intent}</td>
                    <td className="px-6 py-4 text-stone-700">
                      {session.messages?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-xs">
                      {formatDate(session.started_at)}
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-xs">
                      {formatDate(session.last_message_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!data?.sessions || data.sessions.length === 0) && (
              <div className="text-center py-12 text-stone-500">
                No chat sessions found
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setFilters({ ...filters, page })}
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
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-stone-800">Chat Session</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {selectedSession.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-stone-900 text-white rounded-br-sm"
                          : "bg-stone-100 text-stone-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
