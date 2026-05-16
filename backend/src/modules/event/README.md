# 📚 EVENT MODULE - API DOCUMENTATION

## Overview

The Event Module manages events for the WFC-TEST application with **advanced visibility and branch-based access control**. Events can be either:
- **BRANCH events**: Visible only to their specific branch
- **GLOBAL events**: Visible to all approved users across all branches

---

## 🏗️ Architecture

### Service-First Design
- **event.service.js** - All business logic (permissions, filtering, notifications)
- **event.controller.js** - HTTP request/response handling only
- **event.routes.js** - Route registration with middleware chains
- **event.model.js** - Mongoose schema with validation
- **event.validation.js** - Joi schema validation

### Key Design Principles

```
USER (BRANCH Restricted)
├─ Can create: BRANCH events only (own branch)
├─ Can view: GLOBAL + own branch events
└─ Can edit/delete: Own events only

LEADER (BRANCH + GLOBAL)
├─ Can create: BRANCH + GLOBAL events
├─ Can view: GLOBAL + own branch events
└─ Can edit/delete: Own branch events

MASTER_ADMIN (Unrestricted)
├─ Can create: Any event (any branch/visibility)
├─ Can view: All events
└─ Can edit/delete: Any event
```

---

## 📊 Event Schema

```javascript
Event {
  _id: ObjectId,
  
  // 📝 Event Details
  title: String (required, 3-200 chars),
  description: String (required, min 10 chars),
  date: Date (required, must be future),
  time: String (required, HH:MM format),
  location: String (required),
  
  // 🌐 Visibility & Branch
  visibility: "BRANCH" | "GLOBAL" (required),
  branch: "BRANCH1" | "BRANCH2" | null,
    // ⚠️ IMPORTANT: If visibility="GLOBAL", branch MUST be null
  
  // 👤 Creator Info
  createdBy: ObjectId (ref: User),
  createdByRole: "USER" | "LEADER" | "MASTER_ADMIN",
  createdByBranch: String,
  
  // ⏰ Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Key Rules

### Rule 1: USER Can Only Create BRANCH Events

```javascript
// USER must provide:
{
  "visibility": "BRANCH",
  "branch": "BRANCH1"  // Their own branch
}

// USER CANNOT provide:
{
  "visibility": "GLOBAL"  // ❌ Error: Users cannot create global events
}
```

### Rule 2: If Visibility = GLOBAL, Branch Must Be Null

```javascript
// ✅ CORRECT
{
  "visibility": "GLOBAL",
  "branch": null  // Automatically enforced
}

// ❌ INCORRECT
{
  "visibility": "GLOBAL",
  "branch": "BRANCH1"  // Will be set to null by pre-save hook
}
```

### Rule 3: GET Events Filters by Role

```javascript
// USER/LEADER sees:
{
  $or: [
    { visibility: "GLOBAL" },        // All global events
    { branch: user.branch }          // Own branch events
  ]
}

