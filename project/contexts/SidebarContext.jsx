import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const SidebarContext = createContext();

// 2. Create the provider component
export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

// 3. Create a custom hook for easy access
export const useSidebar = () => {
  return useContext(SidebarContext);
};