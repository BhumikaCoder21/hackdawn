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

export default function App() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/post" element={<PostProduce />} />
          <Route path="/trucks" element={<TruckRoutes />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/drivers" element={<Drivers />} />
        </Routes>
      </main>
      <Footer />

      {/* Chatbase loads globally on every page */}
      <ChatbaseWidget />
    </Router>
  );
}