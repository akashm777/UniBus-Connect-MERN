import axios from "axios";

const RAW = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = (/^https?:\/\//i.test(RAW) ? RAW : `http://${RAW}`).replace(/\/+$/, "");

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});


// Upload a new Bus Route PDF (Admin only)

export const uploadRoutePdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_URL}/api/admin/upload`, formData, {
    headers: {
      ...authHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


// Get list of recent uploaded routes (latest 20)

export const getRecentUploads = async () => {
  const res = await axios.get(`${API_URL}/api/admin/uploads`, {
    headers: authHeaders(),
  });
  return res.data;
};
