import { useAuditStore } from '../../../store/auditStore';

const AuditDetailsDrawer = () => {
  const { selectedLog, closeDrawer, loading } = useAuditStore();

  if (!selectedLog) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={closeDrawer} />
      <aside className="w-full max-w-md p-6 overflow-auto" style={{ background: 'var(--glass-modal)', borderLeft: '1px solid var(--border-glass)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Audit Details</h2>
          <button onClick={closeDrawer} className="px-3 py-1 rounded-lg">Close</button>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="space-y-3">
            <div><strong>Action:</strong> {selectedLog.action}</div>
            <div><strong>Performer:</strong> {selectedLog.performedBy?.name} ({selectedLog.performedBy?._id})</div>
            <div><strong>Role:</strong> {selectedLog.performerRole}</div>
            <div><strong>Target Type:</strong> {selectedLog.targetType}</div>
            <div><strong>Branch:</strong> {selectedLog.metadata?.branch}</div>
            <div><strong>Timestamp:</strong> {new Date(selectedLog.createdAt).toLocaleString()}</div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Metadata</h3>
              <pre className="p-3 rounded-lg bg-transparent border overflow-auto text-sm">{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default AuditDetailsDrawer;
