import React, { useState } from "react";
import axios from "axios";
import RecentUploads from "../components/RecentUploads";
import toast from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload to ImageKit
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const imagekitRes = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        formData,
        {
          headers: {
            Authorization: `Basic ${btoa(`${import.meta.env.IMAGEKIT_PUBLIC_KEY}:${import.meta.env.IMAGEKIT_PRIVATE_KEY}`)}`,
          },
        }
      );

      const pdfUrl = imagekitRes.data.url;

      // 2️⃣ Send URL to backend
      await axios.post(
        `/api/admin/upload`,
        { pdfUrl },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("PDF uploaded and parsed successfully!");
      setFile(null);
      setRefreshKey((k) => k + 1); // refresh list
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen p-4 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Panel</h1>

        <div className="p-4 bg-white rounded shadow">
          <form onSubmit={handleUpload}>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-2"
            />
            <button
              type="submit"
              disabled={loading || !file}
              className={`px-4 py-2 rounded text-white ${
                loading || !file
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              title={!file ? "Select a PDF to enable" : ""}
            >
              {loading ? "Uploading..." : "Upload PDF"}
            </button>
          </form>
        </div>

        <RecentUploads key={refreshKey} />
      </div>
    </div>
  );
};

export default AdminUpload;
