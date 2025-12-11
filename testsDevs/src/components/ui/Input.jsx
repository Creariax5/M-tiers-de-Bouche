import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-bold text-stone-brown font-secondary">
          {label}
        </label>
      )}
      <input
        className={`
          px-4 py-2 rounded-lg border border-gray-300 
          font-secondary text-night-bordeaux placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-night-bordeaux focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-secondary">{error}</span>
      )}
    </div>
  );
};

export default Input;
