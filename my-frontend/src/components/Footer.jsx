import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-10">
      <p>
        © {new Date().getFullYear()} NE-FarmConnect | Empowering Northeast
        Farmers
      </p>
    </footer>
  );
}
