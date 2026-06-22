import {
  Home,
  BookOpen,
  FileText,
  Calendar,
  Heart,
  Bell,
  User,
  Settings,
} from "lucide-react";

export const navigationItems = [
  { label: "Home", icon: Home, path: "/home" },
  { label: "Sermons", icon: BookOpen, path: "/sermons" },
  { label: "Blogs", icon: FileText, path: "/blogs" },
  { label: "Events", icon: Calendar, path: "/events" },
  { label: "Prayers", icon: Heart, path: "/prayers" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
];

export const accountItems = [
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/profile/settings" },
];
