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
      },
      {
        id: "local2",
        name: "Fresh Oranges",
        pricePerKg: 40,
        quantityKg: 30,
        location: "Tinsukia, Assam",
        category: "Fruit",
        imageUrl: oranges,
      },
      {
        id: "local3",
        name: "King Chilli (Bhoot Jolokia)",
        pricePerKg: 150,
        quantityKg: 10,
        location: "Imphal, Manipur",
        category: "Spice",
        imageUrl: chilli,
      },
      {
        id: "local4",
        name: "Ginger Roots",
        pricePerKg: 50,
        quantityKg: 20,
        location: "Aizawl, Mizoram",
        category: "Spice",
        imageUrl: ginger,
      },
      {
        id: "local5",
        name: "Homemade Jam",
        pricePerKg: 120,
        quantityKg: 15,
        location: "Shillong, Meghalaya",
        category: "Fruit",
        imageUrl: jam,
      },
      {
        id: "local6",
        name: "Organic Pickle",
        pricePerKg: 90,
        quantityKg: 12,
        location: "Guwahati, Assam",
        category: "Spice",
        imageUrl: pickle,
      },
      {
        id: "local7",
        name: "Fresh Juice",
        pricePerKg: 60,
        quantityKg: 25,
        location: "Agartala, Tripura",
        category: "Fruit",
        imageUrl: juice,
      },
      {
        id: "local8",
        name: "Kiwi Fruit",
        pricePerKg: 80,
        quantityKg: 18,
        location: "Kohima, Nagaland",
        category: "Fruit",
        imageUrl: kiwi,
      },
    ];

    const q = query(collection(db, "produce"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const firebaseData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Ensure consistent price field naming
              pricePerKg: data.pricePerKg || data.price || 0,
              // Ensure consistent quantity field naming
              quantityKg: data.quantityKg || data.quantity || 0,
              // Format dates
              createdAt: data.createdAt?.toDate?.() || new Date(),
              lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
            };
          });
          setProduceData([...defaultProduce, ...firebaseData]);
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
          <p className="text-red-600 text-lg mb-4">⚠ {error}</p>
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

      {/* 🧺 Produce Carousel (Cards Section) */}
      <div className="max-w-6xl mx-auto">
        <Carousel
          autoPlay
          infiniteLoop
          interval={2500}
          showThumbs={false}
          showStatus={false}
          swipeable
          emulateTouch
          centerMode
          centerSlidePercentage={33.33}
          className="rounded-lg overflow-hidden"
        >
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group mx-2"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-72 bg-green-50 flex items-center justify-center text-green-400 text-6xl">
                  🥬
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-5">
                <h2 className="text-2xl font-semibold text-white">
                  {item.name}
                </h2>
                <p className="text-gray-200 text-sm">📍 {item.location}</p>
                <p className="text-green-200 font-bold mt-1 text-lg">
                  ₹{item.pricePerKg || item.price}/kg
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 w-full py-2 rounded-md bg-gradient-to-r from-[#57C84D] to-[#A8E063] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Connect Farmer
                </motion.button>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
