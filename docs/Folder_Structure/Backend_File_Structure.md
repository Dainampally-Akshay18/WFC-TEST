# 🧠 CORE PRINCIPLES (Read this once)

Before structure, understand rules:

* ✅ Separation of concerns (no mixed logic)
* ✅ Feature-based modularity (not random files)
* ✅ Reusable utilities (auth, mail, logging)
* ✅ Centralized error handling
* ❌ No business logic in routes
* ❌ No DB logic in controllers directly

---

# 🧱 FINAL BACKEND STRUCTURE

```
backend/
│
├── src/
│   ├── config/
│   ├── modules/
│   ├── middleware/
│   ├── utils/
│   ├── services/
│   ├── jobs/
│   ├── constants/
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
```

---

# 🔥 1. CONFIG LAYER

```
src/config/
│
├── db.js
├── cloudinary.js
├── sendgrid.js
```

---

## Responsibilities:

* DB connection (**MongoDB**)
* Cloudinary setup
* SendGrid setup

👉 No business logic here

---

# 🧩 2. MODULES (FEATURE-BASED ARCHITECTURE)

This is the **most important design choice**

```
src/modules/
│
├── auth/
├── user/
├── event/
├── sermon/
├── prayer/
├── blog/
├── notification/
├── audit/
```

---

## Inside EACH module:

Example: `event/`

```
event/
│
├── event.model.js
├── event.controller.js
├── event.service.js
├── event.routes.js
├── event.validation.js
```

---

## 🧠 Why this structure?

* Each feature is **self-contained**
* Easy to scale
* Easy to debug
* Industry standard

---

# 🧠 Layer Responsibilities

---

## 🟡 controller

* Handles request/response
* Calls service
* No heavy logic

---

## 🔵 service (IMPORTANT)

* Business logic lives here
* DB operations
* Rules (branch, role, etc.)

---

## 🟢 model

* Mongoose schema

---

## 🟣 routes

* Express routes
* Attach middleware

---

## 🟠 validation

* Input validation (Joi/Zod later)

---

# 🛡️ 3. MIDDLEWARE

```
src/middleware/
│
├── auth.middleware.js
├── role.middleware.js
├── error.middleware.js
├── validate.middleware.js
```

---

## Responsibilities:

* JWT verification
* Role checking
* Error handling
* Request validation

---

# 🔧 4. SERVICES (GLOBAL)

```
src/services/
│
├── email.service.js
├── notification.service.js
├── audit.service.js
├── cloudinary.service.js
```

---

## Why separate from modules?

These are **cross-cutting concerns**

Used by multiple modules:

* Auth → email
* Events → notifications
* Everything → audit logs

---

# 🧰 5. UTILS

```
src/utils/
│
├── generateToken.js
├── hashPassword.js
├── extractYoutubeId.js
├── asyncHandler.js
```

---

## Purpose:

* Reusable helper functions
* Keep code DRY

---

# 📦 6. CONSTANTS

```
src/constants/
│
├── roles.js
├── status.js
├── eventTypes.js
```

---

Example:

```js
export const ROLES = {
  MASTER_ADMIN: "MASTER_ADMIN",
  LEADER: "LEADER",
  USER: "USER"
}
```

---

# ⚙️ 7. JOBS (OPTIONAL BUT POWERFUL)

```
src/jobs/
│
├── cleanup.job.js
├── notification.job.js
```

---

## Use cases:

* Delete expired tokens
* Archive old data

---

# 🚀 8. CORE FILES

---

## app.js

* Express app setup
* Middleware
* Routes registration

---

## server.js

* Starts server
* Connects DB

---

# 🧩 9. ROUTE REGISTRATION

Inside `app.js`:

```js
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/prayers", prayerRoutes)
```

---

# 🔐 10. REQUEST FLOW (IMPORTANT)

```text
Route
 → Middleware (auth, role)
 → Controller
 → Service
 → Model (DB)
 → Response
```

---

# 🔥 11. EXAMPLE FLOW (REAL)

### Create Event:

```text
POST /events

→ authMiddleware
→ eventController.createEvent
→ eventService.createEvent
→ EventModel.create()
→ notificationService.trigger()
→ auditService.log()
```

---

# ⚠️ 12. CRITICAL RULES (NO COMPROMISE)

---

## ❌ Don’t do this:

```js
// inside controller
Event.create(...)
sendEmail(...)
logAction(...)
```

---

## ✅ Do this:

```js
// controller
await eventService.createEvent(data)
```

---

# 🧠 13. SCALABILITY BENEFITS

This structure allows:

* Add new features easily
* Replace DB later (if needed)
* Add microservices later
* Clean team collaboration

---

# 🧾 FINAL VISUAL

```text
modules → business logic
services → shared logic
middleware → security
utils → helpers
config → setup
```

---

# 🚀 REALITY CHECK

This is:

* Not beginner-level
* Not tutorial-level

👉 This is **production architecture**

---

