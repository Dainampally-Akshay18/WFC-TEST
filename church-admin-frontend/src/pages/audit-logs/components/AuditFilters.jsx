import { useAuditStore } from '../../../store/auditStore';

const QUICK = [
  { key: 'BLOG', label: 'Blogs' },
  { key: 'EVENT', label: 'Events' },
  { key: 'USER', label: 'Users' },
  { key: 'PRAYER', label: 'Prayers' },
  { key: 'SERMON', label: 'Sermons' },
];

const AuditFilters = () => {
  const { filters, setFilters, fetchLogs } = useAuditStore();

  const apply = (partial) => {
    setFilters(partial);
    // reset to first page when filters change
    setTimeout(() => fetchLogs(), 0);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl" style={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)' }}>
      <div>
        <label className="block text-xs font-medium mb-2">Target Type</label>
        <select value={filters.targetType} onChange={(e) => apply({ targetType: e.target.value })} className="w-full p-2 rounded-lg bg-transparent border">
          <option value="">All</option>
          <option value="BLOG">Blogs</option>
          <option value="EVENT">Events</option>
          <option value="USER">Users</option>
          <option value="PRAYER">Prayers</option>
          <option value="SERMON">Sermons</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-2">Performer Role</label>
        <select value={filters.performerRole} onChange={(e) => apply({ performerRole: e.target.value })} className="w-full p-2 rounded-lg bg-transparent border">
          <option value="">All</option>
          <option value="USER">User</option>
          <option value="LEADER">Leader</option>
          <option value="MASTER_ADMIN">Master Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-2">Branch</label>
        <input value={filters.branch} onChange={(e) => apply({ branch: e.target.value })} placeholder="Branch" className="w-full p-2 rounded-lg bg-transparent border" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-2">Date Range</label>
        <div className="flex gap-2">
          <input type="date" value={filters.startDate?.split('T')[0] || ''} onChange={(e) => apply({ startDate: e.target.value ? new Date(e.target.value).toISOString() : '' })} className="p-2 rounded-lg bg-transparent border w-1/2" />
          <input type="date" value={filters.endDate?.split('T')[0] || ''} onChange={(e) => apply({ endDate: e.target.value ? new Date(e.target.value).toISOString() : '' })} className="p-2 rounded-lg bg-transparent border w-1/2" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-2">Quick Filters</label>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button key={q.key} onClick={() => apply({ targetType: q.key })} className="px-3 py-1 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 text-sm">{q.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditFilters;
