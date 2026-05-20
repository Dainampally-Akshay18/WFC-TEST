# PRAYER MODULE API DOCUMENTATION

**Generated:** May 20, 2026

## Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/prayers` | GET | Get all prayers |
| `/api/prayers/:id` | GET | Get single prayer |
| `/api/prayers` | POST | Create prayer request |
| `/api/prayers/:id` | PUT | Update prayer |
| `/api/prayers/:id` | DELETE | Delete prayer |
| `/api/prayers/:id/pray` | PATCH | Toggle "prayed" status |
| `/api/prayers/:id/status` | PATCH | Change prayer status (admin only) |

---

## Endpoints

### Get All Prayers
**GET** `/api/prayers`

Get all prayer requests sorted by newest first. Response includes prayer count and whether current user has prayed.

**Auth:** Protected (JWT required)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Health Recovery",
      "description": "Please pray for my mother's surgery recovery",
      "creatorName": "Anonymous",
      "isAnonymous": true,
      "status": "ACTIVE",
      "prayerCount": 12,
      "hasPrayed": false,
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Prayer
**GET** `/api/prayers/:id`

Get detailed prayer request with prayer count and user's prayer status.

**Auth:** Protected (JWT required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Health Recovery",
    "description": "Please pray for my mother's surgery recovery",
    "creatorName": "Anonymous",
    "isAnonymous": true,
    "status": "ACTIVE",
    "prayerCount": 12,
    "hasPrayed": false,
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
}
```

---

### Create Prayer Request
**POST** `/api/prayers`

Submit a new prayer request (public or anonymous).

**Auth:** Protected (JWT required)

**Request Body:**
```json
{
  "title": "Health Recovery",
  "description": "Please pray for my mother's surgery recovery next week",
  "isAnonymous": true
}
```

**Validation:**
- title: 3-150 chars, required
- description: 10-2000 chars, required
- isAnonymous: boolean, optional (default: false)

**Success Response (201):**
```json
{
  "success": true,
  "data": { "_id": "...", "title": "...", "status": "ACTIVE", ... },
  "message": "Prayer request created successfully"
}
```

---

### Update Prayer
**PUT** `/api/prayers/:id`

Edit prayer title, description, or anonymity. Users can only edit their own prayers (admins can edit any).

**Auth:** Protected (JWT required)

**Request Body:**
```json
{
  "title": "Health Recovery - Surgery scheduled",
  "description": "Updated prayer request..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { "_id": "...", "title": "...", ... },
  "message": "Prayer request updated successfully"
}
```

---

### Delete Prayer
**DELETE** `/api/prayers/:id`

Permanently delete a prayer request. Users can only delete their own prayers (admins can delete any).

**Auth:** Protected (JWT required)

**Success Response (200):**
```json
{
  "success": true,
  "data": { "message": "Prayer request deleted successfully" }
}
```

---

### Toggle "Prayed" Status
**PATCH** `/api/prayers/:id/pray`

Toggle whether current user has prayed for this request. Increments/decrements `prayerCount`.

**Auth:** Protected (JWT required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "prayerCount": 13,
    "hasPrayed": true
  }
}
```

---

### Update Prayer Status
**PATCH** `/api/prayers/:id/status`

Change prayer status (ACTIVE → PRAYED → ARCHIVED). Admin only.

**Auth:** Protected (JWT required) | **Role:** LEADER/MASTER_ADMIN only

**Request Body:**
```json
{
  "status": "PRAYED"
}
```

**Valid statuses:** ACTIVE, PRAYED, ARCHIVED

**Success Response (200):**
```json
{
  "success": true,
  "data": { "_id": "...", "status": "PRAYED", ... },
  "message": "Prayer status updated successfully"
}
```

---

## Frontend Integration Notes

- **Anonymous Support**: If `isAnonymous: true`, creator name displays as "Anonymous" but backend still tracks creator
- **Prayer Toggle**: Use `/pray` endpoint to toggle "prayed" status - increments/decrements count dynamically
- **Permission**: Users can only edit/delete own prayers; admins (LEADER/MASTER_ADMIN) can manage any prayer
- **Real-time Updates**: Show `prayerCount` and `hasPrayed` status after toggling
- **Status Flow**: ACTIVE (needs prayer) → PRAYED (answered) → ARCHIVED (closed)

---

**Error Responses:** 400 (validation/not found), 401 (auth), 403 (permission)
