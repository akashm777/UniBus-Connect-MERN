import assets from "../assets";
import { motion } from "motion/react";

const features = [
  {
    title: "Find Your Route Easily",
    description:
      "Search for your bus route by selecting your location and instantly know which bus serves your stop. No confusion, just clear routes at your fingertips.",
    img: "route_img",
    bg: "bg-yellow-100",
  },
  {
    title: "Save Time",
    description:
      "Avoid long waits at the bus stop. Check the exact arrival timings for each stop and reach just when your bus is about to arrive.",
    img: "time_img",
    bg: "bg-green-100",
  },
  {
    title: "Stay Informed",
    description:
      "Always stay connected with the latest route updates uploaded by the university admin. Reliable, up-to-date information every time.",
    img: "info_img",
    bg: "bg-blue-100",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-6 md:px-20 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800">
          Why Choose <span className="text-yellow-500">UniBus Connect</span>?
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-4 text-gray-600">
          UniBus Connect is your simple solution to know bus routes, arrival
          times, and stay updated with the latest university bus schedules.
        </motion.p>

      </div>

      {/* Features Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: idx * 0.2, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300 flex flex-col items-center text-center"
          >
            <div className={`mb-4 p-4 rounded-full ${feature.bg} flex items-center justify-center`}>
              <img
                src={assets[feature.img]}
                alt={feature.title}
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
