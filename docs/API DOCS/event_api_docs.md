# EVENT MODULE API DOCUMENTATION

**Generated:** May 20, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
   - [Public Endpoints](#public-endpoints)
   - [Protected Endpoints](#protected-endpoints)
3. [Frontend Integration Notes](#frontend-integration-notes)

---

## Overview

The EVENT module provides APIs for creating, viewing, and managing church events. Events can be scoped to a specific branch or visible globally.

**Key Concepts:**
- **GLOBAL Events** - Visible to all approved users
- **BRANCH Events** - Visible only to users in that branch (and leaders/admins)
- **Upcoming Events** - Sorted by date, earliest first

---

## API Endpoints

---

## PUBLIC ENDPOINTS

---

### 1. Get All Events

# API Name
**Get All Events**

# Endpoint
```
GET /api/events
```

# Purpose
Fetch all events visible to the current user based on their role and branch.

# Authentication
**Protected** - JWT token required

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Query Params
None

# Request Body
None

# Validation Rules
No request body validation.

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Sunday Service",
      "description": "Join us for our weekly Sunday service at 10 AM",
      "date": "2026-01-25T00:00:00.000Z",
      "time": "10:00",
      "location": "Main Building",
      "visibility": "GLOBAL",
      "branch": null,
      "createdByRole": "MASTER_ADMIN",
      "createdAt": "2026-01-20T12:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Youth Meeting",
      "description": "Youth group gathering and discussion",
      "date": "2026-01-26T18:30:00.000Z",
      "time": "18:30",
      "location": "Youth Center",
      "visibility": "BRANCH",
      "branch": "BRANCH1",
      "createdByRole": "LEADER",
      "createdAt": "2026-01-20T14:00:00.000Z"
    }
  ]
}
```

# Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Failed to fetch events"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `title` | Event name |
| `date` | Event date (ISO 8601 format) |
| `time` | Event time in HH:MM format (24-hour) |
| `visibility` | GLOBAL or BRANCH |
| `branch` | Branch code (null for GLOBAL) |
| `createdByRole` | Role of event creator |

# Frontend Integration Notes

- **Visible Events**: Users see GLOBAL events + their own branch events
- **Sorting**: Sorted by date (earliest first)
- **Branch Filtering**: Automatically filtered by backend based on user's branch
- **Date Formatting**: Use JavaScript `new Date(event.date)` to parse date
- **Time Display**: Use `event.time` directly or parse as HH:MM

# Notes

- Only shows events visible to the authenticated user
- Ordered by upcoming dates

---

### 2. Get Single Event

# API Name
**Get Single Event**

# Endpoint
```
GET /api/events/:id
```

# Purpose
Fetch a single event by ID (with permission checks).

# Authentication
**Protected** - JWT token required

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Event ID (MongoDB ObjectId) |

# Query Params
None

# Request Body
None

# Validation Rules
- `id`: Valid MongoDB ObjectId

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Sunday Service",
    "description": "Join us for our weekly Sunday service at 10 AM with prayer, worship, and preaching.",
    "date": "2026-01-25T00:00:00.000Z",
    "time": "10:00",
    "location": "Main Building, 123 Church Street",
    "visibility": "GLOBAL",
    "branch": null,
    "createdBy": "507f1f77bcf86cd799439099",
    "createdByRole": "MASTER_ADMIN",
    "createdByBranch": null,
    "createdAt": "2026-01-20T12:00:00.000Z",
    "updatedAt": "2026-01-20T12:00:00.000Z"
  }
}
```

# Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Event not found"
  }
}
```

### 403 Forbidden - No Access
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Access denied to this event"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `description` | Full event details |
| `date` | Event date in ISO format |
| `time` | Event time in HH:MM format |
| `location` | Venue address/location |
| `visibility` | GLOBAL or BRANCH |

# Frontend Integration Notes

- **Permission Check**: Backend automatically checks if user can access the event
- **Branch Events**: Users can only see branch events for their own branch
- **Date/Time**: Parse `date` as ISO 8601, display `time` as HH:MM

# Notes

- Users cannot access branch events outside their branch
- GLOBAL events accessible to all authenticated users

---

## PROTECTED ENDPOINTS

These endpoints require **JWT token** and appropriate **role/permissions**.

---

### 3. Create Event

# API Name
**Create Event**

# Endpoint
```
POST /api/events
```

# Purpose
Create a new event. Role-based restrictions apply.

# Authentication
**Protected** - JWT token required

# Permissions

| Role | Can Create |
|------|-----------|
| **USER** | BRANCH events for own branch only |
| **LEADER** | BRANCH + GLOBAL events |
| **MASTER_ADMIN** | BRANCH + GLOBAL events |

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params
None

# Query Params
None

# Request Body

```json
{
  "title": "Prayer Meeting",
  "description": "Weekly prayer gathering for all church members to pray together and intercede for the community.",
  "date": "2026-01-28",
  "time": "19:30",
  "location": "Prayer Room",
  "visibility": "GLOBAL",
  "branch": null
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Event name |
| `description` | string | Yes | Event details |
| `date` | string | Yes | Date in YYYY-MM-DD format (must be future) |
| `time` | string | Yes | Time in HH:MM format (24-hour) |
| `location` | string | Yes | Event venue |
| `visibility` | string | Yes | BRANCH or GLOBAL |
| `branch` | string | No | Branch code (required if visibility=BRANCH) |

# Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Min 3 chars, Max 100 chars, Required |
| `description` | Min 10 chars, Required |
| `date` | Must be future date, Required |
| `time` | HH:MM format (24-hour), Required |
| `location` | Min 3 chars, Max 100 chars, Required |
| `visibility` | BRANCH or GLOBAL, Required |
| `branch` | BRANCH1 or BRANCH2 (if visibility=BRANCH) |

# Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Prayer Meeting",
    "visibility": "GLOBAL",
    "branch": null,
    "date": "2026-01-28T00:00:00.000Z",
    "notifications_sent": 234,
    "message": "Event created successfully"
  }
}
```

# Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Title must be at least 3 characters"
  }
}
```

### 400 Bad Request - Date in Past
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Date must be in the future"
  }
}
```

### 400 Bad Request - User Cannot Create Global
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Users cannot create global events"
  }
}
```

### 400 Bad Request - Wrong Branch
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Users can only create events for their own branch"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `_id` | Event ID (use for updates/delete) |
| `notifications_sent` | Number of users notified |
| `message` | "Event created successfully" |

# Frontend Integration Notes

- **Role Check**: Users cannot create GLOBAL events (only BRANCH)
- **Branch Check**: Users can only create events for their own branch
- **Branch Notifications**: GLOBAL events notify all users; BRANCH events notify users in that branch
- **Date Format**: Send as YYYY-MM-DD (backend validates future date)
- **Time Format**: Send as HH:MM in 24-hour format
- **Automatic Notifications**: Users are notified when event is created

# Notes

- Users can only create BRANCH events for their own branch
- GLOBAL events must have `branch: null`
- All users notified upon event creation based on visibility

---

### 4. Update Event

# API Name
**Update Event**

# Endpoint
```
PUT /api/events/:id
```

# Purpose
Update an event. Only creator can update (with role-based restrictions).

# Authentication
**Protected** - JWT token required

# Permissions

| Role | Can Update |
|------|-----------|
| **USER** | Own events only |
| **LEADER** | Own branch events |
| **MASTER_ADMIN** | All events |

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Event ID |

# Query Params
None

# Request Body

```json
{
  "title": "Prayer Meeting (Updated)",
  "time": "20:00",
  "location": "Prayer Room - Building B"
}
```

**Note:** All fields optional (send only what you want to update)

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | New event title |
| `description` | string | New event description |
| `date` | string | New date (YYYY-MM-DD) |
| `time` | string | New time (HH:MM) |
| `location` | string | New location |
| `visibility` | string | BRANCH or GLOBAL |
| `branch` | string | Branch code |

# Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Min 3 chars, Max 100 chars (if provided) |
| `description` | Min 10 chars (if provided) |
| `date` | Must be future (if provided) |
| `time` | HH:MM format (if provided) |
| `location` | Min 3 chars, Max 100 chars (if provided) |
| `visibility` | BRANCH or GLOBAL (if provided) |
| `branch` | BRANCH1 or BRANCH2 (if visibility=BRANCH) |

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Prayer Meeting (Updated)",
    "message": "Event updated successfully"
  }
}
```

# Error Responses

### 400 Bad Request - Event Not Found
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Event not found"
  }
}
```

