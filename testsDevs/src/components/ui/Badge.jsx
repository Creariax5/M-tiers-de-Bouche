import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-white-smoke text-stone-brown",
    primary: "bg-night-bordeaux text-white",
    secondary: "bg-stone-brown text-white",
    outline: "border border-stone-brown text-stone-brown",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-secondary ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
