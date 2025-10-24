import React from "react";
import StatCard from "./components/StatCard";
import ChartCard from "./components/ChartCard";

export default function DashboardOverview({ data, loading }) {
  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>No dashboard data.</div>;

  // expecting data exactly as your backend returns for /admin/dashboard-stats
  const { stats = [], revenueTrend, userGrowth, sessionActivity } = data;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.title || s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {revenueTrend && <ChartCard title="Revenue Trend" subtitle="Monthly revenue" data={revenueTrend} chartType="line" dataKey="revenue" strokeColor="#3b82f6" />}
        {userGrowth && <ChartCard title="User Growth" subtitle="Total users" data={userGrowth} chartType="line" dataKey="users" strokeColor="#10b981" />}
        {sessionActivity && <ChartCard title="Session Activity" subtitle="Weekly sessions" data={sessionActivity} chartType="bar" dataKey="sessions" strokeColor="#f59e0b" />}
      </div>
    </>
  );
}
