/**
 * WAIT APPROVAL PAGE
 * Displayed when user account is pending admin approval
 * Premium futuristic waiting screen with spiritual aesthetic
 */

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Clock, LogOut, CheckCircle } from "lucide-react";

const WaitApproval = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();
  const { logout, user, isAuthenticated } = useAuth();

  // Redirect approved users to home
  // ✅ FRONTEND FIX: Only redirect if they are fully approved. 
  // Do NOT kick out unauthenticated users, so they can actually see this screen!
  
  useEffect(() => {
    // If they magically get approved while on this screen, send them home
    if (isAuthenticated && user?.status?.toUpperCase() === "APPROVED") {
      navigate("/home", { replace: true });
    }
    // NOTICE: We removed the block that kicks !isAuthenticated users back to login.
  }, [user, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: colors.background.primary }}
    >
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            ...glassmorphism.card,
            background: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.45)",
          }}
        >
          {/* Icon */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{
              background: isDarkMode
                ? "rgba(176,38,255,0.2)"
                : "rgba(109,40,217,0.15)",
              boxShadow: `0 0 40px ${
                isDarkMode
                  ? "rgba(176,38,255,0.3)"
                  : "rgba(109,40,217,0.2)"
              }`,
            }}
          >
            <Clock size={48} style={{ color: colors.accent.purple }} />
          </div>

          {/* Title */}
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Awaiting Approval
          </h1>

          {/* Message */}
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            Your account is currently awaiting approval from the church
            administration. You will receive access once your account has been
            reviewed and approved.
          </p>

          {/* User Info */}
          {user && (
            <div
              className="mb-8 p-6 rounded-xl"
              style={{
                background: isDarkMode
                  ? "rgba(176,38,255,0.1)"
                  : "rgba(109,40,217,0.08)",
                border: `1px solid ${colors.border.glass}`,
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: colors.text.muted }}
              >
                Account Details
              </p>
              <p
                className="font-semibold mb-1"
                style={{ color: colors.text.primary }}
              >
                {user.name}
              </p>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {user.email}
              </p>
            </div>
          )}

          {/* Status Steps */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: colors.accent.purple }}
              >
                <CheckCircle size={18} style={{ color: "#fff" }} />
              </div>
              <div className="flex-1 text-left">
                <p
                  className="font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Account Created
                </p>
                <p className="text-sm" style={{ color: colors.text.muted }}>
                  Your registration was successful
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                style={{
                  background: isDarkMode
                    ? "rgba(176,38,255,0.3)"
                    : "rgba(109,40,217,0.2)",
                  border: `2px solid ${colors.accent.purple}`,
                }}
              >
                <Clock size={18} style={{ color: colors.accent.purple }} />
              </div>
              <div className="flex-1 text-left">
                <p
                  className="font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Pending Review
                </p>
                <p className="text-sm" style={{ color: colors.text.muted }}>
                  Admin is reviewing your account
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-50">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                <CheckCircle size={18} style={{ color: colors.text.muted }} />
              </div>
              <div className="flex-1 text-left">
                <p
                  className="font-semibold"
                  style={{ color: colors.text.muted }}
                >
                  Access Granted
                </p>
                <p className="text-sm" style={{ color: colors.text.muted }}>
                  You'll receive full access
                </p>
              </div>
            </div>
          </div>

          {/* Spiritual Message */}
          <div
            className="mb-8 p-6 rounded-xl"
            style={{
              background: isDarkMode
                ? "rgba(59,130,255,0.1)"
                : "rgba(96,165,250,0.1)",
              border: `1px solid ${colors.border.glass}`,
            }}
          >
            <p
              className="text-sm italic"
              style={{ color: colors.text.secondary }}
            >
              "Wait for the Lord; be strong and take heart and wait for the
              Lord."
            </p>
            <p
              className="text-xs mt-2"
              style={{ color: colors.text.muted }}
            >
              — Psalm 27:14
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
            style={{
              background: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,255,255,0.6)",
              color: colors.text.primary,
              border: `1px solid ${colors.border.glass}`,
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Help Text */}
        <p
          className="text-center mt-6 text-sm"
          style={{ color: colors.text.muted }}
        >
          If you have any questions, please contact the church administration.
        </p>
      </div>
    </div>
  );
};

export default WaitApproval;
