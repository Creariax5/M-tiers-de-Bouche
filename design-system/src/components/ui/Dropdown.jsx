import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`
            absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none
            ${align === 'right' ? 'right-0' : 'left-0'}
            animate-fadeIn
          `}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ children, onClick, className = '', danger = false }) => {
  return (
    <button
      className={`
        group flex w-full items-center px-4 py-2 text-sm font-secondary
        hover:bg-neutral-light transition-colors
        ${danger ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-secondary hover:text-primary'}
        ${className}
      `}
      role="menuitem"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Dropdown, DropdownItem };
