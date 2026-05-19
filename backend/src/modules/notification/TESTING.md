# 🧪 Notification Module - Testing Guide

> **Comprehensive Test Cases for All Notification Scenarios**

Complete test coverage for the Notification Module including unit tests, integration tests, and edge cases.

---

## 📋 Test Coverage Overview

| Category | Test Count | Status |
|----------|-----------|--------|
| Service Layer Tests | 12 | ✅ Ready |
| Controller Tests | 10 | ✅ Ready |
| API Integration Tests | 8 | ✅ Ready |
| Access Control Tests | 6 | ✅ Ready |
| Edge Cases | 8 | ✅ Ready |
| **Total** | **44** | **✅** |

---

## 🧬 Service Layer Tests

### Test Section 1: notificationService

#### Test 1.1: createNotification - Single User

**Scenario:** Create notification for single user

**Setup:**
```js
const userId = '507f1e3a1b2c3d4e5f6a1b2c';
```

**Test:**
```js
const result = await notificationService.createNotification({
  userId,
  title: 'Your account has been approved',
  message: 'Welcome to WFC!',
  type: 'APPROVAL',
  referenceId: userId
});
```

**Expected:**
- ✅ Returns array with 1 notification
- ✅ `result[0].userId === userId`
- ✅ `result[0].isRead === false`
- ✅ `result[0].type === 'APPROVAL'`
- ✅ Database contains the notification

---

#### Test 1.2: createNotification - Multiple Users

**Scenario:** Create notification for multiple users (bulk)

**Setup:**
```js
const userIds = ['507f1e3a1b2c3d4e5f6a1b2c', '507f1e3a1b2c3d4e5f6a1b2d'];
```

**Test:**
```js
const result = await notificationService.createNotification({
  userId: userIds,
  title: 'New blog published',
  message: 'Pastor has published a new article',
  type: 'BLOG',
  referenceId: blogId
});
```

**Expected:**
- ✅ Returns array with 2 notifications
- ✅ Each has correct userId
- ✅ All have `isRead === false`
- ✅ Database contains 2 documents

---

#### Test 1.3: createNotification - Empty Array

**Scenario:** Attempt to create notification with empty user array

**Test:**
```js
const result = await notificationService.createNotification({
  userId: [],
  title: 'Test',
  message: 'Test',
  type: 'BLOG',
  referenceId: '507f1e3a1b2c3d4e5f6a1b2c'
});
```

**Expected:**
- ✅ Returns null (handles gracefully)
- ✅ No error thrown

---

#### Test 1.4: createNotification - Invalid Type

**Scenario:** Create notification with invalid type

**Test:**
```js
const result = await notificationService.createNotification({
  userId: '507f1e3a1b2c3d4e5f6a1b2c',
  title: 'Test',
  message: 'Test',
  type: 'INVALID_TYPE',
  referenceId: '507f1e3a1b2c3d4e5f6a1b2c'
});
```

**Expected:**
- ✅ Returns null (returns null on schema validation error)
- ✅ No database entry created

---

#### Test 1.5: getNotifications - Basic Query

**Scenario:** Fetch notifications for user with pagination

**Setup:**
```js
// Create 5 notifications for userId
const userId = '507f1e3a1b2c3d4e5f6a1b2c';
// Create notifications with staggered timestamps
```

**Test:**
```js
const result = await notificationService.getNotifications(userId, {
  page: 1,
  limit: 20
});
```

**Expected:**
- ✅ `result.notifications` array contains 5 items
- ✅ `result.unreadCount === 5`
- ✅ `result.pagination.total === 5`
- ✅ `result.pagination.pages === 1`
- ✅ Sorted by `createdAt` descending (newest first)

---

#### Test 1.6: getNotifications - Pagination

**Scenario:** Test pagination with multiple pages

**Setup:**
```js
// Create 25 notifications for userId
const userId = '507f1e3a1b2c3d4e5f6a1b2c';
```

**Test:**
```js
// Page 1
const page1 = await notificationService.getNotifications(userId, {
  page: 1,
  limit: 20
});

// Page 2
const page2 = await notificationService.getNotifications(userId, {
  page: 2,
  limit: 20
});
```

**Expected:**
- ✅ `page1.notifications.length === 20`
- ✅ `page2.notifications.length === 5`
- ✅ `page1.pagination.pages === 2`
- ✅ No overlap between pages

---

#### Test 1.7: getNotifications - Filter Unread

**Scenario:** Filter notifications by read status

**Setup:**
```js
// Create 5 unread, 3 read notifications
const userId = '507f1e3a1b2c3d4e5f6a1b2c';
```

