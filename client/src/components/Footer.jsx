import assets from "../assets";
import { motion } from "motion/react";


const Footer = () => {
  return (
    <motion.footer 
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 px-6 md:px-0">
        
        {/* About Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4 text-yellow-400">UniBus Connect</h3>
          <p>
            Know the exact bus route at your fingertips. Get the arrival time at
            your nearest stop and plan your journey smarter.
          </p>
          <p className="mt-2">
            No more waiting at bus stops for too long and no more missing your buses.
          </p>
        </div>

        {/* Contact Section */}
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-4 text-yellow-400">Contact Us</h4>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-3">
              <img src={assets.location_icon} alt="location" className="w-5 h-5" />
              <span>OMR Road, Chennai - 600091</span>
            </li>
            <li className="flex items-center gap-3">
              <img src={assets.phone_icon} alt="phone" className="w-5 h-5" />
              <span>+91 94701 36815</span>
            </li>
            <li className="flex items-center gap-3">
              <img src={assets.mail_icon} alt="mail" className="w-5 h-5" />
              <span>unibusconnect@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-4 text-yellow-400">Follow Us</h4>
          <p className="text-gray-300">Stay connected with us on social media</p>
          <div className="flex gap-4 mt-4 items-center">
            {/* Social icons as full-cover rounded squares */}
            {[
              { key: "twitter", src: assets.twitter, alt: "Twitter", href: "#" },
              { key: "facebook", src: assets.facebook, alt: "Facebook", href: "#" },
              { key: "instagram", src: assets.instagram, alt: "Instagram", href: "#" },
              { key: "telegram", src: assets.telegram, alt: "Telegram", href: "#" },
            ].map((s) => (
              <a
                key={s.key}
                href={s.href}
                className={`inline-block w-8 h-8 md:w-9 md:h-9 rounded-lg overflow-hidden cursor-pointer ${s.key === "twitter" ? "bg-white" : ""}`}
                aria-label={s.alt}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-gray-400 mt-10 text-sm">
        © {new Date().getFullYear()} UniBus Connect. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
