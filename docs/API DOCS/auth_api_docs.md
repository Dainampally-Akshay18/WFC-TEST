# AUTH MODULE API DOCUMENTATION

**Generated:** May 20, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Architecture](#authentication-architecture)
3. [API Endpoints](#api-endpoints)
   - [Public Endpoints](#public-endpoints)
   - [Protected Endpoints](#protected-endpoints)
   - [Admin Endpoints](#admin-endpoints)
4. [Security](#security)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## Overview

The AUTH module handles user authentication, registration, password management, and user approval workflows. It implements JWT-based authentication with role-based access control (RBAC).

### Key Features

- User registration with email verification
- JWT-based authentication
- Password reset functionality
- User approval workflow (2-step process)
- Role-based access control (RBAC)
- Audit logging for all authentication events
- Email notifications for all auth events

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **USER** | Regular user | Access own profile, view content |
| **LEADER** | Elevated user | Moderate content, manage prayers |
| **MASTER_ADMIN** | System administrator | Approve users, manage roles, view audit logs |

### User Status

| Status | Description |
|--------|-------------|
| **PENDING** | User registered, awaiting admin approval |
| **APPROVED** | User approved, can login |
| **REJECTED** | User rejected, cannot login |

---

## Authentication Architecture

### JWT Token Structure

```json
{
  "userId": "ObjectId",
  "role": "USER|LEADER|MASTER_ADMIN",
  "branch": "string",
  "iat": 1621234567,
  "exp": 1621839367
}
```

### Token Details

| Property | Value |
|----------|-------|
| **Algorithm** | HS256 |
| **Expiration** | 7 days |
| **Header Format** | `Authorization: Bearer <token>` |
| **Storage** | Environment variable: `JWT_SECRET` |

### Middleware Stack

| Middleware | Purpose | Usage |
|------------|---------|-------|
| `validateRequest(schema)` | Validates request body | All endpoints |
| `authMiddleware` | Verifies JWT token | Protected routes |
| `roleMiddleware(roles)` | Checks user role | Admin routes |

---

## API Endpoints

---

## PUBLIC ENDPOINTS

These endpoints do not require authentication.

---

### 1. User Signup

# API Name
**User Signup**

# Endpoint
```
POST /api/auth/signup
```

# Controller Function
```
authController.signup()
```

# Purpose

This endpoint allows new users to create an account in the system. Users must provide their name, email, password, and branch. After signup, the user account is created with a PENDING status and requires admin approval before they can login.

**Business Context:**
- Enables self-registration for new members
- Implements 2-step approval process for security
- Sends welcome email to confirm account creation
- All signups are logged in audit trail

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Public (No authentication required) |
| **JWT Required** | No |
| **Bearer Token** | No |
| **Required Roles** | N/A |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `validateRequest(authValidation.signupSchema)` | Validates request body using Joi schema |

# Request Headers

```
Content-Type: application/json
```

# Route Parameters

None

# Query Parameters

None

# Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "branch": "Main Branch"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | User's full name |
| `email` | string | Yes | User's email address |
| `password` | string | Yes | Account password |
| `branch` | string | Yes | User's branch/location |

# Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Min 2 chars, Max 50 chars, Required |
| `email` | Valid email format, Unique in database, Required |
| `password` | Min 6 chars, Max 100 chars, Required |
| `branch` | Non-empty string, Required |

**Validation Schema:**
```javascript
signupSchema: Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  branch: Joi.string().required(),
})
```

# Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Account created. Awaiting admin approval."
  }
}
```

# Error Responses

### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "\"name\" must be at least 2 characters long"
  }
}
```

### 400 Bad Request - Email Already Registered

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Email already registered"
  }
}
```

### 400 Bad Request - Missing Branch

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Branch is required for user signup"
  }
}
```

### 422 Unprocessable Entity

```json
{
  "success": false,
  "error": {
    "status": 422,
    "message": "Signup failed: [error details]"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 201 | Account created successfully |
| 400 | Validation failed or email already exists |
| 422 | Unprocessable entity |
| 500 | Server error |

# Database Models Used

**User Model**
- Inserts new document in `users` collection
- Fields populated: `name`, `email`, `password` (hashed), `role` (defaults to USER), `status` (defaults to PENDING), `branch`, `createdAt`, `updatedAt`
- Indexes used: `email` (unique)

# Service Layer Used

**authService.signup(name, email, password, branch)**
- Checks if email already exists
- Validates branch requirement
- Hashes password using bcrypt (10 salt rounds)
- Creates user with PENDING status
- Logs action to audit trail
- Sends welcome email
- Returns user data without password

# Business Logic Flow

```
1. Receive signup request
   ↓
2. Validate request schema (Joi validation)
   ↓
3. Check if email already exists
   ↓
4. Validate branch is provided
   ↓
5. Hash password using bcrypt
   ↓
6. Create user with defaults (role: USER, status: PENDING)
   ↓
7. Save to database
   ↓
8. Log action in audit trail (CREATE_USER)
   ↓
9. Send welcome email notification
   ↓
10. Return user data (without password)
```

# Security Notes

- **Password Security:** Passwords are hashed using bcrypt with 10 salt rounds before storage
- **Email Uniqueness:** Emails are enforced as unique at database level
- **Password Not Returned:** Response never includes hashed password
- **Email Verification:** Welcome email sent to confirm account
- **Audit Trail:** All signups logged for security auditing
- **Status Control:** New users cannot login until APPROVED by admin
- **Database Index:** Email field indexed for fast lookups and unique constraint enforcement

**Security Risks Detected:**
⚠️ **POTENTIAL ISSUE:** No email verification link sent. Consider adding email verification step before allowing login.

# Example Frontend Usage

```javascript
// Using fetch API
async function signupUser() {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePassword123',
      branch: 'Main Branch',
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Signup successful:', result.data);
    // Show message: "Account created. Awaiting admin approval."
  } else {
    console.error('Signup failed:', result.error.message);
  }
}
```

```javascript
// Using axios
import axios from 'axios';

async function signupUser() {
  try {
    const response = await axios.post('/api/auth/signup', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePassword123',
      branch: 'Main Branch',
    });

    console.log('Signup successful:', response.data.data);
    // Redirect to login or show message
  } catch (error) {
    console.error('Signup failed:', error.response.data.error.message);
  }
}
```

# Related APIs

- [Login](#2-user-login) - Login after account approval
- [Get Current User](#6-get-current-user-profile) - Retrieve profile after approval

# Notes

- Users must wait for admin approval before they can login
- Password is permanently hashed and cannot be retrieved
- Each signup creates an audit trail entry for security tracking
- Emails should be verified in production (not currently implemented)

---

### Admin Signup

# API Name
**Admin Signup**

# Endpoint
```
POST /api/auth/signup-admin
```

# Controller Function
```
authController.signupAdmin()
```

# Purpose

This endpoint allows a new MASTER_ADMIN account to be created using the public auth flow. It accepts the same core identity fields as regular signup, but does not require a branch and stores the account with a MASTER_ADMIN role.

**Business Context:**
- Creates the initial admin account for the system
- Uses the same public auth module and validation pipeline
- Stores the account as a MASTER_ADMIN user
- Logs admin creation in the audit trail

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Public (No authentication required) |
| **JWT Required** | No |
| **Bearer Token** | No |
| **Required Roles** | N/A |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `validateRequest(authValidation.signupAdminSchema)` | Validates request body using Joi schema |

# Request Headers

```
Content-Type: application/json
```

# Route Parameters

None

# Query Parameters

None

# Request Body

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "SecurePassword123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Admin user's full name |
| `email` | string | Yes | Admin user's email address |
| `password` | string | Yes | Admin account password |

# Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Min 2 chars, Max 50 chars, Required |
| `email` | Valid email format, Unique in database, Required |
| `password` | Min 6 chars, Max 100 chars, Required |

**Validation Schema:**
```javascript
signupAdminSchema: Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})
```

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "AdminId": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@example.com",
    "message": "Admin Account created."
  }
}
```

