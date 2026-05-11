/**
 * ============================================
 * AUTH MODULE - API TESTING GUIDE
 * ============================================
 * 
 * Use this file to test all auth endpoints
 * Import in Postman or similar tools
 * 
 * Base URL: http://localhost:5000/api
 */

// ============================================
// VARIABLES (Set these before running tests)
// ============================================

// Variables to update as you test:
// - {{BASE_URL}} = http://localhost:5000/api
// - {{USER_EMAIL}} = user email (from signup)
// - {{USER_PASSWORD}} = user password (from signup)
// - {{ADMIN_TOKEN}} = admin JWT token (from admin login)
// - {{USER_TOKEN}} = user JWT token (from user login)
// - {{USER_ID}} = user ID (from signup response)
// - {{RESET_TOKEN}} = reset token (from email or logs)

// ============================================
// 1. SIGNUP (Public)
// ============================================

/*
POST /auth/signup

Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123",
  "branch": "BRANCH1"
}

Expected:
- Status: 201
- Body: { success: true, data: { userId, message: "Account created..." } }
- Result: User created with status PENDING
*/

// ============================================
// 2. LOGIN - ADMIN (Public)
// ============================================

/*
POST /auth/login

Body:
{
  "email": "admin@example.com",
  "password": "Admin@123456"
}

Expected:
- Status: 200
- Body: { success: true, data: { token, user: { userId, role: "MASTER_ADMIN", ... } } }
- Save: {{ADMIN_TOKEN}} = token
*/

// ============================================
// 3. GET PENDING USERS (Admin Only)
// ============================================

/*
GET /auth/pending-users

Header:
Authorization: Bearer {{ADMIN_TOKEN}}

Expected:
- Status: 200
- Body: { success: true, data: { count: X, users: [...] } }
- Note: Should show "Test User" from step 1
*/

// ============================================
// 4. APPROVE USER (Admin Only)
// ============================================

/*
PUT /auth/approve-user/{{USER_ID}}

Header:
Authorization: Bearer {{ADMIN_TOKEN}}

Body: {} (empty)

Expected:
- Status: 200
- Body: { success: true, data: { message: "User approved...", user: {...} } }
- Result: User now has status APPROVED
- Result: User receives approval email
*/

// ============================================
// 5. LOGIN - USER (Public)
// ============================================

/*
POST /auth/login

Body:
{
  "email": "test@example.com",
  "password": "Password123"
}

Expected:
- Status: 200
- Body: { success: true, data: { token, user: { userId, role: "USER", branch: "BRANCH1" } } }
- Save: {{USER_TOKEN}} = token
- Note: Would fail if user not approved (step 3)
*/

// ============================================
// 6. GET CURRENT USER (Protected)
// ============================================

/*
GET /auth/me

Header:
Authorization: Bearer {{USER_TOKEN}}

Expected:
- Status: 200
- Body: { success: true, data: { _id, name, email, role, branch, ... } }
*/

// ============================================
// 7. UPDATE PROFILE (Protected)
// ============================================

/*
PUT /auth/profile

Header:
Authorization: Bearer {{USER_TOKEN}}

Body:
{
  "name": "Updated Name"
}

Expected:
- Status: 200
- Body: { success: true, data: { message: "Profile updated...", user: {...} } }
- Result: User name is updated
*/

// ============================================
// 8. FORGOT PASSWORD (Public)
// ============================================

/*
POST /auth/forgot-password

Body:
{
  "email": "test@example.com"
}

Expected:
- Status: 200
- Body: { success: true, data: { message: "If this email exists..." } }
- Result: Email sent with reset link
- Note: Extract {{RESET_TOKEN}} from email or server logs
*/

// ============================================
// 9. RESET PASSWORD (Public)
// ============================================

/*
POST /auth/reset-password/{{RESET_TOKEN}}

Body:
{
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}

Expected:
- Status: 200
- Body: { success: true, data: { message: "Password reset successful..." } }
- Result: User password is updated
- Note: Old password no longer works
*/

// ============================================
// 10. LOGIN WITH NEW PASSWORD (Public)
// ============================================

