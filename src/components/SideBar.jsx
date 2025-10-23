import React from 'react';
// Icon prop is passed in, so we don't import specific Lucide icons here.

/**
 * Renders a clickable item for the sidebar navigation.
 */
// eslint-disable-next-line no-unused-vars
const SidebarLink = ({ icon: Icon, name, isActive, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center space-x-3 p-3 rounded-xl transition-colors w-full
      ${isActive
        ? 'bg-white text-gray-900 font-semibold shadow-md'
        : 'text-gray-300 hover:bg-gray-700/50'
      }
      ${isCollapsed ? 'justify-center space-x-0' : ''}
    `}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    {!isCollapsed && <span className="text-sm">{name}</span>}
  </button>
);

export default SidebarLink;
