import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PostRide() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    location: "",
    contact: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.contact.trim())
      newErrors.contact = "Contact number is required";
    if (formData.contact.trim() && !/^\d{10}$/.test(formData.contact.trim())) {
      newErrors.contact = "Please enter a valid 10-digit contact number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage("❌ Please fix the errors in the form");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const rideData = {
        ...formData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        status: "active",
        type: "ride",
      };
      await addDoc(collection(db, "produce"), rideData);
      setMessage("✅ Ride posted successfully!");
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        location: "",
        contact: "",
        description: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding ride:", error);
      let errMsg = "❌ Failed to post ride. Please try again.";
      if (error.code === "permission-denied") {
        errMsg =
          "❌ You don't have permission to post rides. Please sign in again.";
      } else if (error.code === "unavailable") {
        errMsg = "❌ Service temporarily unavailable. Try again later.";
      }
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-24 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        🚚 Post Your Ride
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Select Category</option>
            <option value="Fruit">Mini Truck</option>
            <option value="Vegetable">Pickup Trucks</option>
            <option value="Pickle">Tractor</option>
            <option value="Jam">Delivery Vans</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>
        {/* Input Fields */}
        {[
          { name: "price", type: "number", placeholder: "Price per km" },
          {
            name: "quantity",
            type: "number",
            placeholder: "Storage Availability (kg)",
          },
          { name: "name", type: "text", placeholder: "Start Journey Location" },

          {
            name: "location",
            type: "text",
            placeholder: "End Journey Location",
          },
          { name: "contact", type: "text", placeholder: "Contact Number" },
        ].map(({ name, type, placeholder }) => (
          <div key={name}>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        ))}

        <div>
          <textarea
            name="description"
            placeholder="Additional details (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:ring-2 focus:ring-green-400 outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Posting..." : "Post Ride"}
        </button>
      </form>

      {message && (
        <p
          className={`text-center mt-5 font-medium ${
            message.startsWith("✅") ? "text-green-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
