import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});


// Upload a new Bus Route PDF (Admin only)

export const uploadRoutePdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`/api/admin/upload`, formData, {
    headers: {
      ...authHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


// Get list of recent uploaded routes (latest 20)

export const getRecentUploads = async () => {
  const res = await axios.get(`/api/admin/uploads`, {
    headers: authHeaders(),
  });
  return res.data;
};
