# SERMON MODULE API DOCUMENTATION

**Generated:** May 20, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
   - [Category Management](#category-management)
   - [Sermon Management](#sermon-management)
3. [Frontend Integration Notes](#frontend-integration-notes)

---

## Overview

The SERMON module provides APIs for managing sermon content with YouTube video integration. Sermons can be created as drafts and published for users to view.

**Key Concepts:**
- **Categories** - Organize sermons by topic (e.g., "Faith", "Prayer", "Grace")
- **Draft Sermons** - Only visible to LEADER/MASTER_ADMIN
- **Published Sermons** - Visible to all approved users
- **YouTube Integration** - Automatic video ID extraction and thumbnail generation

---

## API ENDPOINTS

---

## CATEGORY MANAGEMENT

---

### 1. Create Sermon Category

# API Name
**Create Sermon Category**

# Endpoint
```
POST /api/sermons/categories
```

# Purpose
Create a new sermon category for organizing sermons.

# Authentication
**Protected** - JWT token required

# Permissions
**LEADER or MASTER_ADMIN only**

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
  "name": "Faith",
  "description": "Sermons focused on building and strengthening faith in daily life and Christian walk"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Category name |
| `description` | string | Yes | Category description |

# Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Min 3 chars, Max 50 chars, Required, Unique |
| `description` | Min 10 chars, Max 500 chars, Required |

# Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Faith",
    "description": "Sermons focused on building and strengthening faith in daily life and Christian walk",
    "createdBy": "507f1f77bcf86cd799439099",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:00:00.000Z"
  },
  "message": "Sermon category created successfully"
}
```

# Error Responses

### 400 Bad Request - Duplicate Category
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Category with this name already exists"
  }
}
```

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Category name must be at least 3 characters"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Only LEADER and MASTER_ADMIN can create categories"
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
| `_id` | Category ID (use for sermon creation) |
| `name` | Category name |
| `description` | Category description |
| `createdBy` | User ID who created the category |

# Notes

- Category names must be unique
- Only LEADER/MASTER_ADMIN can create categories

---

### 2. Get All Sermon Categories

# API Name
**Get All Sermon Categories**

# Endpoint
```
GET /api/sermons/categories
```

# Purpose
Retrieve all available sermon categories.

# Authentication
**Protected** - JWT token required

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
      "name": "Faith",
      "description": "Sermons focused on building and strengthening faith in daily life and Christian walk",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439099",
        "name": "Pastor John",
        "email": "john@church.com"
      },
      "createdAt": "2026-01-20T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Prayer",
      "description": "Learn effective prayer practices and the power of intercession in Christian life",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439099",
        "name": "Pastor John",
        "email": "john@church.com"
      },
      "createdAt": "2026-01-20T10:15:00.000Z"
    }
  ],
  "message": "Categories retrieved successfully"
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
    "message": "Failed to fetch categories"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `_id` | Category ID (use for filtering sermons) |
| `name` | Category name |
| `description` | What type of sermons are in this category |
| `createdBy` | Creator information |

# Frontend Integration Notes

- **Dropdown Display**: Use category names in dropdown menus for sermon creation
- **Filtering**: Use `categoryId` to filter sermons by category
- **Display**: Show categories sorted by creation date (newest first)

# Notes

- All authenticated users can view categories
- Sorted by creation date (newest first)

---

### 3. Update Sermon Category

# API Name
**Update Sermon Category**

# Endpoint
```
PUT /api/sermons/categories/:id
```

# Purpose
Update an existing sermon category name or description.

# Authentication
**Protected** - JWT token required

# Permissions
**LEADER or MASTER_ADMIN only**

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Category ID |

# Query Params
None

# Request Body

```json
{
  "description": "Updated description for Faith-focused sermons and biblical teachings"
}
```

**Note:** All fields optional (send only what you want to update)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | New category name |
| `description` | string | New category description |

# Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Min 3 chars, Max 50 chars (if provided), Unique |
| `description` | Min 10 chars, Max 500 chars (if provided) |

**Note:** At least one field must be provided for update.

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Faith",
    "description": "Updated description for Faith-focused sermons and biblical teachings",
    "createdBy": "507f1f77bcf86cd799439099",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T14:30:00.000Z"
  },
  "message": "Sermon category updated successfully"
}
```

# Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Category not found"
  }
}
```

