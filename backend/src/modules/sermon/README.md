# 🎤 SERMON MODULE - COMPLETE API DOCUMENTATION

## 📋 Table of Contents
1. [Overview](#overview)
2. [Data Models](#data-models)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Authorization](#authentication--authorization)
5. [Request/Response Examples](#requestresponse-examples)
6. [Error Handling](#error-handling)
7. [Integration Points](#integration-points)

---

## Overview

The Sermon Module provides complete management of sermons and sermon categories for the WFC backend system.

**Key Features:**
- ✅ Sermon Categories (CRUD operations)
- ✅ Sermon Management with YouTube integration
- ✅ Publishing workflow (Draft → Published)
- ✅ Role-based access control
- ✅ Global sermons (no branch restrictions)
- ✅ Automatic notifications on publish
- ✅ Complete audit logging
- ✅ Full-text search support

---

## Data Models

### SermonCategory Schema

```javascript
{
  _id: ObjectId,
  name: String,              // Required, 3-50 chars, unique
  description: String,       // Required, 10-500 chars
  createdBy: ObjectId,       // User ID (LEADER/MASTER_ADMIN)
  createdAt: Date,
  updatedAt: Date
}
```

### Sermon Schema

```javascript
{
  _id: ObjectId,
  title: String,             // Required, 3-200 chars
  description: String,       // Required, 10-3000 chars
  youtubeLink: String,       // Required, valid YouTube URL
  youtubeVideoId: String,    // Required, extracted from URL, unique
  categoryId: ObjectId,      // Required, reference to SermonCategory
  speakerName: String,       // Optional, max 100 chars
  thumbnail: String,         // Optional, auto-generated from video ID
  isPublished: Boolean,      // Default: false (draft/published workflow)
  createdBy: ObjectId,       // User ID (LEADER/MASTER_ADMIN)
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Sermon Categories

#### 1. Create Category
```
POST /api/sermons/categories
```
**Access:** LEADER, MASTER_ADMIN only

**Request Body:**
```json
{
  "name": "Faith",
  "description": "Sermons about faith and trust in God"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Faith",
    "description": "Sermons about faith and trust in God",
    "createdBy": "507f191e810c19729de860ea",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Sermon category created successfully"
}
```

---

#### 2. Get All Categories
```
GET /api/sermons/categories
```
**Access:** All authenticated users

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Faith",
      "description": "Sermons about faith and trust in God",
      "createdBy": {
        "_id": "507f191e810c19729de860ea",
        "name": "Pastor John",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1,
  "message": "Categories retrieved successfully"
}
```

---

#### 3. Update Category
```
PUT /api/sermons/categories/:id
```
**Access:** LEADER, MASTER_ADMIN only

**Request Body:**
```json
{
  "name": "Faith & Trust",
  "description": "Updated description"
}
```

**Response (200):** Updated category object

---

#### 4. Delete Category
```
DELETE /api/sermons/categories/:id
```
**Access:** LEADER, MASTER_ADMIN only

**Note:** Cannot delete if sermons exist in category

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Category deleted successfully"
  },
  "message": "Sermon category deleted successfully"
}
```

---

### Sermons

#### 1. Create Sermon
```
POST /api/sermons
```
**Access:** LEADER, MASTER_ADMIN only

**Request Body:**
```json
{
  "title": "The Power of Prayer",
  "description": "In this sermon, we explore the transformative power of prayer...",
  "youtubeLink": "https://youtube.com/watch?v=abc123XYZ",
  "categoryId": "507f1f77bcf86cd799439011",
  "speakerName": "Pastor John Smith",
  "thumbnail": "https://custom-thumbnail-url.com/image.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "The Power of Prayer",
    "description": "In this sermon...",
    "youtubeLink": "https://youtube.com/watch?v=abc123XYZ",
    "youtubeVideoId": "abc123XYZ",
    "categoryId": "507f1f77bcf86cd799439011",
    "speakerName": "Pastor John Smith",
    "thumbnail": "https://img.youtube.com/vi/abc123XYZ/maxresdefault.jpg",
    "isPublished": false,
    "createdBy": "507f191e810c19729de860ea",
    "createdAt": "2024-01-15T10:35:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  },
  "message": "Sermon created successfully"
}
```

**Important Notes:**
- `youtubeVideoId` is automatically extracted from `youtubeLink`
- `thumbnail` is auto-generated if not provided
- `isPublished` defaults to `false` (draft mode)

---

#### 2. Get All Sermons
```
GET /api/sermons
```
**Access:** All authenticated users

**Query Parameters:**
- `categoryId` - Filter by category ID
- `search` - Search in title and description

**Examples:**
```
GET /api/sermons
GET /api/sermons?categoryId=507f1f77bcf86cd799439011
GET /api/sermons?search=prayer
GET /api/sermons?categoryId=507f1f77bcf86cd799439011&search=grace
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Power of Prayer",
      "description": "In this sermon...",
      "youtubeLink": "https://youtube.com/watch?v=abc123XYZ",
      "youtubeVideoId": "abc123XYZ",
      "categoryId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Prayer",
        "description": "Sermons about prayer"
      },
      "speakerName": "Pastor John Smith",
      "thumbnail": "https://img.youtube.com/vi/abc123XYZ/maxresdefault.jpg",
      "isPublished": true,
      "createdBy": {
        "_id": "507f191e810c19729de860ea",
        "name": "Pastor John",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:35:00Z",
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  ],
  "count": 1,
  "message": "Sermons retrieved successfully"
}
```

**Access Control:**
- **USER role:** Only sees published sermons (`isPublished: true`)
- **LEADER/MASTER_ADMIN:** Sees all sermons (draft + published)

---

#### 3. Get Single Sermon
```
GET /api/sermons/:id
```
**Access:** All authenticated users

**Response (200):** Single sermon object

**Access Control:**
- **USER role:** Only sees published sermons
- **LEADER/MASTER_ADMIN:** Sees any sermon

---

#### 4. Update Sermon
```
PUT /api/sermons/:id
```
**Access:** LEADER, MASTER_ADMIN only

**Request Body (any combination):**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "youtubeLink": "https://youtube.com/watch?v=newVideoId",
  "categoryId": "507f1f77bcf86cd799439011",
  "speakerName": "New Speaker Name",
  "thumbnail": "https://custom-thumbnail.jpg"
}
```

**Important Notes:**
- At least one field must be provided
- If `youtubeLink` changes, `youtubeVideoId` is regenerated
- If `youtubeLink` changes, `thumbnail` is auto-updated (unless explicitly provided)

**Response (200):** Updated sermon object

---

#### 5. Delete Sermon
```
DELETE /api/sermons/:id
```
**Access:** LEADER, MASTER_ADMIN only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Sermon deleted successfully"
  },
  "message": "Sermon deleted successfully"
}
```

---

#### 6. Publish Sermon
```
PATCH /api/sermons/:id/publish
```
**Access:** LEADER, MASTER_ADMIN only

**Request Body:** None (empty)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    ...sermon object,
    "isPublished": true
  },
  "message": "Sermon published successfully"
}
```

