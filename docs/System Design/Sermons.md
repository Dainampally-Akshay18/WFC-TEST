# 🎤 PHASE 3: SERMONS + CATEGORIES SYSTEM

---

# 🧱 1. Data Modeling

We’ll split this into **2 collections**:

---

## 📂 SermonCategory Schema

```js id="n3k0oj"
SermonCategory {
  _id
  name            // e.g., "Faith", "Prayer", "Grace"
  description

  createdBy       // adminId

  createdAt
  updatedAt
}
```

---

## 🎥 Sermon Schema

```js id="c2q8tz"
Sermon {
  _id

  title
  description

  youtubeLink     // original link
  youtubeVideoId  // extracted for faster use

  categoryId      // reference to SermonCategory

  speakerName     // optional (pastor/guest)
  thumbnail       // optional (can auto-fetch)

  createdBy       // adminId

  createdAt
  updatedAt
}
```

---

# 🧠 Important Design Decisions

---

## ✅ Why store `youtubeVideoId`?

Instead of:

```id="dfx1hs"
https://youtube.com/watch?v=abc123
```

Store:

```id="6qzq9s"
abc123
```

👉 Helps:

* Faster embedding
* Thumbnail generation
* Cleaner frontend

---

## ✅ Category-based organization

👉 This allows:

* Filtering
* Grouping
* Better UX

---

# 🔐 2. Access Control

---

## 👤 USERS

* Can:

  * View sermons
  * Filter/search

* Cannot:

  * Create
  * Update
  * Delete

---

## 🟠 LEADER / 🔴 ADMIN

* Full control:

  * Create category
  * Create sermon
  * Update/delete both

---

# 🧩 3. API Design

---

## 📂 Category APIs

---

### ➕ Create Category

```http id="o4qapf"
POST /sermon-categories
```

---

### 📖 Get Categories

```http id="y1n3yt"
GET /sermon-categories
```

---

### ✏️ Update Category

```http id="o8a0h3"
PUT /sermon-categories/:id
```

---

### ❌ Delete Category

```http id="9h9m7l"
DELETE /sermon-categories/:id
```

---

## 🎥 Sermon APIs

---

### ➕ Create Sermon

```http id="4v2y07"
POST /sermons
```

### Logic:

* Extract video ID from link
* Save both link + ID

---

### 📖 Get Sermons

```http id="3w6k7z"
GET /sermons
```

### Optional filters:

```id="76sxkm"
?category=ID
?search=faith
```

---

### ✏️ Update Sermon

```http id="9f1z6k"
PUT /sermons/:id
```

---

### ❌ Delete Sermon

```http id="3n7m3r"
DELETE /sermons/:id
```

---

# 🔍 4. Query Design (Important)

---

## Get sermons by category:

```js id="i6vh2t"
find({ categoryId })
```

---

## Search sermons:

```js id="z4x0z5"
find({
  title: { $regex: search, $options: "i" }
})
```

---

## Sort:

```js id="dh8fsc"
.sort({ createdAt: -1 })
```

---

# 🛡️ 5. Validations

---

### ❗ Invalid YouTube link

→ Reject

---

### ❗ Missing category

→ Reject

---

### ❗ Delete category with sermons

👉 Option:

* Prevent delete OR
* Cascade delete (your choice)

---

# 🧪 6. Edge Cases

---

### ❗ Same sermon added twice

👉 Optional:

* Prevent duplicate videoId

---

### ❗ Broken YouTube link

👉 Handle gracefully in UI

---

# 💡 7. Frontend UX Ideas (Important)

---

## 👤 User View

* Categories list (tabs or sidebar)
* Sermon cards:

  * Title
  * Thumbnail
  * Speaker
* Click → open video modal

---

## 🧑‍💼 Admin View

* Add category
* Add sermon form:

  * Paste YouTube link
  * Auto-fetch preview (optional 🔥)

---

# 🔔 8. Future Enhancements

* Save/bookmark sermons
* Watch history
* Likes/comments
* Playlist system

---

# 🧾 Final Flow Summary

```text id="4j2gl6"
Admin → creates categories
Admin → adds sermons (YT links)

Users → browse → filter → watch
```

---

# 🚀 What You Just Built

This is:

* A mini **content platform**
* Structured + scalable
* Clean separation of concerns

👉 This is **way above basic CRUD**

---

# ⚠️ Small Improvement Suggestion

Add:

```js id="vpyujt"
isPublished: true/false
```

👉 Allows:

* Draft sermons before publishing

---

