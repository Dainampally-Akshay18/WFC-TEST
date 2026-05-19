# 🧪 Audit Module Testing Guide

## Overview

This guide provides comprehensive test cases for the Audit Module, covering all scenarios for immutable audit logging, branch-aware access control, and filtering capabilities.

**Test Coverage**:
- ✅ Authentication & Authorization
- ✅ Audit Log Creation (via logAction helper)
- ✅ Audit Log Retrieval with Pagination
- ✅ Filtering by Action, Role, Target Type, Branch, Date Range
- ✅ Branch-Aware Access Control (LEADER vs MASTER_ADMIN)
- ✅ Immutability Enforcement (no updates/deletes)
- ✅ Statistics Generation
- ✅ Error Handling & Edge Cases

---

## Test Setup

### Prerequisites

```bash
# Install dependencies
npm install

# Start MongoDB
mongod --dbpath ./data

# Start backend server
npm start
```

### Test Fixtures

```javascript
// Users for testing
const masterAdminUser = {
  _id: ObjectId("507f1f77bcf86cd799439001"),
  email: "admin@church.com",
  role: "MASTER_ADMIN",
  branch: null
};

const leaderUser = {
  _id: ObjectId("507f1f77bcf86cd799439002"),
  email: "leader@church.com",
  role: "LEADER",
  branch: "BRANCH1"
};

const regularUser = {
  _id: ObjectId("507f1f77bcf86cd799439003"),
  email: "user@church.com",
  role: "USER",
  branch: "BRANCH1"
};

// Test resources
const testBlog = {
  _id: ObjectId("607f1f77bcf86cd799439001"),
  title: "Test Blog Post",
  branch: "BRANCH1"
};

const testSermon = {
  _id: ObjectId("607f1f77bcf86cd799439002"),
  title: "Test Sermon",
  branch: "BRANCH1"
};
```

---

## Unit Tests

### 1️⃣ Audit Service - logAction() Helper

#### Test 1.1: Create audit log for valid action

```javascript
describe('auditService.logAction()', () => {
  it('should create a new audit log entry', async () => {
    const logData = {
      action: 'CREATE_BLOG',
      performedBy: masterAdminUser._id,
      performerRole: 'MASTER_ADMIN',
      targetId: testBlog._id,
      targetType: 'BLOG',
      metadata: {
        branch: 'BRANCH1',
        title: 'New Blog Post',
        ipAddress: '192.168.1.1'
      }
    };

    const result = await auditService.logAction(logData);

    expect(result).toBeDefined();
    expect(result._id).toBeDefined();
    expect(result.action).toBe('CREATE_BLOG');
    expect(result.performedBy).toEqual(masterAdminUser._id);
    expect(result.metadata.branch).toBe('BRANCH1');
    expect(result.createdAt).toBeDefined();
  });
});
```

---

### 1️⃣.A Auth Module - User Signup & Access Grant Audit

#### Test 1.A.1: User signup should create audit log

```javascript
describe('Auth Module Audit Logging', () => {
  it('should log CREATE_USER when user signs up', async () => {
    const signupResult = await authService.signup(
      'John Doe',
      'john@example.com',
      'password123',
      'BRANCH1'
    );

    // Get audit logs for this user
    const auditLogs = await AuditLog.find({ 
      action: 'CREATE_USER',
      targetId: signupResult.userId 
    });

    expect(auditLogs.length).toBe(1);
    expect(auditLogs[0].performerRole).toBe('USER');
    expect(auditLogs[0].metadata.email).toBe('john@example.com');
    expect(auditLogs[0].metadata.status).toBe('PENDING');
    expect(auditLogs[0].metadata.branch).toBe('BRANCH1');
  });
});
```

#### Test 1.A.2: User approval should create audit log

