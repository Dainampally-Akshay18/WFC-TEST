# UPDATED BEST STRUCTURE (THEME-AWARE)

```txt id="r6j6qe"
src/
│
├── api/
│   ├── axios.js
│   ├── auth.api.js
│   ├── blog.api.js
│   ├── sermon.api.js
│   ├── prayer.api.js
│   ├── event.api.js
│   ├── notification.api.js
│   └── user.api.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useTheme.js
│   ├── useBlogs.js
│   ├── useSermons.js
│   ├── useEvents.js
│   ├── usePrayers.js
│   ├── useNotifications.js
│   └── useUser.js
│
├── pages/
│   │
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   └── VerifyOTP.jsx
│   │
│   ├── home/
│   │   └── Home.jsx
│   │
│   ├── sermons/
│   │   ├── Sermons.jsx
│   │   ├── SermonDetails.jsx
│   │   ├── SermonCategory.jsx
│   │   └── WatchSermon.jsx
│   │
│   ├── blogs/
│   │   ├── Blogs.jsx
│   │   ├── BlogDetails.jsx
│   │   ├── BlogSearch.jsx
│   │   └── BlogTags.jsx
│   │
│   ├── events/
│   │   ├── Events.jsx
│   │   ├── EventDetails.jsx
│   │   ├── UpcomingEvents.jsx
│   │   └── BranchEvents.jsx
│   │
│   ├── prayers/
│   │   ├── Prayers.jsx
│   │   ├── PrayerDetails.jsx
│   │   ├── CreatePrayer.jsx
│   │   └── MyPrayers.jsx
│   │
│   ├── notifications/
│   │   ├── Notifications.jsx
│   │   └── NotificationDetails.jsx
│   │
│   ├── profile/
│   │   ├── Profile.jsx
│   │   ├── EditProfile.jsx
│   │   ├── ChangePassword.jsx
│   │   └── Settings.jsx
│   │
│   ├── user-activity/
│   │   ├── Activity.jsx
│   │   ├── PrayerActivity.jsx
│   │   ├── EventActivity.jsx
│   │   └── NotificationActivity.jsx
│   │
│   ├── errors/
│   │   ├── NotFound.jsx
│   │   ├── Unauthorized.jsx
│   │   └── ServerError.jsx
│   │
│   └── dashboard/
│       └── Dashboard.jsx
│
├── layouts/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── MobileSidebar.jsx
│   ├── Footer.jsx
│   ├── MainLayout.jsx
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
│
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   └── RoleBasedRoute.jsx
│
├── store/
│   ├── authStore.js
│   ├── notificationStore.js
│   ├── themeStore.js
│   ├── userStore.js
│   └── uiStore.js
│
├── theme/
│   ├── colors.js
│   ├── darkTheme.js
│   ├── lightTheme.js
│   ├── gradients.js
│   ├── shadows.js
│   ├── glassmorphism.js
│   └── typography.js
│
├── config/
│   ├── theme.config.js
│   ├── app.config.js
│   └── env.config.js
│
├── services/
│   ├── token.service.js
│   ├── localStorage.service.js
│   ├── notification.service.js
│   └── theme.service.js
│
├── utils/
│   ├── formatDate.js
│   ├── formatTime.js
│   ├── debounce.js
│   ├── truncateText.js
│   ├── validation.js
│   ├── permissions.js
│   └── helpers.js
│
├── constants/
│   ├── api.constants.js
│   ├── route.constants.js
│   ├── role.constants.js
│   ├── theme.constants.js
│   └── app.constants.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   ├── backgrounds/
│   └── animations/
│
├── context/
│   └── ThemeProvider.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# MOST IMPORTANT NEW FOLDERS

---

# 1. `theme/`

THIS becomes the heart of your design system.

VERY important now.

---

# Example

## darkTheme.js

```js id="t50u1r"
export const darkTheme = {
  background: "#05010A",
  card: "#12051F",
  primary: "#B026FF",
};
```

---

## lightTheme.js

```js id="h4k97k"
export const lightTheme = {
  background: "#F8F5FF",
  card: "#FFFFFF",
  primary: "#6D28D9",
};
```

---

# WHY This Is Powerful

Now entire app colors are centralized.

Changing theme later becomes EASY.

---

# 2. `themeStore.js`

VERY important.

Handles:

* dark/light mode state
* persistence
* toggling

---

# Example

```js id="nqew2m"
theme: "dark"
toggleTheme()
```

---

# 3. `ThemeProvider.jsx`

Wraps app.

Controls:

* theme classes
* dark/light state
* persistence

---

# 4. `glassmorphism.js`

VERY smart for your UI style.

Contains reusable:

* blur values
* transparency values
* border styles
* glow presets

---

# Example

```js id="yjlwmc"
export const glassCard = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
};
```

---

# WHY This Architecture Is BETTER

Because now your app becomes:

| Before               | After                    |
| -------------------- | ------------------------ |
| functional structure | design-system structure  |
| basic frontend       | scalable UI system       |
| pages only           | theme-aware architecture |
| scattered colors     | centralized theming      |

---

# MOST IMPORTANT RECOMMENDATION

## DO NOT Hardcode Colors Everywhere

BAD:

```jsx id="0hcrkg"
className="bg-purple-500"
```

BETTER:

```jsx id="x0vdhj"
className={theme.primaryButton}
```

OR use:

* CSS variables
* Tailwind config extension

VERY important for scalability.

---

# BEST THING FOR YOU

Since you use Tailwind:

You should later extend:

```txt id="28lc2q"
tailwind.config.js
```

with:

* dark colors
* light colors
* gradients
* shadows

This is the PROPER way.

---




