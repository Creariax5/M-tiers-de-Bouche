import React from 'react';

const Card = ({ children, className = '', padding = 'p-6' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-3xl shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
