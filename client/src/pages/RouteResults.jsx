import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RouteCard from "../components/RouteCard";
import { getRoutesByLocation } from "../api/busRouteApi";
import toast from "react-hot-toast";

export default function RouteResults() {
  const { location } = useParams();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await getRoutesByLocation(decodeURIComponent(location));
        setRoutes(data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch routes"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, [location]);

  return (
    <div className="min-h-[80vh] px-4 sm:px-8 lg:px-16 py-8 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Bus Routes for:{" "}
        <span className="text-blue-600">{decodeURIComponent(location)}</span>
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading routes...</p>
      ) : routes.length > 0 ? (
        <div className="flex flex-col gap-6 items-center">
          {routes.map((route) => (
            <RouteCard key={route._id} route={route} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No routes found for "{decodeURIComponent(location)}".
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