**Test:**
```js
const unreadResult = await notificationService.getNotifications(userId, {
  isRead: false
});

const readResult = await notificationService.getNotifications(userId, {
  isRead: true
});
```

**Expected:**
- ✅ `unreadResult.notifications.length === 5`
- ✅ `readResult.notifications.length === 3`
- ✅ All unread have `isRead === false`
- ✅ All read have `isRead === true`

---

#### Test 1.8: getNotificationById - Valid

**Scenario:** Fetch single notification by ID

**Setup:**
```js
const userId = '507f1e3a1b2c3d4e5f6a1b2c';
const notification = await notificationService.createNotification({
  userId,
  title: 'Test',
  message: 'Test',
  type: 'APPROVAL',
  referenceId: userId
});
const notificationId = notification[0]._id;
```

**Test:**
```js
const result = await notificationService.getNotificationById(
  notificationId,
  userId
);
```

**Expected:**
- ✅ Returns the notification
- ✅ `result._id === notificationId`
- ✅ `result.userId === userId`

---

#### Test 1.9: getNotificationById - Ownership Violation

**Scenario:** User attempts to access another user's notification

**Setup:**
```js
const userId1 = '507f1e3a1b2c3d4e5f6a1b2c';
const userId2 = '507f1e3a1b2c3d4e5f6a1b2d';
const notification = await notificationService.createNotification({
  userId: userId1,
  title: 'Test',
  message: 'Test',
  type: 'APPROVAL',
  referenceId: userId1
});
const notificationId = notification[0]._id;
```

**Test:**
```js
try {
  await notificationService.getNotificationById(notificationId, userId2);
  // Should throw
} catch (error) {
  // Expected
}
```

**Expected:**
- ✅ Throws error with status 403
- ✅ Error message contains "Unauthorized"

---

#### Test 1.10: markAsRead - Success

**Scenario:** Mark single notification as read

**Setup:**
```js
const userId = '507f1e3a1b2c3d4e5f6a1b2c';
const notification = await notificationService.createNotification({
  userId,
  title: 'Test',
  message: 'Test',
  type: 'APPROVAL',
  referenceId: userId
});
const notificationId = notification[0]._id;
```

**Test:**
```js
const result = await notificationService.markAsRead(notificationId, userId);
```

**Expected:**
- ✅ Returns updated notification
- ✅ `result.isRead === true`
- ✅ Database updated correctly

---

#### Test 1.11: markAllAsRead

**Scenario:** Mark all unread notifications as read

**Setup:**
```js
// Create 5 unread notifications
const userId = '507f1e3a1b2c3d4e5f6a1b2c';
```

**Test:**
```js
const result = await notificationService.markAllAsRead(userId);
```

**Expected:**
- ✅ `result.modifiedCount === 5`
- ✅ All notifications now have `isRead === true`
- ✅ No unread notifications remain

---

#### Test 1.12: getUnreadCount

**Scenario:** Get count of unread notifications

**Setup:**
```js
// Create 3 unread, 2 read notifications
const userId = '507f1e3a1b2c3d4e5f6a1b2c';
```

**Test:**
```js
const unreadCount = await notificationService.getUnreadCount(userId);
```

**Expected:**
- ✅ `unreadCount === 3`
- ✅ Only counts unread, ignores read

---

## 🎮 Controller Tests

### Test Section 2: notificationController

#### Test 2.1: GET /api/notifications

**Scenario:** Controller handles GET request for notifications

**Setup:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' },
  query: { page: 1, limit: 20 }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};
```

**Test:**
```js
await notificationController.getNotifications(req, res);
```

**Expected:**
- ✅ `res.status` called with 200
- ✅ `res.json` called with correct structure
- ✅ Response has `success: true`
- ✅ Response has `data.notifications`
- ✅ Response has `data.unreadCount`
- ✅ Response has `data.pagination`

---

#### Test 2.2: GET /api/notifications/:id

**Scenario:** Controller handles GET single notification

**Test:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' },
  params: { id: notificationId }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

await notificationController.getNotificationById(req, res);
```

**Expected:**
- ✅ `res.status` called with 200
- ✅ Response has `data.notification`
- ✅ Response has `success: true`

---

#### Test 2.3: PATCH /api/notifications/:id/read

**Scenario:** Controller handles mark as read

**Test:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' },
  params: { id: notificationId }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

await notificationController.markAsRead(req, res);
```

**Expected:**
- ✅ `res.status` called with 200
- ✅ Response has `data.notification`
- ✅ `notification.isRead === true`

---

#### Test 2.4: PATCH /api/notifications/read-all

**Scenario:** Controller handles mark all as read

**Test:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

await notificationController.markAllAsRead(req, res);
```

