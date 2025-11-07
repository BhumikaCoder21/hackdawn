// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ChatbaseWidget from "./components/ChatbaseWidget";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import PostProduce from "./pages/PostProduce";
import TruckRoutes from "./pages/TruckRoutes";
import Learn from "./pages/Learn";
import Drivers from "./pages/Drivers";
import Login from "./pages/Login"; // ✅ new login page

import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ context
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ guards pages

// 🌿 Internal content for handling login state
function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <>
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
        <Routes>
          {/* if not logged in, only show login */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

// 🌾 Final Exported App
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        {/* Chatbase Widget globally */}
        <ChatbaseWidget />
      </Router>
    </AuthProvider>
  );
}
