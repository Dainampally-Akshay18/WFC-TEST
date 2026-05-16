# 🧪 EVENT MODULE - COMPREHENSIVE TESTING GUIDE

## 📋 Pre-Testing Checklist

- [ ] Node.js server running (`npm start` in backend directory)
- [ ] MongoDB connected and running
- [ ] JWT tokens available (from auth endpoints)
- [ ] Database clean or acceptable for testing
- [ ] Test user accounts with different roles (USER, LEADER, MASTER_ADMIN)
- [ ] Valid branch values (BRANCH1, BRANCH2)

---

## 🔑 Test User Tokens

You'll need valid JWT tokens for different roles. Get them from auth endpoints:

```bash
# 1. Register users (if needed)
POST /api/auth/register
{
  "email": "user@test.com",
  "password": "password123",
  "name": "Test User",
  "branch": "BRANCH1",
  "role": "USER"
}

# 2. Login to get token
POST /api/auth/login
{
  "email": "user@test.com",
  "password": "password123"
}

# Response includes: accessToken, refreshToken, user
```

**Keep these tokens handy for testing!**

---

## ✅ TEST SUITE 1: CREATE EVENT ENDPOINT

### Test 1.1: USER creates BRANCH event (Own Branch)

**Request:**
```http
POST /api/events
Authorization: Bearer <USER_TOKEN_BRANCH1>
Content-Type: application/json

{
  "title": "Weekly Prayer Meeting",
  "description": "Worship and prayer session for branch 1 members",
  "date": "2026-05-20T10:00:00Z",
  "time": "10:00",
  "location": "Branch 1 Main Hall",
  "visibility": "BRANCH",
  "branch": "BRANCH1"
}
```

**Expected:**
- Status: 201 Created
- Response includes event ID, notifications_sent count
- Event saved to DB with createdByRole="USER"
- Notifications sent to BRANCH1 users + leaders + admin

**Verify in DB:**
```javascript
db.events.findOne({ title: "Weekly Prayer Meeting" })
// Should have: visibility="BRANCH", branch="BRANCH1", createdByRole="USER"
```

---

### Test 1.2: USER tries to create GLOBAL event (SHOULD FAIL)

**Request:**
```http
POST /api/events
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "title": "Global Announcement",
  "description": "This is a global event",
  "date": "2026-05-25T10:00:00Z",
  "time": "10:00",
  "location": "Main Campus",
  "visibility": "GLOBAL",
  "branch": null
}
```

**Expected:**
- Status: 400 Bad Request
- Error: "Users cannot create global events"

---

### Test 1.3: USER tries to create event for different branch (SHOULD FAIL)

**Request:**
```http
POST /api/events
Authorization: Bearer <USER_TOKEN_BRANCH1>
Content-Type: application/json

{
  "title": "Branch 2 Event",
  "description": "User from Branch1 trying to create Branch2 event",
  "date": "2026-05-25T10:00:00Z",
  "time": "10:00",
  "location": "Branch 2 Hall",
  "visibility": "BRANCH",
  "branch": "BRANCH2"
}
```

**Expected:**
- Status: 400 Bad Request
- Error: "Users can only create events for their own branch"

---

### Test 1.4: LEADER creates GLOBAL event

**Request:**
```http
POST /api/events
Authorization: Bearer <LEADER_TOKEN>
Content-Type: application/json

{
  "title": "Church-Wide Conference",
  "description": "Annual conference for all members",
  "date": "2026-06-15T09:00:00Z",
  "time": "09:00",
  "location": "Main Auditorium",
  "visibility": "GLOBAL"
}
```

**Expected:**
- Status: 201 Created
- branch=null automatically (enforced by pre-save hook)
- Notifications sent to ALL approved users
- createdByRole="LEADER"

---

### Test 1.5: LEADER creates BRANCH event

**Request:**
```http
POST /api/events
Authorization: Bearer <LEADER_TOKEN_BRANCH2>
Content-Type: application/json

{
  "title": "Branch 2 Leadership Meeting",
  "description": "Monthly leadership meeting",
  "date": "2026-05-22T14:00:00Z",
  "time": "14:00",
  "location": "Branch 2 Office",
  "visibility": "BRANCH",
  "branch": "BRANCH2"
}
```

**Expected:**
- Status: 201 Created
- branch="BRANCH2" preserved
- Notifications sent to BRANCH2 users + leaders + admin

---

### Test 1.6: MASTER_ADMIN creates any event

**Request:**
```http
POST /api/events
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "Admin Test Event",
  "description": "Testing admin privileges",
  "date": "2026-05-28T16:00:00Z",
  "time": "16:00",
  "location": "Admin Test Location",
  "visibility": "GLOBAL"
}
```

**Expected:**
- Status: 201 Created
- createdByRole="MASTER_ADMIN"
- No branch restrictions apply

---

### Test 1.7: Validation - Missing required fields

**Request:**
```http
POST /api/events
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "title": "Incomplete Event"
  // Missing: description, date, time, location, visibility
}
```

