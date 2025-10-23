import React from "react";
const sidebarItems = [
  { name: 'Home / Feed', icon: Home, slug: 'feed' },
  { name: 'Find Mentors / Users', icon: Search, slug: 'find' },
  { name: 'Book Mentorship', icon: CalendarPlus, slug: 'book' },
  { name: 'My Bookings', icon: CalendarCheck, slug: 'bookings' },
  { name: 'Messages', icon: MessageSquare, slug: 'messages' },
  { name: 'Groups', icon: Users, slug: 'groups' },
  { name: 'Profile', icon: User, slug: 'profile' },
];

const Sidebar = ({ icon: Icon, name, isActive, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center space-x-3 p-3 rounded-xl transition-colors w-full
      ${isActive
        ? 'bg-white text-gray-900 font-semibold shadow-md' // Solid white block active state
        : 'text-gray-300 hover:bg-gray-700/50' // Darker, defined hover state
      }
      ${isCollapsed ? 'justify-center space-x-0' : ''}
    `}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    {!isCollapsed && <span className="text-sm">{name}</span>}
  </button>
);