// TruckRoutes.jsx — shows truck/ride routes and accepts incoming form data
// TruckRoutes.jsx — shows truck/ride routes and accepts incoming form data
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

export default function TruckRoutes() {
  const location = useLocation();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const defaultRoutes = [
      {
        id: "truck1",
        vehicle: "Mini Truck",
        ratePerKm: 25,
        capacityKg: 1000,
        origin: "Guwahati",
        destination: "Shillong",
        contact: "9876543210",
        notes: "Daily runs",
      },
      {
        id: "truck2",
        vehicle: "Pickup Truck",
        ratePerKm: 30,
        capacityKg: 1500,
        origin: "Imphal",
        destination: "Aizawl",
        contact: "9123456780",
        notes: "Available Mon–Sat",
      },
    ];

    const q = query(collection(db, "produce"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const firebaseData = snapshot.docs
            .filter((doc) => doc.data()?.type === "ride")
            .map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                vehicle: data.category || "Truck",
                ratePerKm: Number(data.price) || 0,
                capacityKg: Number(data.quantity) || 0,
                origin: data.name || "",
                destination: data.location || "",
                contact: data.contact || "",
                notes: data.description || "",
              };
            });

          setRoutes([...defaultRoutes, ...firebaseData]);
          setError(null);
        } catch (err) {
          console.error("Error processing Firestore data:", err);
          setError("Failed to load truck routes. Please refresh.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError("Failed to connect to routes. Check your connection.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [location]);

  const filteredRoutes = isSearchActive
    ? routes.filter((route) => {
        const matchesOrigin = searchOrigin.trim()
          ? route.origin?.toLowerCase().includes(searchOrigin.trim().toLowerCase())
          : true;
        const matchesDestination = searchDestination.trim()
          ? route.destination?.toLowerCase().includes(searchDestination.trim().toLowerCase())
          : true;
        return matchesOrigin && matchesDestination;
      })
    : routes;

  const handleSearch = () => {
    if (searchOrigin.trim() || searchDestination.trim()) setIsSearchActive(true);
  };

  const handleClearFilters = () => {
    setSearchOrigin("");
    setSearchDestination("");
    setIsSearchActive(false);
  };

  if (!isLoaded) return <div className="text-center mt-24">🗺️ Loading Google Maps...</div>;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-green-600 font-semibold text-xl">Loading truck routes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
          <p className="text-red-600 text-lg mb-4">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-[#f6fff5] pb-10">
      <div className="max-w-6xl mx-auto mt-24 px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-green-700">
          🚚 Available Truck Routes & Rides
        </h1>

        {/* Search Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Start Point
              </label>
              <input
                type="text"
                placeholder="Enter origin..."
                value={searchOrigin}
                onChange={(e) => setSearchOrigin(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 End Point
              </label>
              <input
                type="text"
                placeholder="Enter destination..."
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                🔍 Search
              </button>
              {isSearchActive && (
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition border border-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Routes List */}
        {filteredRoutes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Routes Found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRoutes.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{r.vehicle}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      📍 {r.origin} → {r.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold text-lg">₹{r.ratePerKm}/km</p>
                    <p className="text-sm text-gray-500">Capacity: {r.capacityKg} kg</p>
                  </div>
                </div>

                <p className="mt-3 text-gray-700 text-sm">
                  {r.notes || "No additional notes."}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedRoute(r)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm transition"
                  >
                    📍 View Location
                  </button>

                  <a
                    href={r.contact ? `tel:${r.contact}` : "#"}
                    className={`text-sm font-medium ${
                      r.contact ? "text-gray-700 hover:text-green-600" : "text-gray-400"
                    }`}
                    onClick={(e) => !r.contact && e.preventDefault()}
                  >
                    📞 {r.contact || "N/A"}
                  </a>

                  <a
                    href={
                      r.contact
                        ? `https://wa.me/91${r.contact}?text=Hi, I'm interested in your truck service from ${r.origin} to ${r.destination}`
                        : "#"
                    }
                    target={r.contact ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`text-sm px-4 py-2 rounded-lg shadow-sm ${
                      r.contact
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500"
                    }`}
                    onClick={(e) => !r.contact && e.preventDefault()}
                  >
                    💬 Contact Driver
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🗺️ Map Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-4xl shadow-xl relative">
              <button
                onClick={() => setSelectedRoute(null)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
                {selectedRoute.vehicle}: {selectedRoute.origin} → {selectedRoute.destination}
              </h2>

              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={6}
                center={{ lat: 25.5788, lng: 93.9629 }}
              >
                {/* Markers for start and end */}
                <Marker
                  position={{ lat: 26.1445, lng: 91.7362 }}
                  label="A"
                  title={selectedRoute.origin}
                />
                <Marker
                  position={{ lat: 25.5788, lng: 93.9629 }}
                  label="B"
                  title={selectedRoute.destination}
                />
              </GoogleMap>

              <p className="text-center text-gray-600 mt-4">
                Showing approximate start and end locations
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
