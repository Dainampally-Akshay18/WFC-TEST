/**
 * PERMISSION UTILITIES
 * Helper functions for checking user permissions
 */

import { ROLE_PERMISSIONS } from "../constants/role.constants";

export const permissions = {
  /**
   * Check if user has specific permission
   */
  hasPermission: (userRole, permission) => {
    if (!userRole) return false;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return userPermissions.includes(permission);
  },

  /**
   * Check if user has any of the permissions
   */
  hasAnyPermission: (userRole, permissionsArray) => {
    if (!userRole || !permissionsArray.length) return false;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return permissionsArray.some((p) => userPermissions.includes(p));
  },

  /**
   * Check if user has all permissions
   */
  hasAllPermissions: (userRole, permissionsArray) => {
    if (!userRole || !permissionsArray.length) return false;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return permissionsArray.every((p) => userPermissions.includes(p));
  },

  /**
   * Get user permissions
   */
  getUserPermissions: (userRole) => {
    return ROLE_PERMISSIONS[userRole] || [];
  },
};

export default permissions;
