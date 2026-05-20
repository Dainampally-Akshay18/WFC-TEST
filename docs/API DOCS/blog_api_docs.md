# BLOG MODULE API DOCUMENTATION

**Generated:** May 20, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
   - [Public Endpoints](#public-endpoints)
   - [Admin Endpoints](#admin-endpoints)
3. [Frontend Integration Notes](#frontend-integration-notes)

---

## Overview

The BLOG module provides APIs for viewing blog posts and managing blog content. Users can read published blogs. Admins (MASTER_ADMIN) can create, edit, publish, and delete blogs.

**Key Points:**
- Users see only **published blogs**
- Admins see **all blogs** (draft + published)
- Blogs are created in **draft status** by default
- Admins must **publish blogs** to make them visible to users

---

## API Endpoints

---

## PUBLIC ENDPOINTS

---

### 1. Get All Blogs

# API Name
**Get All Blogs**

# Endpoint
```
GET /api/blogs
```

# Purpose
Fetch all published blogs with optional search and tag filtering.

# Authentication
**Public** - No token required

# Request Headers
```
Content-Type: application/json
```

# Query Params

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by title or content |
| `tags` | string | Filter by tags (comma-separated: `faith,hope`) |

# Request Body
None

# Validation Rules
- `search`: max 200 characters
- `tags`: comma-separated values

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Faith in Difficult Times",
      "slug": "faith-in-difficult-times",
      "authorName": "Pastor John",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "tags": ["faith", "hope"],
      "publishedAt": "2026-01-15T10:30:00.000Z",
      "createdAt": "2026-01-10T08:20:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "God's Love is Infinite",
      "slug": "gods-love-infinite",
      "authorName": "Pastor John",
      "thumbnail": "https://example.com/thumbnail2.jpg",
      "tags": ["love"],
      "publishedAt": "2026-01-12T14:00:00.000Z",
      "createdAt": "2026-01-05T09:15:00.000Z"
    }
  ]
}
```

# Error Responses

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Failed to fetch blogs"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `title` | Blog post title |
| `slug` | URL-friendly identifier (use in routes) |
| `authorName` | Name of the blog author |
| `thumbnail` | Featured image URL (from Cloudinary) |
| `tags` | Array of topic tags |
| `publishedAt` | When blog was published |
| `content` | **Not included in list** (fetch via slug endpoint) |

# Frontend Integration Notes

- **Pagination:** Results are sorted newest first (by publishedAt)
- **Lazy Loading:** Use `search` param for real-time search with debounce (300ms recommended)
- **Image Rendering:** `thumbnail` is a direct URL, use as `<img src={blog.thumbnail} />` or as background
- **Routing:** Use `slug` for navigation: `/blog/${blog.slug}`
- **Tag Filtering:** Pass multiple tags as comma-separated string: `?tags=faith,hope`
- **Search:** Searches in title and content

# Notes

- Only **published blogs** returned
- Content field excluded for performance (fetch single blog for full content)
- Results ordered by most recent first

---

### 2. Get Single Blog

# API Name
**Get Single Blog**

# Endpoint
```
GET /api/blogs/:slug
```

# Purpose
Fetch a single published blog by URL slug, including full content.

# Authentication
**Public** - No token required

# Request Headers
```
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `slug` | URL-friendly blog identifier |

**Example:** `/api/blogs/faith-in-difficult-times`

# Query Params
None

# Request Body
None

# Validation Rules
- `slug`: URL-safe string (auto-generated from title)

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Faith in Difficult Times",
    "content": "<p>Faith is believing in things unseen...</p><p>During difficult times, our faith is tested...</p>",
    "slug": "faith-in-difficult-times",
    "authorName": "Pastor John",
    "authorId": "507f1f77bcf86cd799439099",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "tags": ["faith", "hope", "strength"],
    "isPublished": true,
    "publishedAt": "2026-01-15T10:30:00.000Z",
    "createdAt": "2026-01-10T08:20:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

# Error Responses

### 404 Not Found - Blog Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Blog not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Failed to fetch blog"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `content` | Full HTML/rich text content |
| `authorName` | Blog author name |
| `thumbnail` | Featured image URL |
| `tags` | Topic tags for categorization |
| `isPublished` | Always `true` for users |
| `publishedAt` | Timestamp when published |

# Frontend Integration Notes

- **Content Rendering:** `content` is HTML, render as `<div dangerouslySetInnerHTML={{ __html: blog.content }} />`
- **Image Handling:** Thumbnail is a direct URL from Cloudinary
- **Metadata:** Include `title`, `authorName`, `publishedAt` in page header
- **SEO:** Use `slug` in URL for clean permalinks
- **Caching:** Safe to cache in frontend (changes only when admin updates)

# Notes

- Full content included (unlike list endpoint)
- Only published blogs visible to users
- Admins can see draft blogs via the same endpoint with token

---

## ADMIN ENDPOINTS

These endpoints require **MASTER_ADMIN role** and **valid JWT token**.

---

### 3. Create Blog

# API Name
**Create Blog**

