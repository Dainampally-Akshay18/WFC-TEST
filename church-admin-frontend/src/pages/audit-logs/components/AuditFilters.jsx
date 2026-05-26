import { useAuditStore } from '../../../store/auditStore';

const QUICK = [
  { key: 'BLOG', label: 'Blogs' },
  { key: 'EVENT', label: 'Events' },
  { key: 'USER', label: 'Users' },
  { key: 'PRAYER', label: 'Prayers' },
  { key: 'SERMON', label: 'Sermons' },
];

const AuditFilters = () => {
  const { filters, setFilters } = useAuditStore();

  const handleQuickFilter = (key) => {
    const newValue = filters.targetType === key ? '' : key;
    setFilters({ targetType: newValue });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl" style={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)' }}>
      {/* Search */}
      <div>
        <label className="block text-xs font-medium mb-2">Search</label>
        <input
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Search logs..."
          className="w-full p-2 rounded-lg bg-transparent border"
        />
      </div>

      {/* Target Type */}
      <div>
        <label className="block text-xs font-medium mb-2">Target Type</label>
        <select value={filters.targetType} onChange={(e) => setFilters({ targetType: e.target.value })} className="w-full p-2 rounded-lg bg-transparent border">
          <option value="">All</option>
          <option value="BLOG">Blogs</option>
          <option value="EVENT">Events</option>
          <option value="USER">Users</option>
          <option value="PRAYER">Prayers</option>
          <option value="SERMON">Sermons</option>
        </select>
      </div>

      {/* Performer Role */}
      <div>
        <label className="block text-xs font-medium mb-2">Performer Role</label>
        <select value={filters.performerRole} onChange={(e) => setFilters({ performerRole: e.target.value })} className="w-full p-2 rounded-lg bg-transparent border">
          <option value="">All</option>
          <option value="USER">User</option>
          <option value="LEADER">Leader</option>
          <option value="MASTER_ADMIN">Master Admin</option>
        </select>
      </div>

      {/* Action */}
      <div>
        <label className="block text-xs font-medium mb-2">Action</label>
        <select value={filters.action} onChange={(e) => setFilters({ action: e.target.value })} className="w-full p-2 rounded-lg bg-transparent border">
          <option value="">All</option>
          <option value="CREATE_BLOG">Create Blog</option>
          <option value="UPDATE_BLOG">Update Blog</option>
          <option value="DELETE_BLOG">Delete Blog</option>
          <option value="PUBLISH_BLOG">Publish Blog</option>
          <option value="CREATE_EVENT">Create Event</option>
          <option value="UPDATE_EVENT">Update Event</option>
          <option value="DELETE_EVENT">Delete Event</option>
          <option value="CREATE_PRAYER">Create Prayer</option>
          <option value="UPDATE_PRAYER">Update Prayer</option>
          <option value="DELETE_PRAYER">Delete Prayer</option>
          <option value="PRAYED">Prayed</option>
          <option value="CREATE_SERMON">Create Sermon</option>
          <option value="UPDATE_SERMON">Update Sermon</option>
          <option value="DELETE_SERMON">Delete Sermon</option>
          <option value="PUBLISH_SERMON">Publish Sermon</option>
          <option value="SIGNUP">Signup</option>
          <option value="LOGIN">Login</option>
          <option value="APPROVE_USER">Approve User</option>
          <option value="REJECT_USER">Reject User</option>
          <option value="CHANGE_ROLE">Change Role</option>
        </select>
      </div>

      {/* Branch */}
      <div>
        <label className="block text-xs font-medium mb-2">Branch</label>
        <input value={filters.branch} onChange={(e) => setFilters({ branch: e.target.value })} placeholder="Branch" className="w-full p-2 rounded-lg bg-transparent border" />
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-xs font-medium mb-2">Date Range</label>
        <div className="flex gap-2">
          <input
            type="date"
            value={filters.startDate?.split('T')[0] || ''}
            onChange={(e) => setFilters({ startDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            className="p-2 rounded-lg bg-transparent border w-1/2"
          />
          <input
            type="date"
            value={filters.endDate?.split('T')[0] || ''}
            onChange={(e) => setFilters({ endDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            className="p-2 rounded-lg bg-transparent border w-1/2"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="block text-xs font-medium mb-2">Quick Filters</label>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.key}
              onClick={() => handleQuickFilter(q.key)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                filters.targetType === q.key
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'bg-gradient-to-r from-gray-200 to-gray-100'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditFilters;
