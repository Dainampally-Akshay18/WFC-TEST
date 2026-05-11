# 🔐 AUTH MODULE - QUICK REFERENCE

## 👤 User Roles

| Role | Can Approve | Can Access | Branch | Status | Created By |
|------|-----------|-----------|--------|--------|-----------|
| **MASTER_ADMIN** | ✅ Any user | All | null | APPROVED | System |
| **LEADER** | ⏳ Plan for v2 | Own branch | Required | PENDING→APPROVED | Admin |
| **USER** | ❌ No | Own data | Required | PENDING→APPROVED | Admin |

---

## 📝 User Status Flow

```
SIGNUP
  ↓
PENDING (awaits admin)
  ↓
  ├─→ APPROVED → Can login ✅
  └─→ REJECTED → Cannot login ❌
```

---

## 🔐 API Endpoints

### Public
- `POST /auth/signup` - Create account
- `POST /auth/login` - Get JWT
- `POST /auth/forgot-password` - Request reset
- `POST /auth/reset-password/:token` - New password

### Protected
- `GET /auth/me` - Current user
- `PUT /auth/profile` - Update name

### Admin Only
- `GET /auth/pending-users`
- `GET /auth/user/:userId`
- `PUT /auth/approve-user/:userId`
- `PUT /auth/reject-user/:userId`
- `PUT /auth/promote-user/:userId`

---

## 📧 JWT Payload

```javascript
{
  userId: "...",
  role: "USER" | "LEADER" | "MASTER_ADMIN",
  branch: "BRANCH1" | "BRANCH2" | null,
  iat: 1234567890,
  exp: 1234654290  // 7 days
}
```

---

## 🧩 Middleware Usage

```javascript
// Public route
app.post('/auth/login', authController.login);

// Protected route
app.get('/auth/me',
  authMiddleware,
  authController.getCurrentUser
);

// Admin only
app.get('/auth/pending-users',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  authController.getPendingUsers
);

// With validation
app.post('/auth/signup',
  validateRequest(signupSchema),
  authController.signup
);
```

---

## 🚀 Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure .env
cp .env.example .env
# Edit: MONGODB_URI, JWT_SECRET, SENDGRID_API_KEY

# 3. Create admin
node scripts/seed-admin.js

# 4. Start server
npm start

# 5. Test
# POST /api/auth/signup
# POST /api/auth/login
# etc.
```

---

## ✅ Approval Workflow

1. **User Signup** → Status: PENDING
2. **Admin Views** → GET /pending-users
3. **Admin Approves** → PUT /approve-user/:userId
4. **User Gets Email** → Approval notification
5. **User Can Login** → Account now accessible

---

## 🔑 Password Reset Flow

1. **Request** → POST /forgot-password
2. **Email Sent** → Reset link (15 min validity)
3. **User Clicks** → Navigates with token
4. **Reset Form** → Enter new password
5. **Request** → POST /reset-password/:token
6. **Success** → Can login with new password

---

## ⚠️ Critical Rules

❌ **Never** bypass status check on login
❌ **Never** store plaintext passwords
❌ **Never** reveal if email exists
❌ **Never** skip validation
❌ **Never** expose reset tokens

✅ **Always** use JWT for auth
✅ **Always** hash passwords with bcrypt
✅ **Always** validate input
✅ **Always** check role before sensitive ops
✅ **Always** log audit events

---

## 🧪 Quick Tests

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -d '{"name":"Test","email":"t@e.com","password":"Pass123","branch":"B1"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -d '{"email":"t@e.com","password":"Pass123"}'

# Protected route
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Admin
curl -X GET http://localhost:5000/api/auth/pending-users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📊 Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad request | Invalid email format |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Not enough permissions |
| 404 | Not found | User doesn't exist |
| 500 | Server error | Database connection failed |

---

## 🔐 Security Checklist

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiry (7 days)
- ✅ Reset tokens with expiry (15 min)
- ✅ Reset tokens are one-time use
- ✅ Email validation on all inputs
- ✅ Role-based access control
- ✅ Status checking on login
- ✅ No sensitive data in JWT
- ✅ Error messages don't leak info
- ✅ Reset link doesn't expose user

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `auth.model.js` | User schema |
| `auth.service.js` | Business logic |
| `auth.controller.js` | Request handlers |
| `auth.routes.js` | API routes |
| `auth.validation.js` | Input schemas |
| `auth.middleware.js` | JWT verification |
| `role.middleware.js` | Role checking |
| `README.md` | Full documentation |
| `TESTING.md` | Testing guide |
| `seed-admin.js` | Admin creation |

---

## 🎯 Common Tasks

### **Signup a user**
```
POST /auth/signup
Body: { name, email, password, branch }
```

### **Approve a user**
```
PUT /auth/approve-user/:userId (admin only)
Header: Authorization: Bearer token
```

### **Get user profile**
```
GET /auth/me
Header: Authorization: Bearer token
```

### **Reset password**
```
POST /auth/forgot-password
Body: { email }

Then: POST /auth/reset-password/:token
Body: { newPassword, confirmPassword }
```

### **Promote user**
```
PUT /auth/promote-user/:userId (admin only)
Header: Authorization: Bearer token
```

---

## 🆘 Troubleshooting

**Can't login after signup?**
→ Check status is APPROVED (admin needs to approve)

**Invalid token error?**
→ Check Authorization header format: "Bearer TOKEN"

**Password reset not working?**
→ Check token expiry (15 min), email in .env

**No approval email?**
→ Check SendGrid API key in .env

**MASTER_ADMIN not created?**
→ Run: node scripts/seed-admin.js

---

## 📚 Full Documentation

- **README.md** - Complete API docs (11 endpoints)
- **TESTING.md** - Testing guide with examples
- **AUTH_IMPLEMENTATION.md** - Full implementation details
- **.env.example** - Environment variables

---

Last Updated: 2024
Version: 1.0.0
