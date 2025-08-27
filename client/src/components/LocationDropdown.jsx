import { useState, useRef, useEffect } from "react"; 
import assets from "../assets";
import { getLocations as apiGetLocations } from "../api/busRouteApi"; // use busRouteApi, not admin
import { motion } from "motion/react";

export default function LocationDropdown({ location, setLocation, onSearch }) {
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Input change → fetch suggestions
  const handleInputChange = async (e) => {
    const value = e.target.value;

    // Prevent "college" from being typed/selected
    if (value.toLowerCase() === "college") {
      setLocation("");
      setFilteredLocations([]);
      setShowDropdown(false);
      return;
    }

    setLocation(value);
    try {
      const suggestions = await apiGetLocations(value); // backend filters with startsWith
      const filtered = suggestions.filter(
        (loc) => loc.toLowerCase() !== "college"
      );
      setFilteredLocations(filtered);
      setShowDropdown(true);
    } catch {
      setFilteredLocations([]);
    }
  };

  // Show suggestions on focus
  const handleFocus = async () => {
    setShowDropdown(true);
    try {
      const suggestions = await apiGetLocations("");
      const filtered = suggestions.filter(
        (loc) => loc.toLowerCase() !== "college"
      );
      setFilteredLocations(filtered);
    } catch {
      setFilteredLocations([]);
    }
  };

  // Select a suggestion
  const handleSelect = (loc) => {
    if (loc.toLowerCase() === "college") return; // safeguard
    setLocation(loc); // loc is a string
    setShowDropdown(false);
  };

  // Handle Enter key for search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (location.toLowerCase() === "college") return; // block search
      onSearch();
      setShowDropdown(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-50 p-8 rounded-lg shadow mb-10 text-center" ref={dropdownRef} >
      <motion.h2 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-2xl font-bold mb-6 text-gray-800">
        Find Your <span className="text-yellow-500">Bus Route</span>
      </motion.h2>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center relative">
        {/* Input + Dropdown */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={location}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="Type your location..."
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none w-full text-gray-700 focus:ring-2 focus:ring-yellow-400"
          />
          {showDropdown && (
            <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto nice-scrollbar">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc, index) => {
                  const q = (location || "").trim();
                  let content = loc;
                  if (q) {
                    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
                    content = loc.split(re).reduce((acc, part, i, arr) => {
                      acc.push(part);
                      if (i < arr.length - 1)
                        acc.push(
                          <strong key={`h-${index}-${i}`} className="text-yellow-600">
                            {loc.match(re)?.[0]}
                          </strong>
                        );
                      return acc;
                    }, []);
                  }
                  return (
                    <li
                      key={index}
                      onClick={() => handleSelect(loc)}
                      className="px-4 py-2 cursor-pointer hover:bg-yellow-50 text-left"
                    >
                      {content}
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-2 text-gray-500 italic select-none">
                  No matches found
                </li>
              )}
            </ul>
          )}
        </div>
        {/* Search Button */}
        <button
          onClick={onSearch}
          className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-lg text-black font-medium w-full sm:w-40 transition cursor-pointer"
        >
          Search
        </button>
      </motion.div>

      {/* Scrollbar Styling */}
      <style>{`
        .nice-scrollbar::-webkit-scrollbar { width: 6px; }
        .nice-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .nice-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.6); border-radius: 9999px; }
        .nice-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(156, 163, 175, 0.9); }
      `}</style>
    </motion.div>
  );
}
