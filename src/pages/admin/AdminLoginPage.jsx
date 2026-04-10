import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminLogin(email, password);
      const { access_token, role } = res.data;
      
      login(access_token, { email }, role);
      toast.success("Login successful!");
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-stone-800">Admin Login</h1>
          <p className="text-stone-500 mt-1">Restaurant Management System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="admin@restaurant.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-900 text-white py-2.5 rounded-lg font-medium hover:bg-stone-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-stone-500 hover:text-stone-700 transition"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
