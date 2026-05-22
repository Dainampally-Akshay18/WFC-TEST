# Church Admin Frontend - Authentication Module

## ✅ Implementation Complete

The authentication frontend module has been fully implemented and integrated with the backend APIs.

## 🎯 Features Implemented

### Authentication Pages
- ✅ **Login** - Email/password authentication with validation
- ✅ **Signup** - User registration with branch selection
- ✅ **Forgot Password** - Password reset request flow
- ✅ **Reset Password** - Password reset with token validation
- ✅ **Verify OTP** - 6-digit OTP verification (if needed)

### Core Features
- ✅ JWT token management
- ✅ Protected routing
- ✅ Public routing
- ✅ Token persistence in localStorage
- ✅ Auto-redirect after login to `/dashboard`
- ✅ Auto-redirect to login on 401 errors
- ✅ Form validation with error messages
- ✅ Loading states
- ✅ Toast notifications
- ✅ Password visibility toggle
- ✅ Glassmorphism UI design
- ✅ Light/Dark theme support

### API Integration
- ✅ Axios client with interceptors
- ✅ Auth service layer
- ✅ Token management
- ✅ Error handling
- ✅ Response formatting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Navigate to the frontend directory
cd church-admin-frontend

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Authentication Flow

### 1. Signup Flow
1. User visits `/signup`
2. Fills in: Name, Email, Branch, Password
3. Submits form
4. Account created with PENDING status
5. Redirected to login with message
6. Must wait for admin approval

### 2. Login Flow
1. User visits `/login`
2. Enters email and password
3. Backend validates credentials
4. If approved: JWT token returned
5. Token stored in localStorage
6. User redirected to `/dashboard`
7. If not approved: Error message shown

### 3. Forgot Password Flow
1. User visits `/forgot-password`
2. Enters email address
3. Backend sends reset link to email
4. User clicks link in email
5. Redirected to `/reset-password/:token`
6. Enters new password
7. Password updated
8. Redirected to login

### 4. Protected Routes
- All routes under `/dashboard` require authentication
- If not authenticated, user is redirected to `/login`
- Token is validated on every protected request
- If token expires, user is logged out automatically

## 📁 File Structure

```
church-admin-frontend/src/
├── api/
│   ├── client/axiosClient.js          # Axios instance with interceptors
│   ├── endpoints/auth.endpoints.js    # Auth API endpoints
│   ├── services/auth.service.js       # Auth service methods
│   ├── interceptors/                  # Request/response interceptors
│   └── utils/tokenManager.js          # Token storage utilities
├── context/
│   └── AuthContext.jsx                # Auth state management
├── hooks/
│   └── useAuth.js                     # Auth hook
├── pages/auth/
│   ├── Login.jsx                      # Login page
│   ├── Signup.jsx                     # Signup page
│   ├── ForgotPassword.jsx             # Forgot password page
│   ├── ResetPassword.jsx              # Reset password page
│   └── VerifyOtp.jsx                  # OTP verification page
├── routes/
│   ├── AppRouter.jsx                  # Main router
│   ├── ProtectedRoute.jsx             # Protected route wrapper
│   └── PublicRoute.jsx                # Public route wrapper
└── utils/
    └── toast.js                       # Toast notification system
```

## 🎨 UI/UX Features

### Glassmorphism Design
- Translucent cards with blur effects
- Soft gradients
- Smooth animations
- Premium feel

### Form Validation
- Real-time validation
- Clear error messages
- Field-level error display
- Submit button disabled until valid

### Loading States
- Spinner animations
- Disabled inputs during loading
- Loading text feedback

### Toast Notifications
- Success messages (green)
- Error messages (red)
- Auto-dismiss after 4 seconds
- Slide-in/out animations

## 🔧 Configuration

### Environment Variables
Create `.env` file in `church-admin-frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ENV=development
```

### API Base URL
The API base URL is configured in:
- `src/config/env.js`
- `src/api/client/axiosClient.js`

Default: `http://localhost:5000/api`

## 🧪 Testing the Authentication

### Test Signup
1. Go to `http://localhost:5173/signup`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Branch: Main Branch
   - Password: password123
3. Submit
4. Should see success message
5. Account created with PENDING status

### Test Login (After Admin Approval)
1. Go to `http://localhost:5173/login`
2. Enter credentials
3. If approved: Redirected to dashboard
4. If pending: Error message shown

### Test Forgot Password
1. Go to `http://localhost:5173/forgot-password`
2. Enter email
3. Check email for reset link
4. Click link
5. Enter new password
6. Login with new password

## 🔒 Security Features

- ✅ Passwords never stored in plain text
- ✅ JWT tokens stored in localStorage
- ✅ Tokens sent in Authorization header
- ✅ Auto-logout on token expiration
- ✅ Protected routes require authentication
- ✅ CORS configured on backend
- ✅ Input validation on frontend and backend

## 📝 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/signup` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/logout` | POST | User logout |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password/:token` | POST | Reset password |
| `/auth/verify-otp` | POST | Verify OTP |
| `/auth/resend-otp` | POST | Resend OTP |
| `/auth/me` | GET | Get current user |
| `/auth/profile` | PUT | Update profile |

## 🎯 Next Steps

The authentication module is complete and ready for use. You can now:

1. ✅ Test the authentication flow
2. ✅ Integrate with backend
3. ⏳ Implement other modules (events, blogs, sermons, etc.)
4. ⏳ Add more features to dashboard
5. ⏳ Implement admin user management

## 🐛 Troubleshooting

### Cannot connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration on backend
- Verify API base URL in `.env`

### Token not persisting
- Check browser localStorage
- Ensure token is being saved in `tokenManager.js`
- Check browser console for errors

### Login redirects to login page
- Check if user status is APPROVED
- Verify token is valid
- Check backend logs for errors

## 📞 Support

For issues or questions, check:
- Backend API documentation
- Browser console for errors
- Network tab for API calls
- Backend logs for server errors
