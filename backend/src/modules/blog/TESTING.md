# 🧪 BLOG MODULE - Testing Guide

Complete testing guide for the Blog Module with examples for all endpoints.

---

## 🚀 Quick Start

### 1. Setup

Ensure you have:
- Node.js running with `npm start`
- MongoDB running
- MASTER_ADMIN user token (from signup + approval)

### 2. Get MASTER_ADMIN Token

```bash
# Signup as MASTER_ADMIN (if seed-admin.js was run)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wfc.com",
    "password": "admin123"
  }'

# Response includes token:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "507f1f77bcf86cd799439011",
    "role": "MASTER_ADMIN"
  }
}
```

Save the token as `TOKEN` variable:
```bash
TOKEN="your_token_here"
```

---

## 📝 Test Cases

### Test 1: Create Blog (Draft)

**Endpoint:** `POST /api/blogs`

**With cURL:**
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to Strengthen Faith",
    "content": "<p>Faith is the foundation of our spiritual journey. It requires daily practice, prayer, and community support. In this blog, we explore practical ways to strengthen your faith.</p>",
    "tags": ["faith", "spiritual-growth", "prayer"],
    "thumbnail": "https://example.com/faith.jpg"
  }'
```

**Expected Response (201):**
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

**Save the blog ID:**
```bash
BLOG_ID="507f1f77bcf86cd799439011"
```

---

### Test 2: Create Another Blog

**Test creating a second blog for variety:**

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Power of Prayer",
    "content": "<p>Prayer is communication with God. Through prayer, we express our needs, gratitude, and devotion. Let us explore different types of prayer and their significance.</p>",
    "tags": ["prayer", "spirituality"],
    "thumbnail": "https://example.com/prayer.jpg"
  }'
```

---

### Test 3: Update Blog

**Endpoint:** `PUT /api/blogs/:id`

**Update title (slug regenerates automatically):**
```bash
curl -X PUT http://localhost:3000/api/blogs/$BLOG_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ways to Strengthen Your Faith in Daily Life",
    "content": "<p>Updated content about strengthening faith through daily practices...</p>",
    "tags": ["faith", "daily-devotion", "spiritual-growth"]
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Ways to Strengthen Your Faith in Daily Life",
    "slug": "ways-to-strengthen-your-faith-in-daily-life",
    "isPublished": false,
    "updatedAt": "2026-05-15T11:00:00Z",
    "message": "Blog updated successfully"
  }
}
```

---

### Test 4: Publish Blog

**Endpoint:** `PATCH /api/blogs/:id/publish`

```bash
curl -X PATCH http://localhost:3000/api/blogs/$BLOG_ID/publish \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Ways to Strengthen Your Faith in Daily Life",
    "slug": "ways-to-strengthen-your-faith-in-daily-life",
    "isPublished": true,
    "publishedAt": "2026-05-15T11:30:00Z",
    "notifications_sent": 12,
    "message": "Blog published successfully"
  }
}
```

---

### Test 5: Get All Blogs (No Auth)

**Endpoint:** `GET /api/blogs`

**Basic query:**
```bash
curl http://localhost:3000/api/blogs
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Ways to Strengthen Your Faith in Daily Life",
      "slug": "ways-to-strengthen-your-faith-in-daily-life",
      "authorName": "Admin User",
      "tags": ["faith", "daily-devotion"],
      "isPublished": true,
      "publishedAt": "2026-05-15T11:30:00Z",
      "createdAt": "2026-05-15T10:30:00Z"
    }
  ]
}
```

**Note:** `content` is excluded from list view for performance

---

### Test 6: Search Blogs

**Endpoint:** `GET /api/blogs?search=faith`

```bash
curl "http://localhost:3000/api/blogs?search=faith"
```

---

### Test 7: Filter by Tags

**Endpoint:** `GET /api/blogs?tags=faith,prayer`

```bash
curl "http://localhost:3000/api/blogs?tags=faith,prayer"
```

---

### Test 8: Combined Search & Filter

```bash
curl "http://localhost:3000/api/blogs?search=strengthen&tags=faith,spiritual-growth"
```

---

### Test 9: Get Single Blog by Slug (No Auth)

**Endpoint:** `GET /api/blogs/:slug`

```bash
curl http://localhost:3000/api/blogs/ways-to-strengthen-your-faith-in-daily-life
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Ways to Strengthen Your Faith in Daily Life",
    "content": "<p>Full HTML content...</p>",
    "slug": "ways-to-strengthen-your-faith-in-daily-life",
    "authorId": "507f1f77bcf86cd799439012",
    "authorName": "Admin User",
    "thumbnail": "https://example.com/faith.jpg",
    "tags": ["faith", "daily-devotion"],
    "isPublished": true,
    "publishedAt": "2026-05-15T11:30:00Z",
    "createdAt": "2026-05-15T10:30:00Z",
    "updatedAt": "2026-05-15T11:30:00Z"
  }
}
```

---

### Test 10: Unpublish Blog

**Endpoint:** `PATCH /api/blogs/:id/unpublish`

