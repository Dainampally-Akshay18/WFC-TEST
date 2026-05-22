import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#7B2CBF', '#0077B6', '#C77DFF', '#2E9E5B', '#F59E0B', '#DC2626'];

const ActionPieChart = ({ data }) => {
  // data comes as an object: { CREATE_BLOG: 45, UPDATE_EVENT: 28, ... }
  const chartData = Object.keys(data || {}).map((key, index) => ({
    name: key.replace(/_/g, ' '),
    value: data[key],
    color: COLORS[index % COLORS.length]
  }));

  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center text-sm text-[var(--text-muted)]">No data</div>;

  return (
    <div className="glass-card p-6 rounded-2xl h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Action Breakdown</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActionPieChart;
