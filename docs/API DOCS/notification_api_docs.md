# NOTIFICATION MODULE API DOCUMENTATION

**Generated:** May 20, 2026

## Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notifications` | GET | Get user notifications (paginated) |
| `/api/notifications/unread-count` | GET | Get unread count |
| `/api/notifications/:id` | GET | Get single notification |
| `/api/notifications/:id/read` | PATCH | Mark as read |
| `/api/notifications/read-all` | PATCH | Mark all as read |

---

## Endpoints

### Get Notifications
**GET** `/api/notifications`

Retrieve user's notifications with pagination and filtering.

**Auth:** Protected (JWT required)

**Query Parameters:**
- `page`: page number (default: 1)
- `limit`: items per page (default: 20, max: 100)
- `isRead`: filter by read status (true/false, optional)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "type": "BLOG",
        "title": "📝 New Blog Published",
        "message": "New blog: 'Faith in Action' is now available",
        "referenceId": "507f1f77bcf86cd799439099",
        "isRead": false,
        "createdAt": "2026-01-20T10:00:00.000Z"
      }
    ],
    "unreadCount": 3,
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  },
  "message": "Notifications retrieved successfully"
}
```

**Notification Types:** BLOG, EVENT, PRAYER, APPROVAL

---

### Get Unread Count
**GET** `/api/notifications/unread-count`

Get count of unread notifications for badge/indicator.

**Auth:** Protected (JWT required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 3
  }
}
```

---

### Get Single Notification
**GET** `/api/notifications/:id`

Retrieve detailed notification. Must be owner.

**Auth:** Protected (JWT required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "_id": "507f1f77bcf86cd799439011",
      "type": "EVENT",
      "title": "📅 Event Created",
      "message": "New event: 'Sunday Service' created",
      "referenceId": "507f1f77bcf86cd799439099",
      "isRead": false,
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  }
}
```

---

### Mark as Read
**PATCH** `/api/notifications/:id/read`

Mark single notification as read.

**Auth:** Protected (JWT required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "notification": { "_id": "...", "isRead": true, ... }
  }
}
```

---

### Mark All as Read
**PATCH** `/api/notifications/read-all`

Mark all unread notifications as read.

**Auth:** Protected (JWT required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "updatedCount": 5
  }
}
```

---

## Frontend Integration Notes

- **Unread Badge**: Fetch `/unread-count` periodically to update notification badge
- **Pagination**: Use `page` and `limit` for infinite scroll or pagination
- **Auto-read**: Mark notifications as read when viewed
- **Notification Types**: 
  - BLOG: New blog published
  - EVENT: New event created
  - PRAYER: Prayer request/answered
  - APPROVAL: Account approved
- **Real-time**: Consider polling `/unread-count` every 30s for badge updates
- **Reference Link**: Use `referenceId` to navigate to related content (blog, event, etc.)

---

**Error Responses:** 400 (not found), 401 (auth), 403 (not owner)
