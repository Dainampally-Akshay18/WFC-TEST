# AUDIT MODULE API DOCUMENTATION

**Generated:** May 20, 2026

## Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/audit` | GET | Get audit logs (admin only) |
| `/api/audit/statistics` | GET | Get statistics summary |
| `/api/audit/:id` | GET | Get single audit log |

---

## Endpoints

### Get Audit Logs
**GET** `/api/audit`

Retrieve activity logs with filtering and pagination. Admin only.

**Auth:** Protected (JWT required) | **Role:** LEADER/MASTER_ADMIN only

**Query Parameters:**
- `page`: page number (default: 1)
- `limit`: items per page (default: 20, max: 100)
- `action`: filter by action (CREATE_BLOG, UPDATE_EVENT, etc.)
- `performerRole`: filter by role (USER, LEADER, MASTER_ADMIN)
- `targetType`: filter by entity type (BLOG, EVENT, PRAYER, SERMON, USER, etc.)
- `branch`: filter by branch (MASTER_ADMIN only, LEADER limited to own branch)
- `startDate`: ISO date string (e.g., 2026-01-01T00:00:00Z)
- `endDate`: ISO date string

**Examples:**
```
GET /api/audit
GET /api/audit?action=CREATE_BLOG&limit=50
GET /api/audit?performerRole=LEADER&startDate=2026-01-01T00:00:00Z
GET /api/audit?targetType=EVENT&branch=BRANCH1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "action": "CREATE_BLOG",
        "performedBy": {
          "_id": "507f1f77bcf86cd799439099",
          "name": "John Doe"
        },
        "performerRole": "LEADER",
        "targetId": "507f1f77bcf86cd799439020",
        "targetType": "BLOG",
        "metadata": {
          "branch": "BRANCH1",
          "blogTitle": "Faith in Action"
        },
        "createdAt": "2026-01-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 342,
      "page": 1,
      "limit": 20,
      "pages": 18
    }
  }
}
```

**Common Actions:**
- AUTH: SIGNUP, LOGIN, APPROVE_USER, REJECT_USER, CHANGE_ROLE
- BLOGS: CREATE_BLOG, UPDATE_BLOG, DELETE_BLOG, PUBLISH_BLOG
- EVENTS: CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT
- PRAYERS: CREATE_PRAYER, UPDATE_PRAYER, DELETE_PRAYER, PRAYED
- SERMONS: CREATE_SERMON, UPDATE_SERMON, DELETE_SERMON, PUBLISH_SERMON

---

### Get Audit Statistics
**GET** `/api/audit/statistics`

Get summary statistics of all audit logs.

**Auth:** Protected (JWT required) | **Role:** LEADER/MASTER_ADMIN only

**Query Parameters:**
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `branch`: filter by branch (MASTER_ADMIN only)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalLogs": 342,
    "actionBreakdown": {
      "CREATE_BLOG": 45,
      "UPDATE_EVENT": 28,
      "DELETE_PRAYER": 12,
      "PUBLISH_SERMON": 8,
      "APPROVE_USER": 5
    },
    "roleBreakdown": {
      "USER": 89,
      "LEADER": 156,
      "MASTER_ADMIN": 97
    },
    "targetTypeBreakdown": {
      "BLOG": 78,
      "EVENT": 92,
      "PRAYER": 65,
      "USER": 45,
      "SERMON": 32,
      "NOTIFICATION": 30
    }
  }
}
```

---

### Get Single Audit Log
**GET** `/api/audit/:id`

Retrieve specific audit log details.

**Auth:** Protected (JWT required) | **Role:** LEADER/MASTER_ADMIN only

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "log": {
      "_id": "507f1f77bcf86cd799439011",
      "action": "CREATE_BLOG",
      "performedBy": {
        "_id": "507f1f77bcf86cd799439099",
        "name": "John Doe",
        "email": "john@church.com"
      },
      "performerRole": "LEADER",
      "targetId": "507f1f77bcf86cd799439020",
      "targetType": "BLOG",
      "metadata": {
        "branch": "BRANCH1",
        "blogTitle": "Faith in Action",
        "status": "PUBLISHED"
      },
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  }
}
```

---

## Frontend Integration Notes

- **Admin Dashboard**: Display audit logs in activity/history table with sorting/filtering
- **Filtering**: Pre-build filter buttons for common actions (blogs, events, users, prayers)
- **Date Range**: Use date pickers for startDate/endDate filtering
- **Statistics Chart**: Use action/role/type breakdown for dashboard charts
- **Permission**: LEADER can only see logs for own branch; MASTER_ADMIN sees all
- **Real-time**: Refresh every 5-10 minutes or on-demand for compliance monitoring
- **Export**: Consider CSV export using paginated API for large datasets

---

**Error Responses:** 400 (invalid query), 401 (auth), 403 (permission)
