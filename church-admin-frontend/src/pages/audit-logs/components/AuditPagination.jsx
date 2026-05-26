import { useAuditStore } from '../../../store/auditStore';

const AuditPagination = () => {
  const { currentPage, totalPages, totalFiltered, allLogs, setPage } = useAuditStore();

  // Don't render if no data at all
  if (allLogs.length === 0) return null;

  return (
    <div className="flex items-center justify-between mt-3">
      <span className="text-sm" style={{ color: 'var(--text-secondary, #9CA3AF)' }}>
        Showing {totalFiltered} of {allLogs.length} logs
      </span>

      {totalPages > 1 && (
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 transition-opacity"
          >
            Prev
          </button>
          <div className="px-3 py-1">
            Page {currentPage} / {totalPages}
          </div>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 transition-opacity"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditPagination;