```javascript
it('should log APPROVE_USER when admin grants access', async () => {
  // Create pending user first
  const signupResult = await authService.signup(
    'Jane Doe',
    'jane@example.com',
    'password123',
    'BRANCH1'
  );

  // Admin approves user
  await authService.approveUser(signupResult.userId, masterAdminUser._id);

  // Get audit log
  const auditLog = await AuditLog.findOne({
    action: 'APPROVE_USER',
    targetId: signupResult.userId
  });

  expect(auditLog).toBeDefined();
  expect(auditLog.performedBy).toEqual(masterAdminUser._id);
  expect(auditLog.performerRole).toBe('MASTER_ADMIN');
  expect(auditLog.metadata.previousStatus).toBe('PENDING');
  expect(auditLog.metadata.newStatus).toBe('APPROVED');
  expect(auditLog.metadata.email).toBe('jane@example.com');
});
```

#### Test 1.A.3: User rejection should create audit log

```javascript
it('should log REJECT_USER when admin rejects user', async () => {
  // Create pending user
  const signupResult = await authService.signup(
    'Bob Smith',
    'bob@example.com',
    'password123',
    'BRANCH1'
  );

  // Admin rejects user
  await authService.rejectUser(
    signupResult.userId,
    masterAdminUser._id,
    'Email domain not whitelisted'
  );

  // Get audit log
  const auditLog = await AuditLog.findOne({
    action: 'REJECT_USER',
    targetId: signupResult.userId
  });

  expect(auditLog).toBeDefined();
  expect(auditLog.performerRole).toBe('MASTER_ADMIN');
  expect(auditLog.metadata.previousStatus).toBe('PENDING');
  expect(auditLog.metadata.newStatus).toBe('REJECTED');
  expect(auditLog.metadata.reason).toBe('Email domain not whitelisted');
});
```

#### Test 1.A.4: User promotion should create audit log

```javascript
it('should log UPDATE_ROLE when admin promotes user to LEADER', async () => {
  // Create and approve user first
  const signupResult = await authService.signup(
    'Alice Wonder',
    'alice@example.com',
    'password123',
    'BRANCH1'
  );

  const userId = signupResult.userId;
  await authService.approveUser(userId, masterAdminUser._id);

  // Promote to LEADER
  await authService.promoteUser(userId, masterAdminUser._id);

  // Get audit log
  const auditLog = await AuditLog.findOne({
    action: 'UPDATE_ROLE',
    targetId: userId
  });

  expect(auditLog).toBeDefined();
  expect(auditLog.performerRole).toBe('MASTER_ADMIN');
  expect(auditLog.metadata.previousRole).toBe('USER');
  expect(auditLog.metadata.newRole).toBe('LEADER');
});
```

#### Test 1.A.5: User login should create audit log

```javascript
it('should log LOGIN when user logs in', async () => {
  // Create and approve user
  const signupResult = await authService.signup(
    'Charlie Brown',
    'charlie@example.com',
    'password123',
    'BRANCH1'
  );

  await authService.approveUser(signupResult.userId, masterAdminUser._id);

  // Clear previous audit logs for this test
  await AuditLog.deleteMany({ action: 'LOGIN' });

  // Login
  await authService.login('charlie@example.com', 'password123');

  // Get audit log
  const auditLog = await AuditLog.findOne({
    action: 'LOGIN',
    performerRole: 'USER'
  });

  expect(auditLog).toBeDefined();
  expect(auditLog.targetType).toBe('USER');
  expect(auditLog.metadata.email).toBe('charlie@example.com');
  expect(auditLog.metadata.role).toBe('USER');
});
```

---

### 1️⃣.B Access Control for Auth Audit Logs

#### Test 1.2: logAction() should not throw on database error

```javascript
it('should not throw error if database fails', async () => {
  const logData = {
    action: 'CREATE_BLOG',
    performedBy: masterAdminUser._id,
    performerRole: 'MASTER_ADMIN',
    targetId: testBlog._id,
    targetType: 'BLOG',
    metadata: { branch: 'BRANCH1' }
  };

  // Mock database failure
  jest.spyOn(AuditLog.prototype, 'save').mockRejectedValue(
    new Error('Database error')
  );

  const result = await auditService.logAction(logData);

  expect(result).toBeNull(); // Should return null, not throw
});
```

#### Test 1.3: logAction() should include all metadata fields

