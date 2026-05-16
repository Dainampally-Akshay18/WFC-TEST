# 🙏 PRAYER MODULE - COMPLETE IMPLEMENTATION GUIDE

## ✅ Implementation Status: COMPLETE

All 5 required files have been implemented in `/backend/src/modules/prayer/`:

1. ✅ **prayer.model.js** - Mongoose schema with all required fields
2. ✅ **prayer.service.js** - Complete business logic (7 methods)
3. ✅ **prayer.controller.js** - HTTP request handlers (thin layer)
4. ✅ **prayer.routes.js** - All API endpoints with middleware
5. ✅ **prayer.validation.js** - Joi validation schemas

---

## 📋 API ENDPOINTS

### 1️⃣ CREATE PRAYER REQUEST
```
POST /api/prayers
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "title": "Request for healing",
  "description": "Please pray for my grandmother's recovery from surgery",
  "isAnonymous": false  // optional, default: false
}

Response (201 Created):
{
  "success": true,
  "data": {
    "_id": "prayer123",
    "title": "Request for healing",
    "description": "Please pray for my grandmother's recovery from surgery",
    "createdBy": "user123",
    "creatorName": "John Doe",
    "isAnonymous": false,
    "status": "ACTIVE",
    "prayerCount": 0,
    "prayedBy": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Prayer request created successfully"
}
```

**Rules:**
- User must be authenticated
- If `isAnonymous: true` → `creatorName` will be "Anonymous" (but `createdBy` still tracked internally)
- Default status = "ACTIVE"
- Default prayerCount = 0

---

### 2️⃣ CREATE ANONYMOUS PRAYER REQUEST
```
POST /api/prayers
Authorization: Bearer {token}

Request Body:
{
  "title": "Need strength",
  "description": "Struggling with personal challenges, need divine guidance",
  "isAnonymous": true  // Make it anonymous
}

Response:
{
  "success": true,
  "data": {
    "_id": "prayer124",
    "creatorName": "Anonymous",  // ← Hidden from frontend
    "isAnonymous": true,
    // ... other fields
  }
}

Important:
- User MUST still be logged in
- createdBy tracks the actual user internally
- Frontend only sees "Anonymous"
```

---

### 3️⃣ GET ALL PRAYER REQUESTS
```
GET /api/prayers
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "_id": "prayer123",
      "title": "Request for healing",
      "description": "...",
      "creatorName": "John Doe",
      "isAnonymous": false,
      "status": "ACTIVE",
      "prayerCount": 25,           // ← Updated count
      "hasPrayed": false,          // ← Current user's status
      "prayedBy": ["user1", "user2", ...],
      "createdAt": "2024-01-15T10:30:00Z"
    },
    // ... more prayers (sorted by newest first)
  ],
  "count": 42  // Total number of prayers
}
```

**Features:**
- Returns ALL prayers (no branch restrictions)
- Sorted by creation date (newest first)
- Includes `prayerCount` (number of people who prayed)
- Includes `hasPrayed` flag (whether current user has prayed)

---

### 4️⃣ GET SPECIFIC PRAYER REQUEST
```
GET /api/prayers/:id
Authorization: Bearer {token}

Example: GET /api/prayers/prayer123

Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "prayer123",
    "title": "Request for healing",
    "description": "...",
    "creatorName": "John Doe",
    "isAnonymous": false,
    "status": "ACTIVE",
    "prayerCount": 25,
    "hasPrayed": false,
    "prayedBy": ["user1", "user2", ...],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 5️⃣ UPDATE PRAYER REQUEST
```
PUT /api/prayers/:id
Content-Type: application/json
Authorization: Bearer {token}

Request Body (any or all fields):
{
  "title": "Updated title",
  "description": "Updated description",
  "isAnonymous": true
}

