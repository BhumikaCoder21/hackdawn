import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#2E8B57] via-[#57C84D] to-[#A8E063] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* 🌾 Brand Logo */}
        <h1 className="text-3xl font-[Playfair_Display] font-extrabold">
          Agri<span className="text-yellow-300">Hills</span>
        </h1>

        {/* 🌿 Navigation */}
        <nav className="flex flex-wrap gap-8 items-center font-[Poppins]">
          {[
            { to: "/", label: "Home" },
            { to: "/marketplace", label: "Marketplace" },
            { to: "/post", label: "Post Produce" },
            { to: "/trucks", label: "Truck Routes" },
            { to: "/learn", label: "Learn" },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="relative group text-base font-medium tracking-wide"
            >
              <span className="transition-colors duration-300 group-hover:text-yellow-300">
                {item.label}
              </span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}

          {/* 🌼 CTA Button */}
          <Link
            to="/join"
            className="bg-yellow-400 text-gray-900 font-[Poppins] font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}