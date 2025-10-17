import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

function StatCard({ title, value, change, changeType }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
      <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
      <div className={`flex items-center gap-2 text-xs font-semibold mt-4 ${changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
        {changeType === "increase" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{change} vs last month</span>
      </div>
    </div>
  );
}
export default StatCard;
