import React from "react";
import { Truck, MapPin, Calendar, Phone, ArrowRight } from "lucide-react";

export default function TruckRoutes() {
  const drivers = [
    {
      id: 1,
      name: "Jainesh Birla",
      from: "Itanagar, Arunachal Pradesh",
      to: "Guwahati, Assam",
      date: "6 Nov 2025",
      contact: "8643007681",
    },
    {
      id: 2,
      name: "Disha Shaw",
      from: "Itanagar, Arunachal Pradesh",
      to: "Kolkata, West Bengal",
      date: "8 Nov 2025",
      contact: "7980567945",
    },
    {
      id: 3,
      name: "Arjun",
      from: "Itanagar, Arunachal Pradesh",
      to: "Kolkata, West Bengal",
      date: "8 Nov 2025",
      contact: "7668699759",
    },
    {
      id: 4,
      name: "Bhumika",
      from: "Itanagar, Arunachal Pradesh",
      to: "Siliguri, West Bengal",
      date: "7 Nov 2025",
      contact: "7268932935",
    },
    {
      id: 5,
      name: "Rohit",
      from: "Patna ,Bihar",
      to: "Assam",
      date: "7 Nov 2025",
      contact: "8638586791",
    },
  ];

  const handleCall = (contactNumber) => {
    window.location.href = `tel:${contactNumber}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 p-8">
      {/* Floating Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 h-48 w-48 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute top-1/2 right-10 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-teal-100/40 blur-3xl" />
      </div>

      {/* Page Header - Positioned below Navbar */}
      <div className="relative mx-auto max-w-6xl mt-24 text-center">
        <h1 className="text-5xl font-extrabold text-green-800 mb-3">
          🚛 Available Truck Routes
        </h1>
        <p className="text-gray-700 text-lg mb-12">
          Discover verified drivers and connect instantly for cost-efficient
          logistics solutions.
        </p>
      </div>

      {/* Driver Cards Grid */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="relative bg-white/80 border border-green-100 rounded-3xl backdrop-blur-xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-500 rounded-t-3xl"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Truck className="text-green-700 w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold text-green-800">
                  {driver.name}
                </h2>
              </div>
              <span className="text-xs font-semibold text-white bg-green-600 px-3 py-1 rounded-full shadow">
                ID-{driver.id.toString().padStart(3, "0")}
              </span>
            </div>

            {/* Route Info */}
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <MapPin className="text-green-500 w-5 h-5" />
                <span>
                  <strong>From:</strong> {driver.from}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="text-green-500 w-5 h-5 rotate-180" />
                <span>
                  <strong>To:</strong> {driver.to}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="text-green-500 w-5 h-5" />
                <span>
                  <strong>Date:</strong> {driver.date}
                </span>
              </p>
            </div>

            {/* Connect Button */}
            <button
              onClick={() => handleCall(driver.contact)}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-2xl shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              Connect Driver
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-center text-gray-600 mt-12 text-sm">
        Tap “Connect Driver” to call directly. Contact numbers remain hidden for privacy.
      </p>
    </div>
  );
}
