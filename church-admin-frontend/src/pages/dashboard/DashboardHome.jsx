import PageHeader from '../../layouts/admin/components/header/PageHeader';

const DashboardHome = () => {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to Church Admin Dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Users', value: '0', icon: '👥' },
          { label: 'Events', value: '0', icon: '📅' },
          { label: 'Blogs', value: '0', icon: '📝' },
          { label: 'Sermons', value: '0', icon: '🎤' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl"
            style={{
              background: 'var(--glass-card)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
