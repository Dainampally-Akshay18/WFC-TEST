import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import authAPI from "../../api/auth.api";
import { Lock, CheckCircle, ArrowLeft, Loader, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const { colors, glassmorphism } = useTheme();
  const { setError, setLoading, loading, error } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.resetPassword(token, newPassword, confirmPassword);

      if (response.success) {
        setSubmitted(true);
        toast.success("Password reset successfully!");
      } else {
        setError(response.error?.message || "Failed to reset password");
      }
    } catch (err) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        "An error occurred. Please try again.";
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
              Password Reset!
            </h1>
            <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
              Your password has been successfully updated.
            </p>
          </div>

          <button
            onClick={() => navigate("/auth/login")}
            style={{
              background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
              color: colors.text.primary,
              boxShadow: `0 0 20px ${colors.glow.purple}`,
            }}
            className="w-full rounded-lg px-8 py-3 font-semibold transition-all duration-200 hover:scale-105"
          >
            Back to Login
          </button>
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
          Create New Password
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

        {/* New Password Input */}
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
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError(null);
              }}
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
              style={{ color: colors.text.muted }}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label style={{ color: colors.text.primary }} className="block text-sm font-medium mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-3.5 h-5 w-5"
              style={{ color: colors.text.muted }}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
              required
              style={{
                background: glassmorphism.input.background,
                border: `1px solid ${glassmorphism.input.border}`,
                color: colors.text.primary,
              }}
              className="w-full rounded-lg pl-12 pr-12 py-3 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
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