**Expected:**
- ✅ `res.status` called with 200
- ✅ Response has `data.modifiedCount`
- ✅ Message indicates success

---

#### Test 2.5: GET /api/notifications/unread-count

**Scenario:** Controller handles unread count request

**Test:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

await notificationController.getUnreadCount(req, res);
```

**Expected:**
- ✅ `res.status` called with 200
- ✅ Response has `data.unreadCount`
- ✅ Response has correct count

---

#### Test 2.6: Error Handling - Invalid ID

**Scenario:** Controller handles invalid notification ID

**Test:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' },
  params: { id: 'invalid-id' }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};
const next = jest.fn();

await notificationController.getNotificationById(req, res, next);
```

**Expected:**
- ✅ `next` called with error (via asyncHandler)
- ✅ Error contains "not found" or validation message

---

#### Test 2.7: Error Handling - Unauthorized Access

**Scenario:** User tries to access another user's notification

**Test:**
```js
const req = {
  user: { userId: 'user1' },
  params: { id: anotherUsersNotificationId }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};
const next = jest.fn();

await notificationController.getNotificationById(req, res, next);
```

**Expected:**
- ✅ `next` called with error
- ✅ Error status is 403

---

#### Test 2.8: Validation - isRead Filter

**Scenario:** Invalid isRead parameter

**Test:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' },
  query: { page: 1, limit: 20, isRead: 'invalid' }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

await notificationController.getNotifications(req, res);
```

**Expected:**
- ✅ Handles gracefully (parses as false or ignores)
- ✅ No error thrown

---

#### Test 2.9: Validation - Limit Exceeds Max

**Scenario:** Request limit exceeds maximum (100)

**Test:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' },
  query: { page: 1, limit: 500 }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

await notificationController.getNotifications(req, res);
```

**Expected:**
- ✅ Limit capped at 100
- ✅ Query executes with limit: 100
- ✅ No error thrown

---

#### Test 2.10: Validation - Negative Page

**Scenario:** Request with negative page number

**Test:**
```js
const req = {
  user: { userId: '507f1e3a1b2c3d4e5f6a1b2c' },
  query: { page: -5, limit: 20 }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

await notificationController.getNotifications(req, res);
```

**Expected:**
- ✅ Page normalized to 1
- ✅ Query executes successfully
- ✅ No error thrown

---

## 📡 API Integration Tests

### Test Section 3: HTTP Endpoints

#### Test 3.1: GET /api/notifications - List

**Endpoint:**
```http
GET /api/notifications?page=1&limit=20
```

**Request:**
```js
const response = await fetch(
  'http://localhost:3000/api/notifications?page=1&limit=20',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
```

**Expected (200):**
```js
{
  success: true,
  data: {
    notifications: [
      {
        _id: '...',
        title: '...',
        message: '...',
        type: 'BLOG',
        isRead: false,
        createdAt: '...'
      }
    ],
    unreadCount: 5,
    pagination: { total: 25, page: 1, limit: 20, pages: 2 }
  }
}
```

---

#### Test 3.2: GET /api/notifications - No Auth

**Test:**
```js
const response = await fetch('http://localhost:3000/api/notifications');
```

**Expected (401):**
```js
{
  success: false,
  error: {
    message: 'No authorization header provided'
  }
}
```

---

#### Test 3.3: GET /api/notifications/:id

**Endpoint:**
```http
GET /api/notifications/{notificationId}
```

**Expected (200):**
```js
{
  success: true,
  data: {
    notification: { _id, title, message, type, isRead }
  }
}
```

---

#### Test 3.4: GET /api/notifications/{notificationId} - Not Found

**Endpoint:**
```http
GET /api/notifications/invalid-id
```

**Expected (404):**
```js
{
  success: false,
  error: {
    message: 'Notification not found'
  }
}
```

---

#### Test 3.5: PATCH /api/notifications/{id}/read

**Endpoint:**
```http
PATCH /api/notifications/{notificationId}/read
```

**Body:**
```json
{}
```

**Expected (200):**
```js
{
  success: true,
  data: {
    notification: { ..., isRead: true }
  }
}
```

---

#### Test 3.6: PATCH /api/notifications/read-all

**Endpoint:**
```http
PATCH /api/notifications/read-all
```

**Body:**
```json
{}
```

**Expected (200):**
```js
{
  success: true,
  data: { modifiedCount: 5 }
}
```

---

#### Test 3.7: GET /api/notifications/unread-count

