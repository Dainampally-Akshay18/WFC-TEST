import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import authAPI from "../../api/auth.api";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      if (response.success) {
        const { token, user } = response.data;
        login(user, token);
        if (user.status?.toUpperCase() === "APPROVED") {
          navigate("/home", { replace: true });
        } else {
          navigate("/wait-approval", { replace: true });
        }
      } else {
        setError(response.error?.message || "Login failed");
      }
    } catch (err) {
      const errorMessage = err.error?.message || err.message || err.response?.data?.message || "An error occurred during login";
      const lowerError = errorMessage.toLowerCase();
      if (lowerError.includes("not approved") || lowerError.includes("wait for admin") || lowerError.includes("pending")) {
        navigate("/wait-approval", { replace: true });
        return;
      }
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-sm md:text-base text-gray-500">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg p-3 text-sm bg-red-50 text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg pl-11 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white disabled:opacity-50 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg pl-11 pr-11 py-3 text-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white disabled:opacity-50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded accent-blue-600" disabled={loading} />
            <span className="text-gray-500">Remember me</span>
          </label>
          <a href="/auth/forgot-password" className="font-medium text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-3 font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md"
          }`}
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/auth/register" className="font-semibold text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