### 400 Bad Request - Duplicate Name
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Another category with this name already exists"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Only LEADER and MASTER_ADMIN can update categories"
  }
}
```

# Frontend Integration Notes

- **Partial Updates**: Send only the fields you want to change
- **Validation**: Show real-time validation feedback for name/description lengths

# Notes

- Only one field must be changed at minimum
- Category names must remain unique

---

### 4. Delete Sermon Category

# API Name
**Delete Sermon Category**

# Endpoint
```
DELETE /api/sermons/categories/:id
```

# Purpose
Delete a sermon category. Cannot delete if sermons exist in the category.

# Authentication
**Protected** - JWT token required

# Permissions
**LEADER or MASTER_ADMIN only**

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Category ID |

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
    "message": "Category deleted successfully"
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
    "message": "Category not found"
  }
}
```

### 400 Bad Request - Category Has Sermons
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Cannot delete category with 5 sermon(s). Delete or reassign sermons first."
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Only LEADER and MASTER_ADMIN can delete categories"
  }
}
```

# Frontend Integration Notes

- **Pre-deletion Check**: Show confirmation dialog before deleting
- **Error Handling**: If category has sermons, guide user to delete/reassign them first
- **Category Reassignment**: Inform user to move sermons to another category before deletion

# Notes

- Cannot delete category with sermons
- Deletion is permanent

---

## SERMON MANAGEMENT

---

### 5. Create Sermon

# API Name
**Create Sermon**

# Endpoint
```
POST /api/sermons
```

# Purpose
Create a new sermon (in draft mode). Only visible to admins until published.

# Authentication
**Protected** - JWT token required

# Permissions
**LEADER or MASTER_ADMIN only**

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
  "title": "The Power of Faith",
  "description": "In this sermon, we explore how faith transforms our lives and brings us closer to God. We discuss biblical examples and practical applications for daily Christian living.",
  "youtubeLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "categoryId": "507f1f77bcf86cd799439011",
  "speakerName": "Pastor John Smith",
  "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Sermon title |
| `description` | string | Yes | Sermon content description |
| `youtubeLink` | string | Yes | YouTube video URL |
| `categoryId` | string | Yes | Sermon category ID |
| `speakerName` | string | No | Name of the speaker |
| `thumbnail` | string | No | Custom thumbnail URL (auto-generated if not provided) |

# Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Min 3 chars, Max 200 chars, Required |
| `description` | Min 10 chars, Max 3000 chars, Required |
| `youtubeLink` | Valid YouTube URL (youtube.com or youtu.be), Required |
| `categoryId` | Valid MongoDB ObjectId, Required, must exist |
| `speakerName` | Max 100 chars (if provided) |
| `thumbnail` | Valid URL (if provided) |

# Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "The Power of Faith",
    "description": "In this sermon, we explore how faith transforms our lives and brings us closer to God. We discuss biblical examples and practical applications for daily Christian living.",
    "youtubeLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "categoryId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Faith"
    },
    "speakerName": "Pastor John Smith",
    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "isPublished": false,
    "createdBy": "507f1f77bcf86cd799439099",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:00:00.000Z"
  },
  "message": "Sermon created successfully"
}
```

# Error Responses

### 400 Bad Request - Invalid YouTube URL
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Invalid YouTube URL. Please use a valid YouTube link."
  }
}
```

### 400 Bad Request - Duplicate Video
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "A sermon with this YouTube video already exists in the system"
  }
}
```

### 400 Bad Request - Category Not Found
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Category not found"
  }
}
```

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

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Only LEADER and MASTER_ADMIN can create sermons"
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
| `_id` | Sermon ID (use for publish/update/delete) |
| `youtubeVideoId` | Extracted YouTube video ID |
| `isPublished` | Always false for new sermons (draft mode) |
| `thumbnail` | Auto-generated from YouTube if not provided |

# YouTube Integration Details

- **Accepted Formats**: `https://www.youtube.com/watch?v=VIDEO_ID` or `https://youtu.be/VIDEO_ID`
- **Video ID Extraction**: Automatic - video ID extracted from URL
- **Thumbnail Generation**: Auto-generated as `https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`
- **Custom Thumbnail**: Optional - provide your own thumbnail URL if needed

# Frontend Integration Notes