# Endpoint
```
POST /api/blogs
```

# Purpose
Create a new blog post in draft status. Only MASTER_ADMIN can create blogs.

# Authentication
**Protected** - JWT token required
**Role Required:** MASTER_ADMIN only

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
  "title": "God's Unconditional Love",
  "content": "<p>God's love is not based on our performance...</p><p>It is unconditional and eternal.</p>",
  "tags": ["love", "grace", "redemption"],
  "thumbnail": "https://res.cloudinary.com/example/image/upload/v1234567890/blog.jpg"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Blog post title |
| `content` | string | Yes | Rich HTML content |
| `tags` | array | No | Topic tags (strings) |
| `thumbnail` | string | No | Image URL from Cloudinary |

# Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Min 3 chars, Max 200 chars, Required |
| `content` | Min 10 chars, Required |
| `tags` | Array of strings, each max 50 chars |
| `thumbnail` | Valid URL (optional) |

# Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "God's Unconditional Love",
    "slug": "gods-unconditional-love",
    "isPublished": false,
    "createdAt": "2026-01-20T12:00:00.000Z",
    "message": "Blog created as draft"
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

### 400 Bad Request - Duplicate Slug
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Blog with slug 'gods-unconditional-love' already exists. Please use a different title."
  }
}
```

### 401 Unauthorized - No Token
```json
{
  "success": false,
  "error": {
    "message": "No authorization header provided"
  }
}
```

### 403 Forbidden - Not Admin
```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions for this action"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Blog creation failed"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `_id` | Blog ID (use for updates/publish/delete) |
| `slug` | Auto-generated URL slug from title |
| `isPublished` | Always `false` when created |
| `message` | "Blog created as draft" |

# Frontend Integration Notes

- **Status:** Created blogs are **draft** and not visible to users until published
- **Slug Generation:** Automatically generated from title (e.g., "My Blog Title" → "my-blog-title")
- **Rich Text:** Use rich text editor (Draft.js, TipTap) for `content` field
- **Image Upload:** Upload to Cloudinary separately, pass URL in `thumbnail`
- **Tags:** Pass as array: `["tag1", "tag2"]`
- **Save Draft:** After creation, save `_id` and `slug` for future edits

# Notes

- Created in **draft status** automatically
- Slug is unique (cannot have duplicate titles)
- Must be published to be visible to users

---

### 4. Update Blog

# API Name
**Update Blog**

# Endpoint
```
PUT /api/blogs/:id
```

# Purpose
Update a blog's title, content, tags, or thumbnail. Only the creator can update.

# Authentication
**Protected** - JWT token required
**Role Required:** MASTER_ADMIN only

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Blog ID (from create response) |

# Query Params
None

# Request Body

```json
{
  "title": "God's Unconditional Love - Updated",
  "content": "<p>Updated content here...</p>",
  "tags": ["love", "grace"],
  "thumbnail": "https://res.cloudinary.com/example/image/upload/v9876543210/blog-new.jpg"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | New blog title |
| `content` | string | No | New content |
| `tags` | array | No | New tags array |
| `thumbnail` | string | No | New thumbnail URL |

**Note:** At least one field must be provided

# Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Min 3 chars, Max 200 chars (if provided) |
| `content` | Min 10 chars (if provided) |
| `tags` | Array of strings, each max 50 chars |
| `thumbnail` | Valid URL (optional) |

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "God's Unconditional Love - Updated",
    "slug": "gods-unconditional-love-updated",
    "isPublished": false,
    "updatedAt": "2026-01-20T13:30:00.000Z",
    "message": "Blog updated successfully"
  }
}
```

# Error Responses

### 400 Bad Request - Blog Not Found
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Blog not found"
  }
}
```

### 400 Bad Request - Not Author
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Unauthorized: Only blog author can update"
  }
}
```

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Content must be at least 10 characters"
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

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions for this action"
  }
}
```

# Response Fields Explanation

| Field | Description |
|-------|-------------|
| `_id` | Blog ID |
| `slug` | Updated slug (regenerated if title changed) |
| `isPublished` | Publishing status (unchanged) |

# Frontend Integration Notes

- **Partial Updates:** Send only fields you want to change
- **Title Change:** If title changed, slug is regenerated
- **Draft Editing:** Can edit while in draft status
- **Published Blogs:** Can still edit published blogs (content updates immediately visible)
- **Auto-save:** Consider debouncing updates (500ms)

# Notes

- Only creator can update
- Can update at any time (draft or published)
- Slug regenerates if title changes

---

### 5. Publish Blog

# API Name
**Publish Blog**

# Endpoint
```
PATCH /api/blogs/:id/publish
```

# Purpose
Publish a draft blog, making it visible to all users. Notifications sent to all users.

# Authentication
**Protected** - JWT token required
**Role Required:** MASTER_ADMIN only

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Blog ID |

# Query Params
None

# Request Body
None

# Validation Rules
- Blog must have content
- Blog must not already be published

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "God's Unconditional Love",
    "slug": "gods-unconditional-love",
    "isPublished": true,
    "publishedAt": "2026-01-20T14:00:00.000Z",
    "notifications_sent": 145,
    "message": "Blog published successfully"
  }
}
```

