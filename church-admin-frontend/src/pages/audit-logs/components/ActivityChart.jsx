import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAuditStore } from '../../../store/auditStore';

const COLORS = ['#7C3AED', '#06B6D4', '#F97316', '#EF4444', '#10B981', '#6366F1'];

const ActivityChart = () => {
  const { statistics } = useAuditStore();
  const actionData = statistics?.actionBreakdown ? Object.entries(statistics.actionBreakdown).map(([k, v]) => ({ name: k, value: v })) : [];
  const roleData = statistics?.roleBreakdown ? Object.entries(statistics.roleBreakdown).map(([k, v]) => ({ name: k, value: v })) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl" style={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)' }}>
        <h4 className="font-semibold mb-2">Action Breakdown</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={actionData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
              {actionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 rounded-xl" style={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)' }}>
        <h4 className="font-semibold mb-2">Role Breakdown</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={roleData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#7C3AED" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
