import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { uploadRoutePdf, getRecentUploads } from "../api/adminApi";

export default function AdminUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }
    try {
      setLoading(true);
      const res = await uploadRoutePdf(selectedFile);
      toast.success(res.message || "File uploaded successfully");

      // Clear input
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh uploads list
      const data = await getRecentUploads();
      setUploads(data);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getRecentUploads();
        setUploads(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch uploads");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Admin Panel - Upload Bus Route PDFs
        </h2>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-black font-medium w-full sm:w-auto transition ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* Recent Uploads */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Recent Uploads
        </h3>
        {loading && uploads.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : uploads.length === 0 ? (
          <p className="text-gray-500 italic">No files uploaded yet</p>
        ) : (
          <ul className="space-y-2">
            {uploads.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center border p-3 rounded-lg text-sm"
              >
                <span className="font-medium text-gray-700">
                  {u.fileName}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(u.uploadedAt).toLocaleString()} • {u.routesParsed} routes
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