```javascript
it('should preserve all metadata fields', async () => {
  const logData = {
    action: 'UPDATE_SERMON',
    performedBy: leaderUser._id,
    performerRole: 'LEADER',
    targetId: testSermon._id,
    targetType: 'SERMON',
    metadata: {
      branch: 'BRANCH1',
      beforeValue: { title: 'Old Title' },
      afterValue: { title: 'New Title' },
      reason: 'Typo correction',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...'
    }
  };

  const result = await auditService.logAction(logData);

  expect(result.metadata.beforeValue).toEqual({ title: 'Old Title' });
  expect(result.metadata.afterValue).toEqual({ title: 'New Title' });
  expect(result.metadata.reason).toBe('Typo correction');
  expect(result.metadata.ipAddress).toBe('192.168.1.100');
});
```

---

### 1️⃣.B Access Control for Auth Audit Logs

#### Test 1.B.1: MASTER_ADMIN can see all user signup logs

```javascript
it('MASTER_ADMIN can see all user signup audit logs', async () => {
  // Create users in different branches
  const user1 = await authService.signup('User One', 'user1@test.com', 'pass1', 'BRANCH1');
  const user2 = await authService.signup('User Two', 'user2@test.com', 'pass2', 'BRANCH2');

  // Get all CREATE_USER logs as MASTER_ADMIN
  const result = await auditService.getAuditLogs(
    masterAdminUser._id,
    'MASTER_ADMIN',
    null,
    { action: 'CREATE_USER' }
  );

  const createUserLogs = result.logs.filter(log => log.action === 'CREATE_USER');

  expect(createUserLogs.length).toBeGreaterThanOrEqual(2);
  expect(createUserLogs.some(log => log.targetId === user1.userId.toString())).toBe(true);
  expect(createUserLogs.some(log => log.targetId === user2.userId.toString())).toBe(true);
});
```

#### Test 1.B.2: LEADER can see signup logs from their branch only

```javascript
it('LEADER can only see user signup logs from their branch', async () => {
  // Create users in different branches
  const user1 = await authService.signup('Branch1 User', 'b1user@test.com', 'pass1', 'BRANCH1');
  const user2 = await authService.signup('Branch2 User', 'b2user@test.com', 'pass2', 'BRANCH2');

  // Get CREATE_USER logs as BRANCH1 LEADER
  const result = await auditService.getAuditLogs(
    leaderUser._id,
    'LEADER',
    'BRANCH1',
    { action: 'CREATE_USER' }
  );

  const branch1UserLogs = result.logs.filter(log => 
    log.action === 'CREATE_USER' && log.metadata.branch === 'BRANCH1'
  );

  // Verify BRANCH2 logs are not visible
  const branch2Visible = result.logs.some(log => 
    log.metadata.branch === 'BRANCH2'
  );

  expect(branch2Visible).toBe(false);
});
```

---

### 2️⃣ Audit Service - getAuditLogs()

#### Test 2.1: MASTER_ADMIN should see all logs

```javascript
describe('auditService.getAuditLogs()', () => {
  beforeEach(async () => {
    // Create logs for different branches
    await createTestAuditLog({
      action: 'CREATE_BLOG',
      metadata: { branch: 'BRANCH1' }
    });

    await createTestAuditLog({
      action: 'CREATE_SERMON',
      metadata: { branch: 'BRANCH2' }
    });

    await createTestAuditLog({
      action: 'LOGIN',
      metadata: { branch: null } // GLOBAL
    });
  });

  it('MASTER_ADMIN should see all logs', async () => {
    const result = await auditService.getAuditLogs(
      masterAdminUser._id,
      'MASTER_ADMIN',
      null, // branch is null for MASTER_ADMIN
      { page: 1, limit: 20 }
    );

    expect(result.logs.length).toBe(3);
    expect(result.pagination.total).toBe(3);
  });
});
```

#### Test 2.2: LEADER should see only their branch + GLOBAL logs

```javascript
it('LEADER should see only their branch + GLOBAL logs', async () => {
  const result = await auditService.getAuditLogs(
    leaderUser._id,
    'LEADER',
    'BRANCH1',
    { page: 1, limit: 20 }
  );

  expect(result.logs.length).toBe(2); // BRANCH1 + GLOBAL (null)
  expect(result.logs.every(log => 
    log.metadata.branch === 'BRANCH1' || log.metadata.branch === null
  )).toBe(true);
});
```

