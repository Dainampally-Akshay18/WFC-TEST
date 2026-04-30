# 🔔 PHASE 6: NOTIFICATION SYSTEM

---

# 🧱 1. Notification Schema

```js
Notification {
  _id

  userId            // who receives it

  title             // short message
  message           // detailed message

  type              // "EVENT" | "PRAYER" | "BLOG" | "APPROVAL"

  referenceId       // eventId / blogId / prayerId

  isRead: false

  createdAt
}
```

---

# 🧠 Core Idea

👉 Notifications are **user-specific**
👉 Triggered automatically when something happens

---

# ⚡ 2. When Notifications Are Created

---

## ✅ 1. User Approval

When admin approves a user:

```text
"Your account has been approved"
```

→ Sent to that user only

---

## 📅 2. Event Created

### Case 1: Branch Event

→ Notify users of that branch

### Case 2: Global Event

→ Notify all users

---

## 🙏 3. Prayer Request (Optional)

* When someone prays:

```text
"Someone prayed for your request"
```

---

## ✍️ 4. Blog Published

→ Notify all users:

```text
"New blog posted by Pastor"
```

---

# 🧩 3. API Design

---

## 📖 Get Notifications

```http
GET /notifications
```

### Logic:

```js
find({ userId }).sort({ createdAt: -1 })
```

---

## ✔️ Mark as Read

```http
PATCH /notifications/:id/read
```

---

## ✔️ Mark All as Read

```http
PATCH /notifications/read-all
```

---

# 🛠️ 4. How Notifications Are Triggered

This is important.

👉 Don’t create notifications in controllers directly everywhere (messy)

---

## ✅ Better Approach:

Create a helper/service:

```js
createNotification(userId, title, message, type, referenceId)
```

---

### Example:

When event is created:

```js
if (event.visibility === "GLOBAL") {
   notify all users
} else {
   notify users of that branch
}
```

---

# 🧠 5. Read/Unread Logic

---

## Default:

```js
isRead = false
```

---

## UI:

* Show badge 🔴 (unread count)

---

# 🔍 6. Query Optimization

Add index:

```js
userId + createdAt
```

---

# 🧪 7. Edge Cases

---

### ❗ Too many notifications

→ Later:

* Pagination
* Limit (e.g., last 50)

---

### ❗ Deleted reference

→ Notification still stays (no issue)

---

### ❗ Spam notifications

→ Avoid unnecessary triggers

---

# 💡 8. UI Ideas

---

## 🔔 Navbar Icon

* Bell icon
* Badge count

---

## 📜 Dropdown

* Latest notifications
* Click → redirect to feature

---

# 🚀 9. Advanced Upgrade (🔥)

---

## Real-Time Notifications

Use:

* Socket.io

Flow:

```text
Event created → emit → user sees instantly
```

---

## Push Notifications (later)

* Mobile / browser push

---

# 🧾 Final Flow Summary

```text
Action happens → notification created → user fetches → marks read
```

---

# 🚀 What You Just Built

This is:

* Event-driven system
* User engagement layer
* Real product behavior

👉 This is what makes apps feel **interactive**

---

# ⚠️ Important Advice

Start with:
👉 **Simple DB-based notifications**

Then upgrade to:
👉 Real-time (later)

---

