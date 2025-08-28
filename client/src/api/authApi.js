import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const register = async ({ name, email, password }) => {
  const res = await axios.post(`/api/auth/register`, {
    name: (name || "").trim(),
    email: (email || "").trim().toLowerCase(),
    password,
  });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await axios.post(`/api/auth/login`, {
    email: (email || "").trim().toLowerCase(),
    password,
  });
  return res.data;
};