// MASTER_ADMIN sees:
{}  // All events
```

---

## 🔌 API ENDPOINTS

### 1. CREATE EVENT

```http
POST /api/events
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Weekly Prayer Meeting",
  "description": "Join us for worship and prayer",
  "date": "2026-05-20T10:00:00Z",
  "time": "10:00",
  "location": "Branch 1 Main Hall",
  "visibility": "BRANCH",
  "branch": "BRANCH1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "event123",
    "title": "Weekly Prayer Meeting",
    "visibility": "BRANCH",
    "branch": "BRANCH1",
    "date": "2026-05-20T10:00:00Z",
    "notifications_sent": 45,
    "message": "Event created successfully"
  }
}
```

**Permission Rules:**
- USER: Can create BRANCH events for own branch only
- LEADER: Can create BRANCH + GLOBAL events
- MASTER_ADMIN: Can create any event with any visibility

**Validation:**
- `title`: Required, 3-200 characters
- `description`: Required, minimum 10 characters
- `date`: Required, must be in the future
- `time`: Required, HH:MM format (24-hour)
- `location`: Required, 3-100 characters
- `visibility`: Required, "BRANCH" or "GLOBAL"
- `branch`: Required if visibility="BRANCH", must be "BRANCH1" or "BRANCH2"

---

### 2. UPDATE EVENT

```http
PUT /api/events/{event_id}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Updated Event Title",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "event123",
    "title": "Updated Event Title",
    "message": "Event updated successfully"
  }
}
```

**Permission Rules:**
- USER: Can update own events only
- LEADER: Can update events in their branch
- MASTER_ADMIN: Can update any event

**Important:**
- USER cannot change visibility to GLOBAL
- Updating to GLOBAL visibility forces branch=null
- All fields optional (at least one required)

---

### 3. DELETE EVENT

```http
DELETE /api/events/{event_id}
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "event123",
    "message": "Event deleted successfully"
  }
}
```

**Permission Rules:**
- USER: Can delete own events only
- LEADER: Can delete events in their branch
- MASTER_ADMIN: Can delete any event

---

### 4. GET ALL EVENTS

```http
GET /api/events
Authorization: Bearer <JWT_TOKEN>  # Optional
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "event1",
      "title": "Weekly Prayer",
      "date": "2026-05-20T10:00:00Z",
      "visibility": "BRANCH",
      "branch": "BRANCH1"
    },
    {
      "_id": "event2",
      "title": "Church Conference",
      "date": "2026-06-15T09:00:00Z",
      "visibility": "GLOBAL",
      "branch": null
    }
  ]
}
```

**Filtering Logic:**
- **No authentication**: Returns only GLOBAL events
- **USER**: Returns GLOBAL + own branch events
- **LEADER**: Returns GLOBAL + own branch events
- **MASTER_ADMIN**: Returns ALL events

**Sorting:** By date (upcoming first)

---

### 5. GET SINGLE EVENT

```http
GET /api/events/{event_id}
Authorization: Bearer <JWT_TOKEN>  # Optional for GLOBAL
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "event123",
    "title": "Weekly Prayer Meeting",
    "description": "Join us for worship and prayer",
    "date": "2026-05-20T10:00:00Z",
    "time": "10:00",
    "location": "Branch 1 Main Hall",
    "visibility": "BRANCH",
    "branch": "BRANCH1",
    "createdBy": "user456",
    "createdByRole": "LEADER",
    "createdAt": "2026-05-10T14:30:00Z",
    "updatedAt": "2026-05-10T14:30:00Z"
  }
}
```

**Access Rules:**
- Public users: Can view GLOBAL events only
- Users: Can view GLOBAL + own branch events
- Other branch users: Cannot view
- MASTER_ADMIN: Can view any event

---

## 🔔 Notification Integration

### When Notifications Are Sent

**GLOBAL Event Created:**
- Notifies: ALL approved users
- Message: "New Global Event Created"
- Type: "EVENT"

**BRANCH Event Created:**
- Notifies: 
  - Users in that branch
  - Leaders in that branch
  - MASTER_ADMIN
- Message: "New Event in Your Branch"
- Type: "EVENT"

### Notification Query

```http
GET /api/notifications
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "notif1",
      "userId": "user123",
      "type": "EVENT",
      "title": "New Event in Your Branch",
      "message": "New event: Weekly Prayer on May 20",
      "referenceId": "event123",
      "isRead": false,
      "createdAt": "2026-05-10T14:30:00Z"
    }
  ]
}
```

---

## 📜 Audit Logging

### Actions Logged

All event operations are automatically logged:

```
- CREATE_EVENT: When new event is created
- UPDATE_EVENT: When event is updated
- DELETE_EVENT: When event is deleted
```

### Accessing Audit Logs

```http
GET /api/audit
Authorization: Bearer <JWT_TOKEN>  # ADMIN only

