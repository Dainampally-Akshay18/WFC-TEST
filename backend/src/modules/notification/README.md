# 🔔 Notification Module

> **User-Specific Event Notifications System**

Complete notification system for tracking and managing user-specific events across all WFC platform features.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Service Layer](#service-layer)
- [API Endpoints](#api-endpoints)
- [Integration Guide](#integration-guide)
- [Access Control](#access-control)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Design Patterns](#design-patterns)

---

## 🎯 Overview

### What is the Notification Module?

The Notification Module provides:
- ✅ User-specific notification creation and management
- ✅ Centralized notification service for all modules
- ✅ Automatic trigger system for user actions
- ✅ Read/unread tracking
- ✅ Pagination and filtering
- ✅ Ownership validation (users can only see their own notifications)

### Core Principles

1. **User-Specific**: Notifications are always tied to a user
2. **Non-Blocking**: Notification failures don't break main operations
3. **Event-Driven**: Triggered automatically when actions occur
4. **Scalable**: Designed for high-volume notification scenarios

---

## 🏗️ Architecture

### Layered Design

```
┌─────────────────────────────────────────┐
│         NOTIFICATION API LAYER          │
│         (notification.routes.js)        │
└────────────┬────────────────────────────┘
             │ HTTP
┌────────────v────────────────────────────┐
│      NOTIFICATION CONTROLLER LAYER      │
│      (notification.controller.js)       │
│  - Request/Response handling            │
│  - Parameter extraction                 │
└────────────┬────────────────────────────┘
             │ Service calls
┌────────────v────────────────────────────┐
│       NOTIFICATION SERVICE LAYER        │
│       (notification.service.js)         │
│  - Business logic                       │
│  - Database operations                  │
│  - Access control validation            │
└────────────┬────────────────────────────┘
             │ MongoDB
┌────────────v────────────────────────────┐
│       NOTIFICATION DATABASE LAYER       │
│       (notification.model.js)           │
│  - Schema definition                    │
│  - Indexes                              │
└─────────────────────────────────────────┘
```

### Cross-Module Integration

```
Other Modules              Notification Helper        Notification Module
─────────────────────────────────────────────────────────────────────────
auth.service.js ────────→ notificationHelper ────────→ notificationService
events.service.js ─────→ createNotification() ──────→ Notification Model
prayers.service.js ────→ notifyAllApprovedUsers() ──→ MongoDB
sermons.service.js ────→ notifyBranchUsers() ───────→
blogs.service.js ───────→ notifyExcludeSelf() ───────→
```

---

## 💾 Data Model

### Notification Schema

```js
Notification {
  _id                // MongoDB ObjectId

  userId             // ObjectId ref User - who receives it

  title              // String - short message
  message            // String - detailed content

  type               // String enum:
                     //   - APPROVAL (user account approved)
                     //   - EVENT (event created/updated)
                     //   - BLOG (blog published)
                     //   - PRAYER (prayer request)
                     //   - SERMON (sermon published)

  referenceId        // ObjectId - link to entity (blogId, eventId, etc.)

  isRead             // Boolean - read status (default: false)

  createdAt          // Date - when created (auto)
  updatedAt          // Date - when last updated (auto)
}
```

### Indexes (Performance)

```js
// Index 1: userId + createdAt (for fetching user notifications sorted by time)
db.notifications.createIndex({ userId: 1, createdAt: -1 })

// Index 2: userId + isRead (for unread count queries)
db.notifications.createIndex({ userId: 1, isRead: 1 })
```

### Sample Document

```js
{
  "_id": ObjectId("6507f1e3a1b2c3d4e5f6g7h8"),
  "userId": ObjectId("6507f1e3a1b2c3d4e5f6a1b2"),
  "title": "Your account has been approved",
  "message": "Welcome to WFC! Your account is now active and you can access all features.",
  "type": "APPROVAL",
  "referenceId": ObjectId("6507f1e3a1b2c3d4e5f6a1b2"),
  "isRead": false,
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

---

## 🔧 Service Layer

### notificationService

Complete business logic for notification operations.

#### Methods

##### 1. `createNotification(options)`

**Centralized helper** for creating notifications across all modules.

```js
await notificationService.createNotification({
  userId: '507f1e3a1b2c3d4e5f6a1b2',        // single ID
  // OR
  userId: ['507f1e3a1b2c3d4e5f6a1b2', '...'], // array of IDs

  title: 'Your account has been approved',
  message: 'Welcome! Your account is now active.',
  type: 'APPROVAL',
  referenceId: '507f1e3a1b2c3d4e5f6a1b2'
});
```

**Features:**
- ✅ Handles single user or multiple users
- ✅ Non-blocking (returns null on error)
- ✅ Bulk insert for multiple users (efficient)
- ✅ Used by all modules

---

##### 2. `getNotifications(userId, options)`

**Fetch notifications** for logged-in user with pagination and filtering.

```js
const result = await notificationService.getNotifications(userId, {
  page: 1,
  limit: 20,
  isRead: false  // optional: filter by read status
});

// Returns:
{
  notifications: [
    {
      _id: '...',
      userId: '...',
      title: '...',
      message: '...',
      type: 'BLOG',
      referenceId: '...',
      isRead: false,
      createdAt: '...'
    },
    // ... more notifications
  ],
  unreadCount: 5,
  pagination: {
    total: 25,
    page: 1,
    limit: 20,
    pages: 2
  }
}
```

**Parameters:**
- `userId`: User requesting notifications
- `options.page`: Page number (default: 1)
- `options.limit`: Items per page (default: 20, max: 100)
- `options.isRead`: Filter by read status (true/false, optional)

**Sorting:** Newest first (`createdAt: -1`)

---

##### 3. `getNotificationById(notificationId, userId)`

**Fetch single notification** with ownership validation.

```js
const notification = await notificationService.getNotificationById(
  '6507f1e3a1b2c3d4e5f6g7h8',
  userId
);
```

**Returns:** Notification document

**Throws:**
- `404`: Notification not found
- `403`: User doesn't own this notification

**⚠️ IMPORTANT:** User can ONLY access their own notifications

---

##### 4. `markAsRead(notificationId, userId)`

**Mark single notification as read** with ownership validation.

```js
const updated = await notificationService.markAsRead(
  notificationId,
  userId
);
```

**Returns:** Updated notification document

**Throws:**
- `404`: Notification not found
- `403`: Unauthorized (not owner)

---

##### 5. `markAllAsRead(userId)`

**Mark all unread notifications as read** for user.

```js
const result = await notificationService.markAllAsRead(userId);
// Returns: { modifiedCount: 5 }
```

**Returns:** `{modifiedCount: Number}`

---

##### 6. `getUnreadCount(userId)`

**Get count of unread notifications** for user.

```js
const unreadCount = await notificationService.getUnreadCount(userId);
// Returns: 7
```

**Returns:** Number

---

### notificationHelper

**Reusable helper** for creating notifications across modules.

Located in: `src/services/notification.helper.js`

#### Methods

##### 1. `createNotification(options)`

Generic notification creator.

```js
import { notificationHelper } from '../../services/notification.helper.js';

await notificationHelper.createNotification({
  userId: user._id,
  title: 'Your account has been approved',
  message: 'Welcome! Your account is now active.',
  type: 'APPROVAL',
  referenceId: user._id
});
```

---

##### 2. `notifyAllApprovedUsers(title, message, type, referenceId)`

**Notify all approved users** in system.

Used for: Blog publications, global events, sermons

```js
import { notificationHelper } from '../../services/notification.helper.js';

await notificationHelper.notifyAllApprovedUsers(
  'New blog published',
  'Pastor has published a new article',
  'BLOG',
  blog._id
);
```

---

##### 3. `notifyBranchUsers(branch, title, message, type, referenceId)`

**Notify all users of a branch** + leaders and MASTER_ADMIN.

Used for: Branch-specific events

```js
import { notificationHelper } from '../../services/notification.helper.js';

await notificationHelper.notifyBranchUsers(
  'BRANCH1',
  'Branch Event Scheduled',
  'An important event has been scheduled for your branch',
  'EVENT',
  event._id
);
```

---

##### 4. `notifyExcludeSelf(excludeUserId, title, message, type, referenceId)`

**Notify all approved users EXCEPT the specified one**.

Used for: Prayer requests (don't notify creator), etc.

```js
import { notificationHelper } from '../../services/notification.helper.js';

await notificationHelper.notifyExcludeSelf(
  prayer.createdBy,  // exclude the prayer creator
  'Someone prayed for your request',
  'A community member has prayed for this request',
  'PRAYER',
  prayer._id
);
```

---

##### 5. `notifySingleUser(userId, title, message, type, referenceId)`

**Notify a single user**.

Used for: Personal notifications, user approvals

```js
import { notificationHelper } from '../../services/notification.helper.js';

await notificationHelper.notifySingleUser(
  user._id,
  'Your account has been approved',
  'Welcome! Your account is now active.',
  'APPROVAL',
  user._id
);
```

---

## 📡 API Endpoints

### Base URL
```
/api/notifications
```

### 1. Get User Notifications

```http
GET /api/notifications?page=1&limit=20&isRead=false
```

**Query Parameters:**
- `page`: Page number (optional, default: 1)
- `limit`: Items per page (optional, default: 20, max: 100)
- `isRead`: Filter by read status (optional, true/false)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "6507f1e3a1b2c3d4e5f6g7h8",
        "userId": "6507f1e3a1b2c3d4e5f6a1b2",
        "title": "New blog published",
        "message": "Pastor has published a new article",
        "type": "BLOG",
        "referenceId": "6507f1e3a1b2c3d4e5f6b2c3",
        "isRead": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  },
  "message": "Notifications retrieved successfully"
}
```

**Errors:**
- `401`: Unauthorized (no token)

---

### 2. Get Single Notification

```http
GET /api/notifications/:id
```

**Path Parameters:**
- `id`: Notification ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "_id": "6507f1e3a1b2c3d4e5f6g7h8",
      "userId": "6507f1e3a1b2c3d4e5f6a1b2",
      "title": "Your account has been approved",
      "message": "Welcome! Your account is now active.",
      "type": "APPROVAL",
      "referenceId": "6507f1e3a1b2c3d4e5f6a1b2",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Notification retrieved successfully"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Notification not found
- `403`: Unauthorized (doesn't own this notification)

---

### 3. Mark Notification As Read

```http
PATCH /api/notifications/:id/read
```

**Path Parameters:**
- `id`: Notification ID

**Body:** Empty `{}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "_id": "6507f1e3a1b2c3d4e5f6g7h8",
      "isRead": true,
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "Notification marked as read"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Notification not found
- `403`: Unauthorized (doesn't own this notification)

---

### 4. Mark All Notifications As Read

```http
PATCH /api/notifications/read-all
```

**Body:** Empty `{}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "modifiedCount": 5
  },
  "message": "All notifications marked as read"
}
```

**Errors:**
- `401`: Unauthorized

---

### 5. Get Unread Count

```http
GET /api/notifications/unread-count
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  },
  "message": "Unread count retrieved successfully"
}
```

**Errors:**
- `401`: Unauthorized

---

## 🔗 Integration Guide

### How to Create Notifications in Your Module

#### Step 1: Import the Helper

```js
import { notificationHelper } from '../../services/notification.helper.js';
```

#### Step 2: Call notificationHelper in Your Service

```js
// In auth.service.js - when user is approved
async approveUser(userId) {
  const user = await User.findByIdAndUpdate(userId, { status: 'APPROVED' });
  
  // Create notification
  await notificationHelper.notifySingleUser(
    user._id,
    'Your account has been approved',
    'Welcome to WFC! Your account is now active.',
    'APPROVAL',
    user._id
  );
  
  return user;
}
```

---

### Example Integrations

#### 1. Auth Module - User Approval

```js
// In auth.service.js
import { notificationHelper } from '../../services/notification.helper.js';

export const authService = {
  async approveUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'APPROVED' }
    );

    // ✅ Notify user of approval
    await notificationHelper.notifySingleUser(
      user._id,
      'Your account has been approved',
      'Welcome to WFC! Your account is now active.',
      'APPROVAL',
      user._id
    );

    return user;
  }
};
```

---

#### 2. Blog Module - Blog Published

```js
// In blog.service.js
import { notificationHelper } from '../../services/notification.helper.js';

