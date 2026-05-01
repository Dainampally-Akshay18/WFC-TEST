
# 🙏 PHASE 4: PRAYER REQUEST SYSTEM

---

# 🧱 1. Prayer Request Schema
```
PrayerRequest {
  _id

  title
  description

  isAnonymous: true/false

  createdBy
  creatorName

  status: "ACTIVE" | "PRAYED" | "ARCHIVED"

  prayerCount: Number   // 👈 NEW FIELD

  prayedBy: [userId]    // 👈 IMPORTANT (to prevent duplicates)

  createdAt
  updatedAt
}

```

---

# 🧠 Core Idea

👉 This is a **global feature**
(No branch restriction)

Everyone:

* Can create
* Can view

---

# 🔐 2. Access Control

---

## 👤 USERS

### Can:

* Create prayer request
* View all prayer requests
* Update/Delete → ONLY their own (optional rule)

---

## 🟠 LEADER / 🔴 ADMIN

### Can:

* View all
* Delete inappropriate ones
* Change status (ACTIVE → PRAYED → ARCHIVED)

---

# ✍️ 3. Create Prayer Request

```http
POST /prayer-requests
```

---

## Logic:

### Case 1: Normal request

```js
createdBy = user.id
creatorName = user.name
isAnonymous = false
```

---

### Case 2: Anonymous request (User is LOGGED IN)

⚠️ IMPORTANT: User MUST be logged in to create prayer

```js
createdBy = user.id     // ✅ Still tracked internally
creatorName = "Anonymous"
isAnonymous = true
```
---

# 📖 4. Get Prayer Requests

```http
GET /prayer-requests
```

---

## Logic:

```js
find({}).sort({ createdAt: -1 })
```

---

# ✏️ 5. Update Prayer Request

```http
PUT /prayer-requests/:id
```

---

## Rules:

### 👤 USER

```js
allow only if request.createdBy === user.id
```

---

### 🟠 ADMIN/LEADER

```js
allow always
```

---

# ❌ 6. Delete Prayer Request

```http
DELETE /prayer-requests/:id
```

Same rules as update.

---

# 🔄 7. Status System (Important)

---

## Status meanings:

| Status   | Meaning                       |
| -------- | ----------------------------- |
| ACTIVE   | Needs prayer                  |
| PRAYED   | Someone prayed / acknowledged |
| ARCHIVED | Old/closed                    |

---

## Who can change status?

* Admin / Leader → ✅
* User → ❌ (recommended)

---

# 🛡️ 8. Moderation (Important)

Because this is **public content**, you must handle:

### ❗ Inappropriate content

→ Admin can delete

---

### ❗ Spam

→ Later add:

* Rate limiting
* CAPTCHA

---

# 🧪 9. Edge Cases

---

### ❗ Anonymous user tries to edit

→ Not possible (no ownership)

---

### ❗ Deleted user’s prayer request

→ Keep it (do not delete)

---

### ❗ Empty content

→ Reject

---

# 💡 10. UI Ideas (Important)

---

## 👤 User Side

* List of prayer requests
* Button: “Add Prayer Request”
* Toggle:

  * Anonymous / Not

---

## 🧑‍💼 Admin Side

* Moderate requests
* Change status
* Delete

---

# 🔔 11. Core Enhancements (🔥)

---

### 🙏 “I Prayed” Button

* Increment counter:

```js
prayerCount
```

---


# 🧾 Final Flow Summary

```text
User → creates request (anonymous or not)
→ Visible to everyone

Admin → moderates + updates status
```

---

# 🚀 What You Just Built

This is:

* A **community feature**
* Not just CRUD
* Emotion-driven + interactive

👉 This makes your project feel **real, not just technical**

---