```bash
curl -X PATCH http://localhost:3000/api/blogs/$BLOG_ID/unpublish \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Ways to Strengthen Your Faith in Daily Life",
    "slug": "ways-to-strengthen-your-faith-in-daily-life",
    "isPublished": false,
    "message": "Blog unpublished successfully"
  }
}
```

---

### Test 11: Delete Blog

**Endpoint:** `DELETE /api/blogs/:id`

```bash
curl -X DELETE http://localhost:3000/api/blogs/$BLOG_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Ways to Strengthen Your Faith in Daily Life",
    "message": "Blog deleted successfully"
  }
}
```

---

## ❌ Error Testing

### Test 1: Missing Required Field

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Blog without content"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "\"content\" is required",
    "details": [...]
  }
}
```

---

### Test 2: Invalid Title Length

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AB",
    "content": "This is valid content with more than 10 characters"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "\"title\" length must be at least 3 characters long"
  }
}
```

---

### Test 3: Unauthorized (Missing Auth)

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized Blog",
    "content": "This blog tries to be created without auth"
  }'
```

**Expected Response (401):**
```json
{
  "error": {
    "status": 401,
    "message": "Unauthorized: No token provided"
  }
}
```

---

### Test 4: Forbidden (Not MASTER_ADMIN)

Create a USER token first, then try to create blog:

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "User tries to create blog",
    "content": "This should fail"
  }'
```

**Expected Response (403):**
```json
{
  "error": {
    "status": 403,
    "message": "Forbidden: Insufficient permissions"
  }
}
```

---

### Test 5: Blog Not Found

```bash
curl http://localhost:3000/api/blogs/nonexistent-slug
```

**Expected Response (404):**
```json
{
  "error": {
    "status": 404,
    "message": "Blog not found"
  }
}
```

---

### Test 6: Slug Already Exists

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to Strengthen Faith",
    "content": "This blog has same title as another blog"
  }'
```

**Expected Response (400):**
```json
{
  "error": {
    "message": "Blog with slug \"how-to-strengthen-faith\" already exists"
  }
}
```

---

### Test 7: Cannot Publish Without Content

Create a blog with empty content attempt (validation will catch):

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Empty Blog",
    "content": ""
  }'
```

**Expected Response (400):**
```json
{
  "error": {
    "message": "\"content\" is not allowed to be empty"
  }
}
```

---

### Test 8: Already Published

```bash
# Try to publish an already published blog
curl -X PATCH http://localhost:3000/api/blogs/$BLOG_ID/publish \
  -H "Authorization: Bearer $TOKEN"

# Try again
curl -X PATCH http://localhost:3000/api/blogs/$BLOG_ID/publish \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (400):**
```json
{
  "error": {
    "message": "Blog is already published"
  }
}
```

---

## 📊 Using Postman/Bruno

### Import Environment

```json
{
  "id": "blog-module-env",
  "name": "Blog Module Testing",
  "values": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:3000",
      "enabled": true
    },
    {
      "key": "TOKEN",
      "value": "your_master_admin_token",
      "enabled": true
    },
    {
      "key": "BLOG_ID",
      "value": "blog_id_from_create_response",
      "enabled": true
    }
  ]
}
```

### Collection Template

Use these URLs in Postman/Bruno:

- Create: `{{BASE_URL}}/api/blogs`
- Update: `{{BASE_URL}}/api/blogs/{{BLOG_ID}}`
- Publish: `{{BASE_URL}}/api/blogs/{{BLOG_ID}}/publish`
- Get All: `{{BASE_URL}}/api/blogs`
- Get One: `{{BASE_URL}}/api/blogs/how-to-strengthen-faith`

---

## ✅ Test Checklist

- [ ] Create blog (draft)
- [ ] Update blog (title change regenerates slug)
- [ ] Publish blog (notifications sent)
- [ ] Get all blogs (published only for users)
- [ ] Get single blog by slug
- [ ] Search blogs
- [ ] Filter blogs by tags
- [ ] Unpublish blog
- [ ] Delete blog
- [ ] Test missing required fields
- [ ] Test invalid input values
- [ ] Test unauthorized access
- [ ] Test forbidden (non-MASTER_ADMIN)
- [ ] Test nonexistent blog
- [ ] Test slug conflicts
- [ ] Test already published error
- [ ] Verify audit logs created
- [ ] Verify notifications sent on publish

---

## 🐛 Debugging

### Check Server Logs

Monitor terminal where `npm start` is running:

```
✅ Audit logged: CREATE_BLOG by MASTER_ADMIN
✅ Email sent successfully to user@example.com
```

### Check Notifications

```bash
# Query MongoDB
db.notifications.find({ type: "BLOG" }).pretty()
```

### Check Audit Logs

```bash
# Query MongoDB
db.audits.find({ action: /BLOG/ }).pretty()
```

---

## 🚀 Performance Tips

1. **Use indexes** - Slug, isPublished, tags are indexed
2. **Exclude content in list** - Only return in single blog view
3. **Use pagination** - Not implemented yet, add later
4. **Cache published blogs** - Consider caching in future
5. **Batch notifications** - Currently sends individually

---
