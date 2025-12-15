import React from 'react';

const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const baseStyles = "font-secondary font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-night-bordeaux text-white hover:bg-opacity-90 focus:ring-night-bordeaux",
    secondary: "bg-stone-brown text-white hover:bg-opacity-90 focus:ring-stone-brown",
    outline: "border-2 border-night-bordeaux text-night-bordeaux hover:bg-night-bordeaux hover:text-white focus:ring-night-bordeaux",
    ghost: "text-stone-brown hover:bg-white-smoke hover:text-night-bordeaux",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
