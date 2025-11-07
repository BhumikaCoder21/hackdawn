import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const auth = getAuth();
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#2E8B57] via-[#57C84D] to-[#A8E063] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* 🌾 Brand Logo */}
        <h1
          className="text-3xl font-[Playfair_Display] font-extrabold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Agri<span className="text-yellow-300">Hills</span>
        </h1>

        {/* 🌿 Navigation */}
        <nav className="flex flex-wrap gap-8 items-center font-[Poppins]">
          {/* 🏡 Public + Protected Links */}
          <Link
            to="/"
            className="relative group text-base font-medium tracking-wide"
          >
            <span className="transition-colors duration-300 group-hover:text-yellow-300">
              Home
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/marketplace"
            className="relative group text-base font-medium tracking-wide"
          >
            <span className="transition-colors duration-300 group-hover:text-yellow-300">
              Marketplace
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <button
            onClick={() => handleProtectedClick("/post")}
            className="relative group text-base font-medium tracking-wide bg-transparent border-none text-white"
          >
            <span className="transition-colors duration-300 group-hover:text-yellow-300">
              Post Produce
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </button>

          <button
            onClick={() => handleProtectedClick("/postride")}
            className="relative group text-base font-medium tracking-wide bg-transparent border-none text-white"
          >
            <span className="transition-colors duration-300 group-hover:text-yellow-300">
              Post Ride
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </button>

          <button
            onClick={() => handleProtectedClick("/trucks")}
            className="relative group text-base font-medium tracking-wide bg-transparent border-none text-white"
          >
            <span className="transition-colors duration-300 group-hover:text-yellow-300">
              Truck Routes
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </button>

          <Link
            to="/learn"
            className="relative group text-base font-medium tracking-wide"
          >
            <span className="transition-colors duration-300 group-hover:text-yellow-300">
              Learn
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/crop-check"
            className="relative group text-base font-medium tracking-wide"
          >
            <span className="transition-colors duration-300 group-hover:text-yellow-300">
              Crop Check 🌿
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* 🌼 Auth Buttons */}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-gray-900 font-[Poppins] font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-yellow-400 text-gray-900 font-[Poppins] font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-white text-green-700 font-[Poppins] font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-green-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
