import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-bold text-secondary font-secondary">
          {label}
        </label>
      )}
      <input
        className={`
          px-4 py-2 rounded-lg border border-neutral-light 
          font-secondary text-primary placeholder-neutral-dark/50
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-neutral-light disabled:text-neutral-dark
          transition-all duration-200
          ${error ? 'border-error focus:ring-error' : ''}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-error font-secondary">{error}</span>
      )}
    </div>
  );
};

export default Input;
