# 📝 BLOG MODULE - Complete Implementation Guide

## Overview

The **Blog Module** implements the Pastor's Blog System - a content publishing platform where only MASTER_ADMIN (Pastor) can create and manage blogs, while all other users can read published blogs.

This module follows enterprise-grade architecture patterns with full service separation, validation, error handling, audit logging, and notifications.

---

## 🏗️ Architecture

### Files Structure

```
backend/src/modules/blog/
├── blog.model.js          # Mongoose schema
├── blog.service.js        # Business logic
├── blog.controller.js      # HTTP handlers
├── blog.routes.js         # Route definitions
├── blog.validation.js     # Joi validation schemas
└── README.md              # This file
```

### Supporting Services

```
backend/src/services/
├── notification.helper.js  # Create notifications
├── audit.helper.js         # Log audit trails
└── email.service.js        # Email integration
```

---

## 📊 Database Schema

### Blog Collection

```javascript
{
  _id: ObjectId,
  
  // Content
  title: String,           // Required, 3-200 chars
  content: String,         // Required, min 10 chars
  
  // Author
  authorId: ObjectId,      // MASTER_ADMIN User ID
  authorName: String,      // MASTER_ADMIN name
  
  // Media
  thumbnail: String,       // Optional Cloudinary URL
  tags: [String],         // e.g., ["faith", "hope"]
  
  // Publishing
  slug: String,           // SEO-friendly URL (unique)
  isPublished: Boolean,   // false = draft, true = live
  publishedAt: Date,      // Set when published
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

- `slug` (unique) - For fast slug lookups
- `isPublished, publishedAt` - For published blogs queries
- `authorId` - For author's blogs
- `tags` - For tag filtering
- Text index on `title, content` - For search

---

## 🔐 Access Control

### MASTER_ADMIN (Pastor)

- ✅ Create blogs (always as draft)
- ✅ Update blogs (title, content, tags, thumbnail)
- ✅ Publish/unpublish blogs
- ✅ Delete blogs permanently
- ✅ See all blogs (draft + published)

### LEADERS

- ✅ View published blogs
- ✅ Search and filter blogs
- ❌ Cannot create/edit/delete blogs

### USERS

- ✅ View published blogs
- ✅ Search and filter blogs
- ❌ Cannot create/edit/delete blogs

---

## 🧩 API Endpoints

### 1. Create Blog (Draft)

```http
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "How to Strengthen Faith",
  "content": "<p>Long form content...</p>",
  "tags": ["faith", "inspiration"],
  "thumbnail": "https://cdn.example.com/image.jpg"
}
```

**Requirements:**
- MASTER_ADMIN only
- Content > 10 characters
- Title 3-200 characters
- Auto-generates slug from title

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "How to Strengthen Faith",
    "slug": "how-to-strengthen-faith",
    "isPublished": false,
    "createdAt": "2026-05-15T10:30:00Z",
    "message": "Blog created as draft"
  }
}
```

---

### 2. Update Blog

```http
PUT /api/blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content...</p>",
  "tags": ["faith", "prayer"],
  "thumbnail": "https://cdn.example.com/new-image.jpg"
}
```

**Requirements:**
- MASTER_ADMIN only (must be creator)
- Can update: title, content, tags, thumbnail
- If title changes, slug regenerates automatically
- Cannot be published (draft only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "slug": "updated-title",
    "isPublished": false,
    "updatedAt": "2026-05-15T11:00:00Z",
    "message": "Blog updated successfully"
  }
}
```

---

### 3. Publish Blog

```http
PATCH /api/blogs/:id/publish
Authorization: Bearer <token>
```

**Requirements:**
- MASTER_ADMIN only (must be creator)
- Blog must have content
- Sets isPublished = true
- Sets publishedAt = now
- Triggers notifications to all approved users

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "How to Strengthen Faith",
    "slug": "how-to-strengthen-faith",
    "isPublished": true,
    "publishedAt": "2026-05-15T11:30:00Z",
    "notifications_sent": 45,
    "message": "Blog published successfully"
  }
}
```

---

### 4. Unpublish Blog

```http
PATCH /api/blogs/:id/unpublish
Authorization: Bearer <token>
```