# Error Responses

### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "\"name\" must be at least 2 characters long"
  }
}
```

### 400 Bad Request - Email Already Registered

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Email already registered"
  }
}
```

### 422 Unprocessable Entity

```json
{
  "success": false,
  "error": {
    "status": 422,
    "message": "Signup failed: [error details]"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Admin account created successfully |
| 400 | Validation failed or email already exists |
| 422 | Unprocessable entity |
| 500 | Server error |

# Database Models Used

**User Model**
- Inserts new document in `users` collection
- Fields populated: `name`, `email`, `password` (hashed), `role` (defaults to MASTER_ADMIN), `status` (defaults to PENDING), `branch` (null), `createdAt`, `updatedAt`
- Indexes used: `email` (unique)

# Service Layer Used

**authService.signupAdmin(name, email, password)**
- Checks if email already exists
- Hashes password using bcrypt (10 salt rounds)
- Creates user with MASTER_ADMIN role
- Stores branch as null
- Logs action to audit trail
- Returns admin data without password

# Business Logic Flow

```
1. Receive admin signup request
   ↓
2. Validate request schema (Joi validation)
   ↓
3. Check if email already exists
   ↓
4. Hash password using bcrypt
   ↓
5. Create admin user with defaults (role: MASTER_ADMIN, status: PENDING, branch: null)
   ↓
6. Save to database
   ↓
7. Log action in audit trail (CREATE_ADMIN)
   ↓
8. Return admin data (without password)
```

# Security Notes

- **Password Security:** Passwords are hashed using bcrypt with 10 salt rounds before storage
- **Email Uniqueness:** Emails are enforced as unique at database level
- **Password Not Returned:** Response never includes hashed password
- **Audit Trail:** Admin signup is logged for security auditing
- **Role Control:** New accounts are created with MASTER_ADMIN role only through this endpoint

**Security Risks Detected:**
⚠️ **CONSIDER:** Restrict access to this endpoint in production if initial admin bootstrap is not needed

---

### 2. User Login

# API Name
**User Login**

# Endpoint
```
POST /api/auth/login
```

# Controller Function
```
authController.login()
```

# Purpose

This endpoint authenticates a user with email and password. Returns a JWT token that must be used for all subsequent authenticated requests. Only users with APPROVED status can login.

**Business Context:**
- Enables user authentication
- Returns JWT token for session management
- Only approved users can access the system
- Login events are logged for audit trail

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Public (No authentication required) |
| **JWT Required** | No |
| **Bearer Token** | No |
| **Required Roles** | N/A |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `validateRequest(authValidation.loginSchema)` | Validates request body using Joi schema |

# Request Headers

```
Content-Type: application/json
```

# Route Parameters

None

# Query Parameters

None

# Request Body

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email address |
| `password` | string | Yes | User's password |

# Validation Rules

| Field | Rules |
|-------|-------|
| `email` | Valid email format, Required |
| `password` | Non-empty string, Required |

**Validation Schema:**
```javascript
loginSchema: Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
```

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "branch": "Main Branch"
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | JWT token valid for 7 days |
| `user.userId` | string | User's MongoDB ObjectId |
| `user.name` | string | User's full name |
| `user.email` | string | User's email |
| `user.role` | string | User's role (USER, LEADER, MASTER_ADMIN) |
| `user.branch` | string | User's branch |

# Error Responses

### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "\"email\" must be a valid email"
  }
}
```

### 400 Bad Request - Invalid Credentials

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Invalid email or password"
  }
}
```

### 400 Bad Request - Account Not Approved

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Your account is not approved yet. Please wait for admin approval."
  }
}
```

### 422 Unprocessable Entity

```json
{
  "success": false,
  "error": {
    "status": 422,
    "message": "Login failed: [error details]"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Login successful, token returned |
| 400 | Invalid credentials or account not approved |
| 422 | Unprocessable entity |
| 500 | Server error |

# Database Models Used

**User Model**
- Queries `users` collection
- Password field is hidden by default, explicitly selected for verification
- Uses indexes on `email` and `status` for fast lookups

# Service Layer Used

**authService.login(email, password)**
- Finds user by email (password explicitly selected)
- Validates account status is APPROVED
- Compares provided password with hashed password
- Generates JWT token with userId, role, branch
- Logs login action to audit trail
- Returns token and user data (without password)

# Business Logic Flow

```
1. Receive login request
   ↓
2. Validate request schema (Joi validation)
   ↓
3. Find user by email in database
   ↓
4. Check if user exists
   ↓
5. Check if user status is APPROVED (CRITICAL CHECK)
   ↓
6. Compare provided password with stored hashed password
   ↓
7. If password matches:
   - Generate JWT token (7 day expiry)
   - Log login action in audit trail
   - Return token and user data
   ↓
8. If password doesn't match:
   - Return "Invalid email or password" error
```

# Security Notes

- **Password Comparison:** Uses bcrypt.compare() for secure password verification
- **Status Check:** Only APPROVED users can login (prevents pending/rejected users)
- **Password Not Returned:** Response never includes password
- **JWT Security:** Token signed with HS256 algorithm using JWT_SECRET
- **Generic Error Messages:** Returns "Invalid email or password" for both invalid email and wrong password (prevents user enumeration)
- **Audit Trail:** All login attempts logged for security monitoring
- **Token Expiry:** Tokens automatically expire after 7 days
- **Password Disclosure:** Password field excluded from response

**Security Risks Detected:**
⚠️ **CONSIDER:** Add rate limiting to prevent brute force attacks
⚠️ **CONSIDER:** Add login attempt tracking and account lockout after N failed attempts

# Example Frontend Usage

```javascript
// Using fetch API
async function loginUser() {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'SecurePassword123',
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    // Store token in localStorage
    localStorage.setItem('token', result.data.token);
    console.log('Login successful:', result.data.user);
    // Redirect to dashboard
  } else {
    console.error('Login failed:', result.error.message);
  }
}
```

```javascript
// Using axios with interceptors
import axios from 'axios';

