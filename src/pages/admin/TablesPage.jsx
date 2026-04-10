import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminTables, createTable, updateTable, deleteTable } from "../../api/adminApi";
import AdminLayout from "../../components/admin/AdminLayout";
import TableMap from "../../components/admin/TableMap";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import toast from "react-hot-toast";

export default function TablesPage() {
  const qc = useQueryClient();
  const [editingTable, setEditingTable] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const { data: tablesData, isLoading } = useQuery({
    queryKey: ["admin-tables"],
    queryFn: () => getAdminTables().then(r => r.data),
    refetchInterval: 15000  // live status refresh
  });

  const createMutation = useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      toast.success("Table created successfully");
      qc.invalidateQueries(["admin-tables"]);
      setShowCreateModal(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to create table");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTable(id, data),
    onSuccess: () => {
      toast.success("Table updated successfully");
      qc.invalidateQueries(["admin-tables"]);
      setEditingTable(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to update table");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTable,
    onSuccess: () => {
      toast.success("Table deactivated successfully");
      qc.invalidateQueries(["admin-tables"]);
      setShowDeleteConfirm(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to deactivate table");
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      table_number: formData.get("table_number"),
      label: formData.get("label"),
      capacity: parseInt(formData.get("capacity")),
      min_capacity: parseInt(formData.get("min_capacity")),
      location: formData.get("location"),
      features: formData.get("features")?.split(",").map(f => f.trim()).filter(Boolean) || [],
      notes: formData.get("notes")
    };
    createMutation.mutate(data);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      label: formData.get("label"),
      capacity: parseInt(formData.get("capacity")),
      min_capacity: parseInt(formData.get("min_capacity")),
      location: formData.get("location"),
      status: formData.get("status"),
      features: formData.get("features")?.split(",").map(f => f.trim()).filter(Boolean) || [],
      notes: formData.get("notes")
    };
    updateMutation.mutate({ id: editingTable._id, data });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-stone-800">Tables</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-700 transition"
          >
            + Add Table
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <TableMap 
            tables={tablesData?.tables || []} 
            onTableClick={setEditingTable}
          />
        )}
      </div>

      {/* Create Table Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Add New Table</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Table Number</label>
                <input name="table_number" required className="w-full border rounded-lg px-3 py-2" placeholder="T1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Label</label>
                <input name="label" required className="w-full border rounded-lg px-3 py-2" placeholder="Window Table 1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Capacity</label>
                  <input name="capacity" type="number" min="1" required className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Min Capacity</label>
                  <input name="min_capacity" type="number" min="1" defaultValue="1" className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                <select name="location" className="w-full border rounded-lg px-3 py-2">
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="bar">Bar</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Features (comma-separated)</label>
                <input name="features" className="w-full border rounded-lg px-3 py-2" placeholder="wheelchair_accessible, near_window" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
                <textarea name="notes" className="w-full border rounded-lg px-3 py-2" rows="2" />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Create Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {editingTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Edit Table {editingTable.table_number}</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Label</label>
                <input name="label" defaultValue={editingTable.label} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Capacity</label>
                  <input name="capacity" type="number" min="1" defaultValue={editingTable.capacity} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Min Capacity</label>
                  <input name="min_capacity" type="number" min="1" defaultValue={editingTable.min_capacity} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                <select name="location" defaultValue={editingTable.location} className="w-full border rounded-lg px-3 py-2">
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="bar">Bar</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
                <select name="status" defaultValue={editingTable.status} className="w-full border rounded-lg px-3 py-2">
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Features</label>
                <input name="features" defaultValue={editingTable.features?.join(", ")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
                <textarea name="notes" defaultValue={editingTable.notes} className="w-full border rounded-lg px-3 py-2" rows="2" />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTable(null)}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(editingTable)}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Deactivate Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => deleteMutation.mutate(showDeleteConfirm._id)}
        title="Deactivate Table"
        message={`Are you sure you want to deactivate table ${showDeleteConfirm?.table_number}? This will remove it from the booking system.`}
        confirmText="Deactivate"
        confirmVariant="danger"
      />
    </AdminLayout>
  );
}
