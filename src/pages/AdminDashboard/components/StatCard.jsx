import React from 'react';

function StatCard({ title, value, Icon }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 flex items-center gap-4">
      {/* Icon */}
      {Icon ? <Icon size={32} className="text-gray-400" /> : null}
      
      <div>
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
      </div>
    </div>
  );
}

export default StatCard;
