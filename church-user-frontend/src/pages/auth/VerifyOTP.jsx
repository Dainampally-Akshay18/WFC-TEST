/**
 * VERIFY OTP PAGE
 * User email OTP verification page
 * Two-factor authentication
 * Mobile-responsive
 */

import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeProvider";
import AuthLayout from "../../layouts/AuthLayout";
import { Mail, ArrowLeft } from "lucide-react";

const VerifyOTP = () => {
  const { colors, glassmorphism } = useTheme();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("OTP verification:", otpCode);
    setVerified(true);
    // TODO: Implement actual OTP verification
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (verified) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
            style={{ background: `${colors.accent.pink}20` }}
          >
            <Mail
              className="h-8 w-8"
              style={{ color: colors.accent.pink }}
            />
          </div>

          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: colors.text.primary }}
            >
              Verification Successful
            </h1>
            <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
              Your email has been verified successfully
            </p>
          </div>

          <button
            onClick={() => window.location.href = "/auth/login"}
            style={{
              background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
              color: colors.text.primary,
              boxShadow: `0 0 20px ${colors.glow.purple}`,
            }}
            className="w-full rounded-lg py-3 font-semibold transition-all duration-200 hover:scale-105"
          >
            Proceed to Login
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
          Verify Your Email
        </h1>
        <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
          We've sent a 6-digit code to your email
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Inputs */}
        <div>
          <label style={{ color: colors.text.primary }} className="block text-sm font-medium mb-4">
            Verification Code
          </label>
          <div className="flex justify-center gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  background: glassmorphism.input.background,
                  border: `2px solid ${digit ? colors.accent.purple : colors.border.glass}`,
                  color: colors.text.primary,
                }}
                className="h-12 md:h-14 w-10 md:w-12 rounded-lg text-center text-lg md:text-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
            Code expires in:{" "}
            <span style={{ color: colors.accent.pink }} className="font-bold">
              {formatTime(timeLeft)}
            </span>
          </p>
        </div>

        {/* Resend Link */}
        <div className="text-center">
          <p style={{ color: colors.text.secondary }} className="text-sm mb-2">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={() => setTimeLeft(300)}
            style={{ color: colors.accent.purple }}
            className="text-sm font-semibold hover:underline"
          >
            Resend Code
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={otp.some((digit) => !digit)}
          style={{
            background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
            color: colors.text.primary,
            boxShadow: `0 0 20px ${colors.glow.purple}`,
            opacity: otp.some((digit) => !digit) ? 0.5 : 1,
          }}
          className="w-full rounded-lg py-3 font-semibold transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed"
        >
          Verify Email
        </button>
      </form>
    </AuthLayout>
  );
};

export default VerifyOTP;
