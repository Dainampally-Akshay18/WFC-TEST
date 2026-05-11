# 🔐 AUTH MODULE - Complete Documentation

This is a production-grade authentication module implementing role-based access control (RBAC) with multi-branch support.

---

## 📋 Table of Contents

1. [User Schema](#user-schema)
2. [API Endpoints](#api-endpoints)
3. [Authentication Flow](#authentication-flow)
4. [Role & Permissions](#role--permissions)
5. [Approval System](#approval-system)
6. [Password Reset](#password-reset)
7. [Middleware System](#middleware-system)
8. [Setup Guide](#setup-guide)

---

## 👤 User Schema

```javascript
User {
  _id: ObjectId
  
  // Basic Info
  name: String
  email: String (unique)
  password: String (hashed)
  
  // Role & Status
  role: "MASTER_ADMIN" | "LEADER" | "USER"
  status: "PENDING" | "APPROVED" | "REJECTED"
  
  // Branch
  branch: String | null
  
  // Approval System
  approvedAt: Date
  createdBy: ObjectId (admin who approved)
  rejectionReason: String
  
  // Password Reset
  resetPasswordToken: String
  resetPasswordExpires: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔑 API Endpoints

### 🟢 PUBLIC ENDPOINTS (No auth required)

#### **1. Signup**
```
POST /api/auth/signup

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "branch": "BRANCH1"
}

Response:
{
  "success": true,
  "data": {
    "userId": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Account created. Awaiting admin approval."
  }
}
```

**Rules:**
- Email must be unique
- Password minimum 6 characters
- Branch is required
- New users are created with `status: PENDING`
- Requires admin approval to login

---

#### **2. Login**
```
POST /api/auth/login

Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "userId": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "branch": "BRANCH1"
    }
  }
}
```

**Rules:**
- Only approved users can login
- Pending users get error: "Your account is not approved yet"
- JWT token expires in 7 days

---

#### **3. Forgot Password**
```
POST /api/auth/forgot-password

Request:
{
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "data": {
    "message": "If this email exists, a password reset link has been sent."
  }
}
```

**Rules:**
- Always returns success message (prevents email enumeration)
- Sends reset link to email if user exists
- Reset token expires in 15 minutes
- Token is one-time use only

---

#### **4. Reset Password**
```
POST /api/auth/reset-password/:token

Request:
{
  "newPassword": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}

Response:
{
  "success": true,
  "data": {
    "message": "Password reset successful. You can now login with your new password."
  }
}
```

**Rules:**
- Token must be valid and not expired
- Passwords must match
- Old token is cleared after reset
- User must login again with new password

---

### 🔵 PROTECTED ENDPOINTS (Auth required)

#### **5. Get Current User Profile**
```
GET /api/auth/me

Header: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "branch": "BRANCH1",
    "status": "APPROVED",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### **6. Update User Profile**
```
PUT /api/auth/profile

Header: Authorization: Bearer <token>

Request:
{
  "name": "Jane Doe"
}

Response:
{
  "success": true,
  "data": {
    "message": "Profile updated successfully",
    "user": { ... }
  }
}
```

**Rules:**
- Users can only update safe fields (name)
- Role, status, branch cannot be changed by user

---

### 🔴 ADMIN ENDPOINTS (MASTER_ADMIN only)

#### **7. Get Pending Users**
```
GET /api/auth/pending-users

Header: Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": {
    "count": 5,
    "users": [ ... ]
  }
}
```

---

#### **8. Get User by ID**
```
GET /api/auth/user/:userId

Header: Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": { ... user data ... }
}
```

---

#### **9. Approve User**
```
PUT /api/auth/approve-user/:userId

Header: Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": {
    "message": "User approved successfully",
    "user": { ... }
  }
}
```

**Actions:**
- Sets `status: APPROVED`
- Sets `approvedAt: now`
- Sets `createdBy: adminId`
- Sends approval email to user
- User can now login

---

#### **10. Reject User**
```
PUT /api/auth/reject-user/:userId

Header: Authorization: Bearer <admin-token>

Request:
{
  "reason": "Application does not meet requirements"
}

Response:
{
  "success": true,
  "data": {
    "message": "User rejected successfully"
  }
}
```

**Actions:**
- Sets `status: REJECTED`
- Stores rejection reason
- Sends rejection email to user
- User cannot login

---

#### **11. Promote User to Leader**
```
PUT /api/auth/promote-user/:userId

Header: Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": {
    "message": "User promoted to leader successfully",
    "user": { ... }
  }
}
```

**Rules:**
- Only MASTER_ADMIN can promote users
- User must have `role: USER`
- Changes role to `LEADER`
- Sends promotion email

---

## 🔄 Authentication Flow

### **Signup & Approval Flow**

```
1. User Signup
   ↓
2. Account Created (status: PENDING)
   ↓
3. Admin Reviews Applications
   ↓
4. Admin Approves/Rejects
   ↓
5. User Receives Email
   ↓
6. User Login (if approved)
```

---

### **Login Flow**

```
1. User Enters Email & Password
   ↓
2. Backend Finds User
   ↓
3. Check: status === APPROVED?
   ├─ NO → Error: "Account not approved"
   └─ YES ↓
4. Verify Password
   ├─ NO Match → Error: "Invalid credentials"
   └─ Match ↓
5. Generate JWT Token
   ↓
6. Return Token to Client
```

---

### **Protected Route Flow**

```
Request
  ↓
Extract Bearer Token
  ↓
Verify Token
  ├─ Invalid → Error: 401
  ├─ Expired → Error: 401
  └─ Valid ↓
Attach User to Request
  ↓
Check Role (if needed)
  ├─ Not Allowed → Error: 403
  └─ Allowed ↓
Execute Controller
```

---

## 👥 Role & Permissions

### **MASTER_ADMIN**
- Can approve/reject users
- Can promote users to LEADER
- Can manage all branches
- Always approved (never pending)
- Has no branch assignment

**Signup:**
```
Created manually via seed script
role: MASTER_ADMIN
status: APPROVED (immediate)
branch: null
```

---

### **LEADER**
- Can approve/reject users in their branch
- Cannot promote to ADMIN
- Can only manage their own branch
- Must be approved by MASTER_ADMIN before login

**Signup:**
```
email, password, name, branch
role: USER → promoted to LEADER (by admin)
status: PENDING → APPROVED (by admin)
branch: Required
```

---

### **USER**
- Can login and access system
- Can update own profile
- Cannot approve or manage other users
- Must be approved by MASTER_ADMIN before login

**Signup:**
```
email, password, name, branch
role: USER (default)
status: PENDING (default)
branch: Required
```

---

## ✅ Approval System

### **Admin Actions**

#### **Approve User**
```javascript
// User transitions from PENDING → APPROVED
user.status = "APPROVED"
user.approvedAt = new Date()
user.createdBy = adminId
// Send approval email
```

---

#### **Reject User**
```javascript
// User transitions from PENDING → REJECTED
user.status = "REJECTED"
user.rejectionReason = "reason"
// Send rejection email
```

---

#### **Promote User**
```javascript
// Promote USER to LEADER
user.role = "LEADER"
user.createdBy = adminId
// Send promotion email
```

---

## 🔑 Password Reset

### **Process**

**Step 1: Request Reset**
```
POST /api/auth/forgot-password
Email: user@example.com
```

**Backend:**
1. Generate random token (32 bytes)
2. Hash token using SHA256
3. Save hashed token + expiry (15 min) to DB
4. Send email with reset link:
   ```
   https://app.com/reset-password/<token>
   ```

---

**Step 2: Reset Password**
```
POST /api/auth/reset-password/:token
newPassword: "NewPass123"
confirmPassword: "NewPass123"
```

**Backend:**
1. Hash token (same as step 1)
2. Find user with matching token + valid expiry
3. Hash new password
4. Update: password, clear token fields
5. Return success

---

### **Security Rules**

✅ **Implemented:**
- Token expires in 15 minutes
- Token is one-time use (cleared after reset)
- Never reveal if email exists
- Password always hashed with bcrypt
- Token stored as hash (not plain text)

---

## 🧩 Middleware System

### **1. Auth Middleware**
```javascript
import authMiddleware from '../middleware/auth.middleware.js'

// Usage:
app.get('/api/protected', authMiddleware, controller)

// Verifies:
// - Token exists
// - Token format is valid (Bearer <token>)
// - Token signature is valid
// - Token not expired

// Attaches:
req.user = {
  userId: "...",
  role: "USER",
  branch: "BRANCH1"
}
```

---

### **2. Role Middleware**
```javascript
import roleMiddleware from '../middleware/role.middleware.js'

// Usage:
app.get('/api/admin', 
  authMiddleware, 
  roleMiddleware(['MASTER_ADMIN']), 
  controller
)

// Checks:
// - User is authenticated
// - User role is in allowed roles
// - Returns 403 if not allowed
```

---

### **3. Branch Middleware**
```javascript
import checkBranch from '../middleware/branch.middleware.js'

// Usage:
app.get('/api/branch-data',
  authMiddleware,
  checkBranch(),
  controller
)

// MASTER_ADMIN: Can access all branches
// Other roles: Can only access their branch
```

---

### **4. Validation Middleware**
```javascript
import validateRequest from '../middleware/validate.middleware.js'
import { signupSchema } from '../auth.validation.js'

// Usage:
app.post('/api/auth/signup',
  validateRequest(signupSchema),
  controller
)

// Validates request body
// Returns 400 with validation errors if invalid
```

---

## 🚀 Setup Guide

### **1. Install Dependencies**

```bash
npm install express mongoose bcrypt jsonwebtoken joi dotenv cors @sendgrid/mail
```

---

### **2. Update .env**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/wfc-test

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourapp.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Master Admin (for seed)
MASTER_ADMIN_EMAIL=admin@example.com
MASTER_ADMIN_PASSWORD=Admin@123456

# Server
PORT=5000
```

---

### **3. Create Master Admin**

```bash
node scripts/seed-admin.js

# Output:
# ✅ MASTER_ADMIN created successfully!
# 📧 Email: admin@example.com
# 🔑 Password: Admin@123456
```

---

### **4. Start Server**

```bash
npm start
# or
npm run dev
```

---

### **5. Test Endpoints**

**Signup User:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "branch": "BRANCH1"
  }'
```

**Admin Approves User:**
```bash
# First, admin login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }'

# Then approve user
curl -X PUT http://localhost:5000/api/auth/approve-user/:userId \
  -H "Authorization: Bearer <admin-token>"
```

---

## 🧪 Example Scenarios

### **Scenario 1: New User Signup and Approval**

1. User signs up → Account created with status `PENDING`
2. Admin logs in → Sees pending users list
3. Admin approves → Email sent to user
4. User receives email → Can now login
5. User logs in → Receives JWT token

---

### **Scenario 2: Password Reset**

1. User clicks "Forgot Password"
2. Enters email → Backend sends reset link
3. User clicks link → Frontend navigates with token
4. User enters new password → Backend validates and updates
5. User logs in with new password

---

### **Scenario 3: Admin Promotes User**

1. Admin promotes USER to LEADER
2. System updates role from `USER` to `LEADER`
3. User receives promotion email
4. User logs back in with new permissions
5. LEADER can now approve other users

---

## ⚠️ Important Security Notes

✅ **Implemented:**
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with expiry
- Password reset tokens with expiry
- Role-based access control
- Input validation
- Error handling prevents info leakage

❌ **Not Implemented (Add Later):**
- Rate limiting on login attempts
- Two-factor authentication (2FA)
- OAuth/Social login
- Token refresh rotation
- Session management
- Audit logging of auth events

---

## 📞 Support

For questions or issues:
1. Check error messages (they're descriptive)
2. Review middleware order in `app.js`
3. Verify JWT_SECRET in .env
4. Check SendGrid configuration

---
