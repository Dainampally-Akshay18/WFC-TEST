/**
 * LANDING PAGE — Premium 2026 SaaS Design
 * Inspired by Stripe, Linear, Vercel
 * Self-contained navbar + hero + features + stats + CTA + footer
 */

import { ChevronRight, Heart, BookOpen, Users, Church, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "#F5F9FF" }}>
      {/* ══════════════════════════════════════════════════════ */}
      {/* NAVBAR */}
      {/* ══════════════════════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-50 w-full"
        style={{
          background: "#0F172A",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff" }}
            >
              W
            </div>
            <span className="text-base md:text-lg font-bold text-white tracking-tight">WFC</span>
            <span className="hidden sm:inline text-xs text-white/60 ml-1 font-medium">Community</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => navigate("/auth/login")}
              className="px-4 py-2 rounded-lg font-medium text-sm text-white/90 hover:text-white hover:bg-white/8 transition-all duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth/register")}
              className="px-4 py-2 rounded-lg font-semibold text-sm text-white flex items-center gap-1.5 transition-all duration-200 group"
              style={{ background: "#2563EB" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1D4ED8";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2563EB";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get Started
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Subtle background gradient orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-16 md:pt-20 pb-12 md:pb-16">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: "rgba(37,99,235,0.08)",
                color: "#2563EB",
                border: "1px solid rgba(37,99,235,0.15)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Welcome to WFC Community
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center mb-5 animate-slide-up" style={{ color: "#0F172A" }}>
            <span className="block text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Growing Together
            </span>
            <span
              className="block text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mt-1"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in Faith
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="text-center text-base md:text-lg max-w-2xl mx-auto mb-8 animate-fade-in leading-relaxed"
            style={{ color: "#64748B" }}
          >
            Join a thriving community of believers. Share prayers, discover
            inspiring sermons, attend meaningful events, and strengthen your
            spiritual journey together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 animate-slide-up">
            <button
              onClick={() => navigate("/auth/register")}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 group transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Join Our Community
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/auth/login")}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: "#FFFFFF",
                color: "#0F172A",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#CBD5E1";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Sign In
            </button>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-6 md:gap-10 max-w-lg mx-auto">
            {[
              { value: "2,847+", label: "Active Members" },
              { value: "234+", label: "Sermons Shared" },
              { value: "156+", label: "Active Prayers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold" style={{ color: "#2563EB" }}>
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm mt-1 font-medium" style={{ color: "#94A3B8" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* FEATURES SECTION */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-20" style={{ background: "#FFFFFF" }}>
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#2563EB" }}>
              Platform Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#0F172A" }}>
              Everything You Need
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "#64748B" }}>
              Tools designed to deepen your faith and connect with our community
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Watch Sermons",
                desc: "Access our library of powerful, inspiring sermons designed to strengthen your faith and guide your spiritual journey.",
                color: "#2563EB",
                bg: "rgba(37,99,235,0.08)",
              },
              {
                icon: Heart,
                title: "Share Prayers",
                desc: "Lift up one another with prayer requests. Experience the power of collective intercession and spiritual support.",
                color: "#EC4899",
                bg: "rgba(236,72,153,0.08)",
              },
              {
                icon: Calendar,
                title: "Join Events",
                desc: "Stay connected with meaningful church gatherings, events, and community activities that build unity and fellowship.",
                color: "#F59E0B",
                bg: "rgba(245,158,11,0.08)",
              },
              {
                icon: Users,
                title: "Community",
                desc: "Connect with fellow believers, build lasting relationships, and grow together in faith as one body.",
                color: "#22C55E",
                bg: "rgba(34,197,94,0.08)",
              },
              {
                icon: Church,
                title: "Church News",
                desc: "Stay informed with the latest updates, blog posts, and announcements from your church community.",
                color: "#8B5CF6",
                bg: "rgba(139,92,246,0.08)",
              },
              {
                icon: Sparkles,
                title: "Daily Inspiration",
                desc: "Receive uplifting content, devotionals, and scripture to nourish your spirit every single day.",
                color: "#0EA5E9",
                bg: "rgba(14,165,233,0.08)",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl p-7 flex flex-col transition-all duration-300 cursor-default group"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = "#CBD5E1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "#E2E8F0";
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: feature.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#0F172A" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-grow" style={{ color: "#64748B" }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CTA SECTION */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-20 px-6" style={{ background: "#F5F9FF" }}>
        <div className="mx-auto max-w-7xl">
          <div
            className="relative rounded-2xl overflow-hidden px-8 py-12 md:px-16 md:py-16 text-center"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            }}
          >
            {/* Decorative gradient orbs */}
            <div
              className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #2563EB, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 opacity-15 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #3B82F6, transparent 70%)",
              }}
            />

            <div className="relative">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Deepen Your Faith?
              </h2>
              <p className="text-base md:text-lg text-white/70 mb-8 max-w-xl mx-auto">
                Join thousands of believers in our community today. It's completely free.
              </p>
              <button
                onClick={() => navigate("/auth/register")}
                className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 mx-auto group"
                style={{
                  background: "#FFFFFF",
                  color: "#0F172A",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Create Your Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ══════════════════════════════════════════════════════ */}
      <footer
        className="py-12 md:py-14 px-6"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
            {[
              {
                title: "PLATFORM",
                links: ["Sermons", "Blogs", "Events"],
              },
              {
                title: "COMMUNITY",
                links: ["Prayers", "Members", "Groups"],
              },
              {
                title: "SUPPORT",
                links: ["Contact", "FAQ", "Help Center"],
              },
              {
                title: "LEGAL",
                links: ["Privacy", "Terms", "Cookies"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  className="font-semibold mb-4 text-xs uppercase tracking-wider"
                  style={{ color: "#94A3B8" }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-200"
                        style={{ color: "#64748B" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between text-sm"
            style={{
              borderTop: "1px solid #F1F5F9",
              color: "#94A3B8",
            }}
          >
            <p>&copy; 2026 WFC Community Platform. All rights reserved.</p>
            <div className="mt-3 md:mt-0 flex gap-5">
              {["Twitter", "Facebook", "Instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="transition-colors duration-200"
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
