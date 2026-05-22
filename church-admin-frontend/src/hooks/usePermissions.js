import { useAuth } from './useAuth';
import { PERMISSIONS } from '../constants/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every((permission) => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: PERMISSIONS,
  };
};
