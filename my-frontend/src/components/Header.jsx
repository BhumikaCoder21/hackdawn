import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const auth = getAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleProtectedClick = (path) => {
    if (!user) navigate("/login");
    else navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#2E8B57] via-[#57C84D] to-[#A8E063] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1
          className="text-3xl font-extrabold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Agri<span className="text-yellow-300">Hills</span>
        </h1>

        {/* Hamburger */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 items-center font-[Poppins]">
          <Link to="/">Home</Link>

          <Link to="/marketplace">Marketplace</Link>

          <button onClick={() => handleProtectedClick("/post")}>
            Post Produce
          </button>

          <button onClick={() => handleProtectedClick("/postride")}>
            Post Ride
          </button>

          <button onClick={() => handleProtectedClick("/trucks")}>
            Truck Routes
          </button>

          <Link to="/learn">Learn</Link>

          <Link to="/crop-check">Crop Check 🌿</Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="bg-white text-green-700 px-4 py-2 rounded-full"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-600 flex flex-col items-center gap-4 py-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/marketplace" onClick={() => setMenuOpen(false)}>
            Marketplace
          </Link>

          <button onClick={() => handleProtectedClick("/post")}>
            Post Produce
          </button>

          <button onClick={() => handleProtectedClick("/postride")}>
            Post Ride
          </button>

          <button onClick={() => handleProtectedClick("/trucks")}>
            Truck Routes
          </button>

          <Link to="/learn" onClick={() => setMenuOpen(false)}>
            Learn
          </Link>

          <Link to="/crop-check" onClick={() => setMenuOpen(false)}>
            Crop Check 🌿
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="bg-white text-green-700 px-4 py-2 rounded-full"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
