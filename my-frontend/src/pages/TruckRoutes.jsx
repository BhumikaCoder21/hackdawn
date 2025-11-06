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
                capacityKg: data.quantity || 0,
                origin: data.name || "",
                destination: data.location || "",
                contact: data.contact || "",
                notes: data.description || "",
                createdAt: data.createdAt?.toDate?.() || new Date(),
              };
            });

          // Insert any incoming form data passed via location.state or sessionStorage
          const incoming = [];

          // 1) Prefer location.state.ride (passed when navigating) — keeps immediate redirect behavior
          if (location?.state?.ride) {
            incoming.push({ id: "incoming-1", ...location.state.ride });
          }

          // 2) Support URL query params (e.g., /trucks?vehicle=X&rate=Y)
          try {
            const params = new URLSearchParams(location.search);
            if (params.has("vehicle") || params.has("name")) {
              incoming.push({
                id: "incoming-qs",
                vehicle: params.get("vehicle") || params.get("name"),
                ratePerKm: Number(
                  params.get("rate") || params.get("price") || 0
                ),
                capacityKg: Number(
                  params.get("capacity") || params.get("quantity") || 0
                ),
                origin: params.get("origin") || params.get("location") || "",
                destination: params.get("destination") || "",
                contact: params.get("contact") || "",
                notes: params.get("notes") || "",
              });
            }
          } catch (e) {
            // ignore malformed query
          }

          // 3) Support sessionStorage from older flows; key: postrideData
          try {
            const stored = sessionStorage.getItem("postrideData");
            if (stored) {
              const parsed = JSON.parse(stored);
              incoming.push({ id: "incoming-session", ...parsed });
              // clear it after reading to avoid duplicates
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {r.vehicle || r.name || "Truck"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    📍 {r.origin || "Unknown"} → {r.destination || "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">
                    ₹{r.ratePerKm || r.pricePerKg || r.rate}/km
                  </p>
                  <p className="text-sm text-gray-500">
                    Capacity:{" "}
                    {r.capacityKg || r.quantityKg || r.capacity || "—"} kg
                  </p>
                </div>
              </div>

              <p className="mt-3 text-gray-700">
                {r.notes || r.description || "No additional notes."}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Contact: {r.contact || "—"}
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Contact Driver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
