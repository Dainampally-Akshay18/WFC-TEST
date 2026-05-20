/**
 * LOGIN PAGE
 * User authentication page
 * Glassmorphic form with dark/light theme support
 * Mobile-responsive with functional API integration
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import authAPI from "../../api/auth.api";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";

const Login = () => {
  const { colors, glassmorphism } = useTheme();
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
    if (error) setError(null); // Clear error when user starts typing
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
        
        // Update auth store with login data
        login(user, token);
        
        // Redirect to home dashboard
        navigate("/home", { replace: true });
      } else {
        setError(response.error?.message || "Login failed");
      }
    } catch (err) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        "An error occurred during login";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
          Welcome Back
        </h1>
        <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div
            className="rounded-lg p-3 text-sm"
            style={{
              background: "rgba(255, 100, 100, 0.1)",
              color: "#ff6464",
              border: "1px solid #ff6464",
            }}
          >
            {error}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label style={{ color: colors.text.primary }} className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-3.5 h-5 w-5"
              style={{ color: colors.text.muted }}
            />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              style={{
                background: glassmorphism.input.background,
                border: `1px solid ${glassmorphism.input.border}`,
                color: colors.text.primary,
              }}
              className="w-full rounded-lg pl-12 pr-4 py-3 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label style={{ color: colors.text.primary }} className="block text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-3.5 h-5 w-5"
              style={{ color: colors.text.muted }}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              style={{
                background: glassmorphism.input.background,
                border: `1px solid ${glassmorphism.input.border}`,
                color: colors.text.primary,
              }}
              className="w-full rounded-lg pl-12 pr-12 py-3 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff
                  className="h-5 w-5"
                  style={{ color: colors.text.muted }}
                />
              ) : (
                <Eye className="h-5 w-5" style={{ color: colors.text.muted }} />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded"
              disabled={loading}
              style={{ accentColor: colors.accent.purple }}
            />
            <span style={{ color: colors.text.secondary }}>Remember me</span>
          </label>
          <a href="/auth/forgot-password" style={{ color: colors.accent.purple }} className="hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
            color: colors.text.primary,
            boxShadow: `0 0 20px ${colors.glow.purple}`,
            opacity: loading ? 0.7 : 1,
          }}
          className="w-full rounded-lg py-3 font-semibold transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <p className="text-center text-sm" style={{ color: colors.text.secondary }}>
          Don't have an account?{" "}
          <a href="/auth/register" style={{ color: colors.accent.purple }} className="font-semibold hover:underline">
            Create one
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
