import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="text-center">
        {/* Big 404 text */}
        <h1 className="text-7xl md:text-9xl font-bold text-yellow-500">404</h1>

        {/* Message */}
        <p className="mt-4 text-xl md:text-2xl font-semibold text-gray-800">
          Oops! Page not found
        </p>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Back to home button */}
        <Link
          to="/"
          className="mt-6 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-3 rounded-lg transition cursor-pointer"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