**Expected:**
- Status: 400 Bad Request
- Error message lists missing required fields

---

### Test 1.8: Validation - Invalid time format

**Request:**
```http
POST /api/events
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "title": "Invalid Time Event",
  "description": "Event with invalid time format",
  "date": "2026-05-25T10:00:00Z",
  "time": "25:99",
  "location": "Test Location",
  "visibility": "BRANCH",
  "branch": "BRANCH1"
}
```

**Expected:**
- Status: 400 Bad Request
- Error: "Time must be in HH:MM format"

---

## ✅ TEST SUITE 2: GET EVENTS ENDPOINT

### Test 2.1: USER gets filtered events (own branch + GLOBAL)

**Setup:** Create 3 events:
- Event 1: BRANCH1 event
- Event 2: BRANCH2 event (created by leader)
- Event 3: GLOBAL event

**Request:**
```http
GET /api/events
Authorization: Bearer <USER_TOKEN_BRANCH1>
```

**Expected:**
- Status: 200 OK
- Response includes: Event 1 (BRANCH1) + Event 3 (GLOBAL)
- Response EXCLUDES: Event 2 (BRANCH2 from other branch)
- Count = 2

---

### Test 2.2: LEADER gets filtered events (own branch + GLOBAL)

**Request:**
```http
GET /api/events
Authorization: Bearer <LEADER_TOKEN_BRANCH1>
```

**Expected:**
- Status: 200 OK
- Includes: Events from BRANCH1 + all GLOBAL events
- Excludes: BRANCH2 events
- Sorted by date (upcoming first)

---

### Test 2.3: MASTER_ADMIN gets ALL events

**Request:**
```http
GET /api/events
Authorization: Bearer <ADMIN_TOKEN>
```

**Expected:**
- Status: 200 OK
- Includes: ALL events regardless of branch/visibility
- Count = all created events

---

### Test 2.4: Public user gets only GLOBAL events

**Request (no token):**
```http
GET /api/events
```

**Expected:**
- Status: 200 OK
- Includes: Only GLOBAL events
- Excludes: All BRANCH events

---

## ✅ TEST SUITE 3: GET SINGLE EVENT ENDPOINT

### Test 3.1: USER gets own branch event

**Request:**
```http
GET /api/events/{BRANCH1_EVENT_ID}
Authorization: Bearer <USER_TOKEN_BRANCH1>
```

**Expected:**
- Status: 200 OK
- Event details returned

---

### Test 3.2: USER gets GLOBAL event

**Request:**
```http
GET /api/events/{GLOBAL_EVENT_ID}
Authorization: Bearer <USER_TOKEN_BRANCH1>
```

**Expected:**
- Status: 200 OK
- Event details returned

---

### Test 3.3: USER tries to get other branch event (SHOULD FAIL)

**Request:**
```http
GET /api/events/{BRANCH2_EVENT_ID}
Authorization: Bearer <USER_TOKEN_BRANCH1>
```

**Expected:**
- Status: 400 Bad Request
- Error: "Access denied to this event"

---

### Test 3.4: Public user gets GLOBAL event

**Request:**
```http
GET /api/events/{GLOBAL_EVENT_ID}
```

**Expected:**
- Status: 200 OK
- Event returned

---

### Test 3.5: Public user tries to get BRANCH event (SHOULD FAIL)

**Request:**
```http
GET /api/events/{BRANCH_EVENT_ID}
```

**Expected:**
- Status: 400 Bad Request
- Error: "Access denied to this event"

---

## ✅ TEST SUITE 4: UPDATE EVENT ENDPOINT

### Test 4.1: USER updates own event

**Setup:** Create event as USER

**Request:**
```http
PUT /api/events/{EVENT_ID}
Authorization: Bearer <USER_TOKEN_SAME_USER>
Content-Type: application/json

{
  "title": "Updated Event Title",
  "description": "Updated description"
}
```

**Expected:**
- Status: 200 OK
- Event updated in DB
- Audit log: UPDATE_EVENT action recorded

---

### Test 4.2: USER tries to update other user's event (SHOULD FAIL)

**Request:**
```http
PUT /api/events/{OTHER_USER_EVENT_ID}
Authorization: Bearer <USER_TOKEN_DIFFERENT_USER>
Content-Type: application/json

{
  "title": "Hack Attempt"
}
```

**Expected:**
- Status: 400 Bad Request
- Error: "Users can only update their own events"

---

### Test 4.3: USER tries to change visibility to GLOBAL (SHOULD FAIL)

**Request:**
```http
PUT /api/events/{USER_EVENT_ID}
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "visibility": "GLOBAL"
}
```

**Expected:**
- Status: 400 Bad Request
- Error: "Users cannot create global events"

---

### Test 4.4: LEADER updates branch event

**Request:**
```http
PUT /api/events/{BRANCH1_EVENT_ID}
Authorization: Bearer <LEADER_TOKEN_BRANCH1>
Content-Type: application/json

{
  "title": "Leader Updated Event"
}
```

**Expected:**
- Status: 200 OK
- Event updated

---

