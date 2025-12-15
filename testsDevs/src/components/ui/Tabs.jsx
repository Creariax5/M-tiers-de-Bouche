import React, { useState } from 'react';

const TabsContext = React.createContext(null);

const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-1 border-b border-neutral-light mb-4 ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, className = '' }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`
        px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-[1px]
        ${isActive 
          ? 'border-primary text-primary' 
          : 'border-transparent text-secondary hover:text-primary hover:border-neutral-light'
        }
        ${className}
      `}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className = '' }) => {
  const { activeTab } = React.useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <div className={`animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