- **Draft Mode**: New sermons are created as drafts (not visible to users)
- **Publishing**: Use the Publish endpoint to make sermon visible to all users
- **YouTube Validation**: Show real-time validation for YouTube URLs
- **Video Preview**: Display YouTube player using extracted `youtubeVideoId`

# Notes

- Sermons are created in draft mode by default
- Each YouTube video can only exist in one sermon
- Thumbnail auto-generated if not provided

---

### 6. Get All Sermons

# API Name
**Get All Sermons**

# Endpoint
```
GET /api/sermons
```

# Purpose
Fetch all sermons with filtering and search support.

# Authentication
**Protected** - JWT token required

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params
None

# Query Params

| Param | Type | Description |
|-------|------|-------------|
| `categoryId` | string | Filter by category ID (optional) |
| `search` | string | Search in sermon title/description (optional) |

# Examples

```
GET /api/sermons
GET /api/sermons?categoryId=507f1f77bcf86cd799439011
GET /api/sermons?search=faith
GET /api/sermons?categoryId=507f1f77bcf86cd799439011&search=grace
```

# Request Body
None

# Validation Rules

- `categoryId`: Valid MongoDB ObjectId (if provided)
- `search`: Any string (if provided)

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "title": "The Power of Faith",
      "description": "In this sermon, we explore how faith transforms our lives and brings us closer to God...",
      "youtubeLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "youtubeVideoId": "dQw4w9WgXcQ",
      "categoryId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Faith",
        "description": "Sermons focused on building faith"
      },
      "speakerName": "Pastor John Smith",
      "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "isPublished": true,
      "createdBy": {
        "_id": "507f1f77bcf86cd799439099",
        "name": "Pastor John",
        "email": "john@church.com"
      },
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z"
    }
  ],
  "message": "Sermons retrieved successfully"
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
    "message": "Failed to fetch sermons"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `count` | Number of sermons returned |
| `youtubeVideoId` | Use for embedding YouTube player |
| `thumbnail` | Image URL for display |
| `isPublished` | Whether sermon is visible to users |

# Access Control

| User Role | Can See |
|-----------|---------|
| **USER** | Published sermons only |
| **LEADER** | Published + draft sermons |
| **MASTER_ADMIN** | Published + draft sermons |

# Frontend Integration Notes

- **Filtering**: Use `categoryId` query param to filter by category
- **Search**: Use `search` query param for keyword search
- **Video Embedding**: Use `youtubeVideoId` to embed YouTube player
- **Thumbnail Display**: Show `thumbnail` URL as sermon preview image
- **Draft Visibility**: Users only see published sermons automatically
- **Sorting**: Results sorted by creation date (newest first)

# Notes

- Users automatically see published sermons only
- Admins can filter by category or search
- Sorted by creation date (newest first)

---

### 7. Get Single Sermon

# API Name
**Get Single Sermon**

# Endpoint
```
GET /api/sermons/:id
```

# Purpose
Fetch a single sermon by ID with full details.

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
| `id` | Sermon ID |

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
    "title": "The Power of Faith",
    "description": "In this sermon, we explore how faith transforms our lives and brings us closer to God. We discuss biblical examples and practical applications for daily Christian living.",
    "youtubeLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "categoryId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Faith",
      "description": "Sermons focused on building faith"
    },
    "speakerName": "Pastor John Smith",
    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "isPublished": true,
    "createdBy": {
      "_id": "507f1f77bcf86cd799439099",
      "name": "Pastor John",
      "email": "john@church.com"
    },
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:00:00.000Z"
  },
  "message": "Sermon retrieved successfully"
}
```

# Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Sermon not found"
  }
}
```

### 403 Forbidden - Draft Access
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "You do not have permission to view this sermon"
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
| `youtubeVideoId` | Use for embedding YouTube player |
| `thumbnail` | Sermon preview/cover image |
| `description` | Full sermon description for display |
| `speakerName` | Name of sermon speaker |

# Access Control

| User Role | Can Access |
|-----------|-----------|
| **USER** | Published sermons only |
| **LEADER** | Any sermon (draft or published) |
| **MASTER_ADMIN** | Any sermon (draft or published) |

# Frontend Integration Notes

- **Video Player**: Embed YouTube player using `youtubeVideoId`
- **Hero Image**: Display `thumbnail` as sermon cover image
- **Creator Info**: Show creator name and email for attribution
- **Category Link**: Use category info for related content suggestions
- **Permission Check**: Users cannot access draft sermons

# Notes

