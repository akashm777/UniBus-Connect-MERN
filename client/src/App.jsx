import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUpload from "./pages/AdminUpload";
import NotFound from "./pages/NotFound";
import {Toaster} from 'react-hot-toast';

function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <Toaster />
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  // Listen for login/logout from anywhere in the app and also cross-tab updates
  useEffect(() => {
    const update = () =>
      setAuth({ token: localStorage.getItem("token"), role: localStorage.getItem("role") });

    window.addEventListener("auth-changed", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("auth-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const { token, role } = auth;

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home - requires auth */}
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />

          {/* Admin route protected by role */}
          <Route
            path="/admin"
            element={token && role === "admin" ? <AdminUpload /> : <Navigate to="/" replace />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