### Test 4.5: LEADER tries to update other branch event (SHOULD FAIL)

**Request:**
```http
PUT /api/events/{BRANCH2_EVENT_ID}
Authorization: Bearer <LEADER_TOKEN_BRANCH1>
Content-Type: application/json

{
  "title": "Unauthorized Update"
}
```

**Expected:**
- Status: 400 Bad Request
- Error: "Leaders can only update events in their branch"

---

### Test 4.6: MASTER_ADMIN updates any event

**Request:**
```http
PUT /api/events/{ANY_EVENT_ID}
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "Admin Updated Event"
}
```

**Expected:**
- Status: 200 OK
- Any event updated successfully

---

## ✅ TEST SUITE 5: DELETE EVENT ENDPOINT

### Test 5.1: USER deletes own event

**Request:**
```http
DELETE http://localhost:5000/api/events/{USER_CREATED_EVENT_ID}
Authorization: Bearer <USER_TOKEN>
```

**Expected:**
- Status: 200 OK
- Event deleted from DB
- Audit log: DELETE_EVENT action recorded

---

### Test 5.2: USER tries to delete other user's event (SHOULD FAIL)

**Request:**
```http
DELETE /api/events/{OTHER_USER_EVENT_ID}
Authorization: Bearer <USER_TOKEN>
```

**Expected:**
- Status: 400 Bad Request
- Error: "Users can only delete their own events"

---

### Test 5.3: LEADER deletes branch event

**Request:**
```http
DELETE /api/events/{BRANCH_EVENT_ID}
Authorization: Bearer <LEADER_TOKEN_BRANCH>
```

**Expected:**
- Status: 200 OK
- Event deleted

---

### Test 5.4: LEADER tries to delete other branch event (SHOULD FAIL)

**Request:**
```http
DELETE /api/events/{OTHER_BRANCH_EVENT_ID}
Authorization: Bearer <LEADER_TOKEN>
```

**Expected:**
- Status: 400 Bad Request
- Error: "Leaders can only delete events in their branch"

---

### Test 5.5: MASTER_ADMIN deletes any event

**Request:**
```http
DELETE /api/events/{ANY_EVENT_ID}
Authorization: Bearer <ADMIN_TOKEN>
```

**Expected:**
- Status: 200 OK
- Any event deleted successfully

---

## 🔔 NOTIFICATION TESTING

### Verify Notifications Sent

After creating events, verify notifications were sent:

```bash
# 1. For GLOBAL events - all users should receive notification
GET /api/notifications
Authorization: Bearer <ANY_USER_TOKEN>

# 2. For BRANCH events - only branch users should receive notification
GET /api/notifications
Authorization: Bearer <USER_FROM_SAME_BRANCH>

# 3. Check notification details
GET /api/notifications
# Response should include notifications with type: "EVENT"
```

---

## 📝 AUDIT LOG TESTING

Verify all operations logged:

```bash
# Get audit logs
GET /api/audit
Authorization: Bearer <ADMIN_TOKEN>

# Should see actions:
# - CREATE_EVENT
# - UPDATE_EVENT
# - DELETE_EVENT
```

---

## 🗄️ DATABASE VERIFICATION

### Check Events Collection

```javascript
// MongoDB shell
use wfc_test

// Verify GLOBAL event has no branch
db.events.findOne({ visibility: "GLOBAL" })
// Should have: branch: null

// Verify BRANCH events have branch
db.events.findOne({ visibility: "BRANCH" })
// Should have: branch: "BRANCH1" or "BRANCH2"

// Check indexes
db.events.getIndexes()

// Verify audit logs
db.audits.find({ targetType: "EVENT" }).pretty()
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Event not found" on create

**Cause:** Event schema validation failed
**Fix:** 
- Check visibility+branch combination
- Ensure date is in future
- Check time format HH:MM

### Issue: Notifications not sent

**Cause:** notificationHelper not working
**Fix:**
- Verify users exist and are APPROVED status
- Check notification.helper.js integration
- Verify User model has branch field

### Issue: Permission denied on update

**Cause:** User role/branch mismatch
**Fix:**
- Use correct token (logged in as right user)
- For LEADER, ensure in same branch
- For USER, ensure they created the event

---

## 📊 Summary Test Checklist

- [ ] Test 1.1-1.8: Create Event (8 tests)
- [ ] Test 2.1-2.4: Get Events Filtering (4 tests)
- [ ] Test 3.1-3.5: Get Single Event (5 tests)
- [ ] Test 4.1-4.6: Update Event (6 tests)
- [ ] Test 5.1-5.5: Delete Event (5 tests)
- [ ] Notification verification (3 checks)
- [ ] Audit log verification (1 check)
- [ ] Database verification (3 checks)

**Total: 32+ test cases**

---

## ✅ SUCCESS CRITERIA

✅ All permission rules enforced
✅ Visibility/branch logic working
✅ Role-based filtering correct
✅ Notifications distributed properly
✅ Audit logs created
✅ No unauthorized access possible
✅ All validation working
✅ Database integrity maintained

---
