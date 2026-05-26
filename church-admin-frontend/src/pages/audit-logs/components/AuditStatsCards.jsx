import { useAuditStore } from '../../../store/auditStore';

const StatCard = ({ title, value }) => (
  <div className="p-4 rounded-xl shadow-sm" style={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)' }}>
    <div className="text-xs text-muted">{title}</div>
    <div className="text-2xl font-semibold mt-2">{value}</div>
  </div>
);

const AuditStatsCards = () => {
  const { statistics, statsLoading } = useAuditStore();

  if (statsLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl shadow-sm animate-pulse" style={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)' }}>
            <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
            <div className="h-7 w-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <StatCard title="Total Logs" value={statistics?.totalLogs ?? '-'} />
      <StatCard title="Blog Activities" value={statistics?.targetTypeBreakdown?.BLOG ?? '-'} />
      <StatCard title="Event Activities" value={statistics?.targetTypeBreakdown?.EVENT ?? '-'} />
      <StatCard title="Prayer Activities" value={statistics?.targetTypeBreakdown?.PRAYER ?? '-'} />
      <StatCard title="User Activities" value={statistics?.targetTypeBreakdown?.USER ?? '-'} />
      <StatCard title="Sermon Activities" value={statistics?.targetTypeBreakdown?.SERMON ?? '-'} />
    </div>
  );
};

export default AuditStatsCards;
