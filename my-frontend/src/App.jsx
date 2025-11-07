// src/App.jsx
// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ChatbaseWidget from "./components/ChatbaseWidget";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import PostProduce from "./pages/PostProduce";
import PostRide from "./pages/PostRide";
import TruckRoutes from "./pages/TruckRoutes";
import Learn from "./pages/Learn";
import Drivers from "./pages/Drivers";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ Firebase Auth Context
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Protects Routes

// 🌿 Handles authentication and route access logic
function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <>
          {/* ✅ Navbar and Footer visible when logged in */}
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
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
              <Route
                path="/learn"
                element={
                  <ProtectedRoute>
                    <Learn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/drivers"
                element={
                  <ProtectedRoute>
                    <Drivers />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </>
      ) : (
        // 🌼 Routes accessible only when logged out
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

// 🌾 Final Exported App Component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        {/* 💬 Chatbase Widget is globally active */}
        <ChatbaseWidget />
      </Router>
    </AuthProvider>
  );
}
