import { useAuditStore } from '../../../store/auditStore';

const AuditPagination = () => {
  const { pagination, setPagination, fetchLogs } = useAuditStore();

  const go = (page) => {
    setPagination({ page });
    setTimeout(() => fetchLogs(), 0);
  };

  return (
    <div className="flex items-center justify-end gap-3 mt-3">
      <button disabled={pagination.page <= 1} onClick={() => go(pagination.page - 1)} className="px-3 py-1 rounded-lg border">Prev</button>
      <div className="px-3 py-1">Page {pagination.page} / {pagination.pages || 1}</div>
      <button disabled={pagination.page >= (pagination.pages || 1)} onClick={() => go(pagination.page + 1)} className="px-3 py-1 rounded-lg border">Next</button>
    </div>
  );
};

export default AuditPagination;
