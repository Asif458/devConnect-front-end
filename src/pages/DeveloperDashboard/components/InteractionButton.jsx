import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Small component for Like/Comment/Share buttons on a post.
 */
// eslint-disable-next-line no-unused-vars
const InteractionButton = ({ icon: Icon = Heart, count, label }) => (
  <button className="flex items-center text-gray-500 hover:text-sky-500 transition-colors group">
    <Icon className="w-5 h-5 mr-2 transition-transform group-hover:scale-105" />
    <span className="text-sm font-medium">{count}</span>
    <span className="sr-only">{label}</span>
  </button>
);

export default InteractionButton;