import { ChevronRight, Heart, BookOpen, Users, Church, Calendar, Sparkles, ArrowRight, MessageCircle, Share2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* ══════════════════════════════════════════════════════ */}
      {/* NAVBAR - Ultra Clean Enterprise */}
      {/* ══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-gray-900 tracking-tight">WFC</span>
                <span className="text-xs font-medium text-gray-400 hidden sm:inline">Community</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {["Features", "Sermons", "Events", "Community"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/auth/login")}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO SECTION - Bold & Minimal */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Welcome to WFC Community</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900">
                Growing Together
                <span className="block text-blue-600">in Faith</span>
              </h1>

              <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                Join a thriving community of believers. Share prayers, discover inspiring sermons, 
                attend meaningful events, and strengthen your spiritual journey together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/auth/register")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Join Our Community
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Sign In
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                {[
                  { icon: Users, label: "2,847+ Active Members" },
                  { icon: BookOpen, label: "234+ Sermons" },
                  { icon: Heart, label: "156+ Prayers" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: "Watch Sermons", desc: "Inspiring messages" },
                { icon: Heart, title: "Share Prayers", desc: "Community support" },
                { icon: Calendar, title: "Join Events", desc: "Connect & grow" },
                { icon: Users, title: "Community", desc: "Build relationships" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* FEATURES SECTION - Clean Grid */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 text-gray-900">Everything You Need</h2>
            <p className="text-lg text-gray-600">Tools designed to deepen your faith and connect with our community.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Watch Sermons",
                desc: "Access our library of powerful, inspiring sermons designed to strengthen your faith.",
                color: "blue",
              },
              {
                icon: Heart,
                title: "Share Prayers",
                desc: "Lift up one another with prayer requests and experience collective intercession.",
                color: "rose",
              },
              {
                icon: Calendar,
                title: "Join Events",
                desc: "Stay connected with meaningful church gatherings and community activities.",
                color: "amber",
              },
              {
                icon: Users,
                title: "Community",
                desc: "Connect with fellow believers and grow together in faith as one body.",
                color: "emerald",
              },
              {
                icon: Church,
                title: "Church News",
                desc: "Stay informed with the latest updates and announcements from your church.",
                color: "violet",
              },
              {
                icon: Sparkles,
                title: "Daily Inspiration",
                desc: "Receive uplifting content and scripture to nourish your spirit every day.",
                color: "cyan",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              const colorMap = {
                blue: "bg-blue-50 text-blue-600",
                rose: "bg-rose-50 text-rose-600",
                amber: "bg-amber-50 text-amber-600",
                emerald: "bg-emerald-50 text-emerald-600",
                violet: "bg-violet-50 text-violet-600",
                cyan: "bg-cyan-50 text-cyan-600",
              };
              return (
                <div
                  key={feature.title}
                  className="group p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${colorMap[feature.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS / SOCIAL PROOF */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 text-gray-900">What Our Community Says</h2>
            <p className="text-lg text-gray-600">Real stories from real people in our faith family.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "This platform has completely transformed my spiritual life. The sermons and community support are incredible.",
                author: "Sarah Johnson",
                role: "Active Member",
              },
              {
                quote: "I've never felt more connected to a church community. The prayer wall and events keep me engaged every day.",
                author: "Michael Chen",
                role: "Prayer Group Leader",
              },
              {
                quote: "The daily devotionals and sermon library have been a game-changer for my family's faith journey.",
                author: "Emily Rodriguez",
                role: "Ministry Volunteer",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex gap-1 text-blue-500 mb-4">★★★★★</div>
                <p className="text-gray-600 leading-relaxed mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CTA SECTION - Bold Enterprise */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden p-12 md:p-16 text-center bg-gray-900">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Deepen Your Faith?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of believers in our community today. It's completely free to get started.
              </p>
              <button
                onClick={() => navigate("/auth/register")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-base font-semibold text-gray-900 bg-white hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
              >
                Create Your Free Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* FOOTER - Professional */}
      {/* ══════════════════════════════════════════════════════ */}
      <footer className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                title: "Platform",
                links: ["Sermons", "Blogs", "Events", "Devotionals"],
              },
              {
                title: "Community",
                links: ["Prayers", "Members", "Groups", "Forum"],
              },
              {
                title: "Support",
                links: ["Contact", "FAQ", "Help Center", "Guidelines"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Use", "Cookie Policy", "Accessibility"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-gray-900 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm border-t border-gray-100">
            <p className="text-gray-500">&copy; 2026 WFC Community Platform. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              {["Twitter", "Facebook", "Instagram", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
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