**Requirements:**
- MASTER_ADMIN only (must be creator)
- Can only unpublish published blogs
- Sets isPublished = false
- Does NOT delete content

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "How to Strengthen Faith",
    "slug": "how-to-strengthen-faith",
    "isPublished": false,
    "message": "Blog unpublished successfully"
  }
}
```

---

### 5. Delete Blog

```http
DELETE /api/blogs/:id
Authorization: Bearer <token>
```

**Requirements:**
- MASTER_ADMIN only (must be creator)
- Deletes blog permanently
- Cannot be undone

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "How to Strengthen Faith",
    "message": "Blog deleted successfully"
  }
}
```

---

### 6. Get All Blogs

```http
GET /api/blogs?search=faith&tags=faith,prayer
```

**Access:**
- Public - No authentication required
- USERS see only published blogs
- ADMIN/LEADER see all blogs (draft + published)

**Query Parameters:**
- `search` - Search title/content (string)
- `tags` - Filter by tags (comma-separated)

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "How to Strengthen Faith",
      "slug": "how-to-strengthen-faith",
      "authorName": "Pastor John",
      "tags": ["faith", "inspiration"],
      "isPublished": true,
      "publishedAt": "2026-05-15T11:30:00Z",
      "createdAt": "2026-05-15T10:30:00Z"
      // Note: content excluded in list view
    }
  ]
}
```

---

### 7. Get Single Blog by Slug

```http
GET /api/blogs/:slug
```

**Examples:**
```
GET /api/blogs/how-to-strengthen-faith
GET /api/blogs/the-power-of-prayer
```

**Access:**
- Public - No authentication required
- USERS can only see published blogs
- ADMIN/LEADER can see any blog (draft or published)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "How to Strengthen Faith",
    "content": "<p>Long form HTML content...</p>",
    "slug": "how-to-strengthen-faith",
    "authorId": "507f1f77bcf86cd799439012",
    "authorName": "Pastor John",
    "thumbnail": "https://cdn.example.com/image.jpg",
    "tags": ["faith", "inspiration"],
    "isPublished": true,
    "publishedAt": "2026-05-15T11:30:00Z",
    "createdAt": "2026-05-15T10:30:00Z",
    "updatedAt": "2026-05-15T11:30:00Z"
  }
}
```

---

## 🔄 Workflows

### Create & Publish Blog

```
1. POST /api/blogs
   ├─ Validates input
   ├─ Generates slug
   ├─ Creates blog with isPublished=false
   └─ Logs CREATE_BLOG

2. PUT /api/blogs/:id (optional)
   ├─ Validates input
   ├─ Updates content
   └─ Logs UPDATE_BLOG

3. PATCH /api/blogs/:id/publish
   ├─ Validates content exists
   ├─ Sets isPublished=true
   ├─ Sets publishedAt=now
   ├─ Creates notifications for all approved users
   └─ Logs PUBLISH_BLOG
```

### View Published Blogs

```
GET /api/blogs
├─ User role check
├─ USERS: Only isPublished=true
├─ ADMIN/LEADER: All blogs
├─ Apply search/filters
└─ Return list (content excluded)

GET /api/blogs/:slug
├─ User role check
├─ Fetch by slug
├─ Check isPublished or admin
└─ Return full blog
```

---

## 🔔 Notifications

When blog is published:
- Creates notifications for **all approved users**
- Notification type: `BLOG`
- Content: "New blog post by Pastor: {title}"

### Notification Schema

```javascript
{
  userId: ObjectId,              // Recipient
  type: "BLOG",                 // Type
  title: "New Blog Post",        // Short message
  message: "Posted: How to...",  // Details
  referenceId: ObjectId,         // blogId
  isRead: false,                // Status
  createdAt: Date               // Timestamp
}
```

---

## 📜 Audit Logging

All blog actions are logged for compliance and debugging.

### Logged Actions

| Action | When | Details |
|--------|------|---------|
| CREATE_BLOG | Blog created | title, slug |
| UPDATE_BLOG | Blog updated | updated_fields |
| PUBLISH_BLOG | Blog published | notified_users count |
| UNPUBLISH_BLOG | Blog unpublished | title |
| DELETE_BLOG | Blog deleted | title, slug, was_published |

### Audit Log Schema