Response:
{
  "success": true,
  "data": [
    {
      "_id": "audit1",
      "action": "CREATE_EVENT",
      "performedBy": "user123",
      "performerRole": "LEADER",
      "targetId": "event123",
      "targetType": "EVENT",
      "metadata": {
        "title": "Weekly Prayer",
        "visibility": "BRANCH",
        "branch": "BRANCH1"
      },
      "createdAt": "2026-05-10T14:30:00Z"
    }
  ]
}
```

---

## ⚠️ Error Responses

### 400 Bad Request - Validation Error

```json
{
  "error": "Event title is required"
}
```

**Common Validation Errors:**
- "Title must be at least 3 characters"
- "Time must be in HH:MM format"
- "Date must be in the future"
- "Visibility must be either BRANCH or GLOBAL"

---

### 400 Bad Request - Permission Error

```json
{
  "error": "Users cannot create global events"
}
```

**Permission Errors:**
- "Users can only create events for their own branch"
- "Users can only update their own events"
- "Users can only delete their own events"
- "Leaders can only update events in their branch"
- "Leaders can only delete events in their branch"
- "Access denied to this event"

---

### 404 Not Found

```json
{
  "error": "Event not found"
}
```

---

### 401 Unauthorized

```json
{
  "error": "Authentication required"
}
```

---

## 💡 Usage Examples

### Example 1: USER Creates Branch Event

```bash
# Get USER token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}' \
  | jq -r '.data.accessToken')

# Create event
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Weekly Prayer",
    "description": "Prayer and worship session",
    "date": "2026-05-20T10:00:00Z",
    "time": "10:00",
    "location": "Branch Hall",
    "visibility": "BRANCH",
    "branch": "BRANCH1"
  }'
```

---

### Example 2: LEADER Creates Global Event

```bash
# Get LEADER token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"leader@test.com","password":"password123"}' \
  | jq -r '.data.accessToken')

# Create global event
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Church Conference",
    "description": "Annual conference for all members",
    "date": "2026-06-15T09:00:00Z",
    "time": "09:00",
    "location": "Main Auditorium",
    "visibility": "GLOBAL"
  }'
```

---

### Example 3: Get Filtered Events

```bash
# As USER - see own branch + global events
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer $USER_TOKEN"

# As public - see global events only
curl -X GET http://localhost:5000/api/events
```

---

## 🗂️ File Structure

```
backend/
├── src/
│   ├── modules/
│   │   └── event/
│   │       ├── event.model.js          (Mongoose schema)
│   │       ├── event.service.js        (Business logic)
│   │       ├── event.controller.js     (HTTP handlers)
│   │       ├── event.routes.js         (Route registration)
│   │       ├── event.validation.js     (Joi schemas)
│   │       ├── README.md               (This file)
│   │       └── TESTING.md              (Test guide)
│   ├── services/
│   │   ├── notification.helper.js      (Notification service)
│   │   └── audit.helper.js             (Audit logging service)
│   ├── middleware/
│   │   ├── auth.middleware.js          (JWT validation)
│   │   └── validate.middleware.js      (Request validation)
│   └── app.js                          (Route registration)
```

---

## 🔒 Security

### Authentication
- All protected endpoints require valid JWT token
- Token passed in `Authorization: Bearer <token>` header

### Authorization
- Role-based access control (USER, LEADER, MASTER_ADMIN)
- Branch-based access filtering
- Permission checks on every operation

### Validation
- All inputs validated with Joi
- Time format validated
- Date must be in future
- Enum values strictly validated

---

## 📝 Migration from Blog Module

The Event Module follows the **exact same architectural pattern** as the Blog Module:

| Aspect | Blog | Event |
|--------|------|-------|
| Service Layer | Yes | Yes |
| Role-Based Filtering | Yes | Yes |
| Notifications | Yes | Yes |
| Audit Logging | Yes | Yes |
| Joi Validation | Yes | Yes |
| asyncHandler Middleware | Yes | Yes |
| Pre-Save Hooks | Yes | Yes |

---

## 🚀 Next Steps

1. **Run Tests**: Follow [TESTING.md](./TESTING.md)
2. **Verify Integration**: Check notification and audit logging
3. **Monitor**: Watch server logs for errors
4. **Deploy**: Once all tests pass

---

## 📞 Support

For issues or questions:
1. Check [TESTING.md](./TESTING.md) troubleshooting section
2. Review error logs in server console
3. Check database directly for data integrity
4. Verify JWT tokens are valid and not expired

---
