import React, { useEffect } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import StatsCard from '../../components/dashboard/StatsCard';
import ActionPieChart from '../../components/dashboard/ActionPieChart';
import RoleBarChart from '../../components/dashboard/RoleBarChart';
import ActivityChart from '../../components/dashboard/ActivityChart';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import EmptyState from '../../components/dashboard/EmptyState';
import { Activity, BookOpen, Calendar, Users, Music, Heart } from 'lucide-react';

const DashboardHome = () => {
  const { statistics, isLoading, error, fetchStatistics } = useDashboardStore();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  if (isLoading) return <DashboardSkeleton />;

  if (error) return <EmptyState message={error} />;

  if (!statistics) return <EmptyState />;

  const { totalLogs, actionBreakdown, roleBreakdown, targetTypeBreakdown } = statistics;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] animate-slide-in-left">Dashboard Overview</h1>
        <p className="text-[var(--text-secondary)] animate-slide-in-left" style={{ animationDelay: '100ms' }}>
          Welcome to the administration panel. Here's what's happening.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Activities" 
          value={totalLogs || 0} 
          icon={Activity} 
          colorClass="bg-purple-500 text-purple-500" 
          delay={100} 
        />
        <StatsCard 
          title="Blog Activities" 
          value={targetTypeBreakdown?.BLOG || 0} 
          icon={BookOpen} 
          colorClass="bg-blue-500 text-blue-500" 
          delay={150} 
        />
        <StatsCard 
          title="Event Activities" 
          value={targetTypeBreakdown?.EVENT || 0} 
          icon={Calendar} 
          colorClass="bg-green-500 text-green-500" 
          delay={200} 
        />
        <StatsCard 
          title="User Activities" 
          value={targetTypeBreakdown?.USER || 0} 
          icon={Users} 
          colorClass="bg-orange-500 text-orange-500" 
          delay={250} 
        />
        <StatsCard 
          title="Sermon Activities" 
          value={targetTypeBreakdown?.SERMON || 0} 
          icon={Music} 
          colorClass="bg-pink-500 text-pink-500" 
          delay={300} 
        />
        <StatsCard 
          title="Prayer Activities" 
          value={targetTypeBreakdown?.PRAYER || 0} 
          icon={Heart} 
          colorClass="bg-red-500 text-red-500" 
          delay={350} 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <ActionPieChart data={actionBreakdown} />
        <RoleBarChart data={roleBreakdown} />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <ActivityChart data={targetTypeBreakdown} />
      </div>
    </div>
  );
};

export default DashboardHome;
