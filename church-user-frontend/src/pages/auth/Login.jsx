/**
 * LOGIN PAGE
 * User authentication page
 * Clean professional design with blue-white theme
 * Mobile-responsive with functional API integration
 */

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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      const errorMessage =
        err.error?.message ||
        err.message ||
        err.response?.data?.message ||
        "An error occurred during login";

      const lowerError = errorMessage.toLowerCase();
      if (
        lowerError.includes("not approved") ||
        lowerError.includes("wait for admin") ||
        lowerError.includes("pending")
      ) {
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#0F172A" }}>
          Welcome Back
        </h1>
        <p className="text-sm md:text-base" style={{ color: "#64748B" }}>
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Alert */}
        {error && (
          <div
            className="rounded-lg p-3 text-sm"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              color: "#EF4444",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3.5 top-3.5 h-4.5 w-4.5"
              style={{ color: "#94A3B8" }}
            />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg pl-11 pr-4 py-3 text-sm transition-all duration-200 focus:outline-none disabled:opacity-50"
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                color: "#0F172A",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
                e.currentTarget.style.background = "#FFFFFF";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#F8FAFC";
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-3.5 h-4.5 w-4.5"
              style={{ color: "#94A3B8" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg pl-11 pr-11 py-3 text-sm transition-all duration-200 focus:outline-none disabled:opacity-50"
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                color: "#0F172A",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
                e.currentTarget.style.background = "#FFFFFF";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#F8FAFC";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" style={{ color: "#94A3B8" }} />
              ) : (
                <Eye className="h-4.5 w-4.5" style={{ color: "#94A3B8" }} />
              )}
            </button>
          </div>
        </div>

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              disabled={loading}
              style={{ accentColor: "#2563EB" }}
            />
            <span style={{ color: "#64748B" }}>Remember me</span>
          </label>
          <a
            href="/auth/forgot-password"
            className="font-medium hover:underline"
            style={{ color: "#2563EB" }}
          >
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: loading ? "#93C5FD" : "#2563EB",
            color: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#1D4ED8";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#2563EB";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.25)";
            }
          }}
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

        {/* Sign Up Link */}
        <p className="text-center text-sm" style={{ color: "#64748B" }}>
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="font-semibold hover:underline"
            style={{ color: "#2563EB" }}
          >
            Create one
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
