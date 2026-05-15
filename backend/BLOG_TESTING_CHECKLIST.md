# 🎯 Blog Module - Integration Checklist

## Pre-Testing Checklist

Before testing the Blog Module, ensure:

### ✅ Server Requirements
- [ ] MongoDB is running
- [ ] Node.js server started with `npm start`
- [ ] No errors in terminal output
- [ ] Health check works: `GET /api/health` returns 200

### ✅ Auth Requirements
- [ ] MASTER_ADMIN user created (via seed-admin.js)
- [ ] Can login and get JWT token
- [ ] Token is valid and not expired

### ✅ File Structure
- [ ] `backend/src/modules/blog/` folder exists
- [ ] All 5 blog files present:
  - `blog.model.js`
  - `blog.service.js`
  - `blog.controller.js`
  - `blog.routes.js`
  - `blog.validation.js`

### ✅ Supporting Files
- [ ] `backend/src/services/notification.helper.js` exists
- [ ] `backend/src/services/audit.helper.js` exists
- [ ] `backend/src/utils/generateSlug.js` exists

### ✅ Model Updates
- [ ] `notification.model.js` updated with userId field
- [ ] `audit.model.js` updated with proper schema

### ✅ Route Registration
- [ ] `blog` routes imported in `app.js`
- [ ] `blogRouter` registered at `/api/blogs`

### ✅ Documentation
- [ ] `blog/README.md` present (500+ lines)
- [ ] `blog/TESTING.md` present (complete examples)
- [ ] `BLOG_IMPLEMENTATION_SUMMARY.md` in backend folder

---

## Quick Verification

### Test 1: Check Server Loads Blog Module

```bash
npm start
# Look for in output - should not have errors importing blog
```

### Test 2: Verify Routes Registered

```bash
curl http://localhost:3000/api/health
# Should return: {"status": "OK", "message": "API is running"}
```

### Test 3: Get Master Admin Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wfc.com",
    "password": "admin123"
  }'

# Save the token from response
TOKEN="your_token_here"
```

### Test 4: Create Blog

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog Post",
    "content": "<p>This is test content with more than 10 characters</p>",
    "tags": ["test"]
  }'

# Should return 201 with blog data
```

### Test 5: Get All Blogs

```bash
curl http://localhost:3000/api/blogs

# Should return 200 with empty array (no published blogs yet)
```

---

## Testing Workflow

### Phase 1: Basic CRUD (5 mins)

1. [ ] Create blog (POST) → expect 201
2. [ ] Update blog (PUT) → expect 200
3. [ ] Get all blogs (GET) → expect 200
4. [ ] Get single blog (GET :slug) → expect 200
5. [ ] Delete blog (DELETE) → expect 200

### Phase 2: Publishing (3 mins)

1. [ ] Create blog
2. [ ] Publish blog (PATCH :id/publish) → expect 200
3. [ ] Verify notifications created (check MongoDB)
4. [ ] Unpublish blog (PATCH :id/unpublish) → expect 200
5. [ ] Verify isPublished = false

### Phase 3: Search & Filter (3 mins)

1. [ ] Create multiple blogs with tags
2. [ ] Search by text: `GET /api/blogs?search=faith`
3. [ ] Filter by tags: `GET /api/blogs?tags=faith,prayer`
4. [ ] Combined: `GET /api/blogs?search=test&tags=faith`

### Phase 4: Access Control (3 mins)

1. [ ] Try create without auth → expect 401
2. [ ] Try create as USER → expect 403
3. [ ] Try create as MASTER_ADMIN → expect 201
4. [ ] USER can view published → expect 200
5. [ ] USER cannot see draft → expect 404

### Phase 5: Error Cases (3 mins)

1. [ ] Empty title → expect 400
2. [ ] Empty content → expect 400
3. [ ] Duplicate slug → expect 400
4. [ ] Publish without content → expect 400
5. [ ] Already published → expect 400

---

## Database Verification

### Check Blogs Collection

