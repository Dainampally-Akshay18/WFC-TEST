/**
 * CREATE PRAYER PAGE
 * Form for creating new prayer requests with anonymous option
 * Futuristic glass form with validation
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePrayer } from "../../hooks/usePrayers";
import { useTheme } from "../../hooks/useTheme";
import { ArrowLeft, Send } from "lucide-react";

const CreatePrayer = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();
  const createPrayerMutation = useCreatePrayer();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isAnonymous: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 150) {
      newErrors.title = "Title must not exceed 150 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description must not exceed 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createPrayerMutation.mutateAsync(formData);
      navigate("/prayers");
    } catch (error) {
      console.error("Failed to create prayer:", error);
      setErrors({ submit: error.message || "Failed to create prayer request" });
    }
  };

  const handleBack = () => {
    navigate("/prayers");
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: colors.background.primary }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80"
          style={{ color: colors.text.secondary }}
        >
          <ArrowLeft size={20} />
          <span>Back to Prayers</span>
        </button>

        {/* Form Card */}
        <div
          className="rounded-xl p-8"
          style={{
            ...glassmorphism.card,
            background: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.45)",
          }}
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Create Prayer Request
          </h1>
          <p className="mb-8" style={{ color: colors.text.secondary }}>
            Share your prayer request with the community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Prayer Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter prayer title..."
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.6)",
                  border: `1px solid ${
                    errors.title ? colors.accent.pink : colors.border.glass
                  }`,
                  color: colors.text.primary,
                }}
              />
              {errors.title && (
                <p className="text-sm mt-1" style={{ color: colors.accent.pink }}>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Prayer Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Share your prayer request in detail..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all resize-none"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.6)",
                  border: `1px solid ${
                    errors.description ? colors.accent.pink : colors.border.glass
                  }`,
                  color: colors.text.primary,
                }}
              />
              {errors.description && (
                <p className="text-sm mt-1" style={{ color: colors.accent.pink }}>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{
                background: isDarkMode
                  ? "rgba(176,38,255,0.1)"
                  : "rgba(109,40,217,0.08)",
                border: `1px solid ${colors.border.glass}`,
              }}
            >
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="w-5 h-5 cursor-pointer"
                style={{ accentColor: colors.accent.purple }}
              />
              <label
                htmlFor="isAnonymous"
                className="cursor-pointer"
                style={{ color: colors.text.primary }}
              >
                <span className="font-semibold">Post Anonymously</span>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Your name will be hidden from other users
                </p>
              </label>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div
                className="p-4 rounded-lg"
                style={{
                  background: isDarkMode
                    ? "rgba(255,44,223,0.1)"
                    : "rgba(217,70,239,0.1)",
                  border: `1px solid ${colors.accent.pink}`,
                }}
              >
                <p style={{ color: colors.accent.pink }}>{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createPrayerMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: colors.accent.purple,
                color: "#fff",
              }}
            >
              {createPrayerMutation.isPending ? (
                <>
                  <div
                    className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"
                  />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Prayer Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePrayer;
