import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Get routes serving a given stop/location

export const getRoutesByLocation = async (location) => {
  const res = await axios.get(`/api/routes`, {
    params: { location },
  });
  return res.data;
};


// Get available locations (for dropdown/autocomplete)
// Supports optional prefix filtering via ?startsWith

export const getLocations = async (startsWith = "") => {
  const res = await axios.get(`/api/routes/locations`, {
    params: startsWith ? { startsWith } : {},
  });
  return res.data; // returns array of strings
};
