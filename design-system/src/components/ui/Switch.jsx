import React from 'react';

const Switch = ({ checked, onChange, label, disabled = false, className = '' }) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`
          w-11 h-6 bg-neutral-medium rounded-full peer 
          peer-focus:ring-2 peer-focus:ring-primary/20 
          peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
          after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:h-5 after:w-5 after:transition-all
          peer-checked:bg-primary
        `}></div>
      </div>
      {label && (
        <span className="text-sm font-medium text-secondary font-secondary">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;
