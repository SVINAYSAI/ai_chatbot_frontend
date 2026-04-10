import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRestaurant } from "../../api/restaurantApi";
import ChatWidget from "../../components/chat/ChatWidget";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function HomePage() {
  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant"],
    queryFn: () => getRestaurant().then(r => r.data),
  });

  const restaurantName = restaurant?.name || import.meta.env.VITE_RESTAURANT_NAME || "The Golden Fork";

  // Format operating hours
  const formatHours = (hours) => {
    if (!hours || !Array.isArray(hours)) return "Please call for hours";
    
    return hours
      .filter(h => h.is_open)
      .map(h => `${h.day.charAt(0).toUpperCase() + h.day.slice(1, 3)}: ${h.open_time}-${h.close_time}`)
      .join(" | ");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Restaurant hero section */}
      <header className="bg-stone-900 text-white py-16 text-center">
        <h1 className="text-4xl font-serif">{restaurantName}</h1>
        <p className="mt-2 text-stone-300">Fine dining, unforgettable moments</p>
        <p className="mt-4 text-sm text-stone-400">
          Click the chat icon to book your table
        </p>
      </header>

      {/* Restaurant info */}
      <main className="max-w-4xl mx-auto py-12 px-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : restaurant ? (
          <div className="space-y-8">
            {/* About */}
            <section className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">About Us</h2>
              <p className="text-stone-600">
                Welcome to {restaurantName}, where culinary excellence meets warm hospitality. 
                Our restaurant offers a memorable dining experience with carefully crafted dishes 
                and an elegant atmosphere.
              </p>
            </section>

            {/* Contact & Hours */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">Contact</h2>
                <div className="space-y-2 text-stone-600">
                  {restaurant.contact?.phone && (
                    <p>📞 {restaurant.contact.phone}</p>
                  )}
                  {restaurant.contact?.email && (
                    <p>✉️ {restaurant.contact.email}</p>
                  )}
                  {restaurant.address && (
                    <p>
                      📍 {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}
                    </p>
                  )}
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">Hours</h2>
                <p className="text-stone-600 text-sm">
                  {formatHours(restaurant.operating_hours)}
                </p>
                {restaurant.booking_rules && (
                  <div className="mt-4 text-sm text-stone-500">
                    <p>Book up to {restaurant.booking_rules.advance_booking_days} days in advance</p>
                    <p>Parties of {restaurant.booking_rules.min_party_size}-{restaurant.booking_rules.max_party_size}</p>
                  </div>
                )}
              </section>
            </div>

            {/* How to Book */}
            <section className="bg-stone-900 text-white rounded-2xl p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Ready to Book?</h2>
              <p className="text-stone-300 mb-4">
                Use our AI assistant to book your table in just a few messages
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="bg-stone-800 px-3 py-1 rounded-full">1. Open chat</span>
                <span className="text-stone-500">→</span>
                <span className="bg-stone-800 px-3 py-1 rounded-full">2. Tell us when</span>
                <span className="text-stone-500">→</span>
                <span className="bg-stone-800 px-3 py-1 rounded-full">3. Get confirmed</span>
              </div>
            </section>
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500">
            <p>Welcome to our restaurant!</p>
            <p className="mt-2">Use the chat widget to book a table.</p>
          </div>
        )}
      </main>

      {/* Floating chat widget — always visible */}
      <ChatWidget />
    </div>
  );
}
