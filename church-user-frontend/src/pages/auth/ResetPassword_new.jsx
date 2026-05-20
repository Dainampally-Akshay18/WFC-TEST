/**
 * RESET PASSWORD PAGE
 * Complete password reset with token validation
 * Glassmorphic form with validation feedback
 * Mobile-responsive with functional API integration
 */

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import authAPI from "../../api/auth.api";
import { Lock, Eye, EyeOff, CheckCircle, Loader, AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const { colors, glassmorphism } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setError, setLoading, loading, error } = useAuth();

  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255, 100, 100, 0.1)" }}
          >
            <AlertCircle className="h-8 w-8" style={{ color: "#ff6464" }} />
          </div>

          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: colors.text.primary }}
            >
              Invalid Reset Link
            </h1>
            <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
              The password reset link is missing or invalid
            </p>
          </div>

          <a
            href="/auth/forgot-password"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
              color: colors.text.primary,
              boxShadow: `0 0 20px ${colors.glow.purple}`,
            }}
            className="inline-block rounded-lg px-8 py-3 font-semibold transition-all duration-200 hover:scale-105"
          >
            Request New Link
          </a>
        </div>
      </AuthLayout>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.resetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );

      if (response.success) {
        setSubmitted(true);
        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 3000);
      } else {
        setError(response.error?.message || "Failed to reset password");
      }
    } catch (err) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        "An error occurred during password reset";
      setError(errorMessage);
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
            style={{ background: `${colors.accent.pink}20` }}
          >
            <CheckCircle
              className="h-8 w-8"
              style={{ color: colors.accent.pink }}
            />
          </div>

          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: colors.text.primary }}
            >
              Password Reset Successful
            </h1>
            <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
              Your password has been successfully updated
            </p>
          </div>

          <p style={{ color: colors.text.secondary }} className="text-sm">
            Redirecting to login in 3 seconds...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
          Set New Password
        </h1>
        <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
          Enter your new password below
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

        {/* Password Input */}
        <div>
          <label style={{ color: colors.text.primary }} className="block text-sm font-medium mb-2">
            New Password
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
              required
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

        {/* Confirm Password Input */}
        <div>
          <label style={{ color: colors.text.primary }} className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-3.5 h-5 w-5"
              style={{ color: colors.text.muted }}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              style={{
                background: glassmorphism.input.background,
                border: `1px solid ${glassmorphism.input.border}`,
                color: colors.text.primary,
              }}
              className="w-full rounded-lg pl-12 pr-12 py-3 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3.5"
              disabled={loading}
            >
              {showConfirmPassword ? (
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

        {/* Password Match Status */}
        {formData.password && (
          <div
            className="rounded-lg p-3 text-sm"
            style={{
              background: formData.password === formData.confirmPassword
                ? `${colors.accent.pink}20`
                : "rgba(255,100,100,0.1)",
              color: formData.password === formData.confirmPassword
                ? colors.accent.pink
                : "#ff6464",
            }}
          >
            {formData.password === formData.confirmPassword
              ? "✓ Passwords match"
              : "✗ Passwords don't match"}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading ||
            !formData.password ||
            formData.password !== formData.confirmPassword
          }
          style={{
            background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
            color: colors.text.primary,
            boxShadow: `0 0 20px ${colors.glow.purple}`,
            opacity:
              loading || !formData.password || formData.password !== formData.confirmPassword
                ? 0.5
                : 1,
          }}
          className="w-full rounded-lg py-3 font-semibold transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
