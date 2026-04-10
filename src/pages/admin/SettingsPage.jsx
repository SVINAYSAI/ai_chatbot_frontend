import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRestaurant, updateRestaurantSettings, updateOperatingHours, updateBookingRules, updateAIPrompt } from "../../api/restaurantApi";
import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function SettingsPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");
  const [editedHours, setEditedHours] = useState([]);
  const [editedRules, setEditedRules] = useState({});
  const [aiPrompt, setAiPrompt] = useState("");

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant-settings"],
    queryFn: () => getRestaurant().then(r => r.data)
  });

  useEffect(() => {
    if (restaurant) {
      setEditedHours(restaurant.operating_hours || []);
      setEditedRules(restaurant.booking_rules || {});
      setAiPrompt(restaurant.ai_system_prompt_override || "");
    }
  }, [restaurant]);

  const settingsMutation = useMutation({
    mutationFn: updateRestaurantSettings,
    onSuccess: () => {
      toast.success("Settings updated");
      qc.invalidateQueries(["restaurant-settings"]);
    },
    onError: (err) => toast.error(err.response?.data?.detail || "Update failed")
  });

  const hoursMutation = useMutation({
    mutationFn: updateOperatingHours,
    onSuccess: () => {
      toast.success("Operating hours updated");
      qc.invalidateQueries(["restaurant-settings"]);
    },
    onError: (err) => toast.error(err.response?.data?.detail || "Update failed")
  });

  const rulesMutation = useMutation({
    mutationFn: updateBookingRules,
    onSuccess: () => {
      toast.success("Booking rules updated");
      qc.invalidateQueries(["restaurant-settings"]);
    },
    onError: (err) => toast.error(err.response?.data?.detail || "Update failed")
  });

  const promptMutation = useMutation({
    mutationFn: updateAIPrompt,
    onSuccess: () => {
      toast.success("AI prompt updated");
      qc.invalidateQueries(["restaurant-settings"]);
    },
    onError: (err) => toast.error(err.response?.data?.detail || "Update failed")
  });

  const handleHourChange = (day, field, value) => {
    setEditedHours(prev => {
      const existing = prev.find(h => h.day === day);
      if (existing) {
        return prev.map(h => h.day === day ? { ...h, [field]: value } : h);
      }
      return [...prev, { day, is_open: true, open_time: "09:00", close_time: "22:00", last_booking_time: "21:00", [field]: value }];
    });
  };

  const getHourForDay = (day) => {
    return editedHours.find(h => h.day === day) || { day, is_open: false, open_time: "09:00", close_time: "22:00", last_booking_time: "21:00" };
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-6">Settings</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-stone-200">
          {[
            { id: "general", label: "General" },
            { id: "hours", label: "Operating Hours" },
            { id: "rules", label: "Booking Rules" },
            { id: "ai", label: "AI Prompt" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "text-stone-900 border-b-2 border-stone-900"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === "general" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                settingsMutation.mutate({
                  name: formData.get("name"),
                  address: {
                    street: formData.get("street"),
                    city: formData.get("city"),
                    state: formData.get("state"),
                    zip: formData.get("zip"),
                    country: formData.get("country")
                  },
                  contact: {
                    phone: formData.get("phone"),
                    email: formData.get("email")
                  }
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Restaurant Name</label>
                <input
                  name="name"
                  defaultValue={restaurant?.name}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                  <input
                    name="phone"
                    defaultValue={restaurant?.contact?.phone}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input
                    name="email"
                    defaultValue={restaurant?.contact?.email}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Street</label>
                <input
                  name="street"
                  defaultValue={restaurant?.address?.street}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
                  <input
                    name="city"
                    defaultValue={restaurant?.address?.city}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
                  <input
                    name="state"
                    defaultValue={restaurant?.address?.state}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">ZIP</label>
                  <input
                    name="zip"
                    defaultValue={restaurant?.address?.zip}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={settingsMutation.isPending}
                className="bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50"
              >
                {settingsMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Operating Hours */}
        {activeTab === "hours" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">
            <div className="space-y-4">
              {DAYS.map(day => {
                const hours = getHourForDay(day);
                return (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 capitalize font-medium text-stone-700">{day}</div>
                    <input
                      type="checkbox"
                      checked={hours.is_open}
                      onChange={(e) => handleHourChange(day, "is_open", e.target.checked)}
                      className="w-5 h-5"
                    />
                    {hours.is_open ? (
                      <>
                        <input
                          type="time"
                          value={hours.open_time}
                          onChange={(e) => handleHourChange(day, "open_time", e.target.value)}
                          className="border rounded-lg px-2 py-1"
                        />
                        <span className="text-stone-500">to</span>
                        <input
                          type="time"
                          value={hours.close_time}
                          onChange={(e) => handleHourChange(day, "close_time", e.target.value)}
                          className="border rounded-lg px-2 py-1"
                        />
                        <span className="text-stone-500 text-sm">Last booking:</span>
                        <input
                          type="time"
                          value={hours.last_booking_time}
                          onChange={(e) => handleHourChange(day, "last_booking_time", e.target.value)}
                          className="border rounded-lg px-2 py-1"
                        />
                      </>
                    ) : (
                      <span className="text-stone-400">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => hoursMutation.mutate(editedHours)}
              disabled={hoursMutation.isPending}
              className="mt-6 bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50"
            >
              {hoursMutation.isPending ? "Saving..." : "Save Hours"}
            </button>
          </div>
        )}

        {/* Booking Rules */}
        {activeTab === "rules" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Min Party Size</label>
                <input
                  type="number"
                  min="1"
                  value={editedRules.min_party_size || 1}
                  onChange={(e) => setEditedRules({ ...editedRules, min_party_size: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Max Party Size</label>
                <input
                  type="number"
                  min="1"
                  value={editedRules.max_party_size || 20}
                  onChange={(e) => setEditedRules({ ...editedRules, max_party_size: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Slot Duration (minutes)</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={editedRules.slot_duration_minutes || 90}
                  onChange={(e) => setEditedRules({ ...editedRules, slot_duration_minutes: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Advance Booking (days)</label>
                <input
                  type="number"
                  min="1"
                  value={editedRules.advance_booking_days || 30}
                  onChange={(e) => setEditedRules({ ...editedRules, advance_booking_days: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Cancellation Cutoff (hours)</label>
                <input
                  type="number"
                  min="0"
                  value={editedRules.cancellation_cutoff_hours || 2}
                  onChange={(e) => setEditedRules({ ...editedRules, cancellation_cutoff_hours: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <button
              onClick={() => rulesMutation.mutate(editedRules)}
              disabled={rulesMutation.isPending}
              className="mt-6 bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50"
            >
              {rulesMutation.isPending ? "Saving..." : "Save Rules"}
            </button>
          </div>
        )}

        {/* AI Prompt */}
        {activeTab === "ai" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">
            <p className="text-stone-600 text-sm mb-4">
              Customize the AI assistant's system prompt. Leave empty to use the default prompt.
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Enter custom AI system prompt..."
              rows="10"
              className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => promptMutation.mutate(aiPrompt)}
                disabled={promptMutation.isPending}
                className="bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50"
              >
                {promptMutation.isPending ? "Saving..." : "Save Prompt"}
              </button>
              <button
                onClick={() => setAiPrompt("")}
                className="border border-stone-300 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-50"
              >
                Reset to Default
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
