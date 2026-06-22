/**
 * AUTH LAYOUT
 * Layout for authentication pages (login, register, etc.)
 * Clean white card on subtle blue background
 * Mobile-responsive with centered content
 */

import Navbar from "./Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F9FF" }}>
      {/* Navbar */}
      <Navbar />

      {/* Auth Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        {/* Subtle background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Form Container */}
        <div
          className="relative w-full max-w-md rounded-2xl p-8 md:p-10"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
