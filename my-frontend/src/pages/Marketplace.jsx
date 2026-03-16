// src/pages/Marketplace.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

import exploreBanner1 from "../assets/exploreBanner1.jpg";
import exploreBanner2 from "../assets/exploreBanner2.jpg";
import exploreBanner3 from "../assets/exploreBanner3.jpg";

import tomatoes from "../assets/tomatoes.jpg";
import oranges from "../assets/oranges.jpg";
import chilli from "../assets/chilli.jpg";
import ginger from "../assets/ginger.jpg";

export default function Marketplace() {
  const [filter, setFilter] = useState("All");
  const [produceData, setProduceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        createdAt: new Date(),
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
        createdAt: new Date(),
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
        createdAt: new Date(),
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
        createdAt: new Date(),
      },
    ];

    setProduceData(defaultProduce); // show local items immediately

    const unsubscribe = onSnapshot(
      collection(db, "produce"),
      (snapshot) => {
        const firebaseData = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            ...data,
            name: data.name || "Unknown Produce",
            location: data.location || "Unknown Location",
            category: data.category || "Other",
            pricePerKg: data.pricePerKg || data.price || 0,
            quantityKg: data.quantityKg || data.quantity || 0,
            contact: data.contact || "",
            description: data.description || "Fresh farm produce",
            createdAt: data.createdAt?.toDate?.() || new Date(),
          };
        });

        const combined = [...firebaseData, ...defaultProduce];

        const uniqueItems = Array.from(
          new Map(combined.map((item) => [item.id, item])).values(),
        );

        uniqueItems.sort((a, b) => b.createdAt - a.createdAt);

        setProduceData(uniqueItems);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredData =
    filter === "All"
      ? produceData
      : produceData.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase() === filter.toLowerCase(),
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-[#f6fff5] pb-10">
      <Carousel
        autoPlay
        infiniteLoop
        interval={2500}
        showThumbs={false}
        showStatus={false}
        className="rounded-xl overflow-hidden max-w-6xl mx-auto mt-24 mb-10 shadow-lg"
      >
        {[exploreBanner1, exploreBanner2, exploreBanner3].map((banner, i) => (
          <div key={i}>
            <img
              src={banner}
              alt="banner"
              className="h-[320px] w-full object-cover"
            />
          </div>
        ))}
      </Carousel>

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-center mt-10 mb-8 bg-gradient-to-r from-[#2E8B57] via-[#57C84D] to-[#A8E063] text-transparent bg-clip-text"
      >
        Explore Fresh & Organic Produce 🌿
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {["All", "Fruit", "Vegetable", "Spice", "Pickle", "Jam"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-xl font-semibold shadow ${
              filter === cat
                ? "bg-green-600 text-white"
                : "bg-white border border-green-400 text-green-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {filteredData.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            No products available in this category.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 flex items-center justify-center bg-green-50 text-6xl">
                  🥬
                </div>
              )}

              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-500 text-sm">📍 {item.location}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-green-600 font-bold text-lg">
                      ₹{item.pricePerKg}/kg
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantityKg} kg
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4">{item.description}</p>

                <div className="pt-4 border-t flex justify-between items-center">
                  <a
                    href={item.contact ? `tel:${item.contact}` : "#"}
                    className="text-gray-700 text-sm"
                  >
                    📞 {item.contact || "—"}
                  </a>

                  <a
                    href={
                      item.contact
                        ? `https://wa.me/91${item.contact}?text=${encodeURIComponent(
                            `Hi, I'm interested in buying ${item.name} from ${item.location}`,
                          )}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
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