```bash
# In MongoDB shell
use wfc_database
db.blogs.find().pretty()

# Should show:
# {
#   _id: ObjectId(...),
#   title: "Test Blog",
#   slug: "test-blog",
#   content: "...",
#   authorId: ObjectId(...),
#   authorName: "Admin",
#   isPublished: true/false,
#   tags: [...],
#   createdAt: ISODate(...),
#   updatedAt: ISODate(...)
# }
```

### Check Notifications

```bash
db.notifications.find({ type: "BLOG" }).pretty()

# Should show notifications for all approved users
# when blog is published
```

### Check Audit Logs

```bash
db.audits.find({ targetType: "BLOG" }).pretty()

# Should show:
# - CREATE_BLOG
# - UPDATE_BLOG
# - PUBLISH_BLOG
# - UNPUBLISH_BLOG
# - DELETE_BLOG
```

---

## Troubleshooting

### Issue: "Cannot find module 'blog.routes.js'"

**Solution:**
```bash
# Check that blog.routes.js exists
ls -la backend/src/modules/blog/

# Restart server
npm start
```

### Issue: "Blog model not found"

**Solution:**
```bash
# Ensure blog.model.js exports properly
grep "export default Blog" backend/src/modules/blog/blog.model.js

# Check mongoose connection
npm start
```

### Issue: Notifications not created on publish

**Solution:**
```bash
# Check notification helper is imported
grep "notificationHelper" backend/src/modules/blog/blog.service.js

# Check Notification model
grep "userId" backend/src/modules/notification/notification.model.js

# Verify approved users exist
db.users.countDocuments({ status: "APPROVED" })
```

### Issue: Slug already exists error

**Solution:**
```bash
# Use different title or delete existing blog
db.blogs.deleteOne({ slug: "test-blog" })
```

### Issue: Cannot publish blog

**Solution:**
```bash
# Check blog content is not empty
db.blogs.findOne({ _id: ObjectId("...") }).content.length

# Content must be > 10 characters
```

---

## Expected Results

### Create Blog (201)
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

### Publish Blog (200)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isPublished": true,
    "publishedAt": "2026-05-15T11:30:00Z",
    "notifications_sent": 12,
    "message": "Blog published successfully"
  }
}
```

### Get All Blogs (200)
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "How to Strengthen Faith",
      "slug": "how-to-strengthen-faith",
      "authorName": "Admin",
      "tags": ["faith"],
      "isPublished": true,
      "publishedAt": "2026-05-15T11:30:00Z",
      "createdAt": "2026-05-15T10:30:00Z"
    }
  ]
}
```

---

## Performance Verification

### Database Indexes

Check if indexes are created:

```bash
db.blogs.getIndexes()

# Should show:
# [
#   { key: { _id: 1 } },
#   { key: { slug: 1 }, unique: true },
#   { key: { isPublished: 1, publishedAt: -1 } },
#   { key: { authorId: 1 } },
#   { key: { tags: 1 } },
#   { key: { title: "text", content: "text" } }
# ]
```

### Query Performance

These queries should be fast:

```bash
# By slug (unique index)
db.blogs.findOne({ slug: "how-to-strengthen-faith" })

# Published blogs (compound index)
db.blogs.find({ isPublished: true }).sort({ publishedAt: -1 })

# By tag
db.blogs.find({ tags: "faith" })

# Text search (text index)
db.blogs.find({ $text: { $search: "faith" } })
```

---

## Sign-Off Checklist

- [ ] All tests passed
- [ ] No errors in server logs
- [ ] Notifications created on publish
- [ ] Audit logs recorded for all actions
- [ ] Database indexes present
- [ ] Slug auto-generation works
- [ ] Role-based access control enforced
- [ ] Error handling working properly
- [ ] Documentation verified
- [ ] Ready for production

---

## Next Module

Once Blog Module is verified, proceed to implement:

1. **Events Module** - Event creation, visibility, notifications
2. **Sermon Module** - Sermon + Category management
3. **Prayer Module** - Prayer requests and interactions
4. **Notification Module** - Complete notification system
5. **Audit Module** - Complete audit dashboard

---

## Support

For issues or questions, refer to:

1. **README.md** - Full API documentation
2. **TESTING.md** - Testing examples
3. **Code comments** - Implementation details
4. **System design docs** - Requirements

---
