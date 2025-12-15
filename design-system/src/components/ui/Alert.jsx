import React from 'react';

const variants = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  neutral: 'bg-neutral-light text-secondary border-neutral-medium',
};

const Alert = ({ variant = 'info', title, children, className = '' }) => {
  const variantClasses = variants[variant] || variants.info;

  return (
    <div className={`p-4 rounded-lg border ${variantClasses} ${className} font-secondary`}>
      {title && (
        <h5 className="font-bold mb-1 flex items-center gap-2">
          {title}
        </h5>
      )}
      <div className="text-sm">
        {children}
      </div>
    </div>
  );
};

export default Alert;
