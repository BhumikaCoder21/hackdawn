// TruckRoutes.jsx — shows truck/ride routes and accepts incoming form data
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function TruckRoutes() {
  const location = useLocation();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    // Default sample truck routes
    const defaultRoutes = [
      {
        id: "truck1",
        vehicle: "Small Truck",
        ratePerKm: 25,
        capacityKg: 1000,
        origin: "Guwahati",
        destination: "Shillong",
        contact: "9876543210",
        notes: "Daily runs",
      },
      {
        id: "truck2",
        vehicle: "Open Trailor",
        ratePerKm: 40,
        capacityKg: 3000,
        origin: "Imphal",
        destination: "Agartala",
        contact: "9123456780",
        notes: "Available on weekdays",
      },
    ];

    const q = query(collection(db, "produce"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          // Only include documents that look like rides (type === 'ride')
          const firebaseData = snapshot.docs
            .filter((doc) => doc.data()?.type === "ride")
            .map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                vehicle: data.category || "Vehicle",
                ratePerKm: Number(data.price) || 0,
                capacityKg: Number(data.quantity) || 0,
                origin: data.name || "",
                destination: data.location || "",
                contact: data.contact || "",
                notes: data.description || "",
                createdAt: data.createdAt?.toDate?.() || new Date(),
              };
            });

          // Insert any incoming form data passed via location.state or sessionStorage
          const incoming = [];

          // 1) Prefer location.state.ride (passed when navigating)
          if (location?.state?.ride) {
            incoming.push({ id: "incoming-1", ...location.state.ride });
          }

          // 2) Support URL query params
          try {
            const params = new URLSearchParams(location.search);
            if (params.has("vehicle") || params.has("name")) {
              incoming.push({
                id: "incoming-qs",
                vehicle: params.get("vehicle") || params.get("category") || params.get("name"),
                ratePerKm: Number(
                  params.get("rate") || params.get("price") || 0
                ),
                capacityKg: Number(
                  params.get("capacity") || params.get("quantity") || 0
                ),
                origin: params.get("origin") || params.get("name") || "",
                destination: params.get("destination") || params.get("location") || "",
                contact: params.get("contact") || "",
                notes: params.get("notes") || params.get("description") || "",
              });
            }
          } catch (e) {
            // ignore malformed query
          }

          // 3) Support sessionStorage from older flows
          try {
            const stored = sessionStorage.getItem("postrideData");
            if (stored) {
              const parsed = JSON.parse(stored);
              incoming.push({ id: "incoming-session", ...parsed });
              sessionStorage.removeItem("postrideData");
            }
          } catch (e) {
            // ignore
          }

          setRoutes([...incoming, ...defaultRoutes, ...firebaseData]);
          setError(null);
        } catch (err) {
          console.error(
            "Error processing Firestore data for TruckRoutes:",
            err
          );
          setError("Failed to load truck routes. Please refresh the page.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError(
          "Failed to connect to truck routes. Please check your connection."
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [location]);

  // Filter routes based on search inputs (only when search is active)
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
    const trimmedOrigin = searchOrigin.trim();
    const trimmedDestination = searchDestination.trim();
    
    if (trimmedOrigin || trimmedDestination) {
      setSearchOrigin(trimmedOrigin);
      setSearchDestination(trimmedDestination);
      setIsSearchActive(true);
    }
  };

  const handleClearFilters = () => {
    setSearchOrigin("");
    setSearchDestination("");
    setIsSearchActive(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-green-600 font-semibold text-xl">
          Loading truck routes...
        </p>
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
          Available Truck Routes & Rides 🚚
        </h1>

        {/* Search Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Start Journey Point
              </label>
              <input
                type="text"
                placeholder="Enter origin location..."
                value={searchOrigin}
                onChange={(e) => setSearchOrigin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 End Journey Point
              </label>
              <input
                type="text"
                placeholder="Enter destination location..."
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
              >
                🔍 Search
              </button>
              {isSearchActive && (
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold border border-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Results Counter */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {isSearchActive ? (
                <>
                  Found <span className="font-bold text-green-600">{filteredRoutes.length}</span> matching route{filteredRoutes.length !== 1 ? 's' : ''}
                  {(searchOrigin || searchDestination) && (
                    <span className="ml-2">
                      {searchOrigin && (
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs ml-1">
                          From: {searchOrigin}
                        </span>
                      )}
                      {searchDestination && (
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs ml-1">
                          To: {searchDestination}
                        </span>
                      )}
                    </span>
                  )}
                </>
              ) : (
                <>
                  Showing <span className="font-bold text-green-600">{routes.length}</span> total route{routes.length !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Routes Grid */}
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
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {r.vehicle || r.category || "Truck"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      📍 {r.origin || "Unknown"} → {r.destination || "Unknown"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold text-lg">
                      ₹{r.ratePerKm || r.pricePerKm || r.price || r.rate}/km
                    </p>
                    <p className="text-sm text-gray-500">
                      Capacity:{" "}
                      {r.capacityKg || r.quantityKg || r.quantity || r.capacity || "—"} kg
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-gray-700 text-sm">
                  {r.notes || r.description || "No additional notes."}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={r.contact ? `tel:${r.contact}` : "#"}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      r.contact
                        ? "text-gray-700 hover:text-green-600 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={(e) => !r.contact && e.preventDefault()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {r.contact || "—"}
                  </a>
                  <a
                    href={r.contact ? `https://wa.me/91${r.contact}?text=Hi, I'm interested in your truck service from ${r.origin} to ${r.destination}` : "#"}
                    target={r.contact ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
                      r.contact
                        ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => !r.contact && e.preventDefault()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Contact Driver
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}