import { useEffect, useState } from "react";
import { getRecentUploads } from "../api/adminApi";
import toast from "react-hot-toast";

export default function RecentUploads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getRecentUploads();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load uploads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Optional: poll for a short period after mounting to catch just-completed uploads from another tab
    const t = setTimeout(load, 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <p className="text-gray-500">Loading uploads...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-lg">📂 Recent Uploads</h3>
        <button onClick={load} className="text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Refresh</button>
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No uploads yet</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it, idx) => (
            <li
              key={it.id || it._id || idx}
              className="flex items-center justify-between p-2 border-b last:border-b-0"
            >
              <span className="font-medium text-gray-700">
                {it.fileName || `Upload ${idx + 1}`} ({it.routesParsed ?? "-"} routes)
              </span>
              <span className="text-xs text-gray-500">
                {new Date(it.uploadedAt || it.date || it.createdAt || Date.now()).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
