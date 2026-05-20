/**
 * FORGOT PASSWORD PAGE
 * Initiates password recovery flow
 * Sends reset link to email
 * Mobile-responsive with functional API integration
 */

import { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import authAPI from "../../api/auth.api";
import { Mail, CheckCircle, ArrowLeft, Loader } from "lucide-react";

const ForgotPassword = () => {
  const { colors, glassmorphism } = useTheme();
  const { setError, setLoading, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.forgotPassword(email);

      if (response.success) {
        setSubmitted(true);
      } else {
        setError(response.error?.message || "Failed to send reset email");
      }
    } catch (err) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        "An error occurred. Please try again.";
      setError(errorMessage);
      console.error("Forgot password error:", err);
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
            style={{ background: `${colors.accent.blue}20` }}
          >
            <CheckCircle
              className="h-8 w-8"
              style={{ color: colors.accent.blue }}
            />
          </div>

          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: colors.text.primary }}
            >
              Reset Link Sent!
            </h1>
            <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
              We've sent a password reset link to:
            </p>
            <p
              style={{ color: colors.accent.purple }}
              className="font-semibold text-sm md:text-base mt-2 break-all"
            >
              {email}
            </p>
          </div>

          <div
            className="rounded-lg p-4 text-sm"
            style={{
              background: `${colors.accent.purple}10`,
              border: `1px solid ${colors.accent.purple}30`,
              color: colors.text.secondary,
            }}
          >
            <p className="mb-2">Check your email (including spam folder) for the reset link.</p>
            <p>The link will expire in 24 hours.</p>
          </div>

          <a
            href="/auth/login"
            style={{ background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
              color: colors.text.primary,
              boxShadow: `0 0 20px ${colors.glow.purple}`,
            }}
            className="inline-block rounded-lg px-8 py-3 font-semibold transition-all duration-200 hover:scale-105"
          >
            Back to Login
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <a href="/auth/login" className="flex items-center gap-2 mb-6 text-sm font-medium" style={{ color: colors.accent.purple }}>
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </a>
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
          Reset Your Password
        </h1>
        <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
          Enter your email and we'll send you a link to reset it
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
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
              required
              style={{
                background: glassmorphism.input.background,
                border: `1px solid ${glassmorphism.input.border}`,
                color: colors.text.primary,
              }}
              className="w-full rounded-lg pl-12 pr-4 py-3 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
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
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;


