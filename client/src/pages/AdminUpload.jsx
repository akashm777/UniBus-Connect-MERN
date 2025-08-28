import React, { useState } from "react";
import { uploadRoutePdf } from "../api/adminApi";
import RecentUploads from "../components/RecentUploads";
import toast from "react-hot-toast";

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setLoading(true);
      await uploadRoutePdf(file); 
      toast.success("PDF uploaded and parsed successfully!");
      setFile(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Upload failed.";
      toast.error(msg);
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
              onChange={(e) => setFile(e.target.files[0] || null)}
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

        {/* Recent uploads list */}
        <RecentUploads key={refreshKey} />
      </div>
    </div>
  );
};

export default AdminUpload;
