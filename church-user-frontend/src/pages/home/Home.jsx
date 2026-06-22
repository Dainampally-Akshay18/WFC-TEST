import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Heart, BookOpen, Calendar, Users, Bell, Sparkles } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Recent Sermons",
      icon: BookOpen,
      count: "12",
      color: "blue",
      items: ["Faith and Trust", "Grace in Trials", "Love Eternal"],
      path: "/sermons",
    },
    {
      title: "Active Prayers",
      icon: Heart,
      count: "28",
      color: "rose",
      items: ["Healing Requests", "Thanksgiving", "Guidance"],
      path: "/prayers",
    },
    {
      title: "Upcoming Events",
      icon: Calendar,
      count: "5",
      color: "amber",
      items: ["Sunday Service", "Prayer Meeting", "Bible Study"],
      path: "/events",
    },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", badge: "bg-rose-100 text-rose-700" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
  };

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
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "Friend"}
        </h1>
        <p className="mt-1 text-gray-500">
          May your day be filled with blessings and spiritual growth
        </p>
      </div>

      {/* Bible Verse */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 text-center">
        <Sparkles className="mx-auto mb-3 h-5 w-5 text-blue-500" />
        <p className="text-gray-700 italic leading-relaxed mb-2">{bibleVerse.text}</p>
        <p className="text-sm font-semibold text-blue-600">{bibleVerse.reference}</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-lg p-3 ${c.bg}`}>
                  <Icon className={`h-5 w-5 ${c.text}`} />
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${c.badge}`}>
                  {card.count}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-500">
                {card.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Community Stats */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Community Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {communityStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 p-5 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/prayers/create")}
            className="rounded-xl px-6 py-5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow-md text-center"
          >
            Share a Prayer Request
          </button>
          <button
            onClick={() => navigate("/events")}
            className="rounded-xl px-6 py-5 text-base font-semibold text-blue-600 bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
          >
            Browse Upcoming Events
          </button>
        </div>
      </div>

      {/* Weekly Gatherings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Gatherings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Sunday Worship Service", time: "9:00 AM - 11:00 AM", location: "Main Sanctuary", icon: Users },
            { name: "Midweek Prayer & Study", time: "7:00 PM - 8:30 PM", location: "Fellowship Hall", icon: Heart },
            { name: "Youth Group", time: "6:00 PM - 8:00 PM", location: "Youth Center", icon: Users },
            { name: "Bible Study Circle", time: "10:00 AM - 11:30 AM", location: "Study Room", icon: BookOpen },
          ].map((meeting) => {
            const MeetingIcon = meeting.icon;
            return (
              <div
                key={meeting.name}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg p-3 bg-blue-50">
                    <MeetingIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{meeting.name}</h3>
                    <p className="text-sm text-gray-500">{meeting.time}</p>
                    <p className="text-sm text-gray-400">📍 {meeting.location}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-3">About Our Community</h2>
        <p className="text-gray-600 mb-3">
          We are a vibrant spiritual community dedicated to growing together in faith, sharing the Gospel,
          and supporting one another through prayer and fellowship.
        </p>
        <p className="text-gray-500">
          Our mission is to create a welcoming space where believers can deepen their relationship with God,
          discover biblical wisdom through sermons and teachings, and build meaningful connections with their
          brothers and sisters in Christ.
        </p>
      </div>
    </div>
  );
};

export default Home;
