import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import { PERMISSIONS } from '../constants/permissions';

export const routeConfig = [
  // Dashboard
  {
    path: ROUTES.DASHBOARD,
    label: 'Dashboard',
    protected: true,
  },
  
  // Users
  {
    path: ROUTES.USERS,
    label: 'Users',
    protected: true,
    permission: PERMISSIONS.USER_VIEW,
  },
  {
    path: ROUTES.USER_APPROVAL,
    label: 'User Approval',
    protected: true,
    permission: PERMISSIONS.USER_APPROVE,
  },
  
  // Events
  {
    path: ROUTES.EVENTS,
    label: 'Events',
    protected: true,
    permission: PERMISSIONS.EVENT_VIEW,
  },
  
  // Blogs
  {
    path: ROUTES.BLOGS,
    label: 'Blogs',
    protected: true,
    permission: PERMISSIONS.BLOG_VIEW,
  },
  
  // Sermons
  {
    path: ROUTES.SERMONS,
    label: 'Sermons',
    protected: true,
    permission: PERMISSIONS.SERMON_VIEW,
  },
  
  // Prayers
  {
    path: ROUTES.PRAYERS,
    label: 'Prayers',
    protected: true,
    permission: PERMISSIONS.PRAYER_VIEW,
  },
  
  // Audit
  {
    path: ROUTES.AUDIT_LOGS,
    label: 'Audit Logs',
    protected: true,
    permission: PERMISSIONS.AUDIT_VIEW,
    minimumRole: ROLES.ADMIN,
  },
];
