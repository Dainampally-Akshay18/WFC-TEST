/**
 * REGISTER PAGE
 * User registration page with email verification requirement
 * Glassmorphic form with password validation
 * Mobile-responsive with functional API integration
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import authAPI from "../../api/auth.api";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, Loader } from "lucide-react";

const Register = () => {
  const { colors, glassmorphism } = useTheme();
  const navigate = useNavigate();
  const { setError, setLoading, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "", // No default - user must select
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

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.branch) {
      setError("Please fill in all fields");
      return;
    }

    // Validate branch selection
    if (formData.branch !== "BRANCH1" && formData.branch !== "BRANCH2") {
      setError("Please select a valid branch");
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
      const response = await authAPI.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.branch
      );

      if (response.success) {
        setSubmitted(true);
        // Redirect to wait-approval immediately
        setTimeout(() => {
          navigate("/wait-approval", { replace: true });
        }, 2000);
      } else {
        setError(response.error?.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        "An error occurred during registration";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { label: "At least 6 characters", met: formData.password.length >= 6 },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(formData.password),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(formData.password),
    },
    { label: "Contains number", met: /[0-9]/.test(formData.password) },
    {
      label: "Passwords match",
      met: formData.password === formData.confirmPassword && formData.password.length > 0,
    },
  ];

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
              Account Created!
            </h1>
            <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
              Your account is pending admin approval.
            </p>
            <p style={{ color: colors.text.secondary }} className="text-xs md:text-sm mt-2">
              You will be notified via email once approved.
            </p>
          </div>

          <p style={{ color: colors.text.secondary }} className="text-sm">
            Redirecting in 2 seconds...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
          Join Our Community
        </h1>
        <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
          Create an account to get started
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

        {/* Name Input */}
        <div>
          <label style={{ color: colors.text.primary }} className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <div className="relative">
            <User
              className="absolute left-4 top-3.5 h-5 w-5"
              style={{ color: colors.text.muted }}
            />
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
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

        {/* Branch Selection */}
        <div>
          <label style={{ color: colors.text.primary }} className="block text-sm font-medium mb-2">
            Branch <span style={{ color: colors.accent.pink }}>*</span>
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            disabled={loading}
            required
            style={{
              background: glassmorphism.input.background,
              border: `1px solid ${glassmorphism.input.border}`,
              color: formData.branch ? colors.text.primary : colors.text.muted,
            }}
            className="w-full rounded-lg px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <option value="" disabled style={{ color: colors.text.muted }}>
              Select your branch
            </option>
            <option value="BRANCH1">Branch 1</option>
            <option value="BRANCH2">Branch 2</option>
          </select>
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

        {/* Password Requirements */}
        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: `${colors.accent.purple}10`,
            border: `1px solid ${colors.accent.purple}30`,
          }}
        >
          {passwordRequirements.map((req, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle
                className="h-4 w-4"
                style={{
                  color: req.met ? colors.accent.pink : colors.text.muted,
                }}
              />
              <span
                style={{
                  color: req.met ? colors.accent.pink : colors.text.muted,
                }}
              >
                {req.label}
              </span>
            </div>
          ))}
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Sign In Link */}
        <p className="text-center text-sm" style={{ color: colors.text.secondary }}>
          Already have an account?{" "}
          <a href="/auth/login" style={{ color: colors.accent.purple }} className="font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
