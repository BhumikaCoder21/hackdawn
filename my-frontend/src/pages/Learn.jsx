import React, { useState } from "react";

export default function Learn() {
  const categories = ["All", "Crop Care", "Pickle & Jam", "Organic Farming"];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const videos = [
    {
      id: 1,
      title: "Tomato Disease Management",
      category: "Crop Care",
      url: "https://www.youtube.com/embed/1I1A7n8R_M4",
      thumbnail: "https://img.youtube.com/vi/1I1A7n8R_M4/hqdefault.jpg",
    },
    {
      id: 2,
      title: "Making Mango Pickle",
      category: "Pickle & Jam",
      url: "https://www.youtube.com/embed/K3mIhR1hT2c",
      thumbnail: "https://img.youtube.com/vi/K3mIhR1hT2c/hqdefault.jpg",
    },
    {
      id: 3,
      title: "Organic Fertilizer Preparation",
      category: "Organic Farming",
      url: "https://www.youtube.com/embed/A4gL9pB7nQM",
      thumbnail: "https://img.youtube.com/vi/A4gL9pB7nQM/hqdefault.jpg",
    },
    {
      id: 4,
      title: "Jalapeno Jam Making",
      category: "Pickle & Jam",
      url: "https://www.youtube.com/embed/Q9Yd7cM0dNQ",
      thumbnail: "https://img.youtube.com/vi/Q9Yd7cM0dNQ/hqdefault.jpg",
    },
  ];

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        Learn & Grow 📺
      </h1>

      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border font-medium transition ${
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "bg-white text-green-700 border-green-400 hover:bg-green-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <iframe
              className="w-full h-48"
              src={video.url}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-green-700">
                {video.title}
              </h3>
              <p className="text-gray-600">{video.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}