async function loginUser() {
  try {
    const response = await axios.post('/api/auth/login', {
      email: 'john@example.com',
      password: 'SecurePassword123',
    });

    const { token, user } = response.data.data;
    
    // Store token
    localStorage.setItem('token', token);
    
    // Set default header for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Login successful:', user);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error.response.data.error.message);
  }
}
```

# Related APIs

- [Signup](#1-user-signup) - Create account
- [Forgot Password](#3-forgot-password) - Reset forgotten password
- [Get Current User](#6-get-current-user-profile) - View profile

# Notes

- Token must be stored securely (localStorage, sessionStorage, or secure cookie)
- Token should be sent in every authenticated request header: `Authorization: Bearer <token>`
- Token expires after 7 days and requires re-login
- Rejected users cannot login, only pending/rejected status prevents login
- Only APPROVED users can access the system

---

### 3. Forgot Password

# API Name
**Forgot Password**

# Endpoint
```
POST /api/auth/forgot-password
```

# Controller Function
```
authController.forgotPassword()
```

# Purpose

This endpoint initiates the password reset process. It generates a secure reset token and sends a password reset email to the user. The reset token is valid for 15 minutes.

**Business Context:**
- Allows users to recover access if they forget their password
- Uses secure token generation and expiry
- Prevents email enumeration by always returning success
- Logs password reset requests for security

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Public (No authentication required) |
| **JWT Required** | No |
| **Bearer Token** | No |
| **Required Roles** | N/A |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `validateRequest(authValidation.forgotPasswordSchema)` | Validates request body using Joi schema |

# Request Headers

```
Content-Type: application/json
```

# Route Parameters

None

# Query Parameters

None

# Request Body

```json
{
  "email": "john@example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email address |

# Validation Rules

| Field | Rules |
|-------|-------|
| `email` | Valid email format, Required |

**Validation Schema:**
```javascript
forgotPasswordSchema: Joi.object({
  email: Joi.string().email().required(),
})
```

# Success Response

**Status Code:** `200 OK`

**IMPORTANT:** Response is the same whether email exists or not (prevents email enumeration attacks)

```json
{
  "success": true,
  "data": {
    "message": "If this email exists, a password reset link has been sent."
  }
}
```

# Error Responses

### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "\"email\" must be a valid email"
  }
}
```

### 422 Unprocessable Entity

```json
{
  "success": false,
  "error": {
    "status": 422,
    "message": "Forgot password failed: [error details]"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Request processed (regardless of email existence) |
| 400 | Validation failed |
| 422 | Unprocessable entity |
| 500 | Server error |

# Database Models Used

**User Model**
- Queries `users` collection by email
- Updates `resetPasswordToken` (hashed token)
- Updates `resetPasswordExpires` (timestamp + 15 minutes)

# Service Layer Used

**authService.forgotPassword(email)**
- Searches for user by email
- Always returns success message (security measure)
- If user found:
  - Generates 32-byte random reset token
  - Hashes token using SHA256
  - Sets expiry to 15 minutes from now
  - Saves hashed token to database
  - Sends email with reset link containing unencrypted token
- If user not found:
  - Returns success message (prevents enumeration)

# Business Logic Flow

```
1. Receive forgot-password request
   ↓
2. Validate request schema (Joi validation)
   ↓
3. Find user by email
   ↓
4. Prepare success response (for both cases)
   ↓
5. If user NOT found:
   - Return generic success message
   ↓
6. If user found:
   - Generate 32-byte random token (hex encoded)
   - Hash token using SHA256
   - Set expiry: current time + 15 minutes
   - Save token hash and expiry to database
   - Create reset link: FRONTEND_URL/reset-password/{token}
   - Send email with reset link
   - Return success message
```

# Security Notes

- **Token Security:** Uses crypto.randomBytes(32) for secure token generation
- **Token Hashing:** Token is hashed with SHA256 before storing in database
- **Email Not Sent:** Unencrypted token sent only via email, never stored
- **Token Expiry:** Tokens expire after 15 minutes
- **Email Enumeration:** Always returns success, even if email doesn't exist
- **No Email Reveal:** Never indicates whether email exists in system
- **Audit Trail:** Password reset requests can be logged for security
- **Reset Link:** Contains unencrypted token, so must be sent via email only

**Security Risks Detected:**
✅ **GOOD:** Email enumeration prevented with generic response
✅ **GOOD:** Token hashing implemented
✅ **GOOD:** 15-minute expiry implemented
⚠️ **CONSIDER:** Rate limiting on forgot-password endpoint to prevent abuse

# Example Frontend Usage

```javascript
// Using fetch API
async function forgotPassword() {
  const email = document.getElementById('emailInput').value;
  
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Check your email for password reset link');
    // Show generic message to user
    alert(result.data.message);
  } else {
    console.error('Request failed:', result.error.message);
  }
}
```

```javascript
// Using axios
import axios from 'axios';

async function forgotPassword(email) {
  try {
    const response = await axios.post('/api/auth/forgot-password', {
      email,
    });

    console.log('Check your email for reset link');
    // Show generic message
    alert(response.data.data.message);
  } catch (error) {
    console.error('Request failed:', error.response.data.error.message);
  }
}
```

# Related APIs

- [Reset Password](#4-reset-password) - Complete password reset with token
- [Login](#2-user-login) - Login after password reset

# Notes

- Always shows generic message to prevent email enumeration
- Reset token is valid for only 15 minutes
- Token is sent via email and must not be shared
- Users should not share reset links with others
- Each forgot-password request generates a new token

---

### 4. Reset Password

# API Name
**Reset Password**

# Endpoint
```
POST /api/auth/reset-password/:token
```

# Controller Function
```
authController.resetPassword()
```

# Purpose

This endpoint completes the password reset process. It validates the reset token (must not be expired), hashes the new password, and updates the user's password in the database.

**Business Context:**
- Completes the forgot password workflow
- Validates token expiry and authenticity
- Securely updates user password
- Logs password change for audit trail

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Public (No authentication required) |
| **JWT Required** | No |
| **Bearer Token** | No |
| **Required Roles** | N/A |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `validateRequest(authValidation.resetPasswordSchema)` | Validates request body using Joi schema |

# Request Headers

```
Content-Type: application/json
```

# Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | Password reset token from email |

**Example:** `/api/auth/reset-password/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

# Query Parameters

None

# Request Body

```json
{
  "newPassword": "NewSecurePassword456",
  "confirmPassword": "NewSecurePassword456"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `newPassword` | string | Yes | New password for account |
| `confirmPassword` | string | Yes | Password confirmation (must match newPassword) |

# Validation Rules

| Field | Rules |
|-------|-------|
| `newPassword` | Min 6 chars, Max 100 chars, Required |
| `confirmPassword` | Must match newPassword exactly, Required |

**Validation Schema:**
```javascript
resetPasswordSchema: Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).max(100).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required(),
})
```

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "Password reset successful. You can now login with your new password."
  }
}
```

# Error Responses

### 400 Bad Request - Invalid/Expired Token

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Invalid or expired reset token"
  }
}
```

### 400 Bad Request - Passwords Don't Match

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "\"confirmPassword\" must be [ref:newPassword]"
  }
}
```

### 400 Bad Request - Password Too Short

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "\"newPassword\" length must be at least 6 characters long"
  }
}
```

### 422 Unprocessable Entity

```json
{
  "success": false,
  "error": {
    "status": 422,
    "message": "Reset password failed: [error details]"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Password reset successfully |
| 400 | Invalid/expired token or validation error |
| 422 | Unprocessable entity |
| 500 | Server error |

# Database Models Used

**User Model**
- Queries `users` collection by `resetPasswordToken` and `resetPasswordExpires`
- Updates `password` field with new hashed password
- Clears `resetPasswordToken` and `resetPasswordExpires` fields

# Service Layer Used

**authService.resetPassword(resetToken, newPassword)**
- Hashes provided token using SHA256
- Searches for user with matching token hash
- Verifies token has not expired (resetPasswordExpires > current time)
- Hashes new password using bcrypt (10 salt rounds)
- Updates user password and clears reset fields
- Logs password reset in audit trail
- Returns success message

# Business Logic Flow

```
1. Receive reset-password request with token
   ↓
2. Validate request schema (Joi validation)
   ↓
3. Hash the provided token (SHA256) to match database
   ↓
4. Find user with:
   - resetPasswordToken matches hash
   - resetPasswordExpires > current time (not expired)
   ↓
5. If no user found or token expired:
   - Return "Invalid or expired reset token" error
   ↓
6. If user found and token valid:
   - Hash new password using bcrypt (10 rounds)
   - Update user.password with hash
   - Clear user.resetPasswordToken (set to null)
   - Clear user.resetPasswordExpires (set to null)
   - Save user to database
   - Log action in audit trail
   - Return success message
```

# Security Notes

- **Token Validation:** Token must be valid and not expired
- **Token Hashing:** Token hashed before database comparison
- **Token Expiry:** Tokens valid for only 15 minutes
- **Password Hashing:** New password hashed with bcrypt (10 salt rounds)
- **Token Cleanup:** Reset token immediately cleared after use (one-time use)
- **Audit Trail:** Password reset logged for security monitoring
- **Password Not Returned:** Response never includes password

**Security Risks Detected:**
✅ **GOOD:** Token can only be used once
✅ **GOOD:** 15-minute expiry prevents unlimited reset attempts
✅ **GOOD:** New password hashed with bcrypt
⚠️ **CONSIDER:** Add rate limiting to prevent reset attempt abuse

# Example Frontend Usage

```javascript
// Using fetch API
async function resetPassword(token) {
  const newPassword = document.getElementById('newPasswordInput').value;
  const confirmPassword = document.getElementById('confirmPasswordInput').value;
  
  const response = await fetch(`/api/auth/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newPassword,
      confirmPassword,
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Password reset successful');
    alert(result.data.message);
    // Redirect to login
    window.location.href = '/login';
  } else {
    console.error('Reset failed:', result.error.message);
    alert(result.error.message);
  }
}
```

```javascript
// Using axios
import axios from 'axios';

async function resetPassword(token, newPassword, confirmPassword) {
  try {
    const response = await axios.post(`/api/auth/reset-password/${token}`, {
      newPassword,
      confirmPassword,
    });

    console.log('Password reset successful');
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Reset failed:', error.response.data.error.message);
    alert(error.response.data.error.message);
  }
}
```

# Related APIs

- [Forgot Password](#3-forgot-password) - Initiate password reset
- [Login](#2-user-login) - Login with new password

# Notes

- Token is obtained from email link sent by Forgot Password endpoint
- Token is valid for only 15 minutes
- Each token can only be used once
- After successful reset, user must login with new password
- Old password is permanently replaced and cannot be recovered

---

## PROTECTED ENDPOINTS

These endpoints require authentication (JWT token).

---

### 5. Get Current User Profile

# API Name
**Get Current User Profile**

# Endpoint
```
GET /api/auth/me
```

# Controller Function
```
authController.getCurrentUser()
```

# Purpose

This endpoint returns the profile information of the currently authenticated user. It uses the user ID extracted from the JWT token to retrieve the user's data.

**Business Context:**
- Allows users to view their own profile information
- Used by frontend to populate user dashboard
- Verifies token is still valid
- Returns complete user information except password

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Protected (Authentication required) |
| **JWT Required** | Yes |
| **Bearer Token** | Required in Authorization header |
| **Required Roles** | Any authenticated user (USER, LEADER, MASTER_ADMIN) |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `authMiddleware` | Verifies JWT token and extracts user info |

# Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Parameters

None

# Query Parameters

None

# Request Body

None (GET request)

# Validation Rules

No request body validation for GET request.

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "APPROVED",
    "branch": "Main Branch",
    "approvedAt": "2026-01-15T10:30:00.000Z",
    "createdAt": "2026-01-10T08:20:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | User's MongoDB ObjectId |
| `name` | string | User's full name |
| `email` | string | User's email |
| `role` | string | User's role (USER, LEADER, MASTER_ADMIN) |
| `status` | string | Account status (APPROVED, PENDING, REJECTED) |
| `branch` | string | User's branch/location |
| `approvedAt` | string (ISO 8601) | Approval timestamp |
| `createdAt` | string (ISO 8601) | Account creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

# Error Responses

### 401 Unauthorized - No Token

```json
{
  "success": false,
  "error": {
    "message": "No authorization header provided"
  }
}
```

### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

### 401 Unauthorized - Token Expired

```json
{
  "success": false,
  "error": {
    "message": "Token expired"
  }
}
```

### 404 Not Found - User Deleted

```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | User profile retrieved successfully |
| 401 | Authentication failed (invalid/expired token) |
| 404 | User not found in database |
| 500 | Server error |

# Database Models Used

**User Model**
- Queries `users` collection by `_id` (from JWT)
- Password field excluded from response (select: false)
- Uses index on `_id` for fast lookup

# Service Layer Used

**authService.getUserById(userId)**
- Receives userId from JWT token
- Queries database by _id
- Excludes password field from response
- Returns complete user data or throws "User not found" error

# Business Logic Flow

```
1. Client sends GET request with Authorization header
   ↓
2. Auth middleware validates JWT token
   ↓
3. Extract userId from decoded JWT
   ↓
4. Call authService.getUserById(userId)
   ↓
5. Query database for user by _id
   ↓
6. If user not found:
   - Return 404 error
   ↓
7. If user found:
   - Return user data (without password)
```

# Security Notes

- **Authentication Required:** Token must be valid and not expired
- **Password Excluded:** Response never includes password
- **User Isolation:** Each user can only view their own profile
- **Token Verification:** JWT verified before accessing data
- **No Role Restrictions:** All authenticated users can view their own profile

# Example Frontend Usage

```javascript
// Using fetch API
async function getCurrentUserProfile() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('User profile:', result.data);
    // Populate dashboard with user data
    displayUserProfile(result.data);
  } else {
    console.error('Failed to get profile:', result.error.message);
    // Redirect to login if token expired
    if (response.status === 401) {
      window.location.href = '/login';
    }
  }
}
```

```javascript
// Using axios with interceptor
import axios from 'axios';

// Set up interceptor to add token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getCurrentUserProfile() {
  try {
    const response = await axios.get('/api/auth/me');
    console.log('User profile:', response.data.data);
    // Populate dashboard
    displayUserProfile(response.data.data);
  } catch (error) {
    if (error.response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
}
```

# Related APIs

- [Update Profile](#6-update-current-user-profile) - Update user profile
- [Login](#2-user-login) - Login to get token

# Notes

- Requires valid JWT token
- Returns current user data only (cannot view other users' profiles)
- Token must be sent in Authorization header with "Bearer" prefix
- If token expired, user must login again

---

### 6. Update Current User Profile

# API Name
**Update Current User Profile**

# Endpoint
```
PUT /api/auth/profile
```

# Controller Function
```
authController.updateProfile()
```

# Purpose

This endpoint allows authenticated users to update their profile information. Currently only the `name` field can be updated. Other fields like email, role, and branch are not modifiable by the user.

**Business Context:**
- Allows users to maintain their profile information
- Restricts which fields can be modified for security
- Logs profile updates to audit trail
- Only safe fields allowed for modification

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Protected (Authentication required) |
| **JWT Required** | Yes |
| **Bearer Token** | Required in Authorization header |
| **Required Roles** | Any authenticated user (USER, LEADER, MASTER_ADMIN) |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `authMiddleware` | Verifies JWT token and extracts user info |
| `validateRequest(authValidation.updateProfileSchema)` | Validates request body using Joi schema |

# Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Parameters

None

# Query Parameters

None

# Request Body

```json
{
  "name": "Jane Doe"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | User's new full name |

# Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Min 2 chars, Max 50 chars, Optional |

**Validation Schema:**
```javascript
updateProfileSchema: Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters',
    }),
})
```

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Jane Doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "APPROVED",
      "branch": "Main Branch",
      "approvedAt": "2026-01-15T10:30:00.000Z",
      "createdAt": "2026-01-10T08:20:00.000Z",
      "updatedAt": "2026-01-20T14:45:00.000Z"
    }
  }
}
```

# Error Responses

### 400 Bad Request - Name Too Short

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Name must be at least 2 characters"
  }
}
```

### 401 Unauthorized - No Token

```json
{
  "success": false,
  "error": {
    "message": "No authorization header provided"
  }
}
```

### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

### 404 Not Found - User Not Found

```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Profile updated successfully |
| 400 | Validation failed |
| 401 | Authentication failed |
| 404 | User not found |
| 500 | Server error |

# Database Models Used

**User Model**
- Queries and updates `users` collection by `_id`
- Only updates allowed fields: `name`
- Runs validators on update
- Returns updated document

# Service Layer Used

**authService.updateUserProfile(userId, updateData)**
- Receives userId from JWT and update data from request
- Filters updateData to only include allowed fields (name)
- Updates user document using findByIdAndUpdate()
- Runs validators on all fields
- Returns success message and updated user data
- Excludes password from response

# Business Logic Flow

```
1. Client sends PUT request with token and updated data
   ↓
2. Auth middleware validates JWT token
   ↓
3. Validate request body (Joi schema)
   ↓
4. Extract userId from JWT
   ↓
5. Create filtered update object (only allow: name)
   ↓
6. Update user in database using findByIdAndUpdate()
   ↓
7. If user not found:
   - Return 404 error
   ↓
8. If update successful:
   - Return updated user data
```

# Security Notes

- **Field Filtering:** Only `name` field can be updated via this endpoint
- **No Email Change:** Email is immutable to prevent unauthorized access
- **No Role Change:** Role cannot be changed by user (admin only)
- **No Branch Change:** Branch is immutable
- **Authentication Required:** User must be authenticated
- **User Isolation:** Can only update own profile
- **Validators Run:** All MongoDB validators run on update
- **Password Protected:** Email unchanged prevents account takeover

**Security Risks Detected:**
⚠️ **MISSING VALIDATION:** Consider adding email verification if email updates are added in future
⚠️ **RESTRICTION GOOD:** Currently only name is updatable, which is good security practice

# Example Frontend Usage

```javascript
// Using fetch API
async function updateProfile(newName) {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: newName,
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Profile updated:', result.data.user);
    alert('Profile updated successfully');
    // Refresh user data in UI
    displayUserProfile(result.data.user);
  } else {
    console.error('Update failed:', result.error.message);
    alert(result.error.message);
  }
}
```

```javascript
// Using axios with interceptor
import axios from 'axios';

async function updateProfile(newName) {
  try {
    const response = await axios.put('/api/auth/profile', {
      name: newName,
    });

    console.log('Profile updated:', response.data.data.user);
    // Refresh UI
    displayUserProfile(response.data.data.user);
  } catch (error) {
    console.error('Update failed:', error.response.data.error.message);
    alert(error.response.data.error.message);
  }
}
```

# Related APIs

- [Get Current User](#5-get-current-user-profile) - View current profile

# Notes

- Only authenticated users can update their own profile
- Currently only name can be updated
- Other fields (email, role, branch, status) cannot be changed via this endpoint
- Email can only be changed by admin
- Role promotions are handled by separate admin endpoint

---

## ADMIN ENDPOINTS

These endpoints require authentication and MASTER_ADMIN role.

---

### 7. Get Pending Users

# API Name
**Get Pending Users**

# Endpoint
```
GET /api/auth/pending-users
```

# Controller Function
```
authController.getPendingUsers()
```

# Purpose

This endpoint returns a list of all users with PENDING status, waiting for admin approval. Admins use this to review new user registrations and approve or reject them.

**Business Context:**
- Admin dashboard feature to manage user approvals
- Displays all users awaiting approval
- Enables 2-step user verification process
- Helps maintain system security by controlling access

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Protected (Authentication required) |
| **JWT Required** | Yes |
| **Bearer Token** | Required in Authorization header |
| **Required Roles** | MASTER_ADMIN only |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `authMiddleware` | Verifies JWT token and extracts user info |
| `roleMiddleware(['MASTER_ADMIN'])` | Restricts access to MASTER_ADMIN role only |

# Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Parameters

None

# Query Parameters

None

# Request Body

None (GET request)

# Validation Rules

No request body validation for GET request.

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "count": 3,
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "status": "PENDING",
        "branch": "Main Branch",
        "createdAt": "2026-01-10T08:20:00.000Z",
        "updatedAt": "2026-01-10T08:20:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "USER",
        "status": "PENDING",
        "branch": "North Branch",
        "createdAt": "2026-01-11T10:15:00.000Z",
        "updatedAt": "2026-01-11T10:15:00.000Z"
      }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `count` | number | Total number of pending users |
| `users` | array | Array of pending user objects |
| `users[].\_id` | string | User's MongoDB ObjectId |
| `users[].name` | string | User's full name |
| `users[].email` | string | User's email |
| `users[].role` | string | Always "USER" for new signups |
| `users[].status` | string | Always "PENDING" |
| `users[].branch` | string | User's branch |
| `users[].createdAt` | string (ISO 8601) | Signup timestamp |
| `users[].updatedAt` | string (ISO 8601) | Last update timestamp |

# Error Responses

### 401 Unauthorized - No Token

```json
{
  "success": false,
  "error": {
    "message": "No authorization header provided"
  }
}
```

### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

### 403 Forbidden - Insufficient Permissions

```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions for this action"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Pending users retrieved successfully |
| 401 | Authentication failed |
| 403 | User role is not MASTER_ADMIN |
| 500 | Server error |

# Database Models Used

**User Model**
- Queries `users` collection with filter `{ status: 'PENDING' }`
- Password field excluded from response (select: false)
- Uses index on `status` field for fast filtering
- Returns all matching documents

# Service Layer Used

**authService.getPendingUsers()**
- Queries database for users with status = PENDING
- Excludes password field from all results
- Returns object with count and users array

# Business Logic Flow

```
1. Admin sends GET request with valid MASTER_ADMIN token
   ↓
2. Auth middleware validates JWT token
   ↓
3. Role middleware verifies user role is MASTER_ADMIN
   ↓
4. Call authService.getPendingUsers()
   ↓
5. Query database for users with status = PENDING
   ↓
6. Exclude password field from all results
   ↓
7. Return count and users array
```

# Security Notes

- **Role Restricted:** Only MASTER_ADMIN can access this endpoint
- **Authentication Required:** Valid JWT token must be provided
- **Password Excluded:** Passwords never included in response
- **No Sensitive Data:** Only necessary fields returned

# Example Frontend Usage

```javascript
// Using fetch API (Admin Dashboard)
async function getPendingUsers() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/pending-users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  
  if (result.success) {
    console.log(`Found ${result.data.count} pending users`);
    displayPendingUsers(result.data.users);
  } else if (response.status === 403) {
    alert('You do not have permission to view this page');
  } else {
    console.error('Failed to get pending users:', result.error.message);
  }
}

function displayPendingUsers(users) {
  const html = users.map(user => `
    <div class="user-card">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Branch:</strong> ${user.branch}</p>
      <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
      <button onclick="approveUser('${user._id}')">Approve</button>
      <button onclick="rejectUser('${user._id}')">Reject</button>
    </div>
  `).join('');
  
  document.getElementById('pendingUsersList').innerHTML = html;
}
```

```javascript
// Using axios with interceptor
import axios from 'axios';

async function getPendingUsers() {
  try {
    const response = await axios.get('/api/auth/pending-users');
    console.log(`Found ${response.data.data.count} pending users`);
    displayPendingUsers(response.data.data.users);
  } catch (error) {
    if (error.response.status === 403) {
      alert('You do not have permission to view this page');
    } else {
      console.error('Failed:', error.response.data.error.message);
    }
  }
}
```

# Related APIs

- [Approve User](#8-approve-user) - Approve pending user
- [Reject User](#9-reject-user) - Reject pending user
- [Get User By ID](#10-get-user-by-id) - View specific user details

# Notes

- Only shows users with PENDING status
- Includes all information needed to make approval decision
- Admins should review user details before approval
- Can filter/sort results on frontend

---

### 8. Approve User

# API Name
**Approve User**

# Endpoint
```
PUT /api/auth/approve-user/:userId
```

# Controller Function
```
authController.approveUser()
```

# Purpose

This endpoint approves a pending user, allowing them to login to the system. The admin (MASTER_ADMIN) reviews the user and grants them access by changing their status from PENDING to APPROVED.

**Business Context:**
- Final step in 2-step user approval process
- Grants access to approved users
- Sends approval confirmation email
- Logs approval action for audit trail

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Protected (Authentication required) |
| **JWT Required** | Yes |
| **Bearer Token** | Required in Authorization header |
| **Required Roles** | MASTER_ADMIN only |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `authMiddleware` | Verifies JWT token and extracts user info |
| `roleMiddleware(['MASTER_ADMIN'])` | Restricts access to MASTER_ADMIN role only |

# Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | MongoDB ObjectId of user to approve |

**Example:** `/api/auth/approve-user/507f1f77bcf86cd799439011`

# Query Parameters

None

# Request Body

None

# Validation Rules

No request body validation.

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "User approved successfully",
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "APPROVED"
    }
  }
}
```

# Error Responses

### 400 Bad Request - User Not Found

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "User not found"
  }
}
```

### 400 Bad Request - Already Approved

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "User is already approved"
  }
}
```

### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

### 403 Forbidden - Not Admin

```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions for this action"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | User approved successfully |
| 400 | User not found or already approved |
| 401 | Authentication failed |
| 403 | User role is not MASTER_ADMIN |
| 500 | Server error |

