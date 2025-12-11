import React from 'react';

const Card = ({ children, className = '', padding = 'p-6' }) => {
  const hasBg = className.includes('bg-');
  const baseClasses = `border border-gray-200 rounded-3xl shadow-sm ${padding}`;
  const bgClass = hasBg ? '' : 'bg-white';

  return (
    <div className={`${bgClass} ${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
