import axios from "axios";

const RAW = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = (/^https?:\/\//i.test(RAW) ? RAW : `http://${RAW}`).replace(/\/+$/, "");


// Get routes serving a given stop/location

export const getRoutesByLocation = async (location) => {
  const res = await axios.get(`${API_URL}/api/routes`, {
    params: { location },
  });
  return res.data;
};


// Get available locations (for dropdown/autocomplete)
// Supports optional prefix filtering via ?startsWith

export const getLocations = async (startsWith = "") => {
  const res = await axios.get(`${API_URL}/api/routes/locations`, {
    params: startsWith ? { startsWith } : {},
  });
  return res.data; // returns array of strings
};
