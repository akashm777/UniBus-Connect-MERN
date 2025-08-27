import axios from "axios";

const RAW = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = (/^https?:\/\//i.test(RAW) ? RAW : `http://${RAW}`).replace(/\/+$/, "");

export const register = async ({ name, email, password }) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, {
    name: (name || "").trim(),
    email: (email || "").trim().toLowerCase(),
    password,
  });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, {
    email: (email || "").trim().toLowerCase(),
    password,
  });
  return res.data;
};
