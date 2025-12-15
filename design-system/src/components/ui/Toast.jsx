import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, variant = 'info', duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`
                pointer-events-auto transform transition-all duration-300 ease-in-out
                bg-white border rounded-lg shadow-lg p-4 flex items-start gap-3
                animate-slideUp
                ${toast.variant === 'success' ? 'border-green-200 bg-green-50' : ''}
                ${toast.variant === 'error' ? 'border-red-200 bg-red-50' : ''}
                ${toast.variant === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
                ${toast.variant === 'info' ? 'border-blue-200 bg-blue-50' : ''}
              `}
            >
              <div className="flex-1">
                {toast.title && (
                  <h4 className={`text-sm font-bold mb-1 ${
                    toast.variant === 'success' ? 'text-green-800' :
                    toast.variant === 'error' ? 'text-red-800' :
                    toast.variant === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {toast.title}
                  </h4>
                )}
                {toast.description && (
                  <p className="text-sm text-secondary">{toast.description}</p>
                )}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-secondary hover:text-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
