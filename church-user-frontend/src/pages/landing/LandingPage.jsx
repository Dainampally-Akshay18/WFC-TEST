/**
 * LANDING PAGE
 * Public facing homepage for unauthenticated users
 * Premium futuristic glassmorphism design
 * Cinematic hero section with smooth animations
 * Mobile-fully responsive
 */

import { useTheme } from "../../context/ThemeProvider";
import { ChevronRight, Sparkles, Heart, BookOpen, Users } from "lucide-react";

const LandingPage = () => {
  const { isDarkMode, colors, gradients, glassmorphism, shadows } = useTheme();

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen" style={{ background: colors.background.primary }}>
      {/* Navbar */}
      <nav
        style={{
          borderBottom: `1px solid ${colors.border.glass}`,
          backdropFilter: glassmorphism.nav.backdropFilter,
        }}
        className="sticky top-0 z-50 w-full px-4 py-3 md:px-6 md:py-4"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl md:text-3xl font-bold">
            <span
              style={{
                background: gradients.primary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              WFC
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => navigateTo("/auth/login")}
              className="rounded-lg px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: gradients.primary,
                color: colors.text.primary,
                boxShadow: isDarkMode
                  ? `0 0 20px ${colors.glow.purple}`
                  : "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigateTo("/auth/register")}
              className="rounded-lg px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base font-medium transition-all duration-200"
              style={{
                background: "transparent",
                border: `1px solid ${colors.border.glass}`,
                color: colors.text.primary,
              }}
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Background Gradient Effect */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: gradients.primary,
          filter: "blur(120px)",
          top: "10%",
        }}
      />

      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-32 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className="mb-6 md:mb-8 inline-flex items-center gap-2 rounded-full px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium"
            style={{
              background: isDarkMode
                ? `linear-gradient(135deg, ${colors.accent.purple}20, ${colors.accent.pink}10)`
                : `linear-gradient(135deg, ${colors.accent.purple}15, ${colors.accent.pink}8)`,
              border: `1px solid ${colors.border.glass}`,
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: colors.accent.purple }} />
            <span>Welcome to WFC Community</span>
          </div>

          {/* Main Heading */}
          <h1
            className="mb-4 md:mb-6 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight"
            style={{ color: colors.text.primary }}
          >
            Experience{" "}
            <span
              style={{
                background: gradients.primary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Spiritual Community
            </span>{" "}
            Reimagined
          </h1>

          {/* Subheading */}
          <p
            className="mb-8 md:mb-12 text-base md:text-lg"
            style={{ color: colors.text.secondary }}
          >
            Join our vibrant faith community. Share prayers, discover sermons, attend events,
            and grow spiritually with people who care about your journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <button
              onClick={() => navigateTo("/auth/register")}
              className="w-full md:w-auto rounded-xl px-8 md:px-10 py-3 md:py-4 text-sm md:text-base font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: gradients.primary,
                color: colors.text.primary,
                boxShadow: isDarkMode
                  ? `0 0 30px ${colors.glow.purple}`
                  : "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              Get Started
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigateTo("/auth/login")}
              className="w-full md:w-auto rounded-xl px-8 md:px-10 py-3 md:py-4 text-sm md:text-base font-semibold transition-all duration-200 hover:bg-white/10"
              style={{
                border: `1px solid ${colors.border.glass}`,
                color: colors.text.primary,
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-16 md:py-24 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-12 md:mb-16 text-center text-2xl md:text-4xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Explore Our Platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                ...glassmorphism.card,
                boxShadow: shadows.lg,
              }}
            >
              <div className="mb-4 inline-flex rounded-lg p-3 md:p-4" style={{ background: `${colors.accent.purple}20` }}>
                <BookOpen
                  className="h-6 w-6 md:h-8 md:w-8"
                  style={{ color: colors.accent.purple }}
                />
              </div>
              <h3 className="mb-3 md:mb-4 text-lg md:text-xl font-bold" style={{ color: colors.text.primary }}>
                Inspiring Sermons
              </h3>
              <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
                Access a library of powerful sermons designed to strengthen your faith and guide your spiritual journey.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                ...glassmorphism.card,
                boxShadow: shadows.lg,
              }}
            >
              <div className="mb-4 inline-flex rounded-lg p-3 md:p-4" style={{ background: `${colors.accent.pink}20` }}>
                <Heart
                  className="h-6 w-6 md:h-8 md:w-8"
                  style={{ color: colors.accent.pink }}
                />
              </div>
              <h3 className="mb-3 md:mb-4 text-lg md:text-xl font-bold" style={{ color: colors.text.primary }}>
                Prayer Community
              </h3>
              <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
                Share prayer requests, lift up one another, and experience the power of collective intercession.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                ...glassmorphism.card,
                boxShadow: shadows.lg,
              }}
            >
              <div className="mb-4 inline-flex rounded-lg p-3 md:p-4" style={{ background: `${colors.accent.blue}20` }}>
                <Users
                  className="h-6 w-6 md:h-8 md:w-8"
                  style={{ color: colors.accent.blue }}
                />
              </div>
              <h3 className="mb-3 md:mb-4 text-lg md:text-xl font-bold" style={{ color: colors.text.primary }}>
                Community Events
              </h3>
              <p style={{ color: colors.text.secondary }} className="text-sm md:text-base">
                Stay connected with church gatherings, events, and community activities that build unity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-16 md:py-24 md:px-6">
        <div
          className="mx-auto max-w-4xl rounded-3xl p-8 md:p-16 text-center"
          style={{
            ...glassmorphism.card,
            boxShadow: isDarkMode
              ? `0 0 40px ${colors.glow.purple}, inset 0 1px 1px rgba(255,255,255,0.1)`
              : `0 20px 60px rgba(0,0,0,0.1)`,
            border: `1px solid ${colors.border.active}`,
          }}
        >
          <h2
            className="mb-4 md:mb-6 text-2xl md:text-4xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Ready to Join Our Community?
          </h2>
          <p className="mb-8 md:mb-10 text-base md:text-lg" style={{ color: colors.text.secondary }}>
            Start your spiritual journey today and connect with a thriving faith community.
          </p>

          <button
            onClick={() => navigateTo("/auth/register")}
            className="rounded-xl px-10 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: gradients.primary,
              color: colors.text.primary,
              boxShadow: isDarkMode
                ? `0 0 30px ${colors.glow.purple}`
                : "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-4 py-8 md:py-12 md:px-6"
        style={{
          borderColor: colors.border.glass,
          background: `linear-gradient(180deg, transparent, ${colors.background.secondary})`,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
            <div>
              <h4 className="mb-4 font-semibold" style={{ color: colors.text.primary }}>
                Platform
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: colors.text.secondary }}>
                <li><a href="#" className="hover:text-white transition-colors">Sermons</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blogs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold" style={{ color: colors.text.primary }}>
                Community
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: colors.text.secondary }}>
                <li><a href="#" className="hover:text-white transition-colors">Prayers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Notifications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Members</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold" style={{ color: colors.text.primary }}>
                Support
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: colors.text.secondary }}>
                <li><a href="#" className="hover:text-white transition-colors">Help</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold" style={{ color: colors.text.primary }}>
                Legal
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: colors.text.secondary }}>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div
            className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-sm"
            style={{
              borderColor: colors.border.glass,
              color: colors.text.muted,
            }}
          >
            <p>&copy; 2026 WFC Community Platform. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