# Error Responses

### 400 Bad Request - Blog Not Found
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Blog not found"
  }
}
```

### 400 Bad Request - Already Published
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Blog is already published"
  }
}
```

### 400 Bad Request - Not Author
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Unauthorized: Only blog author can publish"
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
| `isPublished` | Now `true` |
| `publishedAt` | Current timestamp |
| `notifications_sent` | Count of users notified |

# Frontend Integration Notes

- **User Notification:** Automatically notifies all approved users
- **Visibility:** Blog immediately visible in public blog list
- **Timestamp:** `publishedAt` set to current time

# Notes

- Cannot undo publish (use unpublish endpoint instead)
- Notifications sent to all users automatically
- Blog must have content to publish

---

### 6. Unpublish Blog

# API Name
**Unpublish Blog**

# Endpoint
```
PATCH /api/blogs/:id/unpublish
```

# Purpose
Unpublish a published blog, making it invisible to users (returns to draft).

# Authentication
**Protected** - JWT token required
**Role Required:** MASTER_ADMIN only

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Blog ID |

# Query Params
None

# Request Body
None

# Validation Rules
- Blog must be published

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "God's Unconditional Love",
    "slug": "gods-unconditional-love",
    "isPublished": false,
    "message": "Blog unpublished successfully"
  }
}
```

# Error Responses

### 400 Bad Request - Not Published
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Blog is already in draft mode"
  }
}
```

### 400 Bad Request - Not Author
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Unauthorized: Only blog author can unpublish"
  }
}
```

# Frontend Integration Notes

- **Visibility:** Blog immediately hidden from public (only admins see it)
- **Content Preserved:** All content and metadata remains unchanged
- **Re-publish:** Can re-publish the same blog anytime

# Notes

- Temporarily hides blog from users
- No notifications sent on unpublish

---

### 7. Delete Blog

# API Name
**Delete Blog**

# Endpoint
```
DELETE /api/blogs/:id
```

# Purpose
Permanently delete a blog. Only the creator can delete.

# Authentication
**Protected** - JWT token required
**Role Required:** MASTER_ADMIN only

# Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

# Route Params

| Param | Description |
|-------|-------------|
| `id` | Blog ID |

# Query Params
None

# Request Body
None

# Validation Rules
- Blog must exist
- Must be creator

# Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "God's Unconditional Love",
    "message": "Blog deleted successfully"
  }
}
```

# Error Responses

### 400 Bad Request - Blog Not Found
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Blog not found"
  }
}
```

### 400 Bad Request - Not Author
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Unauthorized: Only blog author can delete"
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

- **Permanent Action:** Deletion cannot be undone
- **Confirmation:** Show user confirmation before deleting
- **Cleanup:** Remove from local cache/state after deletion

# Notes

- **Permanent deletion** - cannot be recovered
- Works on draft or published blogs

---

## Frontend Integration Notes

### Authentication Setup

```javascript
// Store token after login
const token = response.data.token;
localStorage.setItem('token', token);

// Add to all admin requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
};
```

### Blog List Example

```javascript
// Fetch all published blogs
async function fetchBlogs(search = '', tags = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (tags) params.append('tags', tags);
  
  const response = await fetch(`/api/blogs?${params}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

// Search with debounce
const [search, setSearch] = useState('');

const debouncedSearch = useCallback(
  debounce((query) => fetchBlogs(query), 300),
  []
);

const handleSearch = (e) => {
  setSearch(e.target.value);
  debouncedSearch(e.target.value);
};
```

### Single Blog Rendering

```javascript
// Fetch single blog
async function fetchBlog(slug) {
  const response = await fetch(`/api/blogs/${slug}`);
  return response.json();
}

// Render HTML content safely
function BlogContent({ blog }) {
  return (
    <>
      <h1>{blog.title}</h1>
      <p>By {blog.authorName}</p>
      <img src={blog.thumbnail} alt={blog.title} />
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      <div className="tags">
        {blog.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </>
  );
}
```

### Admin Create Blog

```javascript
// Create blog (admin only)
async function createBlog(title, content, tags, thumbnail) {
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      content,
      tags,
      thumbnail,
    }),
  });
  return response.json();
}
```

### Admin Publish Blog

```javascript
// Publish blog
async function publishBlog(blogId) {
  const response = await fetch(`/api/blogs/${blogId}/publish`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
```

### Image Upload Flow

```javascript
// 1. Upload image to Cloudinary (client-side)
async function uploadThumbnail(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_preset');
  
  const response = await fetch(
    'https://api.cloudinary.com/v1_1/your_cloud/image/upload',
    { method: 'POST', body: formData }
  );
  const data = await response.json();
  return data.secure_url; // Use this as thumbnail
}

// 2. Create blog with thumbnail URL
const thumbnailUrl = await uploadThumbnail(file);
await createBlog(title, content, tags, thumbnailUrl);
```

---

**End of Documentation**
