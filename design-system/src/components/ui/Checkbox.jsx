import React from 'react';

const Checkbox = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className={`
            peer h-5 w-5 cursor-pointer appearance-none rounded border border-neutral-dark/30 bg-neutral-light
            checked:border-primary checked:bg-primary hover:border-primary
            focus:outline-none focus:ring-2 focus:ring-primary/20
            disabled:cursor-not-allowed disabled:bg-neutral-medium disabled:opacity-50
            transition-all duration-200
            ${error ? 'border-error' : ''}
          `}
          {...props}
        />
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {label && (
        <label className="text-sm text-secondary font-secondary cursor-pointer select-none pt-0.5">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
