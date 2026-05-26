import { useAuditStore } from '../../../store/auditStore';
import ActionBadge from './ActionBadge';
import RoleBadge from './RoleBadge';

const AuditDetailsDrawer = () => {
  const { selectedLog, closeDrawer, loading } = useAuditStore();

  if (!selectedLog) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dark overlay backdrop */}
      <div
        className="flex-1 animate-fade-in"
        onClick={closeDrawer}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      />

      {/* Drawer panel — solid opaque background */}
      <aside
        className="w-full max-w-md p-6 overflow-auto animate-slide-in-right"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderLeft: '1px solid var(--border-glass)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Audit Details</h2>
          <button
            onClick={closeDrawer}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              border: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
            }}
          >
            ✕ Close
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-5 w-2/3 rounded animate-pulse" style={{ backgroundColor: 'var(--border-glass)' }} />
            <div className="h-5 w-1/2 rounded animate-pulse" style={{ backgroundColor: 'var(--border-glass)' }} />
            <div className="h-5 w-3/4 rounded animate-pulse" style={{ backgroundColor: 'var(--border-glass)' }} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Action */}
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(123, 44, 191, 0.08)', border: '1px solid var(--border-glass)' }}
            >
              <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Action</div>
              <ActionBadge action={selectedLog.action} />
            </div>

            {/* Performer */}
            <div
              className="p-3 rounded-lg"
              style={{ border: '1px solid var(--border-glass)' }}
            >
              <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Performer</div>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {selectedLog.performedBy?.name || '—'}
              </div>
              {selectedLog.performedBy?.email && (
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {selectedLog.performedBy.email}
                </div>
              )}
              <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                ID: {selectedLog.performedBy?._id || '—'}
              </div>
            </div>

            {/* Role & Target Type */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ border: '1px solid var(--border-glass)' }}>
                <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</div>
                <RoleBadge role={selectedLog.performerRole} />
              </div>
              <div className="p-3 rounded-lg" style={{ border: '1px solid var(--border-glass)' }}>
                <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Target Type</div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {selectedLog.targetType || '—'}
                </div>
              </div>
            </div>

            {/* Branch & Timestamp */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ border: '1px solid var(--border-glass)' }}>
                <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Branch</div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {selectedLog.metadata?.branch || '—'}
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ border: '1px solid var(--border-glass)' }}>
                <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Timestamp</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {new Date(selectedLog.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-2">
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Metadata</div>
              <pre
                className="p-3 rounded-lg overflow-auto text-xs leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-secondary)',
                }}
              >
                {JSON.stringify(selectedLog.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default AuditDetailsDrawer;