**Important Notes:**
- Sets `isPublished = true`
- Sends notification to all approved users
- Cannot publish already published sermon

---

#### 7. Unpublish Sermon
```
PATCH /api/sermons/:id/unpublish
```
**Access:** LEADER, MASTER_ADMIN only

**Request Body:** None (empty)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    ...sermon object,
    "isPublished": false
  },
  "message": "Sermon unpublished successfully"
}
```

**Important Notes:**
- Sets `isPublished = false`
- Cannot unpublish already unpublished sermon

---

## Authentication & Authorization

### Required Headers
```
Authorization: Bearer <JWT_TOKEN>
```

### Role-Based Access Control

| Operation | USER | LEADER | MASTER_ADMIN |
|-----------|------|--------|--------------|
| **Categories** |
| Create | ❌ | ✅ | ✅ |
| Read | ✅ | ✅ | ✅ |
| Update | ❌ | ✅ | ✅ |
| Delete | ❌ | ✅ | ✅ |
| **Sermons** |
| Create | ❌ | ✅ | ✅ |
| Read Published | ✅ | ✅ | ✅ |
| Read All | ❌ | ✅ | ✅ |
| Update | ❌ | ✅ | ✅ |
| Delete | ❌ | ✅ | ✅ |
| Publish | ❌ | ✅ | ✅ |
| Unpublish | ❌ | ✅ | ✅ |

---

## Request/Response Examples

### Example 1: Create Category and Sermon

**Step 1: Create Category**
```bash
curl -X POST http://localhost:5000/api/sermons/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prayer",
    "description": "Sermons about prayer and intercession"
  }'
