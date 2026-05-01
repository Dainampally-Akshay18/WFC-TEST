# 🚀 FINAL TECH STACK (UPDATED)

---

# 🖥️ FRONTEND

* **React**
* **Vite**
* **Tailwind CSS**
* **Axios**

---

# 🧠 BACKEND

* **Node.js**
* **Express.js**

---

# 🗄️ DATABASE

* **MongoDB**
* **Mongoose**

---

# 🔐 AUTH & SECURITY

* **JSON Web Token**
* **bcrypt**

👉 Token stored in:

* HTTP-only cookies (recommended)

---

# 📩 EMAIL SYSTEM

* **SendGrid** ✅

Used for:

* Forgot password
* Account approval
* Notifications (optional)

---

# 🖼️ MEDIA HANDLING (UPDATED)

* **Cloudinary** ✅

---

## 🧠 Where you’ll use Cloudinary

### ✍️ Blog

* Thumbnail images

### 🎤 Sermons

* Optional thumbnails

### 👤 (Future)

* User profile images

---

## 🔄 How it works (simple flow)

```text
Frontend → Upload image → Backend → Cloudinary
→ Returns URL → Store URL in MongoDB
```

---

## 🧾 What you store in DB

```js
thumbnail: "https://res.cloudinary.com/.../image.jpg"
```

👉 NEVER store actual images in DB ❌

---

# 🔔 NOTIFICATIONS

* Phase 1 → MongoDB (DB-based)
* Phase 2 → **Socket.IO**

---

# 🧪 DEV TOOLS

* **Postman**
* Nodemon

---

# ☁️ DEPLOYMENT

* Frontend → **Vercel**
* Backend → **Render**
* DB → **MongoDB Atlas**
* Email → SendGrid
* Media → Cloudinary

---

# 🔐 ENV VARIABLES (UPDATED)

```env
MONGO_URI=
JWT_SECRET=

SENDGRID_API_KEY=
EMAIL_FROM=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=
```

---

# 🧠 FINAL ARCHITECTURE (MENTAL MODEL)

```text
React (Frontend)
   ↓
Node + Express (Backend)
   ↓
MongoDB (Data)

SendGrid → Emails
Cloudinary → Media
Socket.IO → (later realtime)
```

---

# 🚀 WHY THIS STACK IS 🔥

* Real-world tools (not beginner hacks)
* Scalable
* Clean separation:

  * Data → MongoDB
  * Media → Cloudinary
  * Email → SendGrid

👉 This is how production apps are built.

---

# ⚠️ ONE IMPORTANT RULE

👉 Keep responsibilities separate:

* ❌ Don’t store images in DB
* ❌ Don’t send emails from frontend
* ❌ Don’t trust frontend for auth

---