/*
POST /auth/login

Body:
{
  "email": "test@example.com",
  "password": "NewPassword123"
}

Expected:
- Status: 200
- Body: { success: true, data: { token, user: {...} } }
- Note: This confirms password reset worked
*/

// ============================================
// 11. PROMOTE USER (Admin Only)
// ============================================

/*
PUT /auth/promote-user/{{USER_ID}}

Header:
Authorization: Bearer {{ADMIN_TOKEN}}

Body: {} (empty)

Expected:
- Status: 200
- Body: { success: true, data: { message: "User promoted...", user: { role: "LEADER" } } }
- Result: User role changed from USER to LEADER
- Result: User receives promotion email
*/

// ============================================
// 12. REJECT USER (Admin Only)
// ============================================

/*
Create another test user first (separate signup)

PUT /auth/reject-user/{{ANOTHER_USER_ID}}

Header:
Authorization: Bearer {{ADMIN_TOKEN}}

Body:
{
  "reason": "Application does not meet requirements"
}

Expected:
- Status: 200
- Body: { success: true, data: { message: "User rejected..." } }
- Result: User status changed to REJECTED
- Result: User cannot login
- Result: User receives rejection email
*/

// ============================================
// ERROR CASES TO TEST
// ============================================

/*
1. DUPLICATE EMAIL
   POST /auth/signup with existing email
   → Expected: 400 { error: "Email already registered" }

2. WEAK PASSWORD
   POST /auth/signup with password < 6 chars
   → Expected: 400 { validation error }

3. LOGIN BEFORE APPROVAL
   POST /auth/login before admin approval
   → Expected: 401 { error: "Your account is not approved yet..." }

4. INVALID TOKEN
   GET /auth/me with invalid token
   → Expected: 401 { error: "Invalid token" }

5. EXPIRED TOKEN
   Use old/expired token
   → Expected: 401 { error: "Token expired" }

6. WRONG ROLE
   Try admin endpoint without MASTER_ADMIN role
   → Expected: 403 { error: "Insufficient permissions..." }

7. MISSING VALIDATION
   POST /auth/signup without name
   → Expected: 400 { validation error for name }

8. INVALID EMAIL FORMAT
   POST /auth/login with invalid email
   → Expected: 400 { validation error }

9. EXPIRED RESET TOKEN
   Try to reset password with old token (> 15 min)
   → Expected: 401 { error: "Invalid or expired reset token" }

10. PASSWORD MISMATCH ON RESET
    POST /auth/reset-password with newPassword !== confirmPassword
    → Expected: 400 { validation error }
*/

// ============================================
// POSTMAN COLLECTION TEMPLATE
// ============================================

/*
{
  "info": {
    "name": "WFC-Test Auth API",
    "description": "Testing all auth endpoints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Signup",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/auth/signup",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Test User\", \"email\": \"test@example.com\", \"password\": \"Password123\", \"branch\": \"BRANCH1\"}"
        }
      }
    },
    {
      "name": "2. Login Admin",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/auth/login",
        "body": {"raw": "{\"email\": \"admin@example.com\", \"password\": \"Admin@123456\"}"}
      }
    }
    // Add more endpoints as needed
  ],
  "variable": [
    {"key": "BASE_URL", "value": "http://localhost:5000/api"},
    {"key": "ADMIN_TOKEN", "value": ""},
    {"key": "USER_TOKEN", "value": ""},
    {"key": "USER_ID", "value": ""},
    {"key": "RESET_TOKEN", "value": ""}
  ]
}
*/

// ============================================
// CURL EXAMPLES
// ============================================

/*
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Pass123","branch":"BRANCH1"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}'

# Get profile (with token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get pending users (admin only)
curl -X GET http://localhost:5000/api/auth/pending-users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Approve user
curl -X PUT http://localhost:5000/api/auth/approve-user/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Forgot password
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Reset password
curl -X POST http://localhost:5000/api/auth/reset-password/RESET_TOKEN \
  -H "Content-Type: application/json" \
  -d '{"newPassword":"NewPass123","confirmPassword":"NewPass123"}'
*/

export {};