- Users cannot access draft sermons
- Admins can access any sermon

---

### 8. Update Sermon

# API Name
**Update Sermon**

# Endpoint
```
PUT /api/sermons/:id
```

# Purpose
Update sermon details. If YouTube link changes, video ID is regenerated.

# Authentication
**Protected** - JWT token required

# Permissions
**LEADER or MASTER_ADMIN only**

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Sermon ID |

# Query Params
None

# Request Body

```json
{
  "title": "The Power of Faith - Revised",
  "speakerName": "Pastor John Smith (Senior Pastor)"
}
```

**Note:** All fields optional (send only what you want to update)

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | New sermon title |
| `description` | string | New sermon description |
| `youtubeLink` | string | New YouTube video URL |
| `categoryId` | string | New category ID |
| `speakerName` | string | New speaker name |
| `thumbnail` | string | New thumbnail URL |

# Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Min 3 chars, Max 200 chars (if provided) |
| `description` | Min 10 chars, Max 3000 chars (if provided) |
| `youtubeLink` | Valid YouTube URL (if provided) |
| `categoryId` | Valid MongoDB ObjectId, must exist (if provided) |
| `speakerName` | Max 100 chars (if provided) |
| `thumbnail` | Valid URL (if provided) |

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "The Power of Faith - Revised",
    "description": "In this sermon, we explore how faith transforms our lives and brings us closer to God...",
    "youtubeLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "categoryId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Faith"
    },
    "speakerName": "Pastor John Smith (Senior Pastor)",
    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "isPublished": true,
    "createdBy": "507f1f77bcf86cd799439099",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T14:30:00.000Z"
  },
  "message": "Sermon updated successfully"
}
```

# Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Sermon not found"
  }
}
```

### 400 Bad Request - Duplicate Video
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "A sermon with this YouTube video already exists in the system"
  }
}
```

### 400 Bad Request - Invalid YouTube URL
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Invalid YouTube URL"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Only LEADER and MASTER_ADMIN can update sermons"
  }
}
```

# Frontend Integration Notes

- **Partial Updates**: Send only fields you want to change
- **YouTube Change**: If YouTube link changes, video ID and thumbnail auto-update
- **Custom Thumbnail**: Can override auto-generated thumbnail with custom URL
- **Real-time Validation**: Show validation feedback for all fields

# Notes

- Only LEADER/MASTER_ADMIN can update sermons
- Can update any field at any time
- Changing YouTube link regenerates video ID and thumbnail

---

### 9. Delete Sermon

# API Name
**Delete Sermon**

# Endpoint
```
DELETE /api/sermons/:id
```

# Purpose
Permanently delete a sermon.

# Authentication
**Protected** - JWT token required

# Permissions
**LEADER or MASTER_ADMIN only**

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Sermon ID |

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
    "message": "Sermon deleted successfully"
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
    "message": "Sermon not found"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Only LEADER and MASTER_ADMIN can delete sermons"
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

- **Confirmation**: Show confirmation dialog before permanent deletion
- **Warning**: Inform user that deletion cannot be undone

# Notes

- **Permanent deletion** - not recoverable
- Only LEADER/MASTER_ADMIN can delete sermons

---

### 10. Publish Sermon

# API Name
**Publish Sermon**

# Endpoint
```
PATCH /api/sermons/:id/publish
```

# Purpose
Publish a sermon (make visible to all users). Sends notification to all approved users.

# Authentication
**Protected** - JWT token required

# Permissions
**LEADER or MASTER_ADMIN only**

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Sermon ID |

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
    "title": "The Power of Faith",
    "description": "In this sermon, we explore how faith transforms our lives and brings us closer to God...",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "categoryId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Faith"
    },
    "speakerName": "Pastor John Smith",
    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "isPublished": true,
    "createdBy": "507f1f77bcf86cd799439099",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T14:30:00.000Z"
  },
  "message": "Sermon published successfully"
}
```

# Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Sermon not found"
  }
}
```

### 400 Bad Request - Already Published
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Sermon is already published"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Only LEADER and MASTER_ADMIN can publish sermons"
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
| `isPublished` | Always true after successful publish |

# Frontend Integration Notes

- **Notification**: All approved users are automatically notified when sermon is published
- **Visibility**: Sermon immediately becomes visible to all users after publishing
- **Notification Content**: Users receive: "🎤 New Sermon Published" with sermon title

