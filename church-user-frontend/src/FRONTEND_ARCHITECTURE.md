# FRONTEND ARCHITECTURE GUIDE

## Overview

This document describes the complete frontend architecture for the WFC (Church Platform) React application. It's built with modern, production-grade patterns following enterprise architecture best practices.

---

## Architecture Principles

### 1. **Separation of Concerns**
- **API Layer**: All backend communication isolated in `src/api/`
- **Business Logic**: Centralized in `src/hooks/` and `src/services/`
- **UI Layer**: Clean JSX components with no API logic
- **State Management**: Zustand stores for global state

### 2. **Scalability**
- Feature-based folder structure in `src/pages/`
- Modular, reusable components
- Centralized configuration and constants
- No hardcoded URLs or colors

### 3. **Type Safety & Consistency**
- Centralized theme system
- Consistent API endpoint definitions
- Role-based access control constants
- Validation utilities

### 4. **Dark/Light Mode Support**
- Dual theme configuration
- Theme persistence via localStorage
- Tailwind CSS dark mode utilities
- Smooth theme switching

---

## Project Structure

```
src/
├── api/                    # API client and endpoints
│   └── axios.js           # Axios instance with interceptors
├── hooks/                 # Custom React hooks
│   ├── useAuth.js        # Auth state hook
│   ├── useTheme.js       # Theme management hook
│   └── [feature].js      # Feature-specific hooks (coming)
├── pages/                 # Feature-based pages
│   ├── auth/             # Authentication pages
│   ├── sermons/          # Sermon pages
│   ├── blogs/            # Blog pages
│   └── [feature]/        # Other features
├── layouts/              # Layout components
│   ├── Navbar.jsx        # Top navigation
│   ├── Sidebar.jsx       # Left sidebar
│   └── MainLayout.jsx    # Primary layout
├── routes/               # Routing system
│   ├── AppRoutes.jsx     # Route configuration
│   ├── ProtectedRoute.jsx # Auth guard
│   ├── PublicRoute.jsx   # Public route guard
│   └── RoleBasedRoute.jsx # Role-based access
├── store/                # Zustand stores
│   ├── themeStore.js     # Theme state management
│   ├── authStore.js      # Auth state management
│   └── uiStore.js        # UI state management
├── theme/                # Design system
│   ├── colors.js         # Color palette
│   ├── darkTheme.js      # Dark mode config
│   ├── lightTheme.js     # Light mode config
│   ├── gradients.js      # Gradient presets
│   ├── glassmorphism.js  # Glass effect presets
│   ├── shadows.js        # Shadow effects
│   └── typography.js     # Font system
├── context/              # React context
│   └── ThemeProvider.jsx # Theme provider
├── services/             # Utility services
│   ├── token.service.js  # JWT management
│   └── localStorage.service.js
├── utils/                # Utility functions
│   ├── validation.js     # Form validation
│   ├── formatters.js     # Data formatting
│   └── permissions.js    # Role-based checks
├── constants/            # App constants
│   ├── api.constants.js  # API endpoints
│   ├── route.constants.js # Route paths
│   └── role.constants.js # User roles
├── config/               # Configuration files
│   ├── app.config.js     # App settings
│   └── theme.config.js   # Theme settings
├── App.jsx              # Root component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

---

## Core Systems

### 1. Theme System

**Location**: `src/theme/`

The theme system provides a centralized design system with dual-mode support.

#### Usage Example:
```javascript
// In a component
import { useTheme } from '../context/ThemeProvider';

function MyComponent() {
  const { colors, isDarkMode, currentTheme } = useTheme();

  return (
    <div style={{ 
      background: isDarkMode ? colors.background.primary : colors.background.secondary 
    }}>
      Content
    </div>
  );
}
```

#### Key Files:
- `colors.js` - Color palette for both themes
- `darkTheme.js` - Dark mode configuration
- `lightTheme.js` - Light mode configuration
- `gradients.js` - Gradient presets
- `glassmorphism.js` - Glass effect styles
- `shadows.js` - Shadow effects
- `typography.js` - Font definitions

### 2. State Management

**Location**: `src/store/`

Uses Zustand for lightweight, efficient state management.

#### Stores:

**themeStore.js**
- Manages dark/light mode state
- Persists theme to localStorage
- Provides toggle functionality

```javascript
import { useThemeStore } from '../store/themeStore';

function Component() {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
}
```

**authStore.js**
- Manages user authentication state
- Handles login/logout
- Stores user info and token

```javascript
import { useAuthStore } from '../store/authStore';

function Component() {
  const { user, isAuthenticated, logout } = useAuthStore();
}
```

**uiStore.js**
- Manages UI state (sidebar, modals, etc.)
- Notification management
- UI-related flags

### 3. API Layer

**Location**: `src/api/axios.js`

Centralized HTTP client with automatic token injection and error handling.

#### Features:
- Automatic Bearer token injection
- Request/response interceptors
- Automatic 401 logout
- Type-safe error handling
- Configurable timeouts

#### Usage:
```javascript
// In API files - NOT in JSX
import apiClient from '../api/axios';

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
};
```

### 4. Routing System

**Location**: `src/routes/`

Three-tier routing approach:

#### AppRoutes.jsx
Central route configuration with all route definitions.

#### ProtectedRoute.jsx
Wrapper for authenticated routes. Redirects to login if not authenticated.

```javascript
<Route 
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

