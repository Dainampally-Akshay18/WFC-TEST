# 📊 Audit Module Documentation

## Overview

The Audit Module provides immutable, append-only audit logging for the WFC (Worship Fellowship Church) management system. It tracks all significant system actions, enforces branch-aware access control, and provides comprehensive audit trails for compliance and debugging.

**Key Characteristics**:
- ✅ **Immutable**: Logs can never be updated or deleted
- ✅ **Append-Only**: New logs are created via `logAction()` helper
- ✅ **Branch-Aware**: LEADER users see only their branch logs; MASTER_ADMIN see all
- ✅ **Centralized**: Single `logAction()` helper prevents code duplication
- ✅ **Comprehensive**: Tracks action, performer, target, branch, and custom metadata

---

## Architecture

### Files

```
src/modules/audit/
├── audit.model.js        # MongoDB schema (immutable AuditLog)
├── audit.service.js      # Business logic + logAction() helper
├── audit.controller.js   # HTTP request handlers
├── audit.routes.js       # API endpoint definitions
├── audit.validation.js   # Joi schemas for query validation
├── README.md             # This file
└── TESTING.md            # Test cases and scenarios
```

### Data Model

```javascript
{
  _id: ObjectId,
  action: String,                    // "CREATE_BLOG", "UPDATE_EVENT", etc.
  performedBy: ObjectId,             // User._id who performed action
  performerRole: String,             // "USER", "LEADER", "MASTER_ADMIN"
  targetId: ObjectId,                // "blogId", "eventId", etc.
  targetType: String,                // "BLOG", "EVENT", "PRAYER", etc.
  metadata: {
    branch: String,                  // "BRANCH1", null for GLOBAL
    userId: ObjectId,                // Additional context (varies by action)
    beforeValue: { ... },            // Previous state (for updates)
    afterValue: { ... },             // New state (for updates)
    ipAddress: String,
    userAgent: String,
    reason: String,                  // Why action was taken
    ...                              // Custom fields per action
  },
  createdAt: Date,
  updatedAt: Date                    // Pseudo-immutable, never truly updated
}
```

### Service Layer Pattern

The Audit Module exports a centralized `logAction()` helper that other modules use for logging:

```javascript
import { auditService } from '../audit/audit.service.js';

// In any service file (sermon.service.js, blog.service.js, etc.)
await auditService.logAction({
  action: 'CREATE_BLOG',
  performedBy: userId,
  performerRole: userRole,
  targetId: blogId,
  targetType: 'BLOG',
  metadata: {
    branch: userBranch,
    title: blogTitle,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  }
});
```

---

## API Endpoints

### 1️⃣ Get Audit Logs

```http
GET /api/audit
```

**Authentication**: Required (Bearer token)  
**Authorization**: LEADER, MASTER_ADMIN only

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20, max: 100) |
| `action` | string | Filter by action (CREATE_BLOG, UPDATE_EVENT, etc.) |
| `performerRole` | string | Filter by performer role (USER, LEADER, MASTER_ADMIN) |
| `targetType` | string | Filter by target type (BLOG, EVENT, SERMON, etc.) |
| `branch` | string | Filter by branch (MASTER_ADMIN only) |
| `startDate` | ISO string | Filter from date |
| `endDate` | ISO string | Filter to date |

**Example Request**:

```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/audit?page=1&limit=20&action=CREATE_BLOG&startDate=2024-01-01T00:00:00Z'
```

**Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "action": "CREATE_BLOG",
      "performedBy": "507f1f77bcf86cd799439012",
      "performerRole": "LEADER",
      "targetId": "507f1f77bcf86cd799439013",
      "targetType": "BLOG",
      "metadata": {
        "branch": "BRANCH1",
        "title": "New Blog Post",
        "ipAddress": "192.168.1.1"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  },
  "message": "Audit logs retrieved successfully"
}
```

**Access Control**:
- **MASTER_ADMIN**: Sees all logs (no branch filtering)
- **LEADER**: Sees logs for their branch + logs where branch is null (GLOBAL)
- **USER**: 403 Forbidden

---

### 2️⃣ Get Single Audit Log

```http
GET /api/audit/:id
```

**Authentication**: Required  
**Authorization**: LEADER, MASTER_ADMIN only

**Example Request**:

```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/audit/507f1f77bcf86cd799439011'
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "action": "UPDATE_SERMON",
    "performedBy": "507f1f77bcf86cd799439012",
    "performerRole": "MASTER_ADMIN",
    "targetId": "507f1f77bcf86cd799439013",
    "targetType": "SERMON",
    "metadata": {
      "branch": null,
      "beforeValue": {
        "title": "Old Title"
      },
      "afterValue": {
        "title": "New Title"
      },
      "reason": "Corrected typo in title"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Audit log retrieved successfully"
}
```

---

### 3️⃣ Get Audit Statistics

```http
GET /api/audit/statistics
```

**Authentication**: Required  
**Authorization**: LEADER, MASTER_ADMIN only

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | ISO string | Filter from date |
| `endDate` | ISO string | Filter to date |
| `branch` | string | Filter by branch (MASTER_ADMIN only) |

**Example Request**:

```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/audit/statistics?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z'
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "totalLogs": 1250,
    "actionBreakdown": {
      "CREATE_BLOG": 150,
      "UPDATE_SERMON": 200,
      "DELETE_PRAYER": 50,
      "CREATE_EVENT": 100,
      "LOGIN": 750
    },
    "roleBreakdown": {
      "USER": 500,
      "LEADER": 400,
      "MASTER_ADMIN": 350
    },
    "targetTypeBreakdown": {
      "BLOG": 200,
      "SERMON": 300,
      "EVENT": 250,
      "PRAYER": 150,
      "USER": 350
    }
  },
  "message": "Audit statistics retrieved successfully"
}
```

---

## Action Types

The following action types are tracked across the system:

### Authentication & User Access
- `LOGIN` - User logged in successfully
- `LOGOUT` - User logged out
- `CREATE_USER` - New user registered (self-signup)
- `APPROVE_USER` - Admin approved/granted access to pending user
- `REJECT_USER` - Admin rejected pending user
- `UPDATE_ROLE` - User role changed (e.g., promoted to LEADER)
- `PASSWORD_CHANGE` - User changed their password
- `PASSWORD_RESET` - User initiated password reset

### Content Management
- `CREATE_BLOG` - New blog post created
- `UPDATE_BLOG` - Blog post updated
- `DELETE_BLOG` - Blog post deleted
- `CREATE_SERMON` - New sermon added
- `UPDATE_SERMON` - Sermon updated
- `DELETE_SERMON` - Sermon deleted
- `PUBLISH_SERMON` - Sermon published
- `UNPUBLISH_SERMON` - Sermon unpublished

### Events & Prayers
- `CREATE_EVENT` - New event created
- `UPDATE_EVENT` - Event updated
- `DELETE_EVENT` - Event deleted
- `CREATE_PRAYER` - New prayer request created
- `UPDATE_PRAYER` - Prayer request updated
- `DELETE_PRAYER` - Prayer request deleted

### Admin Actions
- `ADMIN_ACTION` - Generic admin action
- `AUDIT_EXPORT` - Audit logs exported
- `BULK_OPERATION` - Bulk operation performed

---

## Target Types

All audit logs track one of these target types:

- `USER` - User account
- `BLOG` - Blog post
- `SERMON` - Sermon content
- `EVENT` - Event
- `PRAYER` - Prayer request
- `NOTIFICATION` - Notification
- `SERMON_CATEGORY` - Sermon category

---

## Usage Guide

### For Module Developers

When implementing a new module (like `blog`, `event`, `prayer`), use the centralized `logAction()` helper:

#### In your service file (e.g., `blog.service.js`):

```javascript
import { auditService } from '../audit/audit.service.js';

export const blogService = {
  async createBlog(title, description, userId, userRole, userBranch, req) {
    // 1. Create blog
    const newBlog = new Blog({ title, description, createdBy: userId });
    await newBlog.save();

    // 2. Log the action
    await auditService.logAction({
      action: 'CREATE_BLOG',
      performedBy: userId,
      performerRole: userRole,
      targetId: newBlog._id,
      targetType: 'BLOG',
      metadata: {
        branch: userBranch,
        title: title,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      }
    });

    return newBlog;
  },

  async updateBlog(blogId, updates, userId, userRole, userBranch, req) {
    const oldBlog = await Blog.findById(blogId);
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updates,
      { new: true }
    );

    // Log with before/after values for auditing
    await auditService.logAction({
      action: 'UPDATE_BLOG',
      performedBy: userId,
      performerRole: userRole,
      targetId: blogId,
      targetType: 'BLOG',
      metadata: {
        branch: userBranch,
        beforeValue: {
          title: oldBlog.title,
          description: oldBlog.description
        },
        afterValue: {
          title: updatedBlog.title,
          description: updatedBlog.description
        },
        ipAddress: req.ip,
      }
    });

    return updatedBlog;
  },

  async deleteBlog(blogId, userId, userRole, userBranch, req) {
    const blog = await Blog.findById(blogId);
    await Blog.findByIdAndDelete(blogId);

    // Log deletion with reason
    await auditService.logAction({
      action: 'DELETE_BLOG',
      performedBy: userId,
      performerRole: userRole,
      targetId: blogId,
      targetType: 'BLOG',
      metadata: {
        branch: userBranch,
        deletedTitle: blog.title,
        reason: 'User requested deletion',
        ipAddress: req.ip,
      }
    });
  }
};
```

### For Admins

#### View all activity in the past 30 days:

```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/audit?page=1&limit=50&startDate=2024-01-01T00:00:00Z'
```

#### View activity by specific role:

```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/audit?performerRole=LEADER&page=1'
```

#### Get statistics for dashboard:

```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/audit/statistics'
```

#### View all changes to a specific resource:

```bash
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/audit?targetId=507f1f77bcf86cd799439013&targetType=SERMON'
```

---

## Access Control

### MASTER_ADMIN
- ✅ See ALL audit logs
- ✅ No branch filtering
- ✅ Can filter by any branch

### LEADER
- ✅ See logs for their branch
- ✅ See logs with `branch: null` (GLOBAL)
- ❌ Cannot see logs from other branches
- ❌ Cannot filter by other branches

### USER
- ❌ No access to audit endpoints
- ✅ Can only see logs if `targetId` is their own userId (TBD per design)

---

## Immutability Guarantee

The Audit Module is **truly immutable**:

1. **No Update Routes**: There is NO PUT or PATCH endpoint for audit logs
2. **No Delete Routes**: There is NO DELETE endpoint for audit logs
3. **Schema-Level**: Timestamps are managed automatically; metadata should never change
4. **Service Pattern**: Only `logAction()` creates new entries; no service method updates existing logs
5. **Database Index**: MongoDB index ensures query performance without update operations

```javascript
// ❌ These operations are NEVER available
// PUT /api/audit/:id    → 404 Not Found
// PATCH /api/audit/:id  → 404 Not Found
// DELETE /api/audit/:id → 404 Not Found

