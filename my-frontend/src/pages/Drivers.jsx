import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Truck,
  Weight,
  IndianRupee,
  Phone,
  MessageCircle,
  Star,
  X,
  Share2,
  Sparkles,
  RotateCcw,
  Filter,
  ArrowRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- Mock data (replace with API later) ---
const DRIVERS = [
  {
    id: "DRV101",
    name: "Rakesh Kumar",
    vehicleType: "Mini Truck",
    capacityKg: 1500,
    from: "Guwahati",
    to: "Shillong",
    date: "2025-11-07",
    price: 2800,
    rating: 4.7,
    phone: "+91 91234 32345",
    notes: "Experienced in farm produce; tarpaulin available.",
  },
  {
    id: "DRV102",
    name: "Anita Das",
    vehicleType: "Pickup",
    capacityKg: 800,
    from: "Tezpur",
    to: "Guwahati",
    date: "2025-11-07",
    price: 1600,
    rating: 4.5,
    phone: "+91 89876 99876",
    notes: "Refrigerated crates on request.",
  },
  {
    id: "DRV103",
    name: "Bipul Saikia",
    vehicleType: "Tempo",
    capacityKg: 1200,
    from: "Jorhat",
    to: "Dibrugarh",
    date: "2025-11-08",
    price: 2100,
    rating: 4.3,
    phone: "+91 70112 01122",
    notes: "Night driving ok; loading help possible.",
  },
  {
    id: "DRV104",
    name: "Meera Gogoi",
    vehicleType: "Mini Truck",
    capacityKg: 2000,
    from: "Guwahati",
    to: "Nagaon",
    date: "2025-11-09",
    price: 3200,
    rating: 4.9,
    phone: "+91 98776 77766",
    notes: "GPS live share; blankets & straps included.",
  },
];

// ---------- UI helpers ----------
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
  exit: { opacity: 0, y: -10 },
};

const titleContainerVariants = {
  show: { transition: { staggerChildren: 0.1 } },
};
const titleWordVariants = {
  hidden: { y: "100%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

// This is the LIGHT chip, used in the hero
function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 ring-1 ring-inset ring-black/5 backdrop-blur">
      {Icon && <Icon className="h-3.5 w-3.5" />} {children}
    </span>
  );
}

// NEW: This is the DARK chip, used in the new DriverCard
function DarkChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-white/10">
      {Icon && <Icon className="h-3.5 w-3.5" />} {children}
    </span>
  );
}

