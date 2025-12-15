import React from 'react';

const Select = ({ label, error, options = [], className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-bold text-secondary font-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-4 py-2 rounded-lg border border-transparent bg-neutral-light
            font-secondary text-primary appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white focus:border-primary
            disabled:bg-neutral-medium disabled:text-neutral-dark
            transition-all duration-200
            ${error ? 'border-error focus:ring-error bg-red-50' : ''}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-error font-secondary">{error}</span>
      )}
    </div>
  );
};

export default Select;