// ✅ Only these operations exist
// GET /api/audit              → List logs
// GET /api/audit/:id          → Get single log
// GET /api/audit/statistics   → Get statistics
// logAction() via service     → Internal logging only
```

---

## Performance Characteristics

### Indexes

The audit model includes 6 performance indexes:

```javascript
// Optimized queries
index({ action: 1 });                    // Filter by action type
index({ performedBy: 1 });               // Filter by user
index({ performerRole: 1 });             // Filter by role
index({ targetId: 1 });                  // Find all actions on a resource
index({ targetType: 1 });                // Filter by resource type
index({ 'metadata.branch': 1 });         // Filter by branch (critical for LEADER access)
index({ createdAt: -1 });                // Sort by time
index({ action: 1, createdAt: -1 });     // Composite: action + time
```

### Query Performance

- **Pagination**: Default limit of 20 (max 100) for manageable response sizes
- **Aggregation**: Statistics query uses MongoDB aggregation pipeline for fast analytics
- **Branch Filtering**: Indexed `metadata.branch` ensures O(log n) LEADER filtering

---

## Error Handling

### Audit Failures Don't Break Operations

The `logAction()` helper is designed to never throw errors:

```javascript
// In audit.service.js
async logAction(data) {
  try {
    const entry = new AuditLog(data);
    await entry.save();
    return entry;
  } catch (error) {
    // Log to system, but don't throw
    console.error('Audit logging failed:', error);
    return null;
  }
}
```

**Rationale**: If audit logging fails, the main operation (create blog, update sermon, etc.) should still complete. Audit failures are logged to system but don't affect user operations.

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Provide valid JWT token |
| 403 Forbidden | Insufficient permissions | Use LEADER or MASTER_ADMIN role |
| 400 Bad Request | Invalid query parameters | Check parameter types and values |
| 404 Not Found | Audit log not found | Verify audit ID is correct |

---

## Compliance & Standards

- ✅ **Immutability**: Follows financial audit trail standards
- ✅ **Timestamps**: All actions timestamped (UTC)
- ✅ **User Attribution**: Every action tied to specific user (performedBy)
- ✅ **Branch Tracking**: Every action tracks branch context
- ✅ **Metadata Flexibility**: Custom metadata per action type
- ✅ **Retention**: No automatic deletion (unless configured separately)

---

## Integration Checklist

When adding audit logging to a new module:

- [ ] Import `auditService` from '../audit/audit.service.js'
- [ ] Call `auditService.logAction({...})` after each create/update/delete
- [ ] Include proper `metadata` with branch info
- [ ] Pass `req.ip` and `req.headers['user-agent']` for tracking
- [ ] Include `beforeValue` and `afterValue` for updates
- [ ] Document action types in this README
- [ ] Add test cases for audit logging in module tests

---

## Related Documentation

- [System Design: Audit_Logs.md](../../System%20Design/Audit_Logs.md) - Detailed requirements
- [TESTING.md](./TESTING.md) - Comprehensive test cases
- [AUTH.md](../../System%20Design/Auth.md) - User roles and permissions

---

**Last Updated**: 2024-01-15  
**Status**: Production Ready ✅