**Endpoint:**
```http
GET /api/notifications/unread-count
```

**Expected (200):**
```js
{
  success: true,
  data: { unreadCount: 5 }
}
```

---

#### Test 3.8: GET /api/notifications - Filter Unread

**Endpoint:**
```http
GET /api/notifications?isRead=false
```

**Expected (200):**
```js
{
  data: {
    notifications: [/* only unread */],
    unreadCount: 3
  }
}
```

---

## 🔐 Access Control Tests

### Test Section 4: Authorization & Ownership

#### Test 4.1: User Can Only See Own Notifications

**Scenario:** User1 cannot see User2's notifications

**Setup:**
```js
// User1 creates notification for themselves
await notificationService.createNotification({
  userId: user1._id,
  title: 'Test',
  message: 'Test',
  type: 'APPROVAL',
  referenceId: user1._id
});

// User2 tries to see User1's notification
const user2Token = generateToken({ userId: user2._id, role: 'USER' });
```

**Test:**
```js
const response = await fetch(
  `/api/notifications/${user1Notification._id}`,
  {
    headers: { 'Authorization': `Bearer ${user2Token}` }
  }
);
```

**Expected:**
- ✅ Status 403
- ✅ Error message: "Unauthorized"

---

#### Test 4.2: User Can Only Modify Own Notifications

**Scenario:** User1 cannot mark User2's notification as read

**Test:**
```js
const response = await fetch(
  `/api/notifications/${user2Notification._id}/read`,
  {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${user1Token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  }
);
```

**Expected:**
- ✅ Status 403
- ✅ Notification remains `isRead: false`
- ✅ Error message returned

---

#### Test 4.3: getNotifications Returns Only User's Notifications

**Scenario:** User1's GET returns only User1's notifications

**Setup:**
```js
// User1 has 5 notifications
// User2 has 3 notifications
```

**Test:**
```js
const user1Result = await notificationService.getNotifications(user1._id);
```

**Expected:**
- ✅ `user1Result.notifications.length === 5`
- ✅ All have `userId === user1._id`

---

#### Test 4.4: markAllAsRead Only Updates Own Notifications

**Scenario:** User can only mark their own as read

**Setup:**
```js
// User1 has 5 unread
// User2 has 3 unread
```

**Test:**
```js
const result = await notificationService.markAllAsRead(user1._id);
```

**Expected:**
- ✅ `result.modifiedCount === 5`
- ✅ User2's notifications still unread
- ✅ User1's all marked read

---

#### Test 4.5: getUnreadCount Only Counts User's Unread

**Scenario:** Each user gets correct count for their notifications

**Test:**
```js
const user1Unread = await notificationService.getUnreadCount(user1._id);
const user2Unread = await notificationService.getUnreadCount(user2._id);
```

**Expected:**
- ✅ `user1Unread === 5`
- ✅ `user2Unread === 3`
- ✅ Each counts only their own

---

#### Test 4.6: Deleted User Notifications

**Scenario:** If user is deleted, their notifications remain but are orphaned

**Setup:**
```js
const notification = await notificationService.createNotification({
  userId: user._id,
  title: 'Test',
  message: 'Test',
  type: 'APPROVAL',
  referenceId: user._id
});

await User.deleteOne({ _id: user._id });
```

**Expected:**
- ✅ Notification still in database
- ✅ Has valid `userId` reference (even if user deleted)
- ✅ No cascade delete

---

## 🔄 Edge Cases

### Test Section 5: Edge Cases & Stress Tests

#### Test 5.1: Many Notifications - Performance

**Scenario:** Handle user with 1000+ notifications

**Setup:**
```js
// Create 1000 notifications for one user
const userIds = Array(1000).fill(userId);
const notifications = [];
for (let i = 0; i < 1000; i++) {
  notifications.push({
    userId,
    title: `Notification ${i}`,
    message: 'Test',
    type: 'BLOG',
    referenceId: `ref${i}`,
    isRead: i < 500 // 500 read, 500 unread
  });
}
```

**Test:**
```js
const result = await notificationService.getNotifications(userId, {
  page: 1,
  limit: 20
});
```

**Expected:**
- ✅ Returns within acceptable time
- ✅ Pagination works correctly
- ✅ Indexes used (fast queries)

---

#### Test 5.2: Bulk Notification Creation

**Scenario:** Create notifications for 100 users at once

**Setup:**
```js
const userIds = Array(100).fill(null).map(() => new ObjectId());
```

**Test:**
```js
const result = await notificationService.createNotification({
  userId: userIds,
  title: 'Event created',
  message: 'An event has been created',
  type: 'EVENT',
  referenceId: eventId
});
```

