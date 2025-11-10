import React from 'react';

export const Button = React.forwardRef(({ children, type = 'button', variant = 'primary', size = 'md', disabled = false, className = '', onClick, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md focus:ring-blue-500 active:scale-95',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md focus:ring-green-500 active:scale-95',
    purple: 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md focus:ring-purple-500 active:scale-95',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow focus:ring-gray-400 active:scale-95 border border-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md focus:ring-red-500 active:scale-95',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 shadow-none',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