function Rating({ value }) {
  const stars = Array.from({ length: 5 });
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rated ${value} out of 5`}
    >
      {stars.map((_, i) => (
        <Star
          key={i}
          className={
            "h-4 w-4 " +
            (i < Math.round(value)
              ? "fill-yellow-400 text-yellow-500"
              : "text-gray-400")
          }
        />
      ))}
      {/* REFINEMENT: text-gray-500 looks good on both light and dark backgrounds */}
      <span className="ml-1 text-xs text-gray-500">{value.toFixed(1)}</span>
    </div>
  );
}

function TopRatedBadge() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
      className="absolute top-0 right-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 p-1.5 shadow-lg"
    >
      <Sparkles className="h-4 w-4 text-white" />
    </motion.div>
  );
}

function SkeletonCard() {
  // REFINEMENT: Dark-themed skeleton
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="h-5 w-40 rounded bg-white/20" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="h-4 rounded bg-white/20" />
        <div className="h-4 rounded bg-white/20" />
        <div className="h-4 rounded bg-white/20" />
        <div className="h-4 rounded bg-white/20" />
      </div>
      <div className="mt-4 h-9 w-40 rounded bg-white/20" />
    </div>
  );
}

// ---------- Booking Modal ----------
function BookingModal({ driver, open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: driver?.from || "",
    drop: driver?.to || "",
    date: driver?.date || "",
    weight: "",
    notes: "",
  });

  useEffect(() => {
    if (driver) {
      setForm((f) => ({
        ...f,
        pickup: driver.from,
        drop: driver.to,
        date: driver.date,
      }));
    }
  }, [driver]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const makeWhatsAppLink = () => {
    const cleanNumber = (driver.phone || "").replace(/\D/g, "");
    const text = encodeURIComponent(
      `Hi ${driver.name}, I'm ${form.name}.\n` +
        `Load details:\n` +
        `• Pickup: ${form.pickup}\n` +
        `• Drop: ${form.drop}\n` +
        `• Date: ${form.date}\n` +
        `• Weight: ${form.weight} kg\n` +
        `Notes: ${form.notes || "-"}\n` +
        `Quoted price on app: ₹${driver.price}\n\n` +
        `Please confirm availability.`
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  const callLink = () => `tel:${(driver.phone || "").replace(/\s/g, "")}`;

  const submit = (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.phone ||
      !form.pickup ||
      !form.drop ||
      !form.date ||
      !form.weight
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    window.open(makeWhatsAppLink(), "_blank");
    navigator.clipboard?.writeText(
      `Customer: ${form.name}, Phone: ${form.phone}\nPickup: ${
        form.pickup
      }\nDrop: ${form.drop}\nDate: ${form.date}\nWeight: ${
        form.weight
      } kg\nNotes: ${form.notes || "-"}`
    );
    toast.success("Opening WhatsApp and copied summary to clipboard ✅");
    onClose();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-600 bg-slate-700/80 px-3 py-2.5 pl-9 text-sm text-white placeholder-gray-400 focus:bg-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const iconClass =
    "pointer-events-none absolute left-2.5 top-3 h-4 w-4 text-emerald-400 group-focus-within:text-emerald-300";

  return (
    <AnimatePresence>
      {open && driver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.9, rotate: -1 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ y: 24, opacity: 0, scale: 0.9, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-slate-800 shadow-2xl ring-1 ring-white/10 backdrop-blur-md"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Modal header with gradient bar */}
            <div className="relative overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500" />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 h-1.5 w-full bg-white/30"
              />
              <div className="flex items-start justify-between p-5">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <Sparkles className="h-5 w-5 text-green-400" /> Book Driver
                  </h2>
                  <p className="text-sm text-gray-400">
                    {driver.name} • {driver.vehicleType} • {driver.capacityKg}{" "}
                    kg • ₹{driver.price}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 p-5 pt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative group">
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your name *"
                    className={inputClass}
                  />
                  <Sparkles className={iconClass} />
                </div>
                <div className="relative group">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Your phone *"
                    className={inputClass}
                  />
                  <Phone className={iconClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative group">
                  <input
                    name="pickup"
                    value={form.pickup}
                    onChange={onChange}
                    placeholder="Pickup location *"
                    className={inputClass}
                  />
                  <MapPin className={iconClass} />
                </div>
                <div className="relative group">
                  <input
                    name="drop"
                    value={form.drop}
                    onChange={onChange}
                    placeholder="Drop location *"
                    className={inputClass}
                  />
                  <MapPin className={`${iconClass} text-emerald-400`} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative group">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={onChange}
                    className={inputClass}
                  />
                  <Calendar className={iconClass} />
                </div>
                <div className="relative group">
                  <input
                    type="number"
                    name="weight"
                    value={form.weight}
                    onChange={onChange}
                    placeholder="Weight (kg) *"
                    className={inputClass}
                  />
                  <Weight className={iconClass} />
                </div>
                <a
                  href={callLink()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
                >
                  <Phone className="h-4 w-4" /> Call Driver
                </a>
              </div>

              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder="Notes for the driver (optional)"
                rows={3}
                className={`${inputClass} pl-3`}
              />

              <div className="mt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-gray-400 transition hover:bg-gray-700"
                >
                  Cancel
                </button>
                <motion.button
                  animate={{
                    scale: [1, 1.03, 1],
                    boxShadow: [
                      "0 0 0 0px rgba(22, 163, 74, 0)",
                      "0 0 0 5px rgba(22, 163, 74, 0.5)",
                      "0 0 0 0px rgba(22, 163, 74, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-500/20 ring-1 ring-black/5 transition hover:brightness-105 active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" /> Send on WhatsApp
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Driver Card ----------
// REFINEMENT: Re-styled card to a DARK THEME
function DriverCard({ d, onContact }) {
  return (
    <motion.div
      variants={cardVariants}
      layout="position"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      // REFINEMENT: Dark, glassy background
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800/70 to-slate-900/50 backdrop-blur-md shadow-lg"
    >
      {/* corner glow */}
      <div className="pointer-events-none absolute -inset-x-4 -top-10 h-24 bg-gradient-to-b from-green-400/20 to-transparent opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />

      {/* Shine on hover */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-0 group-hover:opacity-10"
        style={{
          background:
            "linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
        }}
        initial={{ x: "-150%" }}
        whileHover={{ x: "150%" }}
        transition={{ duration: 0.7, ease: "linear" }}
      />

      {d.rating >= 4.7 && <TopRatedBadge />}

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            {/* REFINEMENT: Name is text-white as requested */}
            <h3 className="text-lg font-bold tracking-tight text-white">
              {d.name}
            </h3>
            <Rating value={d.rating} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-emerald-400">
              <span className="text-sm font-medium text-emerald-200">₹</span>
              {d.price}
            </span>
            <span className="text-xs text-gray-400">Total Price</span>
          </div>
        </div>

        <div className="mt-4">
          {/* REFINEMENT: Light text for dark background */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-green-400" /> From:{" "}
              <span className="font-medium text-white">{d.from}</span>
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-400" /> To:{" "}
              <span className="font-medium text-white">{d.to}</span>
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {/* REFINEMENT: Use the new DarkChip component */}
          <DarkChip icon={Truck}>{d.vehicleType}</DarkChip>
          <DarkChip icon={Weight}>{d.capacityKg} kg</DarkChip>
          <DarkChip icon={Calendar}>{d.date}</DarkChip>
        </div>

        <p className="mt-3 text-sm text-gray-400 line-clamp-2">
          {d.notes || "No additional notes from driver."}
        </p>
      </div>

      {/* Action area with separator */}
      <div className="mt-2 border-t border-white/10 bg-white/5 px-5 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onContact(d)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-500/20 ring-1 ring-black/5 transition-all duration-300 ease-in-out hover:brightness-105 group-hover:shadow-xl group-hover:brightness-110 active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" /> Contact / Book
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-50"
            onClick={() => {
              navigator.share?.({
                title: "Driver",
                text: `Driver ${d.name} (${d.vehicleType})`,
              }) || toast.success("Share sheet opened / ready ✨");
            }}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Page ----------
export default function Drivers() {
  const [qFrom, setQFrom] = useState("");
  const [qTo, setQTo] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [date, setDate] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState("price");

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // UX: simulated loading for skeletons whenever filters change
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 500); // simulate 500ms fetch
    return () => clearTimeout(id);
  }, [qFrom, qTo, vehicle, date, maxPrice, sortBy]);

  const results = useMemo(() => {
    let rows = [...DRIVERS];
    if (qFrom.trim())
      rows = rows.filter((r) =>
        r.from.toLowerCase().includes(qFrom.trim().toLowerCase())
      );
    if (qTo.trim())
      rows = rows.filter((r) =>
        r.to.toLowerCase().includes(qTo.trim().toLowerCase())
      );
    if (vehicle) rows = rows.filter((r) => r.vehicleType === vehicle);
    if (date) rows = rows.filter((r) => r.date === date);
    if (maxPrice > 0) rows = rows.filter((r) => r.price <= maxPrice);
    if (sortBy === "price") rows.sort((a, b) => a.price - b.price);
    if (sortBy === "rating") rows.sort((a, b) => b.rating - a.rating);
    if (sortBy === "capacity") rows.sort((a, b) => b.capacityKg - a.capacityKg);
    return rows;
  }, [qFrom, qTo, vehicle, date, maxPrice, sortBy]);

  // simple pagination (Load More)
  const PAGE = 4;
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [qFrom, qTo, vehicle, date, maxPrice, sortBy]);
  const visible = results.slice(0, PAGE * page);
  const canLoadMore = visible.length < results.length;

  const openBooking = (d) => {
    setSelectedDriver(d);
    setModalOpen(true);
  };
  const closeBooking = () => {
    setModalOpen(false);
    setSelectedDriver(null);
  };

  const handleContact = (drv) => {
    navigator.clipboard?.writeText(drv.phone);
    toast.success("Driver phone copied");
    setTimeout(() => setSelectedDriver(drv), 50);
    setTimeout(() => setModalOpen(true), 100);
  };

  const clearFilters = () => {
    setQFrom("");
    setQTo("");
    setVehicle("");
    setDate("");
    setMaxPrice(0);
    setSortBy("price");
    toast.success("Filters reset");
  };

  const inputClass =
    "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 pl-9 text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400";
  const selectClass =
    "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(120deg,#0f172a_0%,#052e1a_35%,#052e1a_65%,#0f1a_100%)] text-white">
      {/* Ambient radial blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{
            x: [0, -40, 10, 0],
            y: [0, 50, -10, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            yoyo: true,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-green-600/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            yoyo: true,
            ease: "easeInOut",
            delay: -5,
          }}
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
        />
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          dark: {
            className: "!bg-gray-900 !text-white !shadow-lg",
          },
          light: {
            className: "!bg-white !text-gray-900 !shadow-lg",
          },
          className: "!bg-gray-900 !text-white !shadow-lg",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-32 md:pb-16">
        {/* Hero header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={titleContainerVariants}
          className="rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-lime-500 p-[2px] shadow-2xl"
        >
          <div className="rounded-[calc(1.5rem-2px)] bg-gradient-to-b from-green-800/80 to-emerald-900/80 backdrop-blur-sm px-6 py-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="bg-gradient-to-br from-white via-emerald-100 to-emerald-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow sm:text-4xl">
                  <span className="inline-block overflow-hidden">
                    <motion.span
                      variants={titleWordVariants}
                      className="inline-block"
                    >
                      Find
                    </motion.span>
                  </span>{" "}
                  <span className="inline-block overflow-hidden">
                    <motion.span
                      variants={titleWordVariants}
                      className="inline-block"
                    >
                      Drivers
                    </motion.span>
                  </span>
                </h1>
                <p className="mt-1 text-emerald-100">
                  Search verified drivers by route, date, vehicle type, capacity
                  and price.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-50">
                <Chip icon={Truck}>Farm Logistics</Chip>
                <Chip icon={SlidersHorizontal}>Smart Filters</Chip>
                <Chip icon={Sparkles}>Fast Booking</Chip>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.form
          layout
          className="sticky top-4 z-10 mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-md md:grid-cols-12"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative md:col-span-3">
            <input
              className={inputClass}
              placeholder="From (e.g., Guwahati)"
              value={qFrom}
              onChange={(e) => setQFrom(e.target.value)}
            />
            <MapPin className="pointer-events-none absolute left-2.5 top-3 h-4 w-4 text-emerald-300" />
          </div>
          <div className="relative md:col-span-3">
            <input
              className={inputClass}
              placeholder="To (e.g., Shillong)"
              value={qTo}
              onChange={(e) => setQTo(e.target.value)}
            />
            <MapPin className="pointer-events-none absolute left-2.5 top-3 h-4 w-4 text-emerald-300" />
          </div>
          <div className="md:col-span-2">
            <select
              className={selectClass}
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            >
              <option className="bg-slate-900" value="">
                All Vehicles
              </option>
              <option className="bg-slate-900">Pickup</option>
              <option className="bg-slate-900">Tempo</option>
              <option className="bg-slate-900">Mini Truck</option>
            </select>
          </div>
          <div className="relative md:col-span-2">
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Calendar className="pointer-events-none absolute left-2.5 top-3 h-4 w-4 text-emerald-300" />
          </div>
          <div className="md:col-span-2 flex items-center gap-2">
            <label className="w-24 text-sm text-emerald-100">Max Price</label>
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 cursor-pointer accent-emerald-400"
            />
            <span className="w-20 text-sm font-semibold text-emerald-100">
              ₹{maxPrice || "Any"}
            </span>
          </div>
          <div className="md:col-span-2 flex items-center gap-2">
            <label className="w-20 text-sm text-emerald-100">Sort</label>
            <select
              className={selectClass}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option className="bg-slate-900" value="price">
                Lowest Price
              </option>
              <option className="bg-slate-900" value="rating">
                Highest Rating
              </option>
              <option className="bg-slate-900" value="capacity">
                Largest Capacity
              </option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent bg-transparent px-4 py-2 text-sm text-emerald-200 shadow-sm transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <motion.button
              animate={{ scale: [1, 1.03, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-emerald-300 transition hover:brightness-110 active:scale-[0.98]"
            >
              <Search className="h-4 w-4" /> Search
            </motion.button>
          </div>
        </motion.form>

        {/* Results */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {loading ? (
            [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence>
              {visible.length === 0 ? (
                <motion.div
                  key="no-results"
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-emerald-100"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-300/20">
                    <Search className="h-6 w-6 text-emerald-200" />
                  </div>
                  No drivers match your filters. Try adjusting your search.
                </motion.div>
              ) : (
                visible.map((d) => (
                  <DriverCard key={d.id} d={d} onContact={handleContact} />
                ))
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Load more */}
        {!loading && canLoadMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-emerald-50 shadow-sm transition hover:bg-white/15 active:scale-95"
            >
              <Filter className="h-4 w-4" /> Load more results
            </button>
          </div>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-3 z-40 mx-auto w-[95%] rounded-2xl bg-white/10 p-2 shadow-lg ring-1 ring-white/10 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <button
            onClick={() => toast("Sorted by " + sortBy, { icon: "SORT" })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white"
          >
            <Sparkles className="h-4 w-4" /> Sort
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        driver={selectedDriver}
        open={modalOpen}
        onClose={closeBooking}
      />
    </div>
  );
}
