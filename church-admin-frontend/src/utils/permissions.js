import { ROLES, ROLE_HIERARCHY } from '../constants/roles';

export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role;
};

export const hasAnyRole = (user, roles) => {
  if (!user) return false;
  return roles.includes(user.role);
};

export const hasMinimumRole = (user, minimumRole) => {
  if (!user) return false;
  const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
  const minimumRoleLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userRoleLevel >= minimumRoleLevel;
};

export const isSuperAdmin = (user) => {
  return hasRole(user, ROLES.SUPER_ADMIN);
};

export const isAdmin = (user) => {
  return hasAnyRole(user, [ROLES.SUPER_ADMIN, ROLES.ADMIN]);
};

export const isModerator = (user) => {
  return hasAnyRole(user, [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR]);
};
