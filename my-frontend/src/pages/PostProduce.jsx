import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PostProduce() {
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
  const [retryCount, setRetryCount] = useState(0);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.quantity || Number(formData.quantity) <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.contact.trim())
      newErrors.contact = "Contact number is required";
    if (formData.contact.trim() && !/^\d{10}$/.test(formData.contact.trim())) {
      newErrors.contact = "Please enter a valid 10-digit contact number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage("❌ Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setMessage("");

    const trySubmit = async (attempt = 0) => {
      try {
        const produceData = {
          ...formData,
          pricePerKg: Number(formData.price),
          quantityKg: Number(formData.quantity),
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          status: "active",
        };

        await addDoc(collection(db, "produce"), produceData);

        setMessage("✅ Produce posted successfully!");
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
        setRetryCount(0);
      } catch (error) {
        console.error(`Error adding produce (attempt ${attempt + 1}):`, error);

        if (attempt < 2) {
          setRetryCount(attempt + 1);
          setMessage(`Retrying... (attempt ${attempt + 2}/3)`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return trySubmit(attempt + 1);
        }

        let errMsg = "❌ Failed to post produce. Please try again.";
        if (error.code === "permission-denied")
          errMsg =
            "❌ You don’t have permission to post produce. Please sign in again.";
        else if (error.code === "unavailable")
          errMsg = "❌ Service temporarily unavailable. Try again later.";

        setMessage(errMsg);
      }
    };

    try {
      await trySubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-24 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        🌾 Post Your Produce
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Fields */}
        {[
          { name: "name", type: "text", placeholder: "Product Name" },
          { name: "price", type: "number", placeholder: "Price per kg" },
          { name: "quantity", type: "number", placeholder: "Quantity (kg)" },
          { name: "location", type: "text", placeholder: "Location" },
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

        {/* Category */}
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
            <option value="Fruit">Fruit</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Pickle">Pickle</option>
            <option value="Jam">Jam</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            placeholder="Product Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:ring-2 focus:ring-green-400 outline-none transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Posting..." : "Post Produce"}
        </button>
      </form>

      {/* Message Display */}
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
