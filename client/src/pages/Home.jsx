import { useState } from "react"; 
import toast from "react-hot-toast"; 
import HeroSection from "../components/HeroSection"; 
import LocationDropdown from "../components/LocationDropdown"; 
import RouteCard from "../components/RouteCard"; 
import FeaturesSection from "../components/FeaturesSection"; 
import Footer from "../components/Footer"; 
import { getRoutesByLocation } from "../api/busRouteApi"; 

export default function Home() {
  const [location, setLocation] = useState("");
  const [routes, setRoutes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchRoute = async () => {
    if (!location) {
      toast.error("Please select a location");
      return;
    }
    try {
      setLoading(true);
      setSearched(true);
      const data = await getRoutesByLocation(location); // ensure we always have an array
      setRoutes(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setRoutes([]);
      toast.error(err.response?.data?.message || "No route found for location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Location Dropdown */}
      <LocationDropdown location={location} setLocation={setLocation} onSearch={searchRoute} />

      {/* Results Section */}
      <div className="max-w-3xl mx-auto px-4">
        {loading && (
          <div className="text-center text-gray-600 mb-6">Loading...</div>
        )}
        {!loading && searched && routes.length === 0 && (
          <p className="text-center text-gray-500 italic mb-6">
            No bus routes found for "{location}"
          </p>
        )}
        {!loading && routes.length > 0 && routes.map((route, idx) => <RouteCard key={idx} route={route} />)}
      </div>

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      <div id="how-it-works" className="py-0"></div>
      <div id="about" className="py-0"></div>

      {/* Footer */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
