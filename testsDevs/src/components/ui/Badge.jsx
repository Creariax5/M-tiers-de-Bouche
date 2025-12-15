import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-neutral-light text-secondary",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    outline: "border border-secondary text-secondary",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-error text-white",
    info: "bg-info text-white",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-secondary ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
