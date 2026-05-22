export const QUERY_KEYS = {
  // Auth
  ME: ['me'],
  
  // Users
  USERS: ['users'],
  USER: (id) => ['user', id],
  
  // Events
  EVENTS: ['events'],
  EVENT: (id) => ['event', id],
  
  // Blogs
  BLOGS: ['blogs'],
  BLOG: (id) => ['blog', id],
  
  // Sermons
  SERMONS: ['sermons'],
  SERMON: (id) => ['sermon', id],
  SERMON_CATEGORIES: ['sermon-categories'],
  
  // Prayers
  PRAYERS: ['prayers'],
  PRAYER: (id) => ['prayer', id],
  
  // Notifications
  NOTIFICATIONS: ['notifications'],
  NOTIFICATION: (id) => ['notification', id],
  
  // Branches
  BRANCHES: ['branches'],
  BRANCH: (id) => ['branch', id],
  
  // Dashboard
  DASHBOARD_OVERVIEW: ['dashboard-overview'],
  DASHBOARD_ANALYTICS: ['dashboard-analytics'],
  DASHBOARD_REPORTS: ['dashboard-reports'],
  DASHBOARD_ACTIVITIES: ['dashboard-activities'],
  
  // Audit
  AUDIT_LOGS: ['audit-logs'],
  AUDIT_LOG: (id) => ['audit-log', id],
};
