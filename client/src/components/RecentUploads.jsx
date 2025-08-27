import { useEffect, useState } from "react";
import { getRecentUploads } from "../api/adminApi";
import toast from "react-hot-toast";

export default function RecentUploads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getRecentUploads();
        setItems(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load uploads");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-gray-500">Loading uploads...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-800 mb-3 text-lg">
        📂 Recent Uploads
      </h3>
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No uploads yet</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it._id}
              className="flex items-center justify-between p-2 border-b last:border-b-0"
            >
              <span className="font-medium text-gray-700">
                Route {it.routeNo}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(it.date || it.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
