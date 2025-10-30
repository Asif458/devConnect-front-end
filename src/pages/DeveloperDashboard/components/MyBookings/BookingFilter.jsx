import React from "react";

export default function BookingFilter({ filter, setFilter }) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by mentor, title, date..."
          value={filter.search}
          onChange={e => setFilter({ ...filter, search: e.target.value })}
          className="px-4 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>
      <div className="flex items-center gap-2">
        {[
          { label: 'All', value: '' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ].map(({ label, value }) => {
          const isActive = filter.status === value;
          return (
            <button
              key={value || 'all'}
              onClick={() => setFilter({ ...filter, status: value })}
              className={
                `px-3 py-1.5 rounded-md text-sm font-medium border transition ` +
                (isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