# Database Models Used

**User Model**
- Finds user by `_id`
- Updates fields: `status` (APPROVED), `approvedAt` (current timestamp), `createdBy` (admin ID)

# Service Layer Used

**authService.approveUser(userId, adminId)**
- Receives userId from route param and adminId from JWT
- Finds user by userId
- Checks if user exists and not already approved
- Updates user status to APPROVED
- Sets approvalAt timestamp
- Records which admin approved (createdBy)
- Logs action in audit trail
- Sends approval email
- Returns success message and user data

# Business Logic Flow

```
1. Admin sends PUT request with userId and valid MASTER_ADMIN token
   ↓
2. Auth middleware validates JWT token
   ↓
3. Role middleware verifies user role is MASTER_ADMIN
   ↓
4. Extract userId from route and adminId from JWT
   ↓
5. Call authService.approveUser(userId, adminId)
   ↓
6. Find user by userId
   ↓
7. Check if user exists and status is not already APPROVED
   ↓
8. If user not found or already approved:
   - Return 400 error
   ↓
9. If user found and pending:
   - Update user.status = APPROVED
   - Set user.approvedAt = current timestamp
   - Set user.createdBy = adminId
   - Save to database
   - Log action in audit trail
   - Send approval email to user
   - Return success with user data
```

# Security Notes

