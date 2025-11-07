// src/App.jsx
// src/App.jsx
// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🌿 Components
import ChatbaseWidget from "./components/ChatbaseWidget";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// 🌾 Pages
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import PostProduce from "./pages/PostProduce";
import PostRide from "./pages/PostRide";
import TruckRoutes from "./pages/TruckRoutes";
import Learn from "./pages/Learn";
import CropCheck from "./pages/CropCheck";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// 🌱 Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// 🌼 Fallback 404 Page
function NotFound() {
  return (
    <div className="max-w-2xl mx-auto p-10 text-center">
      <h1 className="text-5xl font-bold text-green-700">404</h1>
      <p className="text-gray-600 mt-3 text-lg">Oops! Page not found.</p>
      <a
        href="/"
        className="mt-5 inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
      >
        Go Home
      </a>
    </div>
  );
}

// 🌾 Route Controller
function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/crop-check" element={<CropCheck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Pages (require login) */}
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <PostProduce />
              </ProtectedRoute>
            }
          />
          <Route
            path="/postride"
            element={
              <ProtectedRoute>
                <PostRide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trucks"
            element={
              <ProtectedRoute>
                <TruckRoutes />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

// 🌿 Root App Component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ChatbaseWidget />
      </Router>
    </AuthProvider>
  );
}
