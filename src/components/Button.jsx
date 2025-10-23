import React from 'react';
import { Loader2 } from 'lucide-react';

const PRIMARY_COLOR = '#043873';
const ACCENT_COLOR = 'rgb(245, 158, 11)'; // Tailwind's yellow-500

const Button = ({ children, className = '', onClick, variant = 'primary' }) => {
  const baseStyle = 'px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md';
  let variantStyle = '';

  switch (variant) {
    case 'primary':
      variantStyle = `bg-[${PRIMARY_COLOR}] text-white hover:bg-sky-600`;
      break;
    case 'accent':
      variantStyle = `bg-amber-500 text-white hover:bg-amber-600`;
      break;
    case 'ghost':
      variantStyle = 'bg-transparent text-gray-600 hover:bg-gray-100 shadow-none';
      break;
    default:
      variantStyle = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  }

  return (
    <button onClick={onClick} className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
