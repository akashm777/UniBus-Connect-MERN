import React from "react"; 
import { Phone } from "lucide-react"; 

const RouteCard = ({ route }) => {
  if (!route || !route.stops) return null;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-6 w-full max-w-2xl mx-auto border border-gray-100 hover:shadow-xl transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          🚌 Route {route.routeNo}
        </h2>
        <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
          {(route.createdAt || route.date) && (
            <p className="text-xs text-gray-500 mt-1">
              Uploaded: {new Date(route.createdAt || route.date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Stops */}
      <div className="relative">
        {route.stops.map((stop, idx) => (
          <div key={idx} className="flex items-start relative">
            {/* Connector line */}
            {idx !== route.stops.length - 1 && (
              <div className="absolute left-[11px] top-5 bottom-[-18px] w-[2px] bg-gray-300"></div>
            )}

            {/* Stop dot */}
            <div className="w-6 h-6 rounded-full border-2 border-gray-800 bg-white flex items-center justify-center z-10">
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
            </div>

            {/* Stop details */}
            <div className="ml-4 mb-6">
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {stop.location}
              </p>
              {stop.time && (
                <p className="text-xs text-gray-500">{stop.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteCard;