Response (200 OK):
{
  "success": true,
  "data": {
    // ... updated prayer
  },
  "message": "Prayer request updated successfully"
}
```

**Access Rules:**
- ✅ USER: can update ONLY their own prayers
- ✅ LEADER/MASTER_ADMIN: can update ANY prayer

**Error:**
- ❌ If user tries to update someone else's prayer (not their own):
  ```json
  {
    "success": false,
    "error": {
      "message": "You can only update your own prayer requests"
    }
  }
  ```

---

### 6️⃣ DELETE PRAYER REQUEST
```
DELETE /api/prayers/:id
Authorization: Bearer {token}

Example: DELETE /api/prayers/prayer123

Response (200 OK):
{
  "success": true,
  "data": {
    "message": "Prayer request deleted successfully"
  }
}
```

**Access Rules:**
- ✅ USER: can delete ONLY their own prayers
- ✅ LEADER/MASTER_ADMIN: can delete ANY prayer

---

### 7️⃣ UPDATE PRAYER STATUS (ADMIN ONLY)
```
PATCH /api/prayers/:id/status
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "status": "PRAYED"  // Must be: ACTIVE | PRAYED | ARCHIVED
}

Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "prayer123",
    "status": "PRAYED",  // ← Updated
    // ... other fields
  },
  "message": "Prayer status updated successfully"
}
```

**Status Meanings:**
- `ACTIVE` - Needs prayer / open request
- `PRAYED` - Someone prayed / acknowledged
- `ARCHIVED` - Old / closed request

**Access Rules:**
- ✅ LEADER: can change status
- ✅ MASTER_ADMIN: can change status
- ❌ USER: cannot change status

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Only Leaders and Admins can change prayer status"
  }
}
```

---

### 8️⃣ "I PRAYED" FEATURE (VERY IMPORTANT)
```
POST /api/prayers/:id/pray
Authorization: Bearer {token}

Request Body: (empty)

Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "prayer123",
    "title": "Request for healing",
    "prayerCount": 26,      // ← Incremented!
    "hasPrayed": true,      // ← You just prayed
    "prayedBy": ["user1", "user2", "user123", ...],
    // ... other fields
  },
  "message": "Thank you for praying!"
}
```

**TOGGLE BEHAVIOR (Duplicate Prevention):**

**First time user prays:**
- ✅ Add user to `prayedBy` array
- ✅ Increment `prayerCount`
- ✅ Send notification to prayer creator
- ⚠️ Don't notify if user is praying for their own prayer

**Second time user prays (click again):**
- ✅ Remove user from `prayedBy` array
- ✅ Decrement `prayerCount`
- ✅ No notification sent

**Example Flow:**
```
User clicks "I Prayed"
  → prayerCount: 10 → 11
  → hasPrayed: false → true

User clicks "I Prayed" again
  → prayerCount: 11 → 10
  → hasPrayed: true → false
```

---

## 🔐 ACCESS CONTROL MATRIX

| Action | USER | LEADER | MASTER_ADMIN |
|--------|------|--------|--------------|
| Create prayer | ✅ | ✅ | ✅ |
| View all prayers | ✅ | ✅ | ✅ |
| View single prayer | ✅ | ✅ | ✅ |
| Update own prayer | ✅ | ✅ | ✅ |
| Update any prayer | ❌ | ✅ | ✅ |
| Delete own prayer | ✅ | ✅ | ✅ |
| Delete any prayer | ❌ | ✅ | ✅ |
| Change status | ❌ | ✅ | ✅ |
| "I Prayed" | ✅ | ✅ | ✅ |

---

## 📊 PRAYER SCHEMA

```javascript
Prayer {
  _id: ObjectId,
  
  // Content
  title: String (3-150 chars),
  description: String (10-2000 chars),
  
  // Creator
  createdBy: ObjectId (ref User),
  creatorName: String ("John Doe" or "Anonymous"),
  
  // Privacy
  isAnonymous: Boolean (default: false),
  
  // Status
  status: String ("ACTIVE" | "PRAYED" | "ARCHIVED"),
  
  // Prayer Counter
  prayerCount: Number (default: 0),
  prayedBy: [ObjectId] (array of userIds),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ VALIDATION RULES

### Create/Update Prayer:
```
title:
  - Required (for create)
  - Min 3 characters
  - Max 150 characters

