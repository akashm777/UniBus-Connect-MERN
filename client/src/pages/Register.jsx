import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import assets from "../assets";
import { register as apiRegister } from "../api/authApi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Manual password length validation only
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Set loading state ONLY after all validations pass
    setIsLoading(true);

    try {
      const data = await apiRegister({ name, email, password });

      // Save auth details
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "student");

      // Notify app of auth change
      window.dispatchEvent(new Event("auth-changed"));

      // Success toast
      toast.success(data.message || "Registration successful");

      // Always go to home after signup
      setTimeout(() => navigate("/"), 200);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err.response?.data?.message || 
        err.message || 
        "Registration failed. Please try again."
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

        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

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
              placeholder="Create a password (min. 6 characters)"
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
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}