- **Role Restricted:** Only MASTER_ADMIN can approve users
- **Admin Tracking:** Records which admin approved the user (createdBy field)
- **Email Notification:** Approval email sent to user
- **Audit Trail:** Approval logged for security audit
- **Status Validation:** Cannot approve already approved users

# Example Frontend Usage

```javascript
// Admin Dashboard - Approve User
async function approveUser(userId) {
  const token = localStorage.getItem('token');
  const confirmed = confirm('Are you sure you want to approve this user?');
  
  if (!confirmed) return;
  
  const response = await fetch(`/api/auth/approve-user/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('User approved:', result.data.user);
    alert('User approved successfully');
    // Refresh pending users list
    getPendingUsers();
  } else {
    console.error('Approval failed:', result.error.message);
    alert(result.error.message);
  }
}
```

# Related APIs

- [Get Pending Users](#7-get-pending-users) - View pending user list
- [Reject User](#9-reject-user) - Reject pending user

# Notes

- User must be in PENDING status before approval
- Cannot approve already approved users
- Approval email sent automatically
- Admin information is recorded for audit purposes
- Approved users can now login to the system

---

### 9. Reject User

# API Name
**Reject User**

# Endpoint
```
PUT /api/auth/reject-user/:userId
```

# Controller Function
```
authController.rejectUser()
```

# Purpose

This endpoint rejects a pending user application. The admin provides a reason for rejection, and a rejection email is sent to the user. Rejected users cannot login.

**Business Context:**
- Second outcome of user approval workflow
- Admin can deny access based on review
- Requires rejection reason for transparency
- Rejected users receive notification email

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Protected (Authentication required) |
| **JWT Required** | Yes |
| **Bearer Token** | Required in Authorization header |
| **Required Roles** | MASTER_ADMIN only |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `authMiddleware` | Verifies JWT token and extracts user info |
| `roleMiddleware(['MASTER_ADMIN'])` | Restricts access to MASTER_ADMIN role only |
| `validateRequest(authValidation.rejectUserSchema)` | Validates request body |

# Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | MongoDB ObjectId of user to reject |

# Query Parameters

None

# Request Body

```json
{
  "reason": "Application does not meet requirements"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | No | Reason for rejecting the user |

# Validation Rules

| Field | Rules |
|-------|-------|
| `reason` | Max 500 chars, Optional |

**Validation Schema:**
```javascript
rejectUserSchema: Joi.object({
  reason: Joi.string()
    .max(500)
    .messages({
      'string.max': 'Rejection reason must be less than 500 characters',
    }),
})
```

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "User rejected successfully"
  }
}
```

# Error Responses

### 400 Bad Request - User Not Found

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "User not found"
  }
}
```