export const blogService = {
  async publishBlog(blogId) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status: 'PUBLISHED' }
    );

    // ✅ Notify all users
    await notificationHelper.notifyAllApprovedUsers(
      'New blog published',
      `Pastor has published: "${blog.title}"`,
      'BLOG',
      blog._id
    );

    return blog;
  }
};
```

---

#### 3. Event Module - Branch Event Created

```js
// In event.service.js
import { notificationHelper } from '../../services/notification.helper.js';

export const eventService = {
  async createEvent(eventData) {
    const event = new Event(eventData);
    await event.save();

    if (event.visibility === 'BRANCH') {
      // ✅ Notify branch users
      await notificationHelper.notifyBranchUsers(
        event.branch,
        'New event scheduled',
        `A new event has been scheduled for your branch: "${event.title}"`,
        'EVENT',
        event._id
      );
    } else {
      // ✅ Notify all approved users
      await notificationHelper.notifyAllApprovedUsers(
        'New event scheduled',
        `A new global event has been scheduled: "${event.title}"`,
        'EVENT',
        event._id
      );
    }

    return event;
  }
};
```

---

#### 4. Prayer Module - Someone Prayed

```js
// In prayer.service.js
import { notificationHelper } from '../../services/notification.helper.js';

export const prayerService = {
  async addPrayer(prayerId, userId) {
    const prayer = await Prayer.findById(prayerId);
    
    // ✅ Notify prayer creator (but NOT the person who prayed)
    await notificationHelper.notifyExcludeSelf(
      userId,  // exclude the person who just prayed
      'Someone prayed for your request',
      'A community member has prayed for this request',
      'PRAYER',
      prayer._id
    );

    return prayer;
  }
};
```

---

#### 5. Sermon Module - Sermon Published

```js
// In sermon.service.js
import { notificationHelper } from '../../services/notification.helper.js';