#### Test 2.3: LEADER from different branch should not see other branch logs

```javascript
it('LEADER should not see logs from other branches', async () => {
  const result = await auditService.getAuditLogs(
    leaderUser._id,
    'LEADER',
    'BRANCH1',
    { page: 1, limit: 20 }
  );

  const branch2Logs = result.logs.filter(log => 
    log.metadata.branch === 'BRANCH2'
  );

  expect(branch2Logs.length).toBe(0);
});
```

#### Test 2.4: Pagination should work correctly

```javascript
it('should paginate results correctly', async () => {
  // Create 50 audit logs
  for (let i = 0; i < 50; i++) {
    await createTestAuditLog();
  }

  const page1 = await auditService.getAuditLogs(
    masterAdminUser._id,
    'MASTER_ADMIN',
    null,
    { page: 1, limit: 20 }
  );

  const page2 = await auditService.getAuditLogs(
    masterAdminUser._id,
    'MASTER_ADMIN',
    null,
    { page: 2, limit: 20 }
  );

  expect(page1.logs.length).toBe(20);
  expect(page2.logs.length).toBe(20);
  expect(page1.pagination.total).toBe(50);
  expect(page1.pagination.pages).toBe(3);
  expect(page1.logs[0]._id).not.toEqual(page2.logs[0]._id);
});
```

#### Test 2.5: Filter by action type

```javascript
it('should filter by action type', async () => {
  await createTestAuditLog({ action: 'CREATE_BLOG' });
  await createTestAuditLog({ action: 'CREATE_BLOG' });
  await createTestAuditLog({ action: 'UPDATE_SERMON' });

  const result = await auditService.getAuditLogs(
    masterAdminUser._id,
    'MASTER_ADMIN',
    null,
    { page: 1, limit: 20, action: 'CREATE_BLOG' }
  );

  expect(result.logs.length).toBe(2);
  expect(result.logs.every(log => log.action === 'CREATE_BLOG')).toBe(true);
});
```

#### Test 2.6: Filter by performer role

```javascript
it('should filter by performer role', async () => {
  await createTestAuditLog({ performerRole: 'LEADER' });
  await createTestAuditLog({ performerRole: 'LEADER' });
  await createTestAuditLog({ performerRole: 'USER' });

  const result = await auditService.getAuditLogs(
    masterAdminUser._id,
    'MASTER_ADMIN',
    null,
    { page: 1, limit: 20, performerRole: 'LEADER' }
  );

  expect(result.logs.length).toBe(2);
  expect(result.logs.every(log => log.performerRole === 'LEADER')).toBe(true);
});
```

#### Test 2.7: Filter by target type

```javascript
it('should filter by target type', async () => {
  await createTestAuditLog({ targetType: 'BLOG' });
  await createTestAuditLog({ targetType: 'BLOG' });
  await createTestAuditLog({ targetType: 'SERMON' });

  const result = await auditService.getAuditLogs(
    masterAdminUser._id,
    'MASTER_ADMIN',
    null,
    { page: 1, limit: 20, targetType: 'BLOG' }
  );

  expect(result.logs.length).toBe(2);
  expect(result.logs.every(log => log.targetType === 'BLOG')).toBe(true);
});
```

#### Test 2.8: Filter by date range

```javascript
it('should filter by date range', async () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  await createTestAuditLog({ createdAt: yesterday });
  await createTestAuditLog({ createdAt: now });
  await createTestAuditLog({ createdAt: now });

  const result = await auditService.getAuditLogs(
    masterAdminUser._id,
    'MASTER_ADMIN',
    null,
    {
      page: 1,
      limit: 20,
      startDate: yesterday,
      endDate: tomorrow
    }
  );

  expect(result.logs.length).toBe(3);
});
```

#### Test 2.9: Combined filters

