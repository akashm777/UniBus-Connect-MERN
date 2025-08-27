import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import assets from "../assets";
import { login as apiLogin } from "../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Set loading state ONLY after all validations pass
    setIsLoading(true);

    try {
      const data = await apiLogin({ email, password });

      // Save auth details
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Broadcast auth change
      window.dispatchEvent(new Event("auth-changed"));

      // Success toast
      toast.success(data.message || "Login successful");

      // Go to home for all users; admin can use Navbar button to access panel
      setTimeout(() => navigate("/"), 200);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.message || 
        err.message || 
        "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={assets.bg_video}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur p-6 rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <img src={assets.logo} alt="UniBus Connect" className="h-10" />
          <span className="text-xl font-bold text-gray-800">UniBus Connect</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-yellow-400 text-black font-medium py-2 rounded transition ${
              isLoading 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:bg-yellow-500 cursor-pointer"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-yellow-500 hover:underline cursor-pointer">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}