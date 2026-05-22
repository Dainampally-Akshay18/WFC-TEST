import { ROUTES } from '../../../constants/routes';
import { PERMISSIONS } from '../../../constants/permissions';

export const sidebarConfig = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: ROUTES.DASHBOARD,
    permission: null,
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'users',
    permission: PERMISSIONS.USER_VIEW,
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        path: ROUTES.USERS,
      },
      {
        id: 'users-approval',
        label: 'Pending Approval',
        path: ROUTES.USER_APPROVAL,
        permission: PERMISSIONS.USER_APPROVE,
      },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    icon: 'calendar',
    path: ROUTES.EVENTS,
    permission: PERMISSIONS.EVENT_VIEW,
  },
  {
    id: 'blogs',
    label: 'Blogs',
    icon: 'blog',
    path: ROUTES.BLOGS,
    permission: PERMISSIONS.BLOG_VIEW,
  },
  {
    id: 'sermons',
    label: 'Sermons',
    icon: 'sermon',
    path: ROUTES.SERMONS,
    permission: PERMISSIONS.SERMON_VIEW,
  },
  {
    id: 'prayers',
    label: 'Prayers',
    icon: 'prayer',
    path: ROUTES.PRAYERS,
    permission: PERMISSIONS.PRAYER_VIEW,
  },
  {
    id: 'branches',
    label: 'Branches',
    icon: 'branch',
    path: ROUTES.BRANCHES,
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: 'audit',
    path: ROUTES.AUDIT_LOGS,
    permission: PERMISSIONS.AUDIT_VIEW,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: ROUTES.SETTINGS,
  },
];