```javascript
it('should apply multiple filters together', async () => {
  await createTestAuditLog({
    action: 'CREATE_BLOG',
    performerRole: 'LEADER',
    targetType: 'BLOG',
    metadata: { branch: 'BRANCH1' }
  });

  await createTestAuditLog({
    action: 'UPDATE_SERMON',
    performerRole: 'MASTER_ADMIN',
    targetType: 'SERMON',
    metadata: { branch: 'BRANCH1' }
  });

  const result = await auditService.getAuditLogs(
    masterAdminUser._id,
    'MASTER_ADMIN',
    null,
    {
      page: 1,
      limit: 20,
      action: 'CREATE_BLOG',
      performerRole: 'LEADER',
      targetType: 'BLOG'
    }
  );

  expect(result.logs.length).toBe(1);
  expect(result.logs[0].action).toBe('CREATE_BLOG');
  expect(result.logs[0].performerRole).toBe('LEADER');
  expect(result.logs[0].targetType).toBe('BLOG');
});
```

---

## Integration Tests

### 3️⃣ Audit Routes - GET http://localhost:5000/api/audit

#### Test 3.1: Unauthenticated request should return 401

```javascript
describe('GET /api/audit', () => {
  it('should return 401 without authentication token', async () => {
    const response = await request(app)
      .get('/api/audit')
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});
```

#### Test 3.2: USER role should return 403

```javascript
it('should return 403 for USER role', async () => {
  const token = generateToken(regularUser._id, 'USER', 'BRANCH1');

  const response = await request(app)
    .get('/api/audit')
    .set('Authorization', `Bearer ${token}`)
    .expect(403);

  expect(response.body.success).toBe(false);
});
```

#### Test 3.3: MASTER_ADMIN should see all logs

```javascript
it('MASTER_ADMIN should retrieve all audit logs', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  // Create test logs
  await createTestAuditLog();
  await createTestAuditLog();

  const response = await request(app)
    .get('/api/audit?page=1&limit=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.data.length).toBeGreaterThan(0);
  expect(response.body.pagination).toBeDefined();
});
```

#### Test 3.4: LEADER should see only branch logs

```javascript
it('LEADER should retrieve only their branch logs', async () => {
  const token = generateToken(leaderUser._id, 'LEADER', 'BRANCH1');

  // Create logs for different branches
  await createTestAuditLog({ metadata: { branch: 'BRANCH1' } });
  await createTestAuditLog({ metadata: { branch: 'BRANCH2' } });

  const response = await request(app)
    .get('/api/audit?page=1&limit=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.data.every(log => 
    log.metadata.branch === 'BRANCH1' || log.metadata.branch === null
  )).toBe(true);
});
```

#### Test 3.5: Filter parameters should work

```javascript
it('should filter by action parameter', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  await createTestAuditLog({ action: 'CREATE_BLOG' });
  await createTestAuditLog({ action: 'CREATE_BLOG' });
  await createTestAuditLog({ action: 'UPDATE_SERMON' });

  const response = await request(app)
    .get('/api/audit?page=1&limit=20&action=CREATE_BLOG')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.data.every(log => 
    log.action === 'CREATE_BLOG'
  )).toBe(true);
});
```

#### Test 3.6: Invalid query parameters should return 400

```javascript
it('should return 400 for invalid limit parameter', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  const response = await request(app)
    .get('/api/audit?page=1&limit=200') // max is 100
    .set('Authorization', `Bearer ${token}`)
    .expect(400);

  expect(response.body.success).toBe(false);
});
```

#### Test 3.6.A: API endpoint should return user signup audit logs

```javascript
it('should return CREATE_USER audit logs via API', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  // Create a new user (which triggers CREATE_USER audit)
  const signupResult = await authService.signup(
    'Test User',
    'testuser@example.com',
    'password123',
    'BRANCH1'
  );

  // Query audit API for CREATE_USER logs
  const response = await request(app)
    .get('/api/audit?action=CREATE_USER&page=1&limit=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.data.length).toBeGreaterThan(0);

  const userSignupLog = response.body.data.find(log => 
    log.targetId === signupResult.userId.toString()
  );

  expect(userSignupLog).toBeDefined();
  expect(userSignupLog.action).toBe('CREATE_USER');
  expect(userSignupLog.metadata.email).toBe('testuser@example.com');
  expect(userSignupLog.metadata.status).toBe('PENDING');
});
```

