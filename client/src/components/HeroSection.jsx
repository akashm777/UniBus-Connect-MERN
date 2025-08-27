import assets from "../assets";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-50 py-16 text-center rounded-lg shadow mb-10 overflow-hidden">
      {/* Left decorative bus (hidden on small screens) */}
      <motion.img
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        src={assets.bus_left}
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 max-h-72 object-contain opacity-80 select-none pointer-events-none"
      />

      {/* Right decorative bus (hidden on small screens) */}
      <motion.img
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        src={assets.bus_right}
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 max-h-72 object-contain opacity-80 select-none pointer-events-none"
      />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <h1 className="relative z-10 text-3xl md:text-4xl font-extrabold text-gray-900 mb-5">
          Welcome to <span className="text-yellow-500">UniBus Connect</span>
        </h1>
        <p className="relative z-10 text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          Your one-stop solution to find <span className="font-semibold">real-time university bus routes</span>.  
          Select your location, check live timings, and travel smarter without waiting endlessly at the bus stop.
        </p>
      </motion.div>
    </section>
  );
}