### 400 Bad Request - Not Pending

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Only pending users can be rejected"
  }
}
```

### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

### 403 Forbidden - Not Admin

```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions for this action"
  }
}
```

### 422 Unprocessable Entity - Validation Error

```json
{
  "success": false,
  "error": {
    "status": 422,
    "message": "\"reason\" length must be less than or equal to 500 characters"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | User rejected successfully |
| 400 | User not found or not in PENDING status |
| 401 | Authentication failed |
| 403 | User role is not MASTER_ADMIN |
| 422 | Validation error |
| 500 | Server error |

# Database Models Used

**User Model**
- Finds user by `_id`
- Updates fields: `status` (REJECTED), `createdBy` (admin ID), `rejectionReason` (reason text)

# Service Layer Used

**authService.rejectUser(userId, adminId, reason)**
- Receives userId from route, adminId from JWT, and reason from body
- Finds user by userId
- Checks if user exists and status is PENDING
- Updates user status to REJECTED
- Stores rejection reason
- Records which admin rejected (createdBy)
- Logs action in audit trail
- Sends rejection email with reason
- Returns success message

# Business Logic Flow

```
1. Admin sends PUT request with userId, reason, and valid MASTER_ADMIN token
   ↓
2. Validate request schema (Joi validation)
   ↓
3. Auth middleware validates JWT token
   ↓
4. Role middleware verifies user role is MASTER_ADMIN
   ↓
5. Extract userId from route and adminId from JWT
   ↓
6. Call authService.rejectUser(userId, adminId, reason)
   ↓
7. Find user by userId
   ↓
8. Check if user exists and status is PENDING
   ↓
9. If user not found or not pending:
   - Return 400 error
   ↓
10. If user found and pending:
    - Update user.status = REJECTED
    - Set user.rejectionReason = reason
    - Set user.createdBy = adminId
    - Save to database
    - Log action in audit trail
    - Send rejection email with reason
    - Return success message
```

# Security Notes

- **Role Restricted:** Only MASTER_ADMIN can reject users
- **Admin Tracking:** Records which admin rejected the user
- **Reason Required:** Rejection reason stored and sent to user
- **Email Notification:** Rejection email sent to user
- **Audit Trail:** Rejection logged for security audit
- **Status Validation:** Cannot reject non-pending users

# Example Frontend Usage

```javascript
// Admin Dashboard - Reject User
async function rejectUser(userId) {
  const reason = prompt('Please provide a reason for rejection:');
  
  if (reason === null) return; // User cancelled
  
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/auth/reject-user/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('User rejected');
    alert('User rejected successfully');
    // Refresh pending users list
    getPendingUsers();
  } else {
    console.error('Rejection failed:', result.error.message);
    alert(result.error.message);
  }
}
```

# Related APIs

- [Get Pending Users](#7-get-pending-users) - View pending user list
- [Approve User](#8-approve-user) - Approve pending user

# Notes

- Only PENDING users can be rejected
- Rejection reason is stored with user record
- Rejected users receive email notification
- Rejected users cannot login to system
- Admin information is recorded for audit purposes

---

### 10. Get User By ID

# API Name
**Get User By ID**

# Endpoint
```
GET /api/auth/user/:userId
```

# Controller Function
```
authController.getUserById()
```

# Purpose

This endpoint retrieves the detailed profile information of a specific user by their ID. Used by admins to view user details before making approval/rejection decisions.

**Business Context:**
- Admin dashboard feature to view user details
- Used before making approval/rejection decisions
- Displays comprehensive user information
- Helps admins make informed decisions

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Protected (Authentication required) |
| **JWT Required** | Yes |
| **Bearer Token** | Required in Authorization header |
| **Required Roles** | MASTER_ADMIN only |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `authMiddleware` | Verifies JWT token and extracts user info |
| `roleMiddleware(['MASTER_ADMIN'])` | Restricts access to MASTER_ADMIN role only |

# Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | MongoDB ObjectId of user to retrieve |

# Query Parameters

None

# Request Body

None (GET request)

# Validation Rules

No request body validation for GET request.

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "PENDING",
    "branch": "Main Branch",
    "approvedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-01-10T08:20:00.000Z",
    "updatedAt": "2026-01-10T08:20:00.000Z"
  }
}
```

# Error Responses

### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

### 403 Forbidden - Not Admin

```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions for this action"
  }
}
```

### 404 Not Found - User Not Found

```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | User retrieved successfully |
| 401 | Authentication failed |
| 403 | User role is not MASTER_ADMIN |
| 404 | User not found |
| 500 | Server error |