#### RoleBasedRoute.jsx
Wrapper for role-restricted routes.

```javascript
<Route 
  path="/admin"
  element={
    <RoleBasedRoute requiredRoles={['MASTER_ADMIN']}>
      <AdminPanel />
    </RoleBasedRoute>
  }
/>
```

### 5. Layouts

**Location**: `src/layouts/`

Reusable layout components for consistent UI structure.

#### Components:
- `Navbar.jsx` - Top navigation with theme toggle
- `Sidebar.jsx` - Left navigation with menu items
- `MainLayout.jsx` - Primary layout combining navbar + sidebar + content

---

## Configuration

### Environment Variables

Create `.env` file in project root:

```
VITE_API_URL=http://localhost:5000/api
```

### app.config.js

Central application configuration:

```javascript
{
  api: { baseURL, timeout },
  auth: { tokenKey, expiry },
  pagination: { pageSize, defaultPage },
  cache: { staleTime, gcTime },
  features: { darkMode, notifications },
  validation: { minPasswordLength, maxEmailLength }
}
```

---

## Usage Patterns

### 1. Creating a Custom Hook

Location: `src/hooks/useFeature.js`

```javascript
import { useQuery } from '@tanstack/react-query';
import { featureAPI } from '../api/feature.api';

export const useFeature = () => {
  return useQuery({
    queryKey: ['feature'],
    queryFn: () => featureAPI.getAll(),
  });
};
```

### 2. Creating an API Module

Location: `src/api/feature.api.js`

```javascript
import apiClient from './axios';

export const featureAPI = {
  getAll: () => apiClient.get('/feature'),
  getOne: (id) => apiClient.get(`/feature/${id}`),
  create: (data) => apiClient.post('/feature', data),
  update: (id, data) => apiClient.put(`/feature/${id}`, data),
  delete: (id) => apiClient.delete(`/feature/${id}`),
};
```

### 3. Using Theme in Components

```javascript
import { useTheme } from '../hooks/useTheme';

function ThemedComponent() {
  const { 
    isDarkMode, 
    colors, 
    gradients, 
    glassmorphism,
    toggleTheme 
  } = useTheme();

  return (
    <div
      style={{
        background: colors.background.primary,
        ...glassmorphism.card,
      }}
      className={`p-4 rounded-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
    >
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### 4. Protected Route Pattern

```javascript
<Route 
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Best Practices

### ✅ DO:

1. **Use centralized constants**
   ```javascript
   import { ROUTES } from '../constants/route.constants';
   navigate(ROUTES.HOME);
   ```

2. **Separate API logic from JSX**
   ```javascript
   // api/blog.api.js
   export const blogAPI = { ... };

   // hooks/useBlog.js
   export const useBlog = () => { ... };

   // pages/Blog.jsx
   function Blog() {
     const { data } = useBlog();
   }
   ```

3. **Use theme variables**
   ```javascript
   const { colors, glassmorphism } = useTheme();
   // Style based on theme configuration
   ```

4. **Apply RBAC properly**
   ```javascript
   import { RoleBasedRoute } from '../routes/RoleBasedRoute';
   // Wrap sensitive routes
   ```

### ❌ DON'T:

1. **Hardcode colors**
   ```javascript
   // BAD
   className="bg-purple-500"

   // GOOD
   style={{ background: colors.accent.purple }}
   ```

2. **API calls in JSX**
   ```javascript
   // BAD - In component file
   const data = axios.get('/api/data');

   // GOOD - In hook/API file
   const { data } = useBlogData();
   ```

3. **Hardcode URLs**
   ```javascript
   // BAD
   axios.get('http://localhost:5000/api/blog');

   // GOOD
   import { API_ENDPOINTS } from '../constants/api.constants';
   axios.get(API_ENDPOINTS.BLOG.GET_ALL);
   ```

4. **Mix concerns**
   - Keep API logic separate
   - Keep business logic in hooks
   - Keep UI logic in components

---

## Testing Checklist

- [ ] Dark/light mode toggle works
- [ ] Protected routes redirect to login
- [ ] Theme persists after refresh
- [ ] API calls include auth token
- [ ] 401 responses redirect to login
- [ ] Role-based routes work
- [ ] Sidebar toggle functions
- [ ] All colors match design spec
- [ ] Responsive on mobile
- [ ] No hardcoded URLs in code

---

## Next Steps

1. **Create Feature Modules** - Implement sermon, blog, event, etc.
2. **Implement Auth Pages** - Login, register, password reset
3. **Add Error Pages** - 404, 500, unauthorized
4. **Build Feature Pages** - Using established patterns
5. **Add Form Validation** - Using validation utilities
6. **Implement Notifications** - Using notification store

---

## Important Notes

✨ **This is production-grade foundation code** - All systems are fully configured and ready for feature implementation.

🎨 **Theme System** - Completely centralized. Change colors in ONE place to update everywhere.

🔒 **Security** - Token management, RBAC, and route protection all in place.

⚡ **Performance** - React Query caching, Zustand lightweight state, optimized re-renders.

📱 **Responsive** - Tailwind CSS utilities + custom breakpoints built-in.