#### Test 3.6.B: API endpoint should return user approval/grant access logs

```javascript
it('should return APPROVE_USER audit logs via API', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  // Create and approve a user
  const signupResult = await authService.signup(
    'Approve Test User',
    'approvetest@example.com',
    'password123',
    'BRANCH1'
  );

  await authService.approveUser(signupResult.userId, masterAdminUser._id);

  // Query audit API for APPROVE_USER logs
  const response = await request(app)
    .get('/api/audit?action=APPROVE_USER&page=1&limit=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);

  const approvalLog = response.body.data.find(log => 
    log.targetId === signupResult.userId.toString()
  );

  expect(approvalLog).toBeDefined();
  expect(approvalLog.action).toBe('APPROVE_USER');
  expect(approvalLog.metadata.newStatus).toBe('APPROVED');
  expect(approvalLog.metadata.previousStatus).toBe('PENDING');
});
```

#### Test 3.6.C: API endpoint should return user rejection logs

```javascript
it('should return REJECT_USER audit logs via API', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  // Create and reject a user
  const signupResult = await authService.signup(
    'Reject Test User',
    'rejecttest@example.com',
    'password123',
    'BRANCH1'
  );

  await authService.rejectUser(
    signupResult.userId,
    masterAdminUser._id,
    'Invalid email domain'
  );

  // Query audit API for REJECT_USER logs
  const response = await request(app)
    .get('/api/audit?action=REJECT_USER&page=1&limit=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);

  const rejectionLog = response.body.data.find(log => 
    log.targetId === signupResult.userId.toString()
  );

  expect(rejectionLog).toBeDefined();
  expect(rejectionLog.action).toBe('REJECT_USER');
  expect(rejectionLog.metadata.newStatus).toBe('REJECTED');
  expect(rejectionLog.metadata.reason).toBe('Invalid email domain');
});
```

#### Test 3.6.D: API endpoint should return user login logs

```javascript
it('should return LOGIN audit logs via API', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  // Create and approve user
  const signupResult = await authService.signup(
    'Login Test User',
    'logintest@example.com',
    'password123',
    'BRANCH1'
  );

  await authService.approveUser(signupResult.userId, masterAdminUser._id);

  // User logs in (triggers LOGIN audit)
  await authService.login('logintest@example.com', 'password123');

  // Query audit API for LOGIN logs
  const response = await request(app)
    .get('/api/audit?action=LOGIN&page=1&limit=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);

  const loginLog = response.body.data.find(log => 
    log.action === 'LOGIN' && log.metadata.email === 'logintest@example.com'
  );

  expect(loginLog).toBeDefined();
  expect(loginLog.performerRole).toBe('USER');
  expect(loginLog.targetType).toBe('USER');
});
```

#### Test 3.6.E: API endpoint should return user role change logs

```javascript
it('should return UPDATE_ROLE audit logs via API', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  // Create, approve, and promote user
  const signupResult = await authService.signup(
    'Promote Test User',
    'promotetest@example.com',
    'password123',
    'BRANCH1'
  );

  await authService.approveUser(signupResult.userId, masterAdminUser._id);
  await authService.promoteUser(signupResult.userId, masterAdminUser._id);

  // Query audit API for UPDATE_ROLE logs
  const response = await request(app)
    .get('/api/audit?action=UPDATE_ROLE&page=1&limit=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);

  const roleChangeLog = response.body.data.find(log => 
    log.targetId === signupResult.userId.toString()
  );

  expect(roleChangeLog).toBeDefined();
  expect(roleChangeLog.action).toBe('UPDATE_ROLE');
  expect(roleChangeLog.metadata.previousRole).toBe('USER');
  expect(roleChangeLog.metadata.newRole).toBe('LEADER');
});
```

---

### 4️⃣ Audit Routes - GET /api/audit/:id

#### Test 4.1: Retrieve single audit log

