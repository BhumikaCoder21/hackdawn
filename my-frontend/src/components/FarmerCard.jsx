import React from "react";

export default function FarmerCard({ name, produce, quantity, location }) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-700">Produce: {produce}</p>
      <p className="text-sm text-gray-700">Quantity: {quantity} kg</p>
      <p className="text-sm text-gray-500">Location: {location}</p>
    </div>
  );
}