```

**Step 2: Create Sermon**
```bash
curl -X POST http://localhost:5000/api/sermons \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Power of Prayer",
    "description": "Learn how prayer transforms our lives and the world around us",
    "youtubeLink": "https://youtube.com/watch?v=abc123XYZ",
    "categoryId": "507f1f77bcf86cd799439011",
    "speakerName": "Pastor John Smith"
  }'
```

**Step 3: Publish Sermon**
```bash
curl -X PATCH http://localhost:5000/api/sermons/507f1f77bcf86cd799439012/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Example 2: Search and Filter Sermons

**Get sermons by category:**
```bash
curl http://localhost:5000/api/sermons?categoryId=507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Search sermons:**
```bash
curl "http://localhost:5000/api/sermons?search=prayer" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Combine filters:**
```bash
curl "http://localhost:5000/api/sermons?categoryId=507f1f77bcf86cd799439011&search=faith" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "message": "Please provide a valid JWT token"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions for this action"
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "message": "Sermon not found"
  }
}
```

**400 Bad Request (Validation Error):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid YouTube URL. Please use youtube.com or youtu.be"
  }
}
```

**400 Bad Request (Duplicate Video):**
```json
{
  "success": false,
  "error": {
    "message": "A sermon with this YouTube video already exists in the system"
  }
}
```

**409 Conflict:**
```json
{
  "success": false,
  "error": {
    "message": "Cannot delete category with 5 sermon(s). Delete or reassign sermons first."
  }
}
```

---

## Integration Points

### 1. Audit Logging
Every action is automatically logged:
- `CREATE_SERMON_CATEGORY`
- `UPDATE_SERMON_CATEGORY`
- `DELETE_SERMON_CATEGORY`
- `CREATE_SERMON`
- `UPDATE_SERMON`
- `DELETE_SERMON`
- `PUBLISH_SERMON`
- `UNPUBLISH_SERMON`

### 2. Notifications
When a sermon is published, all approved users receive a notification:
```
Title: "🎤 New Sermon Published"
Message: "New sermon: "The Power of Prayer" is now available to watch"
Type: "SERMON"
```

### 3. YouTube Integration
- Automatically extracts video ID from YouTube URL
- Validates URL format (youtube.com or youtu.be)
- Auto-generates thumbnail from video ID
- Prevents duplicate videos in system

### 4. Database Indexes
Optimized for common queries:
- Category lookup by name
- Sermon filtering by category
- Sermon lookup by video ID
- Publication status filtering
- Full-text search on title/description
- Sorting by creation date

---

## Notes

- **Global Sermons:** No branch restrictions - sermons are accessible globally
- **Publishing Workflow:** Sermons are created in draft mode (`isPublished: false`) and must be explicitly published
- **Video Validation:** Only valid YouTube URLs are accepted
- **Duplicate Prevention:** Same YouTube video cannot be added twice
- **Notifications:** Sent automatically when sermon is published
- **Audit Trail:** All actions are logged for compliance and debugging

---

**Last Updated:** January 15, 2024  
**Status:** ✅ Production Ready
