/**
 * ROLE CONSTANTS
 * User role definitions and permissions
 */

export const USER_ROLES = {
  USER: "USER",
  LEADER: "LEADER",
  MASTER_ADMIN: "MASTER_ADMIN",
};

export const ROLE_LABELS = {
  [USER_ROLES.USER]: "User",
  [USER_ROLES.LEADER]: "Leader",
  [USER_ROLES.MASTER_ADMIN]: "Admin",
};

export const USER_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const STATUS_LABELS = {
  [USER_STATUS.PENDING]: "Pending",
  [USER_STATUS.APPROVED]: "Approved",
  [USER_STATUS.REJECTED]: "Rejected",
};

// Permission definitions by role
export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: ["view:content", "create:prayer", "read:notifications"],
  [USER_ROLES.LEADER]: [
    "view:content",
    "create:prayer",
    "read:notifications",
    "moderate:content",
    "manage:prayers",
  ],
  [USER_ROLES.MASTER_ADMIN]: [
    "view:content",
    "create:prayer",
    "read:notifications",
    "moderate:content",
    "manage:prayers",
    "approve:users",
    "manage:roles",
    "view:audit-logs",
  ],
};

export default {
  USER_ROLES,
  ROLE_LABELS,
  USER_STATUS,
  STATUS_LABELS,
  ROLE_PERMISSIONS,
};