**Expected:**
- ✅ All 100 notifications created
- ✅ Uses insertMany for efficiency
- ✅ Completes in reasonable time

---

#### Test 5.3: Race Condition - Mark as Read

**Scenario:** Concurrent requests to mark same notification as read

**Setup:**
```js
const notificationId = notification._id;
```

**Test:**
```js
const results = await Promise.all([
  notificationService.markAsRead(notificationId, userId),
  notificationService.markAsRead(notificationId, userId),
  notificationService.markAsRead(notificationId, userId)
]);
```

**Expected:**
- ✅ All succeed without errors
- ✅ Notification marked as read
- ✅ No duplicate updates issue

---

#### Test 5.4: Invalid ObjectId

**Scenario:** Use invalid MongoDB ObjectId format

**Test:**
```js
const result = await notificationService.getNotificationById(
  'not-a-valid-id',
  userId
);
```

**Expected:**
- ✅ Throws error (404 or validation)
- ✅ No database corruption

---

#### Test 5.5: Null/Undefined Values

**Scenario:** Create notification with missing fields

**Test:**
```js
try {
  await notificationService.createNotification({
    userId,
    title: null,
    message: 'Test',
    type: 'BLOG',
    referenceId: userId
  });
} catch (error) {
  // Expected
}
```

**Expected:**
- ✅ Returns null (validation fails)
- ✅ No error thrown to caller
- ✅ No partial document created

---

#### Test 5.6: Duplicate Notifications

**Scenario:** Create same notification multiple times

**Setup:**
```js
const payload = {
  userId,
  title: 'Test',
  message: 'Test',
  type: 'BLOG',
  referenceId: blogId
};
```

**Test:**
```js
await notificationService.createNotification(payload);
await notificationService.createNotification(payload);
await notificationService.createNotification(payload);
```

**Expected:**
- ✅ All 3 created (no duplicate prevention)
- ✅ Different `_id` for each
- ✅ Valid system behavior (duplicates allowed)

---

#### Test 5.7: Very Long Message

**Scenario:** Notification with very long text

**Test:**
```js
const longMessage = 'A'.repeat(10000);
const result = await notificationService.createNotification({
  userId,
  title: 'Test',
  message: longMessage,
  type: 'BLOG',
  referenceId: blogId
});
```

**Expected:**
- ✅ Accepts long message
- ✅ Stores correctly
- ✅ Retrieves correctly

---

#### Test 5.8: Timezone Handling

**Scenario:** createdAt timestamp is stored correctly in UTC

**Test:**
```js
const notification = await notificationService.createNotification({
  userId,
  title: 'Test',
  message: 'Test',
  type: 'APPROVAL',
  referenceId: userId
});

console.log(notification[0].createdAt.getTimezoneOffset()); // Should be 0 (UTC)
```

**Expected:**
- ✅ Stored in UTC
- ✅ Same timezone regardless of server location
- ✅ Sorting by `createdAt` works correctly

---

## 📊 Test Execution

### Running Tests

```bash
# Run all notification tests
npm test -- modules/notification

# Run specific test suite
npm test -- modules/notification/notification.service.test.js

# Run with coverage
npm test -- modules/notification --coverage

# Run in watch mode
npm test -- modules/notification --watch
```

### Test Framework Setup

```js
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/modules/notification/**/*.js',
    '!src/modules/notification/notification.model.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## ✅ Verification Checklist

- [ ] All 44 tests pass
- [ ] No console errors
- [ ] Coverage > 80%
- [ ] All edge cases handled
- [ ] Access control verified
- [ ] Performance acceptable
- [ ] Database indexes working
- [ ] Error messages clear
- [ ] Non-blocking behavior confirmed
- [ ] No memory leaks

---

## 🎯 Test Priorities

### Critical (Must Pass)
1. Ownership validation tests
2. Basic CRUD operations
3. Access control tests
4. Error handling

### Important (Should Pass)
5. Pagination tests
6. Filtering tests
7. Integration tests
8. Validation tests

### Nice to Have (Can Pass)
9. Performance tests
10. Edge case tests
11. Stress tests

---

## 📝 Summary

The Notification Module includes:
- ✅ 12 comprehensive service layer tests
- ✅ 10 detailed controller tests
- ✅ 8 integration tests
- ✅ 6 access control tests
- ✅ 8 edge case tests
- ✅ Total: 44+ test cases

All tests focus on:
- ✅ Ownership validation
- ✅ Data accuracy
- ✅ Error handling
- ✅ Performance
- ✅ Security