# Notes

- Publishing sends notifications to all approved users
- Cannot publish already-published sermons
- Only LEADER/MASTER_ADMIN can publish

---

### 11. Unpublish Sermon

# API Name
**Unpublish Sermon**

# Endpoint
```
PATCH /api/sermons/:id/unpublish
```

# Purpose
Unpublish a sermon (hide from users). Returns to draft mode.

# Authentication
**Protected** - JWT token required

# Permissions
**LEADER or MASTER_ADMIN only**

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Sermon ID |

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
    "title": "The Power of Faith",
    "description": "In this sermon, we explore how faith transforms our lives and brings us closer to God...",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "categoryId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Faith"
    },
    "speakerName": "Pastor John Smith",
    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "isPublished": false,
    "createdBy": "507f1f77bcf86cd799439099",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T14:35:00.000Z"
  },
  "message": "Sermon unpublished successfully"
}
```

# Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Sermon not found"
  }
}
```

### 400 Bad Request - Already Unpublished
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Sermon is already unpublished"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Only LEADER and MASTER_ADMIN can unpublish sermons"
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

- **Visibility**: Sermon immediately becomes hidden from all users
- **Draft Status**: Sermon returns to draft mode (only visible to admins)
- **User Experience**: Users will no longer see sermon in their lists

# Notes

- Unpublished sermons hidden from users (visible to admins only)
- Cannot unpublish already-unpublished sermons
- Only LEADER/MASTER_ADMIN can unpublish

---

## Frontend Integration Notes

### Authentication Setup

```javascript
// Store token after login
const token = response.data.token;
localStorage.setItem('token', token);

// Add to all sermon requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
};
```

### Fetch Sermons Example

```javascript
// Get all published sermons
async function fetchSermons() {
  const response = await fetch('/api/sermons', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

// Filter by category
async function fetchSermonsByCategory(categoryId) {
  const response = await fetch(`/api/sermons?categoryId=${categoryId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

// Search sermons
async function searchSermons(query) {
  const response = await fetch(`/api/sermons?search=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
```

### YouTube Video Embedding

```javascript
// Embed YouTube player using extracted video ID
function embedYoutubePlayer(youtubeVideoId, containerId) {
  const container = document.getElementById(containerId);
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '600';
  iframe.src = `https://www.youtube.com/embed/${youtubeVideoId}`;
  iframe.frameBorder = '0';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  container.appendChild(iframe);
}

// Usage
const sermon = { youtubeVideoId: 'dQw4w9WgXcQ' };
embedYoutubePlayer(sermon.youtubeVideoId, 'video-player');
```

### Display Sermon List

```javascript
// Display sermon cards with thumbnails
function displaySermonCards(sermons) {
  return sermons.map(sermon => `
    <div class="sermon-card">
      <img src="${sermon.thumbnail}" alt="${sermon.title}" class="sermon-thumbnail" />
      <h3>${sermon.title}</h3>
      <p class="speaker">by ${sermon.speakerName || 'Unknown Speaker'}</p>
      <p class="category">${sermon.categoryId.name}</p>
      <p class="date">${new Date(sermon.createdAt).toLocaleDateString()}</p>
      <button onclick="viewSermon('${sermon._id}')">Watch Sermon</button>
    </div>
  `).join('');
}
```

### Fetch Categories for Dropdown

```javascript
// Get categories for dropdown menu
async function fetchCategories() {
  const response = await fetch('/api/sermons/categories', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

// Populate category dropdown
async function populateCategoryDropdown(selectElementId) {
  const { data: categories } = await fetchCategories();
  const select = document.getElementById(selectElementId);
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category._id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
```

### Create Sermon (Admin Only)

```javascript
// Create new sermon
async function createSermon(title, description, youtubeLink, categoryId, speakerName) {
  const response = await fetch('/api/sermons', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      youtubeLink,
      categoryId,
      speakerName,
      // thumbnail is auto-generated if not provided
    }),
  });
  return response.json();
}
```

### Publish/Unpublish Sermon (Admin Only)

```javascript
// Publish sermon
async function publishSermon(sermonId) {
  const response = await fetch(`/api/sermons/${sermonId}/publish`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

// Unpublish sermon
async function unpublishSermon(sermonId) {
  const response = await fetch(`/api/sermons/${sermonId}/unpublish`, {
    method: 'PATCH',
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
