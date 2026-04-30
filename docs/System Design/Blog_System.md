# ✍️ PHASE 5: PASTOR’S BLOG SYSTEM

---

# 🧱 1. Blog Schema (MongoDB)

```js
Blog {
  _id

  title
  content        // rich text / HTML

  authorId       // Master Admin (Pastor)
  authorName

  thumbnail      // optional image

  tags: [String] // e.g., ["faith", "hope"]

  isPublished: true/false   // draft vs live

  publishedAt

  createdAt
  updatedAt
}
```

---

# 🧠 Core Idea

👉 Only **Master Admin (Pastor)** writes blogs
👉 Users → **read-only**

This is your:
👉 Teaching / message / article system

---

# 🔐 2. Access Control

---

## 👤 USERS

* Can:

  * View blogs
  * Search/filter

* Cannot:

  * Create/update/delete

---

## 🔴 MASTER ADMIN (Pastor)

* Full control:

  * Create blog
  * Edit blog
  * Delete blog
  * Publish/unpublish

---

## 🟠 LEADERS

👉 Your decision:

* Option A: Read-only
* Option B: Allow posting

👉 I recommend:
👉 **ONLY Pastor writes blogs** (keeps authority clear)

---

# 🧩 3. API Design

---

## ➕ Create Blog (Draft)

```http
POST /blogs
```

```js
isPublished = false
```

---

## ✏️ Update Blog

```http
PUT /blogs/:id
```

---

## 🚀 Publish Blog

```http
PATCH /blogs/:id/publish
```

```js
isPublished = true
publishedAt = now
```

---

## ❌ Delete Blog

```http
DELETE /blogs/:id
```

---

## 📖 Get Blogs (User)

```http
GET /blogs
```

---

## Logic:

```js
find({ isPublished: true }).sort({ publishedAt: -1 })
```

---

## 📖 Get Single Blog

```http
GET /blogs/:id
```

---

# 🔍 4. Search & Filter

---

### 🔎 Search:

```js
title OR content
```

---

### 🏷️ Filter by tags:

```js
find({ tags: "faith" })
```

---

# 🛡️ 5. Validations

---

### ❗ Empty content

→ Reject

---

### ❗ Publish without content

→ Reject

---

### ❗ Only MASTER_ADMIN allowed

→ Strict backend check

---

# 🧪 6. Edge Cases

---

### ❗ Draft visible to users

→ NEVER allow

---

### ❗ Delete published blog

→ Allowed (admin decision)

---

### ❗ Edit after publish

→ Allowed

---

# 💡 7. UI Design (Important)

---

## 👤 User View

* Blog list:

  * Title
  * Thumbnail
  * Short preview
* Click → Full article page

---

## 🔴 Admin View

* Rich text editor (important 🔥)
* Buttons:

  * Save Draft
  * Publish

---

# 🔔 8. Optional Enhancements (🔥)

---

### ❤️ Likes system

```js
likesCount
likedBy
```

---

### 💬 Comments

* Users can comment

---

### 📌 Featured blog

```js
isFeatured
```

---

### 🔔 Notifications

* Notify users when new blog is published

---

# 🧾 Final Flow Summary

```text
Admin writes → saves draft → publishes

Users → browse → read → engage
```

---

# 🚀 What You Just Built

This is:

* A **content publishing system**
* Structured + scalable
* Real-world CMS logic

👉 This is not basic anymore

---

# ⚠️ One Smart Upgrade

Add:

```js
slug   // for SEO-friendly URLs
```

Example:

```text
/how-to-strengthen-faith
```

---


