import React from "react";

export default function TruckRoutes() {
  const drivers = [
    {
      id: 1,
      name: "Ramesh Sharma",
      from: "Itanagar, Arunachal Pradesh",
      to: "Guwahati, Assam",
      date: "6 Nov 2025",
      contact: "9876543210",
    },
    {
      id: 2,
      name: "David Marak",
      from: "Shillong, Meghalaya",
      to: "Kolkata, West Bengal",
      date: "8 Nov 2025",
      contact: "9876123456",
    },
    {
      id: 3,
      name: "Pema Bhutia",
      from: "Gangtok, Sikkim",
      to: "Siliguri, West Bengal",
      date: "7 Nov 2025",
      contact: "9812345678",
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        🚚 Available Truck Routes
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Connect with truck drivers traveling your route to share transportation
        and reduce costs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white border border-green-200 rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              {driver.name}
            </h2>
            <p className="text-gray-600 mb-1">
              <strong>From:</strong> {driver.from}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>To:</strong> {driver.to}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Date:</strong> {driver.date}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Contact:</strong> {driver.contact}
            </p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              Connect Driver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}