export const sermonService = {
  async publishSermon(sermonId) {
    const sermon = await Sermon.findByIdAndUpdate(
      sermonId,
      { status: 'PUBLISHED' }
    );

    // ✅ Notify all users
    await notificationHelper.notifyAllApprovedUsers(
      'New sermon published',
      `A new sermon has been published: "${sermon.title}"`,
      'SERMON',
      sermon._id
    );

    return sermon;
  }
};
```

---

## 🔐 Access Control

### Who Can Access What?

| Operation | Required Role | Notes |
|-----------|--------------|-------|
| GET /api/notifications | ANY (authenticated) | Returns ONLY their own notifications |
| GET /api/notifications/:id | ANY (authenticated) | Can only access own notifications |
| PATCH /api/notifications/:id/read | ANY (authenticated) | Can only modify own notifications |
| PATCH /api/notifications/read-all | ANY (authenticated) | Marks only own notifications |
| GET /api/notifications/unread-count | ANY (authenticated) | Shows count for own notifications |

### Important Rules

1. **Ownership Validation**: User can ONLY access their own notifications
2. **Non-Admin Access**: All authenticated, approved users can manage their notifications
3. **No Admin Panel**: There's no admin endpoint to view other users' notifications

---

## 💡 Usage Examples

### cURL Examples

#### Get notifications
```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/notifications?page=1&limit=20'
```

#### Get unread only
```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/notifications?isRead=false'
```

#### Mark as read
```bash
curl -X PATCH \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}' \
  'http://localhost:3000/api/notifications/{notificationId}/read'