# Database Models Used

**User Model**
- Queries `users` collection by `_id`
- Password field excluded from response

# Service Layer Used

**authService.getUserById(userId)**
- Receives userId from route parameter
- Queries database by _id
- Excludes password field
- Returns complete user data

# Business Logic Flow

```
1. Admin sends GET request with userId and valid MASTER_ADMIN token
   ↓
2. Auth middleware validates JWT token
   ↓
3. Role middleware verifies user role is MASTER_ADMIN
   ↓
4. Extract userId from route
   ↓
5. Call authService.getUserById(userId)
   ↓
6. Find user by _id
   ↓
7. If user not found:
   - Return 404 error
   ↓
8. If user found:
   - Return complete user data (without password)
```

# Security Notes

- **Role Restricted:** Only MASTER_ADMIN can access
- **Password Excluded:** Passwords never included in response
- **Admin Only:** Regular users cannot view other users

# Example Frontend Usage

```javascript
// Admin Dashboard - View User Details
async function viewUserDetails(userId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/auth/user/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('User details:', result.data);
    displayUserDetails(result.data);
  } else {
    console.error('Failed to get user:', result.error.message);
  }
}

function displayUserDetails(user) {
  const html = `
    <div class="user-detail-card">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Branch:</strong> ${user.branch}</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <p><strong>Status:</strong> ${user.status}</p>
      <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
      ${user.rejectionReason ? `<p><strong>Rejection Reason:</strong> ${user.rejectionReason}</p>` : ''}
    </div>
  `;
  
  document.getElementById('userDetails').innerHTML = html;
}
```

# Related APIs

- [Get Pending Users](#7-get-pending-users) - View all pending users
- [Approve User](#8-approve-user) - Approve user
- [Reject User](#9-reject-user) - Reject user

# Notes

- Only admins can view other users' details
- Includes all user information needed for admin decisions
- Shows rejection reason if user was rejected

---

### 11. Promote User

# API Name
**Promote User**

# Endpoint
```
PUT /api/auth/promote-user/:userId
```

# Controller Function
```
authController.promoteUser()
```

# Purpose

This endpoint promotes a regular USER to LEADER role. Only MASTER_ADMIN can perform this action. Promoted users gain additional permissions in the system.

**Business Context:**
- Elevates trusted users to leadership positions
- Grants additional permissions
- Role-based hierarchy (USER → LEADER → MASTER_ADMIN)
- Logs promotion for audit trail

# Authentication / Authorization

| Aspect | Value |
|--------|-------|
| **Route Type** | Protected (Authentication required) |
| **JWT Required** | Yes |
| **Bearer Token** | Required in Authorization header |
| **Required Roles** | MASTER_ADMIN only |

# Middleware Used

| Middleware | Purpose |
|------------|---------|
| `authMiddleware` | Verifies JWT token and extracts user info |
| `roleMiddleware(['MASTER_ADMIN'])` | Restricts access to MASTER_ADMIN role only |

# Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | MongoDB ObjectId of USER to promote |

# Query Parameters

None

# Request Body

None

# Validation Rules

No request body validation.

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "User promoted to leader successfully",
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "role": "LEADER"
    }
  }
}
```

# Error Responses

### 400 Bad Request - User Not Found

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "User not found"
  }
}
```

### 400 Bad Request - Not a User

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Only users can be promoted to leader"
  }
}
```

### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

### 403 Forbidden - Not Admin

```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions for this action"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | User promoted successfully |
| 400 | User not found or not a regular user |
| 401 | Authentication failed |
| 403 | User role is not MASTER_ADMIN |
| 500 | Server error |

# Database Models Used

**User Model**
- Finds user by `_id`
- Updates fields: `role` (LEADER), `createdBy` (admin ID)

