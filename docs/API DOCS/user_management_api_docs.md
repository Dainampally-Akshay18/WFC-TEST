# USER MANAGEMENT MODULE API DOCUMENTATION

## Base URL

```txt id="yjlwm4"
/api/users
```

---

# Authentication

All APIs require JWT token.

## Headers

```http id="n6mb1m"
Authorization: Bearer <token>
Content-Type: application/json
```

---

# USER STATUS ENUM

```txt id="jlwm5a"
PENDING
APPROVED
REJECTED
```

---

# USER ROLE ENUM

```txt id="jlwm5b"
MASTER_ADMIN
LEADER
USER
```

---

# 1. GET ALL USERS

## Endpoint

```http id="jlwm5c"
GET /api/users
```

---

## Description

Fetch all users with:

* pagination
* filters

Accessible only by:

* MASTER_ADMIN

---

## Query Parameters

| Parameter | Type   | Required | Example   |
| --------- | ------ | -------- | --------- |
| role      | string | No       | USER      |
| status    | string | No       | PENDING   |
| branch    | string | No       | Hyderabad |
| page      | number | No       | 1         |
| limit     | number | No       | 10        |

---

## Example Request

```http id="jlwm5d"
GET /api/users?status=PENDING&page=1&limit=10
```

---

## Success Response

```json id="jlwm5e"
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "665f7a2f91ab12",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "status": "PENDING",
        "branch": "Hyderabad",
        "createdAt": "2026-05-22T10:00:00Z",
        "updatedAt": "2026-05-22T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

---

# 2. GET USER BY ID

## Endpoint

```http id="jlwm5f"
GET /api/users/:userId
```

---

## Example Request

```http id="jlwm5g"
GET /api/users/665f7a2f91ab12
```

---

## Success Response

```json id="jlwm5h"
{
  "success": true,
  "data": {
    "_id": "665f7a2f91ab12",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "PENDING",
    "branch": "Hyderabad",
    "approvedAt": null,
    "createdAt": "2026-05-22T10:00:00Z"
  }
}
```

---

# 3. UPDATE USER STATUS

## Endpoint

```http id="jlwm5i"
PUT /api/users/:userId
```

---

# IMPORTANT

This API is ONLY for:

* approving users
* rejecting users

Do NOT use this API for:

* password updates
* profile updates
* email updates

---

# APPROVE USER

## Request Body

```json id="jlwm5j"
{
  "status": "APPROVED"
}
```

---

# REJECT USER

## Request Body

```json id="jlwm5k"
{
  "status": "REJECTED"
}
```

---

## Validation Rules

| Field  | Type   | Required |
| ------ | ------ | -------- |
| status | string | Yes      |

---

## Allowed Status Values

```txt id="jlwm5l"
APPROVED
REJECTED
```

---

## Success Response

```json id="jlwm5m"
{
  "success": true,
  "data": {
    "_id": "665f7a2f91ab12",
    "name": "John Doe",
    "status": "APPROVED",
    "approvedAt": "2026-05-22T12:00:00Z"
  }
}
```

---

## Error Response

```json id="jlwm5n"
{
  "success": false,
  "error": {
    "message": "User not found"
  }
}
```

---

# 4. DELETE USER

## Endpoint

```http id="jlwm5o"
DELETE /api/users/:userId
```

---

## Example Request

```http id="jlwm5p"
DELETE /api/users/665f7a2f91ab12
```

---

## Success Response

```json id="jlwm5q"
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  }
}
```

---

## Error Response

```json id="jlwm5r"
{
  "success": false,
  "error": {
    "message": "Cannot delete MASTER_ADMIN account"
  }
}
```

---

# Frontend Integration Notes

## Pending Users Screen

Frontend should call:

```http id="jlwm5s"
GET /api/users?status=PENDING
```

to show approval requests.

---

## Approve User Action

Frontend should call:

```http id="jlwm5t"
PUT /api/users/:userId
```

Body:

```json id="jlwm5u"
{
  "status": "APPROVED"
}
```

---

## Reject User Action

Frontend should call:

```http id="jlwm5v"
PUT /api/users/:userId
```

Body:

```json id="jlwm5w"
{
  "status": "REJECTED"
}
```

---

# Security Notes

Never expose:

* password
* resetPasswordToken
* resetPasswordExpires

Frontend should never send:

* password
* email updates
* role updates

through User Management APIs.
