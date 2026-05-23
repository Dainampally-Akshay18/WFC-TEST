import { useAuditStore } from '../../../store/auditStore';
import RoleBadge from './RoleBadge';
import ActionBadge from './ActionBadge';

const AuditTable = () => {
  const { logs, openDrawer } = useAuditStore();

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-glass)', background: 'var(--glass-card)' }}>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="text-left text-sm">
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Performer</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Target Type</th>
            <th className="px-4 py-3">Branch</th>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l._id} className="border-t">
              <td className="px-4 py-3"><ActionBadge action={l.action} /></td>
              <td className="px-4 py-3">{l.performedBy?.name || '—'}</td>
              <td className="px-4 py-3"><RoleBadge role={l.performerRole} /></td>
              <td className="px-4 py-3">{l.targetType}</td>
              <td className="px-4 py-3">{l.metadata?.branch || '—'}</td>
              <td className="px-4 py-3">{new Date(l.createdAt).toLocaleString()}</td>
              <td className="px-4 py-3">
                <button onClick={() => openDrawer(l._id)} className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;