# Service Layer Used

**authService.promoteUser(userId, adminId)**
- Receives userId from route and adminId from JWT
- Finds user by userId
- Checks if user exists and role is USER
- Updates user role to LEADER
- Records which admin promoted (createdBy)
- Logs action in audit trail
- Sends promotion email
- Returns success message and user data

# Business Logic Flow

```
1. Admin sends PUT request with userId and valid MASTER_ADMIN token
   ↓
2. Auth middleware validates JWT token
   ↓
3. Role middleware verifies user role is MASTER_ADMIN
   ↓
4. Extract userId from route and adminId from JWT
   ↓
5. Call authService.promoteUser(userId, adminId)
   ↓
6. Find user by userId
   ↓
7. Check if user exists and role is USER
   ↓
8. If user not found or not a regular user:
   - Return 400 error
   ↓
9. If user found and role is USER:
   - Update user.role = LEADER
   - Set user.createdBy = adminId
   - Save to database
   - Log action in audit trail
   - Send promotion email
   - Return success with user data
```

# Security Notes

- **Role Restricted:** Only MASTER_ADMIN can promote users
- **Role Validation:** Can only promote users with USER role
- **Admin Tracking:** Records which admin promoted the user
- **Email Notification:** Promotion email sent to user
- **Audit Trail:** Promotion logged for security audit
- **No Reverse:** Currently no demotion endpoint (consider adding)

**Security Risks Detected:**
⚠️ **MISSING FEATURE:** No endpoint to demote LEADER back to USER
⚠️ **MISSING FEATURE:** Consider adding demote-user endpoint for admin control

# Example Frontend Usage

```javascript
// Admin Dashboard - Promote User
async function promoteUserToLeader(userId) {
  const token = localStorage.getItem('token');
  const confirmed = confirm('Are you sure you want to promote this user to leader?');
  
  if (!confirmed) return;
  
  const response = await fetch(`/api/auth/promote-user/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('User promoted:', result.data.user);
    alert('User promoted to leader successfully');
    // Refresh user list
    getPendingUsers();
  } else {
    console.error('Promotion failed:', result.error.message);
    alert(result.error.message);
  }
}
```

# Related APIs

- [Get User By ID](#10-get-user-by-id) - View user details
- [Get Pending Users](#7-get-pending-users) - View pending users

# Notes

- Only users with USER role can be promoted
- LEADER users cannot be promoted further (MASTER_ADMIN is system role)
- Promotion email sent to user
- Admin information is recorded for audit purposes
- Promoted user role updated immediately

---

## Security

### JWT Implementation

The AUTH module implements JWT (JSON Web Tokens) for stateless authentication with the following features:

| Feature | Details |
|---------|---------|
| **Algorithm** | HS256 (HMAC with SHA-256) |
| **Expiration** | 7 days |
| **Payload** | userId, role, branch |
| **Secret** | Stored in `JWT_SECRET` environment variable |
| **Validation** | Verified on every protected request |

### Token Storage

**Best Practices (Frontend):**
- Store in secure HTTP-only cookies (preferred for security)
- Store in localStorage (if HTTP-only cookies unavailable)
- Never store in plain text
- Always send via Authorization header

### Password Security

| Aspect | Implementation |
|--------|-----------------|
| **Hashing Algorithm** | bcrypt |
| **Salt Rounds** | 10 |
| **Comparison** | bcrypt.compare() |
| **Storage** | Hashed only, never plain text |
| **Transmission** | HTTPS only |

### RBAC (Role-Based Access Control)

| Role | Permissions |
|------|------------|
| **USER** | View own profile, update own name |
| **LEADER** | All USER permissions + moderate content |
| **MASTER_ADMIN** | All permissions + user approval, role management |

### Email Security

All emails sent through SendGrid with HTML templates:
- Welcome email on signup
- Password reset link (expires in 15 minutes)
- Approval confirmation
- Rejection with reason
- Promotion notification

### Rate Limiting

**Status:** Not currently implemented

**Recommended Actions:**
- Add rate limiting on login attempts
- Add rate limiting on forgot-password endpoint
- Add rate limiting on signup endpoint
- Implement account lockout after N failed attempts

---

## Error Handling

### HTTP Status Codes

| Code | Usage |
|------|-------|
| **200** | Successful GET, PUT request |
| **201** | Successful resource creation (POST) |
| **400** | Validation errors, business logic errors |
| **401** | Authentication failed, invalid/expired token |
| **403** | Authorization failed, insufficient role |
| **404** | Resource not found |
| **422** | Unprocessable entity, validation error |
| **500** | Server error |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Descriptive error message"
  }
}
```

---

## Best Practices

### For Frontend Developers

1. **Always store token securely**
   ```javascript
   // ✅ GOOD
   localStorage.setItem('token', response.data.token);
   
   // ❌ BAD
   window.token = token;
   ```

2. **Always include token in protected requests**
   ```javascript
   // ✅ GOOD
   headers: {
     'Authorization': `Bearer ${token}`,
   }
   
   // ❌ BAD
   headers: {}
   ```

3. **Handle token expiration**
   ```javascript
   // ✅ GOOD - Redirect to login on 401
   if (error.response.status === 401) {
     localStorage.removeItem('token');
     window.location.href = '/login';
   }
   ```

4. **Use environment variables for API base URL**
   ```javascript
   // ✅ GOOD
   const API_URL = process.env.REACT_APP_API_URL;
   
   // ❌ BAD
   const API_URL = 'http://localhost:3000/api';
   ```

### For Backend Developers

1. **Always validate input**
   - Use Joi schemas for all endpoints
   - Sanitize email and password inputs
   - Validate branch requirements

2. **Always hash passwords**
   - Use bcrypt with 10+ salt rounds
   - Never store plain text passwords
   - Never return password in responses

3. **Always log security events**
   - Log all login attempts
   - Log password resets
   - Log user approvals/rejections
   - Log role changes

4. **Always use HTTPS in production**
   - Tokens vulnerable over HTTP
   - Passwords vulnerable over HTTP

---

## Documentation Metadata

| Property | Value |
|----------|-------|
| **Module** | AUTH |
| **Generated** | May 20, 2026 |
| **Version** | 1.0.0 |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (HS256) |
| **Language** | JavaScript (Node.js) |

---

## Summary

The AUTH module provides comprehensive authentication and authorization functionality with:

✅ **12 API Endpoints** covering signup, admin signup, login, password reset, user management, and admin controls

✅ **JWT-based Authentication** with 7-day token expiration

✅ **Role-Based Access Control (RBAC)** with 3 roles: USER, LEADER, MASTER_ADMIN

✅ **2-Step User Approval Workflow** for security

✅ **Password Security** using bcrypt with 10 salt rounds

✅ **Email Notifications** for all critical events

✅ **Comprehensive Audit Trail** for security monitoring

✅ **Input Validation** using Joi schemas

### Detected Issues & Recommendations

| Issue | Severity | Recommendation |
|-------|----------|-----------------|
| No email verification on signup | Medium | Add email verification before allowing login |
| No rate limiting | High | Implement rate limiting on auth endpoints |
| No login attempt tracking | Medium | Add failed login tracking and account lockout |
| No refresh token endpoint | Medium | Consider adding refresh token for long-lived sessions |
| No demote user endpoint | Low | Add ability to demote LEADER users back to USER |
| Token stored in localStorage | Low | Consider using HTTP-only cookies for better security |

---

**End of Documentation**