```javascript
{
  action: "CREATE_BLOG",
  performedBy: ObjectId,        // MASTER_ADMIN userId
  performerRole: "MASTER_ADMIN",
  targetId: ObjectId,           // blogId
  targetType: "BLOG",
  metadata: {                   // Extra info
    title: "How to...",
    slug: "how-to-..."
  },
  createdAt: Date
}
```

---

## ⚙️ Validation Rules

### Create Blog

- **title**: Required, 3-200 characters, trimmed
- **content**: Required, minimum 10 characters
- **tags**: Optional array, each tag max 50 chars
- **thumbnail**: Optional, must be valid URL

### Update Blog

- **At least one field** must be provided
- **title**: 3-200 characters if provided
- **content**: Minimum 10 characters if provided
- **slug**: Auto-regenerated if title changes
- **Slug uniqueness**: Checked to prevent conflicts

### Publish Blog

- **Content required**: Blog must have content
- **Not already published**: Cannot publish published blogs
- **Author check**: Only creator can publish

---

## 🛡️ Error Handling

### Common Errors

| Scenario | Status | Message |
|----------|--------|---------|
| Unauthorized role | 403 | "Forbidden: Only MASTER_ADMIN can create blogs" |
| Blog not found | 404 | "Blog not found" |
| Slug conflict | 400 | 'Blog with slug "..." already exists' |
| Empty content | 400 | "Cannot publish: Blog must have content" |
| Validation failed | 400 | Joi validation details |
| Not blog author | 403 | "Unauthorized: Only blog author can update" |
| Already published | 400 | "Blog is already published" |

---

## 🧪 Testing

### Example Requests

#### Create Blog

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to Strengthen Faith",
    "content": "<p>Long form content here...</p>",
    "tags": ["faith", "inspiration"],
    "thumbnail": "https://example.com/image.jpg"
  }'
```

#### Publish Blog

```bash
curl -X PATCH http://localhost:3000/api/blogs/<blog-id>/publish \
  -H "Authorization: Bearer <token>"
```

#### Get All Blogs

```bash
curl http://localhost:3000/api/blogs?search=faith&tags=faith,prayer
```

#### Get Single Blog

```bash
curl http://localhost:3000/api/blogs/how-to-strengthen-faith
```

---

## 🚀 Features Implemented

✅ Create blogs (draft only)
✅ Update blogs (title, content, tags, thumbnail)
✅ Publish/unpublish blogs
✅ Delete blogs
✅ Get all blogs (with role-based filtering)
✅ Get single blog by slug
✅ Search by title/content
✅ Filter by tags
✅ Auto-generate SEO-friendly slugs
✅ Ownership verification (only author can manage)
✅ Notifications on publish (all approved users)
✅ Audit logging (all actions)
✅ Full input validation with Joi
✅ Proper error handling
✅ Role-based access control (RBAC)

---

## 📈 Future Enhancements

- [ ] Add draft auto-save
- [ ] Add featured blogs
- [ ] Add blog comments
- [ ] Add likes/reactions
- [ ] Add reading time estimate
- [ ] Add related blogs
- [ ] Add blog categories
- [ ] Add SEO meta tags
- [ ] Add scheduled publishing
- [ ] Add edit history/revisions
- [ ] Add blog statistics/views
- [ ] Add social sharing
- [ ] Add newsletter integration
- [ ] Add RSS feed

---

## 🔗 Integration Points

- **Auth Middleware** - Verifies JWT tokens
- **Role Middleware** - Enforces MASTER_ADMIN role
- **Validation Middleware** - Validates request bodies
- **Notification Service** - Sends notifications to users
- **Audit Service** - Logs all actions
- **Error Middleware** - Handles errors globally

---

## 📦 Dependencies

- `mongoose` - ODM for MongoDB
- `joi` - Input validation
- `express` - Web framework

---

## 💡 Design Principles

1. **Service Layer Architecture** - All business logic in service
2. **Clean Separation** - Controllers only handle HTTP
3. **Proper Validation** - Joi schemas for all inputs
4. **Immutable Audits** - Logs cannot be modified
5. **Event-Driven** - Notifications on important actions
6. **RBAC** - Role-based access control throughout
7. **Error Handling** - Consistent error responses
8. **Production-Ready** - Indexes, logging, monitoring

---
