import PageHeader from '../../layouts/admin/components/header/PageHeader';
import { useAuth } from '../../hooks/useAuth';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Admin'}!`}
        subtitle="Here's what's happening with your church today"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Users', value: '0', icon: '👥', color: '#7B2CBF' },
          { label: 'Events', value: '0', icon: '📅', color: '#0077B6' },
          { label: 'Blogs', value: '0', icon: '📝', color: '#C77DFF' },
          { label: 'Sermons', value: '0', icon: '🎤', color: '#2E9E5B' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl transition-all hover:scale-105"
            style={{
              background: 'var(--glass-card)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{stat.icon}</div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: `${stat.color}20` }}
              >
                <span style={{ color: stat.color }}>→</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'var(--glass-card)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Recent Activity
          </h3>
          <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
            <div className="text-5xl mb-3">📊</div>
            <p>No recent activity</p>
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: 'var(--glass-card)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Create Event', icon: '📅' },
              { label: 'Write Blog Post', icon: '📝' },
              { label: 'Upload Sermon', icon: '🎤' },
              { label: 'Manage Users', icon: '👥' },
            ].map((action) => (
              <button
                key={action.label}
                className="w-full p-3 rounded-lg text-left transition-all hover:scale-105"
                style={{
                  background: 'var(--glass-card)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-primary)',
                }}
              >
                <span className="mr-3">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
