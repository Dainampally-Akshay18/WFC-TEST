# 🧠 Updated Concept: Event Visibility

We need to introduce a new idea:

👉 **Visibility ≠ Branch**

---

# 🧱 Updated Event Schema

Add a new field:

```js
Event {
  _id
  title
  description
  date
  time
  location

  branch: "BRANCH1" | "BRANCH2" | null

  visibility: "BRANCH" | "GLOBAL"

  createdBy
  createdByRole

  createdAt
  updatedAt
}
```

---

# 🧠 How This Works

### 🔵 Case 1: User-created event

```js
branch = user.branch
visibility = "BRANCH"
```

👉 Only visible to that branch

---

### 🔴 Case 2: Admin creates event for one branch

```js
branch = "BRANCH1"
visibility = "BRANCH"
```

👉 Only Branch 1 users see it

---

### 🔥 Case 3: Admin creates GLOBAL event

```js
branch = null
visibility = "GLOBAL"
```

👉 BOTH Branch 1 + Branch 2 users see it

---

# 📖 Updated GET Events Logic

This is the most important change.

---

## 👤 USER

```js
events = find({
  $or: [
    { visibility: "GLOBAL" },
    { branch: user.branch }
  ]
})
```

👉 So user sees:

* Their branch events
* Global events

---

## 🟠 ADMIN / LEADER

```js
events = find({})
```

👉 See everything

---

# ➕ Updated Create Event API

```http
POST /events
```

---

## 👤 USER

```js
event.branch = user.branch
event.visibility = "BRANCH"
```

👉 Cannot create global events ❌

---

## 🔴 ADMIN / LEADER

They can choose:

```json
{
  "visibility": "GLOBAL"
}
```

OR

```json
{
  "branch": "BRANCH1",
  "visibility": "BRANCH"
}
```

---

# ⚠️ Important Rule

👉 If:

```js
visibility === "GLOBAL"
```

Then:

```js
branch = null
```

---

# 🔐 Updated Permissions Summary

| Action              | USER | ADMIN/LEADER |
| ------------------- | ---- | ------------ |
| Create branch event | ✅    | ✅            |
| Create global event | ❌    | ✅            |
| View global events  | ✅    | ✅            |

---

# 🧪 Edge Cases (New Ones)

---

### ❗ User tries to send:

```json
{ "visibility": "GLOBAL" }
```

👉 Ignore or reject ❌

---

### ❗ Admin sends:

```json
{ "visibility": "GLOBAL", "branch": "BRANCH1" }
```

👉 Force:

```js
branch = null
```

---

# 💡 UI Impact (Important)

Now in frontend:

### Admin Panel:

* Option:

  * 🌍 Global Event
  * 🏠 Branch Event

---

### User Panel:

* Show:

  * Their branch events
  * Global events (mixed list)

---

# 🧾 Final Updated Flow

```text
User sees:
→ Their branch events
→ Global events

Admin creates:
→ Branch-specific OR Global
```

---

# 🚀 This Was a Smart Addition

This makes your system:

* More realistic
* More flexible
* More product-like

---

## 👉 You said “one more thing…”

Finish that thought.

Then we’ll move to:
👉 **Sermons System Design**
