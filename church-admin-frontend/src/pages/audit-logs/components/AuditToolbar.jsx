import { useAuditStore } from '../../../store/auditStore';

const AuditToolbar = () => {
  const { fetchAllLogs, fetchStatistics, clearFilters } = useAuditStore();

  const onRefresh = () => {
    fetchAllLogs();
    fetchStatistics();
  };

  const onReset = () => {
    clearFilters();
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={onRefresh} className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm">Refresh</button>
      <button onClick={onReset} className="px-3 py-2 rounded-xl bg-transparent border hover:bg-gray-50">Reset</button>
    </div>
  );
};

export default AuditToolbar;