### 400 Bad Request - Not Creator
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Users can only update their own events"
  }
}
```

### 400 Bad Request - Wrong Branch
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Leaders can only update events in their branch"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

# Frontend Integration Notes

- **Partial Updates**: Send only fields you want to change
- **Creator Only**: Users can only update their own events
- **Branch Restriction**: Leaders cannot update events outside their branch
- **Role Restriction**: Users cannot change event to GLOBAL visibility

# Notes

- Only event creator can update (with role/branch restrictions)
- Can update any field at any time

---

### 5. Delete Event

# API Name
**Delete Event**

# Endpoint
```
DELETE /api/events/:id
```

# Purpose
Permanently delete an event. Only creator can delete (with role-based restrictions).

# Authentication
**Protected** - JWT token required

# Permissions

| Role | Can Delete |
|------|----------|
| **USER** | Own events only |
| **LEADER** | Own branch events |
| **MASTER_ADMIN** | All events |

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Event ID |

# Query Params
None

# Request Body
None

# Validation Rules
- `id`: Valid MongoDB ObjectId

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "message": "Event deleted successfully"
  }
}
```

# Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Event not found"
  }
}
```

### 400 Bad Request - Not Creator
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Users can only delete their own events"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

# Frontend Integration Notes

- **Permanent Action**: Cannot be undone
- **Confirmation**: Show user confirmation before deleting
- **Creator Only**: Users can only delete their own events

# Notes

- **Permanent deletion** - not recoverable
- Only event creator can delete (with role/branch restrictions)

---

## Frontend Integration Notes

### Authentication Setup

```javascript
// Store token after login
const token = response.data.token;
localStorage.setItem('token', token);

// Add to all event requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
};
```

### Fetch Events Example

```javascript
// Get all visible events
async function fetchEvents() {
  const response = await fetch('/api/events', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

// Display events sorted by date
function displayEvents(events) {
  const sorted = events.sort((a, b) => new Date(a.date) - new Date(b.date));
  return sorted.map(event => ({
    ...event,
    displayDate: new Date(event.date).toLocaleDateString(),
  }));
}
```

### Create Event Example

```javascript
// Create new event
async function createEvent(title, description, date, time, location, visibility, branch) {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      date,           // YYYY-MM-DD format
      time,           // HH:MM format (24-hour)
      location,
      visibility,     // 'GLOBAL' or 'BRANCH'
      branch,         // 'BRANCH1' | 'BRANCH2' | null
    }),
  });
  return response.json();
}
```

### Date & Time Handling

```javascript
// Format date for API
function formatDateForAPI(date) {
  // Convert Date to YYYY-MM-DD
  return date.toISOString().split('T')[0];
}

// Parse event date for display
function parseEventDate(event) {
  const date = new Date(event.date);
  const time = event.time; // Already HH:MM format
  return {
    dateString: date.toLocaleDateString(),
    timeString: time,
    fullDateTime: `${date.toLocaleDateString()} at ${time}`,
  };
}
```

### Event Filtering by Visibility

```javascript
// Check if user can see event
function canAccessEvent(event, userBranch, userRole) {
  if (event.visibility === 'GLOBAL') {
    return true;
  }
  if (event.visibility === 'BRANCH' && event.branch === userBranch) {
    return true;
  }
  return false;
}

// Check if user can edit event
function canEditEvent(event, userId, userRole, userBranch) {
  if (userRole === 'MASTER_ADMIN') return true;
  if (userRole === 'LEADER' && event.branch === userBranch) return true;
  if (userRole === 'USER' && event.createdBy === userId) return true;
  return false;
}
```

### Update Event Example

```javascript
// Partial update (only changed fields)
async function updateEvent(eventId, changes) {
  const response = await fetch(`/api/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(changes),
  });
  return response.json();
}

// Usage: update only time
await updateEvent('507f1f77bcf86cd799439020', { time: '20:00' });
```

### Delete Event Example

```javascript
// Delete event with confirmation
async function deleteEvent(eventId, eventTitle) {
  if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
    return;
  }
  
  const response = await fetch(`/api/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
```

---

**End of Documentation**
