import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Images
import bannerfinal from "../assets/bannerfinal.jpg";
import farmers from "../assets/farmers.jpg";
import drivers from "../assets/drivers.jpg";
import makers from "../assets/makers.jpg";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      {/* 🌄 Hero Section */}
      <section
        className="relative flex flex-col justify-center items-center text-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerfinal})` }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 px-6 max-w-3xl flex flex-col items-center justify-center gap-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-snug md:leading-normal text-white drop-shadow-xl font-[Playfair_Display] text-center">
            Empowering Farmers, <br /> Connecting Communities
          </h1>
          <p className="text-lg md:text-xl text-gray-100 leading-relaxed italic text-center drop-shadow-lg">
            Reducing post-harvest loss and connecting farmers with buyers for a
            sustainable agri-ecosystem.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/marketplace"
                className="uppercase tracking-wide bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                Explore Marketplace
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/drivers"
                className="uppercase tracking-wide bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                Find Drivers
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/learn"
                className="uppercase tracking-wide bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                Learn & Grow
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 🌾 Farmers / Drivers / Makers Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Farmers",
              text: "Discover buyers, reduce waste, and get fair prices for your crops.",
              image: farmers,
              link: "/marketplace",
              buttonText: "Explore Marketplace",
            },
            {
              title: "Drivers",
              text: "Share your routes and earn more by connecting with farmers efficiently.",
              image: drivers,
              link: "/drivers",
              buttonText: "Find Drivers",
            },
            {
              title: "Makers",
              text: "Source fresh or imperfect produce directly from farms to create jams, pickles, and more.",
              image: makers,
              link: "/learn",
              buttonText: "Learn & Grow",
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className="relative h-80 overflow-hidden group shadow-lg cursor-pointer rounded-xl"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Text & Button */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-xl">
                  {card.title}
                </h3>
                <p className="text-white text-sm md:text-base mb-4 drop-shadow-lg">
                  {card.text}
                </p>
                <Link
                  to={card.link}
                  className="bg-white text-gray-900 px-5 py-2 font-semibold tracking-wide hover:bg-gray-100 transition rounded-md"
                >
                  {card.buttonText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