```

#### Mark all as read
```bash
curl -X PATCH \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}' \
  'http://localhost:3000/api/notifications/read-all'
```

#### Get unread count
```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/notifications/unread-count'
```

---

### JavaScript/Fetch Examples

#### Get notifications
```js
const response = await fetch(
  '/api/notifications?page=1&limit=20',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const data = await response.json();
console.log(data.data.notifications);
```

#### Mark all as read
```js
const response = await fetch(
  '/api/notifications/read-all',
  {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({})
  }
);
const data = await response.json();
console.log(data.data.modifiedCount); // count of updated notifications
```

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized: You cannot access this notification",
    "status": 403
  }
}
```

### Common Errors

| Status | Message | Cause |
|--------|---------|-------|
| `401` | No authorization header provided | Missing or invalid token |
| `404` | Notification not found | Notification ID doesn't exist |
| `403` | Unauthorized: You cannot access this notification | Trying to access another user's notification |
| `400` | Validation failed | Invalid query parameters |

---

## 🧠 Design Patterns

### 1. Non-Blocking Notifications

Notification failures **DO NOT** block main operations:

```js
// In blog.service.js
async publishBlog(blogId) {
  const blog = await Blog.findByIdAndUpdate(blogId, { published: true });
  
  // Notify users - but if this fails, blog is still published
  await notificationHelper.notifyAllApprovedUsers(
    'New blog',
    `"${blog.title}" published`,
    'BLOG',
    blog._id
  );
  
  return blog; // ✅ Returned even if notification fails
}
```

### 2. Centralized Creation Helper

All modules use the same helper for consistency:

```
Auth → notificationHelper.notifySingleUser()
Blog → notificationHelper.notifyAllApprovedUsers()
Event → notificationHelper.notifyBranchUsers()
Prayer → notificationHelper.notifyExcludeSelf()
Sermon → notificationHelper.notifyAllApprovedUsers()
```

### 3. Ownership Validation

Every read/write validates that user owns the notification:

```js
async markAsRead(notificationId, userId) {
  const notification = await Notification.findById(notificationId);
  
  // ⚠️ CRITICAL: Verify ownership
  if (notification.userId.toString() !== userId.toString()) {
    throw new Error('Unauthorized');
  }
  
  notification.isRead = true;
  await notification.save();
  return notification;
}
```

### 4. Efficient Bulk Operations

For bulk notifications, use `insertMany` instead of individual saves:

```js
// ❌ SLOW: Loop and save
for (const userId of userIds) {
  const n = new Notification({userId, title, message});
  await n.save();
}

// ✅ FAST: Bulk insert
const notifications = userIds.map(userId => ({
  userId,
  title,
  message,
  type,
  referenceId,
  isRead: false
}));
await Notification.insertMany(notifications);
```

---

## 🚀 Future Enhancements

### Phase 2: Real-Time Notifications
- Socket.IO integration for instant notifications
- Live badge updates
- Real-time notification dropdown

### Phase 3: Push Notifications
- Mobile push notifications
- Browser push notifications
- Notification preferences per user

### Phase 4: Email Notifications
- Digest emails for unread notifications
- Customizable email templates
- Notification frequency settings

---

## 📊 Performance Considerations

### Indexes
The schema includes optimized indexes:
- `{ userId: 1, createdAt: -1 }` - for fetching user notifications
- `{ userId: 1, isRead: 1 }` - for unread count queries

### Pagination
Always use pagination to prevent loading massive datasets:
```js
GET /api/notifications?page=1&limit=20  // ✅ Good
GET /api/notifications                  // ⚠️ May load all notifications
```

### Bulk Operations
When notifying many users, use bulk insert:
```js
// Use notificationHelper.notifyAllApprovedUsers()
// This uses insertMany() for efficiency
```

---

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive test cases covering:
- Unit tests for service methods
- Integration tests for API endpoints
- Ownership validation tests
- Pagination and filtering tests
- Error handling tests

---

## 📝 Summary

The Notification Module provides:
- ✅ Clean, scalable architecture
- ✅ Reusable helper functions
- ✅ Ownership-based access control
- ✅ Non-blocking notification creation
- ✅ Comprehensive API endpoints
- ✅ Performance-optimized queries
- ✅ Easy integration with other modules

For questions or issues, refer to [TESTING.md](./TESTING.md) for usage examples.