description:
  - Required (for create)
  - Min 10 characters
  - Max 2000 characters

isAnonymous:
  - Optional
  - Must be boolean
  - Default: false
```

### Update Status:
```
status:
  - Required
  - Must be: "ACTIVE" | "PRAYED" | "ARCHIVED"
```

---

## 🔔 NOTIFICATIONS AUTOMATICALLY SENT

When a user prays for a prayer request:
- ✅ **Notification created** for prayer creator
- ✅ **Type:** PRAYER
- ✅ **Title:** "Someone prayed for your request"
- ✅ **Message:** "Someone prayed for your prayer request"
- ⚠️ **Important:** NOT sent if user prays for their own prayer

---

## 📜 AUDIT LOGS AUTOMATICALLY CREATED

Every action is logged:

| Action | Logged As |
|--------|-----------|
| Create prayer | `CREATE_PRAYER` |
| Update prayer | `UPDATE_PRAYER` |
| Delete prayer | `DELETE_PRAYER` |
| "I Prayed" | `PRAYED` |

Example audit log:
```json
{
  "action": "CREATE_PRAYER",
  "performedBy": "user123",
  "performerRole": "USER",
  "targetId": "prayer456",
  "targetType": "PRAYER",
  "metadata": {
    "title": "Request for healing",
    "isAnonymous": false
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 🧪 EDGE CASES HANDLED

✅ **Anonymous prayers** - `createdBy` tracked internally, `creatorName` = "Anonymous"
✅ **Duplicate prayer prevention** - Using `prayedBy` array
✅ **Self-notification prevention** - Don't notify user for their own prayer
✅ **Deleted user's prayers** - Prayer preserved, user can be deleted
✅ **Invalid status values** - Rejected with validation error
✅ **Ownership validation** - Users can't modify/delete others' prayers
✅ **Empty requests** - Rejected with validation error
✅ **Non-existent prayers** - Return 404 error

---

## 🚀 FEATURES SUMMARY

| Feature | Status |
|---------|--------|
| Create prayer (normal & anonymous) | ✅ Complete |
| View all prayers | ✅ Complete |
| View single prayer | ✅ Complete |
| Update prayer | ✅ Complete |
| Delete prayer | ✅ Complete |
| Change status (admin) | ✅ Complete |
| "I Prayed" toggle | ✅ Complete |
| Duplicate prevention | ✅ Complete |
| Notifications | ✅ Complete |
| Audit logging | ✅ Complete |
| Access control | ✅ Complete |
| Validation | ✅ Complete |
| Error handling | ✅ Complete |

---

## 🏗️ ARCHITECTURE

### File Structure:
```
backend/src/modules/prayer/
├── prayer.model.js       (Schema)
├── prayer.service.js     (Business Logic)
├── prayer.controller.js  (HTTP Handlers)
├── prayer.routes.js      (API Routes)
└── prayer.validation.js  (Validation)
```

### Layers:
```
Request
  ↓
Routes (middleware: auth, validate)
  ↓
Controller (receives request)
  ↓
Service (business logic)
  ↓
Model (database)
  ↓
Response
```

### Integrations:
- ✅ Auth middleware (protects routes)
- ✅ Role middleware (restricts admin actions)
- ✅ Validate middleware (validates requests)
- ✅ Audit helper service (logs actions)
- ✅ Notification model (sends notifications)

---

## 🎯 READY FOR PRODUCTION

This implementation is:
- ✅ **Fully tested** against requirements
- ✅ **Production-grade** code quality
- ✅ **Follows architecture** exactly
- ✅ **Integrated** with all systems
- ✅ **Documented** comprehensively
- ✅ **Error handling** complete
- ✅ **Security** compliant
- ✅ **Performance optimized** (with indexes)

---

## 📞 SUPPORT

For questions about:
- **Schema**: See `prayer.model.js`
- **Business Logic**: See `prayer.service.js`
- **API Routes**: See `prayer.routes.js`
- **Validation**: See `prayer.validation.js`
- **Integration**: Check `app.js`

