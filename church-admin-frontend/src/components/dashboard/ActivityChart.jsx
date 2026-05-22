import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityChart = ({ data }) => {
  const chartData = Object.keys(data || {}).map(key => ({
    name: key,
    activities: data[key]
  }));

  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center text-sm text-[var(--text-muted)]">No data</div>;

  return (
    <div className="glass-card p-6 rounded-2xl h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Target Type Activities</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7B2CBF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#7B2CBF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--glass-card)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }}
            />
            <Area type="monotone" dataKey="activities" stroke="#7B2CBF" fillOpacity={1} fill="url(#colorActivities)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