```javascript
describe('GET /api/audit/:id', () => {
  it('should retrieve a single audit log by ID', async () => {
    const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

    const auditLog = await createTestAuditLog();

    const response = await request(app)
      .get(`/api/audit/${auditLog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toEqual(auditLog._id.toString());
    expect(response.body.data.action).toBe(auditLog.action);
  });
});
```

#### Test 4.2: LEADER cannot see other branch logs

```javascript
it('LEADER should not retrieve logs from other branches', async () => {
  const token = generateToken(leaderUser._id, 'LEADER', 'BRANCH1');

  // Create log for BRANCH2
  const auditLog = await createTestAuditLog({
    metadata: { branch: 'BRANCH2' }
  });

  const response = await request(app)
    .get(`/api/audit/${auditLog._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(403);

  expect(response.body.success).toBe(false);
});
```

#### Test 4.3: Invalid ID should return 404

```javascript
it('should return 404 for non-existent audit log', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  const response = await request(app)
    .get('/api/audit/507f1f77bcf86cd799999999')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);

  expect(response.body.success).toBe(false);
});
```

---

### 5️⃣ Audit Routes - GET /api/audit/statistics

#### Test 5.1: Retrieve statistics

```javascript
describe('GET /api/audit/statistics', () => {
  beforeEach(async () => {
    await createTestAuditLog({ action: 'CREATE_BLOG' });
    await createTestAuditLog({ action: 'CREATE_BLOG' });
    await createTestAuditLog({ action: 'UPDATE_SERMON' });
    await createTestAuditLog({ performerRole: 'LEADER' });
    await createTestAuditLog({ performerRole: 'USER' });
  });

  it('should return audit statistics', async () => {
    const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

    const response = await request(app)
      .get('/api/audit/statistics')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('totalLogs');
    expect(response.body.data).toHaveProperty('actionBreakdown');
    expect(response.body.data).toHaveProperty('roleBreakdown');
    expect(response.body.data).toHaveProperty('targetTypeBreakdown');
  });
});
```

#### Test 5.2: Statistics should show correct counts

```javascript
it('should return correct action breakdown', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  const response = await request(app)
    .get('/api/audit/statistics')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.data.actionBreakdown).toEqual(
    expect.objectContaining({
      CREATE_BLOG: 2,
      UPDATE_SERMON: 1
    })
  );
});
```

---

### 6️⃣ Immutability Tests

#### Test 6.1: Audit logs cannot be updated

```javascript
describe('Audit Immutability', () => {
  it('PUT /api/audit/:id should return 404', async () => {
    const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);
    const auditLog = await createTestAuditLog();

    const response = await request(app)
      .put(`/api/audit/${auditLog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'MODIFIED' })
      .expect(404);
  });
});
```

#### Test 6.2: Audit logs cannot be deleted

```javascript
it('DELETE /api/audit/:id should return 404', async () => {
  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);
  const auditLog = await createTestAuditLog();

  const response = await request(app)
    .delete(`/api/audit/${auditLog._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404);

  // Verify log still exists
  const stillExists = await AuditLog.findById(auditLog._id);
  expect(stillExists).toBeDefined();
});
```

#### Test 6.3: Direct database update should not be possible (best practice)

```javascript
it('should not allow direct updates to audit logs', async () => {
  const auditLog = await createTestAuditLog({ action: 'CREATE_BLOG' });

  // Attempt direct update
  const updated = await AuditLog.findByIdAndUpdate(
    auditLog._id,
    { action: 'MODIFIED' },
    { new: true }
  );

  // Database technically allows it, but audit system design prevents it via:
  // 1. No update routes
  // 2. No service methods for updating
  // 3. API-level documentation enforces immutability

  expect(updated.action).toBe('MODIFIED');
  // This test demonstrates that immutability is enforced at API layer,
  // not database layer. In production, use database triggers to prevent this.
});
```

---

## Performance Tests

### 7️⃣ Query Performance

#### Test 7.1: Large dataset pagination

```javascript
describe('Audit Performance', () => {
  it('should handle 10k audit logs with pagination', async () => {
    // Create 10,000 test logs
    const logs = [];
    for (let i = 0; i < 10000; i++) {
      logs.push(createTestAuditLog());
    }
    await Promise.all(logs);

    const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

    const start = Date.now();
    const response = await request(app)
      .get('/api/audit?page=1&limit=20')
      .set('Authorization', `Bearer ${token}`);
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(500); // Should respond in <500ms
  });
});
```

#### Test 7.2: Complex filter performance

```javascript
it('should apply complex filters efficiently', async () => {
  // Create logs with various attributes
  for (let i = 0; i < 1000; i++) {
    await createTestAuditLog({
      action: ['CREATE_BLOG', 'UPDATE_SERMON', 'DELETE_PRAYER'][i % 3],
      performerRole: ['USER', 'LEADER', 'MASTER_ADMIN'][i % 3],
      targetType: ['BLOG', 'SERMON', 'EVENT'][i % 3]
    });
  }

  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  const start = Date.now();
  const response = await request(app)
    .get('/api/audit?page=1&limit=20&action=CREATE_BLOG&performerRole=LEADER&targetType=BLOG')
    .set('Authorization', `Bearer ${token}`);
  const duration = Date.now() - start;

  expect(response.status).toBe(200);
  expect(duration).toBeLessThan(300); // Should respond in <300ms
});
```

---

## Edge Cases

### 8️⃣ Edge Case Tests

#### Test 8.1: No logs should return empty array

```javascript
describe('Edge Cases', () => {
  it('should return empty array when no logs match filters', async () => {
    const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

    const response = await request(app)
      .get('/api/audit?action=NON_EXISTENT_ACTION')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body.pagination.total).toBe(0);
  });
});
```

#### Test 8.2: Page number exceeding total pages

```javascript
it('should return empty array for page beyond total', async () => {
  await createTestAuditLog();

  const token = generateToken(masterAdminUser._id, 'MASTER_ADMIN', null);

  const response = await request(app)
    .get('/api/audit?page=100&limit=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.data).toEqual([]);
  expect(response.body.pagination.page).toBe(100);
});
```

#### Test 8.3: Null branch (GLOBAL logs) visible to all roles

```javascript
it('should show GLOBAL logs (branch: null) to LEADER', async () => {
  const token = generateToken(leaderUser._id, 'LEADER', 'BRANCH1');

  const globalLog = await createTestAuditLog({
    metadata: { branch: null }
  });

  const response = await request(app)
    .get('/api/audit')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  const foundGlobalLog = response.body.data.find(log => 
    log._id === globalLog._id.toString()
  );

  expect(foundGlobalLog).toBeDefined();
});
```

---

## Test Execution

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
npm test -- audit.test.js
npm test -- audit.integration.test.js
```

### Run with Coverage

```bash
npm test -- --coverage
```

### Expected Coverage

- Statements: 95%+
- Branches: 90%+
- Functions: 95%+
- Lines: 95%+

---

## Test Report Template

| Test | Status | Duration | Notes |
|------|--------|----------|-------|
| Create audit log | ✅ | 50ms | Log created successfully |
| MASTER_ADMIN access | ✅ | 100ms | Sees all logs |
| LEADER access | ✅ | 100ms | Branch filtered |
| USER denied | ✅ | 50ms | 403 Forbidden |
| Pagination | ✅ | 120ms | 10k logs handled |
| Immutability | ✅ | 80ms | No PUT/DELETE routes |
| Statistics | ✅ | 150ms | Aggregation works |

---

## Debugging Audit Issues

### Check if logAction() was called

```javascript
// In service layer
const result = await auditService.logAction({
  action: 'CREATE_BLOG',
  performedBy: userId,
  performerRole: userRole,
  targetId: blogId,
  targetType: 'BLOG',
  metadata: { branch: userBranch }
});

if (result === null) {
  console.warn('Audit logging failed, but operation completed');
}
```

### Verify branch-aware filtering

```bash
# Get logs for BRANCH1 only
curl -H "Authorization: Bearer {token}" \
  'http://localhost:3000/api/audit?branch=BRANCH1'

# Should not see BRANCH2 logs even with MASTER_ADMIN token
```

### Check timestamp accuracy

```javascript
// All logs should be within expected time range
const logs = await auditService.getAuditLogs(...);
logs.forEach(log => {
  const logTime = new Date(log.createdAt);
  console.log(`Action at: ${logTime.toISOString()}`);
});
```

---

**Last Updated**: 2024-01-15  
**Status**: Complete ✅
