/**
 * HOME PAGE / DASHBOARD
 * Main authenticated user dashboard
 * Shows spiritual community highlights, upcoming events, prayers
 * Glassmorphic design with immersive layout
 * Fully responsive for mobile/tablet/desktop
 */

import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../../hooks/useAuth";
import { Heart, BookOpen, Calendar, Users, Bell, Sparkles } from "lucide-react";

const Home = () => {
  const { isDarkMode, colors, glassmorphism, shadows, gradients } = useTheme();
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: "Recent Sermons",
      icon: BookOpen,
      color: colors.accent.blue,
      count: "12",
      items: ["Faith and Trust", "Grace in Trials", "Love Eternal"],
    },
    {
      title: "Active Prayers",
      icon: Heart,
      color: colors.accent.pink,
      count: "28",
      items: ["Healing Requests", "Thanksgiving", "Guidance"],
    },
    {
      title: "Upcoming Events",
      icon: Calendar,
      color: colors.accent.purple,
      count: "5",
      items: ["Sunday Service", "Prayer Meeting", "Bible Study"],
    },
  ];

  const bibleVerse = {
    text: '"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."',
    reference: "John 3:16",
  };

  const communityStats = [
    { label: "Community Members", value: "2,847" },
    { label: "Active Prayers", value: "156" },
    { label: "Sermons Shared", value: "234" },
    { label: "Events This Month", value: "18" },
  ];

  return (
    <div className="min-h-screen" style={{ background: colors.background.primary }}>
      {/* Welcome Section */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.text.primary }}>
          Welcome back, {user?.name?.split(" ")[0] || "Friend"}
        </h1>
        <p className="mt-2 text-base md:text-lg" style={{ color: colors.text.secondary }}>
          May your day be filled with blessings and spiritual growth
        </p>
      </div>

      {/* Bible Verse Section */}
      <div
        className="mb-8 md:mb-12 rounded-2xl p-6 md:p-8 text-center"
        style={{
          ...glassmorphism.card,
          boxShadow: isDarkMode
            ? `0 0 30px ${colors.glow.purple}, inset 0 1px 1px rgba(255,255,255,0.1)`
            : `0 8px 20px rgba(0,0,0,0.08)`,
          border: `1px solid ${colors.border.active}`,
        }}
      >
        <Sparkles className="mx-auto mb-4 h-6 w-6" style={{ color: colors.accent.purple }} />
        <p className="mb-4 text-base md:text-lg italic" style={{ color: colors.text.primary }}>
          {bibleVerse.text}
        </p>
        <p className="text-sm md:text-base font-semibold" style={{ color: colors.text.secondary }}>
          {bibleVerse.reference}
        </p>
      </div>

      {/* Main Dashboard Cards */}
      <div className="mb-8 md:mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {dashboardCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                ...glassmorphism.card,
                boxShadow: shadows.lg,
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="rounded-lg p-3 md:p-4"
                  style={{ background: `${card.color}20` }}
                >
                  <Icon
                    className="h-6 w-6 md:h-8 md:w-8"
                    style={{ color: card.color }}
                  />
                </div>
                <span
                  className="rounded-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-bold"
                  style={{
                    background: `${card.color}20`,
                    color: card.color,
                  }}
                >
                  {card.count}
                </span>
              </div>
              <h3
                className="mb-3 md:mb-4 text-lg md:text-xl font-bold"
                style={{ color: colors.text.primary }}
              >
                {card.title}
              </h3>
              <ul className="space-y-2 text-sm md:text-base" style={{ color: colors.text.secondary }}>
                {card.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* About Church Section */}
      <div className="mb-8 md:mb-12">
        <h2
          className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold"
          style={{ color: colors.text.primary }}
        >
          About Our Community
        </h2>
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{
            ...glassmorphism.card,
            boxShadow: shadows.md,
          }}
        >
          <p
            className="mb-4 text-base md:text-lg"
            style={{ color: colors.text.primary }}
          >
            We are a vibrant spiritual community dedicated to growing together in faith, sharing the Gospel,
            and supporting one another through prayer and fellowship.
          </p>
          <p
            className="text-base md:text-lg"
            style={{ color: colors.text.secondary }}
          >
            Our mission is to create a welcoming space where believers can deepen their relationship with God,
            discover biblical wisdom through sermons and teachings, and build meaningful connections with their brothers
            and sisters in Christ.
          </p>
        </div>
      </div>

      {/* Community Stats */}
      <div className="mb-8 md:mb-12">
        <h2
          className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Community Highlights
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {communityStats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-xl p-4 md:p-6 text-center"
              style={{
                ...glassmorphism.card,
                boxShadow: shadows.sm,
              }}
            >
              <p
                className="text-2xl md:text-3xl font-bold"
                style={{
                  background: gradients.primary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </p>
              <p
                className="mt-2 text-xs md:text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12 md:mb-16">
        <h2
          className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <button
            className="rounded-xl px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold transition-all duration-200 hover:scale-105 text-center"
            style={{
              background: gradients.primary,
              color: colors.text.primary,
              boxShadow: isDarkMode
                ? `0 0 20px ${colors.glow.purple}`
                : "0 8px 20px rgba(0,0,0,0.1)",
            }}
          >
            Share a Prayer Request
          </button>
          <button
            className="rounded-xl px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold transition-all duration-200 hover:scale-105 text-center"
            style={{
              border: `2px solid ${colors.accent.pink}`,
              color: colors.accent.pink,
              background: "transparent",
            }}
          >
            Browse Upcoming Events
          </button>
        </div>
      </div>

      {/* Meetings Section */}
      <div className="mb-12 md:mb-16">
        <h2
          className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Weekly Gatherings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              name: "Sunday Worship Service",
              time: "9:00 AM - 11:00 AM",
              location: "Main Sanctuary",
              icon: Users,
            },
            {
              name: "Midweek Prayer & Study",
              time: "7:00 PM - 8:30 PM",
              location: "Fellowship Hall",
              icon: Heart,
            },
            {
              name: "Youth Group",
              time: "6:00 PM - 8:00 PM",
              location: "Youth Center",
              icon: Users,
            },
            {
              name: "Bible Study Circle",
              time: "10:00 AM - 11:30 AM",
              location: "Study Room",
              icon: BookOpen,
            },
          ].map((meeting, idx) => {
            const MeetingIcon = meeting.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-6 md:p-8"
                style={{
                  ...glassmorphism.card,
                  boxShadow: shadows.md,
                }}
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <div
                    className="rounded-lg p-3 md:p-4"
                    style={{ background: `${colors.accent.blue}20` }}
                  >
                    <MeetingIcon
                      className="h-6 w-6 md:h-8 md:w-8"
                      style={{ color: colors.accent.blue }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="mb-2 text-lg md:text-xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {meeting.name}
                    </h3>
                    <p
                      className="mb-1 text-sm md:text-base"
                      style={{ color: colors.text.secondary }}
                    >
                      {meeting.time}
                    </p>
                    <p
                      className="text-sm md:text-base"
                      style={{ color: colors.text.muted }}
                    >
                      📍 {meeting.location}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
