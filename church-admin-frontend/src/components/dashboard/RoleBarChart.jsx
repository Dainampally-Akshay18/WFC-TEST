import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RoleBarChart = ({ data }) => {
  const chartData = Object.keys(data || {}).map(key => ({
    name: key.replace(/_/g, ' '),
    count: data[key]
  }));

  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center text-sm text-[var(--text-muted)]">No data</div>;

  return (
    <div className="glass-card p-6 rounded-2xl h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Role Breakdown</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'var(--glass-navbar)' }}
              contentStyle={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }}
            />
            <Bar dataKey="count" fill="#0077B6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoleBarChart;
