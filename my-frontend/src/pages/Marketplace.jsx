// src/pages/Marketplace.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

import exploreBanner1 from "../assets/exploreBanner1.jpg";
import exploreBanner2 from "../assets/exploreBanner2.jpg";
import exploreBanner3 from "../assets/exploreBanner3.jpg";

import tomatoes from "../assets/tomatoes.jpg";
import oranges from "../assets/oranges.jpg";
import chilli from "../assets/chilli.jpg";
import ginger from "../assets/ginger.jpg";
import jam from "../assets/jam.jpg";
import pickle from "../assets/pickle.jpg";
import juice from "../assets/juice.jpg";
import kiwi from "../assets/kiwi.jpg";

export default function Marketplace() {
  const [filter, setFilter] = useState("All");
  const [produceData, setProduceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Default local produce items
    const defaultProduce = [
      {
        id: "local1",
        name: "Organic Tomatoes",
        pricePerKg: 25,
        quantityKg: 50,
        location: "Ziro, Arunachal Pradesh",
        category: "Vegetable",
        imageUrl: tomatoes,
        contact: "9876543210",
        description: "Fresh organic tomatoes from local farms",
      },
      {
        id: "local2",
        name: "Fresh Oranges",
        pricePerKg: 40,
        quantityKg: 30,
        location: "Tinsukia, Assam",
        category: "Fruit",
        imageUrl: oranges,
        contact: "9123456780",
        description: "Sweet and juicy oranges",
      },
      {
        id: "local3",
        name: "King Chilli (Bhoot Jolokia)",
        pricePerKg: 150,
        quantityKg: 10,
        location: "Imphal, Manipur",
        category: "Spice",
        imageUrl: chilli,
        contact: "9988776655",
        description: "World's hottest chilli pepper",
      },
      {
        id: "local4",
        name: "Ginger Roots",
        pricePerKg: 50,
        quantityKg: 20,
        location: "Aizawl, Mizoram",
        category: "Spice",
        imageUrl: ginger,
        contact: "9876501234",
        description: "Premium quality ginger roots",
      },
    ];

    const q = query(collection(db, "produce"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          // Only include documents that look like produce (type === 'produce')
          const firebaseData = snapshot.docs
            .filter((doc) => doc.data()?.type === "produce")
            .map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                pricePerKg: data.pricePerKg || data.price || 0,
                quantityKg: data.quantityKg || data.quantity || 0,
                contact: data.contact || "",
                description: data.description || "",
                createdAt: data.createdAt?.toDate?.() || new Date(),
                lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
              };
            });

          console.log("Firebase Data Count:", firebaseData.length);
          console.log("Firebase Data IDs:", firebaseData.map(i => i.id));

          // Always show first 4 hardcoded items + Firebase data
          const hardcodedItems = defaultProduce.slice(0, 4);
          const combined = [...hardcodedItems, ...firebaseData];
          
          // Remove duplicates by ID (Firebase data takes precedence)
          const uniqueById = Array.from(
            new Map(combined.map((item) => [item.id, item])).values()
          );
          
          setProduceData(uniqueById);
          setError(null);
        } catch (err) {
          console.error("Error processing Firestore data:", err);
          setError(
            "Failed to load some produce items. Please refresh the page."
          );
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError(
          "Failed to connect to the marketplace. Please check your connection."
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredData =
    filter === "All"
      ? produceData
      : produceData.filter(
          (item) => item.category?.toLowerCase() === filter.toLowerCase()
        );

  console.log("Filtered Data Count:", filteredData.length);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-green-600 font-semibold text-xl">
          Loading marketplace...
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
      {/* 🌿 Banner Carousel */}
      <Carousel
        autoPlay
        infiniteLoop
        interval={2500}
        showThumbs={false}
        showStatus={false}
        swipeable
        emulateTouch
        dynamicHeight={false}
        className="rounded-xl overflow-hidden max-w-6xl mx-auto mt-24 mb-10 shadow-lg"
      >
        {[exploreBanner1, exploreBanner2, exploreBanner3].map((banner, i) => (
          <div key={i}>
            <img
              src={banner}
              alt={`Explore Banner ${i + 1}`}
              className="h-[320px] w-full object-cover"
            />
          </div>
        ))}
      </Carousel>

      {/* 🏷 Title Section */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center mt-10 mb-8 bg-gradient-to-r from-[#2E8B57] via-[#57C84D] to-[#A8E063] text-transparent bg-clip-text"
      >
        Explore Fresh & Organic Produce 🌿
      </motion.h1>

      {/* 🍎 Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {["All", "Fruit", "Vegetable", "Spice", "Pickle", "Jam"].map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setFilter(cat)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-250 shadow-md ${
              filter.toLowerCase() === cat.toLowerCase()
                ? "bg-gradient-to-r from-[#57C84D] to-[#A8E063] text-white shadow-lg scale-105"
                : "bg-white border border-green-400 text-green-700 hover:bg-green-50"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* 🧺 Produce Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-green-50 flex items-center justify-center text-green-400 text-6xl">
                  🥬
                </div>
              )}

              {/* Product Details */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      📍 {item.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold text-lg">
                      ₹{item.pricePerKg || item.price}/kg
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantityKg || item.quantity || 0} kg
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  {item.description || "Fresh and organic produce"}
                </p>

                {/* Contact Section */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={item.contact ? `tel:${item.contact}` : "#"}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      item.contact
                        ? "text-gray-700 hover:text-green-600 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={(e) => !item.contact && e.preventDefault()}
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
                    {item.contact || "—"}
                  </a>
                  <a
                    href={item.contact ? `https://wa.me/91${item.contact}?text=Hi, I'm interested in buying ${item.name} from ${item.location}` : "#"}
                    target={item.contact ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
                      item.contact
                        ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => !item.contact && e.preventDefault()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Contact Farmer
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}