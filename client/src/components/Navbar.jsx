import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import assets from "../assets";
import { motion } from "motion/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [routeKey, setRouteKey] = useState(location.pathname);

  useEffect(() => {
    setRouteKey(location.pathname); 
  }, [location.pathname]);

  const role = localStorage.getItem("role"); // check user role

  const menuLinks = [
    { name: "Home", type: "home" },
    { name: "Features", id: "features" },
    { name: "About Us", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  const handleScrollTo = (id) => {
    // If not on home route, navigate there first
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMenuClick = (link) => {
    setOpen(false);
    if (link.type === "home") {
      navigate("/");
      return;
    }
    if (link.id) handleScrollTo(link.id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-changed"));
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <motion.div
      key={routeKey} 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 
      py-4 border-b border-gray-200 bg-gray-50 fixed top-0 w-full z-50">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-between">
          <img style={{display:"inline-block"}} src={assets.logo} alt="UniBus Connect" className="h-8" />
          <span className="font-bold text-xl">UniBus Connect</span>
        </motion.div>
      </Link>

      {/* Menu Links */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
        max-sm:border-t border-gray-200 right-0 flex flex-col sm:flex-row
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all
        duration-300 bg-gray-50
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => handleMenuClick(link)}
            className="text-gray-700 hover:text-yellow-500 transition cursor-pointer"
          >
            {link.name}
          </button>
        ))}

        {/* Admin Panel Button - only for admin */}
        {role === "admin" && (
          <button
            onClick={() => {
              setOpen(false);
              navigate("/admin");
            }}
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition cursor-pointer"
          >
            Admin Panel
          </button>
        )}

        {/* Logout Button */}
        {location.pathname !== "/login" && location.pathname !== "/register" && (
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt="menu"
          className="w-6 h-6"
        />
      </button>
    </motion.div>
  );
}
