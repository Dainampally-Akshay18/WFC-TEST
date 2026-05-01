# 🔐 PHASE 1: AUTH SYSTEM DESIGN

---

# 🧱 1. User Schema (MongoDB)

This is your **core foundation**.

```js
User {
  _id
  name
  email
  password

  role: "MASTER_ADMIN" | "LEADER" | "USER"

  branch: "BRANCH1" | "BRANCH2" | null

  status: "PENDING" | "APPROVED" | "REJECTED"

  createdBy   // admin who approved/created
  approvedAt

  createdAt
  updatedAt
}
```

---

## 🧠 Important Logic

### 🔴 MASTER_ADMIN

* Created manually (seed script)
* Always:

  ```
  role = MASTER_ADMIN
  status = APPROVED
  ```

---

### 🟠 LEADER

* Signs up OR created by admin
* Must be:

  ```
  status = APPROVED
  ```

---

### 🔵 USER

* Signs up normally
* Default:

  ```
  role = USER
  status = PENDING
  branch = required
  ```

---

# 🔄 2. Signup Flow

## 🧾 Step-by-step:

### 👤 User Signup

1. User submits:

   * name
   * email
   * password
   * branch

2. Backend:

   * Hash password
   * Save user:

     ```
     role = USER
     status = PENDING
     ```

3. Response:

   ```
   "Account created. Waiting for admin approval."
   ```

---

### 🧑‍💼 Leader/Admin Signup

Two options:

👉 Option A (Recommended):

* Only admin can create them

👉 Option B:

* They signup → still `PENDING` → admin approves

---

# 🔐 3. Login Flow

## 🚫 Blocked Case (Important)

If:

```
status !== APPROVED
```

👉 Deny login:

```
"Your account is not approved yet"
```

---

## ✅ Allowed Case

1. Verify email + password
2. Generate JWT

```js
token = {
  userId,
  role,
  branch
}
```

3. Send token

---

# 🔑 4. JWT Strategy

### Payload:

```js
{
  userId: "...",
  role: "USER",
  branch: "BRANCH1"
}
```

### Why include role + branch?

👉 So backend can:

* Authorize quickly
* Avoid extra DB calls (sometimes)

---

# 🛡️ 5. Middleware System (VERY IMPORTANT)

You’ll create **3 layers**

---

## 🧩 1. Auth Middleware

```js
checkAuth
```

* Verify JWT
* Attach user to request

---

## 🧩 2. Role Middleware

```js
checkRole(["MASTER_ADMIN", "LEADER"])
```

* Only allow specific roles

---

## 🧩 3. Branch Middleware

```js
checkBranch
```

* Ensure:

  * User accesses only their branch data

---

# 🧠 Example Flow

### User accessing event:

```
Request → checkAuth → checkRole → checkBranch → Controller
```

---

# 🔐 6. Approval System (Core Feature)

## Admin Actions:

### ✅ Approve User

```js
status = APPROVED
approvedAt = now
createdBy = adminId
```

---

### ❌ Reject User

```js
status = REJECTED
```

---

### 🔄 Change Role

Admin can:

* Promote user → LEADER
* Demote leader → USER

---

## 🔴 Important: LEADER Limitations

LEADER Cannot:
- Promote users
- Delete users  
- Manage all branches (only their own)
- Promote users to ADMIN

Only MASTER_ADMIN can:
- Promote users to ADMIN
- Delete users
- Manage all branches


# 📜 7. Access Rules Summary

| Action             | USER             | LEADER           | MASTER_ADMIN |
| ------------------ | ---------------- | ---------------- | ------------ |
| Login              | Only if approved | Only if approved | Always       |
| Access Admin Panel | ❌                | ✅                | ✅            |
| Approve Users      | ❌                | ✅                | ✅            |
| Manage Roles       | ❌                | ❌     | ✅            |

---

# ⚠️ 8. Critical Security Rules

## ❌ Never trust frontend

Always check in backend:

* Role
* Status
* Branch

---

## 🔐 Password Security

* Use:

  ```
  bcrypt
  ```

---

## 🔐 Token Expiry

* Example:

  ```
  7d access token
  ```

---

# 🧪 9. Edge Cases (Most people forget)

### ❗ Duplicate email signup

→ Block

---

### ❗ User tries login while pending

→ Block

---

### ❗ Deleted / revoked user

→ Block

---

### ❗ Role changed after login

→ Handle via:

* Token refresh OR
* Re-login

---

# 🧾 Final Flow Summary

### Signup:

```
User → PENDING → Admin Approval → APPROVED → Login allowed
```

---

### Login:

```
Approved user → JWT → Access system
```

---

### Access:

```
JWT → Middleware → Role + Branch check → Data access
```

---

# 🚀 What You Just Built (Conceptually)

👉 This is:

* RBAC (Role-Based Access Control)
* Approval-based system
* Multi-tenant (branch logic)

This is **NOT beginner level anymore**

---

