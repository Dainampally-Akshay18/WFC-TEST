# 📜 PHASE 7: AUDIT LOG SYSTEM

---

# 🧱 1. Audit Log Schema

```js
AuditLog {
  _id

  action          // "CREATE_EVENT", "APPROVE_USER", etc.

  performedBy     // userId
  performerRole   // USER | LEADER | MASTER_ADMIN

  targetId        // affected entity (eventId, userId, etc.)
  targetType      // "USER" | "EVENT" | "PRAYER" | "BLOG"

  metadata        // extra info (optional JSON)

  createdAt
}
```

---

# 🧠 Core Idea

👉 Every important action in your system should leave a **trace**

Think of it like:

> “Who did what, to what, and when”

---

# ⚡ 2. What Should Be Logged

---

## 👤 User Actions

* Signup
* Login (optional)
* Create event
* Update/delete own event
* Create prayer request
* Click “I prayed”

---

## 🔴 Admin / Leader Actions (VERY IMPORTANT)

* Approve/reject user
* Change role
* Create/update/delete:

  * Events
  * Sermons
  * Blogs
* Delete prayer requests

---

# 🧩 3. Example Logs

---

### ✅ User creates event

```js
{
  action: "CREATE_EVENT",
  performedBy: userId,
  performerRole: "USER",
  targetId: eventId,
  targetType: "EVENT"
}
```

---

### 🔴 Admin approves user

```js
{
  action: "APPROVE_USER",
  performedBy: adminId,
  performerRole: "MASTER_ADMIN",
  targetId: userId,
  targetType: "USER"
}
```

---

### 🙏 User clicks "I prayed"

```js
{
  action: "PRAYED",
  performedBy: userId,
  targetId: prayerId,
  targetType: "PRAYER"
}
```

---

# 🛠️ 4. Logging Strategy (VERY IMPORTANT)

---

## ❌ Wrong Way:

Write logs manually everywhere

👉 Leads to messy code

---

## ✅ Correct Way:

Create a helper:

```js
logAction({
  action,
  performedBy,
  performerRole,
  targetId,
  targetType,
  metadata
})
```

---

### Example Usage:

```js
await logAction({
  action: "CREATE_EVENT",
  performedBy: user.id,
  performerRole: user.role,
  targetId: event._id,
  targetType: "EVENT"
})
```

---

# 🔍 5. Admin View (UI)

---

## Admin Dashboard → Logs Page

Show:

* Action
* Who did it
* When
* Target

---

## Example Table:

| User  | Action        | Target         | Time     |
| ----- | ------------- | -------------- | -------- |
| John  | Created Event | Sunday Service | 10:30 AM |
| Admin | Approved User | Akshay         | 11:00 AM |

---

# 🔎 6. Filtering & Search

---

### Filter by:

* Action type
* User
* Date

---

### Query Example:

```js
find({
  action: "CREATE_EVENT"
})
```

---

# 🛡️ 7. Security Rules

---

## ❗ Only Admin/Leader can view logs

```js
checkRole(["MASTER_ADMIN", "LEADER"])
```

---

## ❗ Logs should NEVER be editable

👉 Immutable data

---

# 🧪 8. Edge Cases

---

### ❗ Large log data

→ Later:

* Pagination
* Archiving

---

### ❗ Sensitive data

→ Don’t store passwords/tokens

---

### ❗ Deleted entities

→ Logs still remain

---

# 💡 9. Metadata (Power Feature 🔥)

---

You can store:

```js
metadata: {
  eventTitle: "Sunday Service",
  previousRole: "USER",
  newRole: "LEADER"
}
```

👉 Makes logs more readable

---

# 🚀 10. Advanced Upgrade

---

## Real-time admin activity feed

```text
Admin dashboard → live updates
```

---

## Export logs

* CSV / Excel

---

# 🧾 Final Flow Summary

```text
User/Admin performs action
→ logAction() called
→ saved in AuditLog
→ Admin can view history
```

---

# 🚀 What You Just Built

This is:

* Enterprise-level feature
* Debugging tool
* Accountability system

👉 This is used in:

* Banking apps
* SaaS platforms
* Internal tools

---

# ⚠️ One Honest Note

Most developers:
❌ Ignore this
You:
✅ Included it

👉 This already puts your project ahead

---

