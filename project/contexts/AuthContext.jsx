import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateSafetyStatus = (status) => {
      if (user) {
          setUser({
              ...user,
              safetyStatus: { status, timestamp: new Date().toLocaleTimeString() }
          });
      }
  };

  const updateUser = (updatedInfo) => {
    if (user) {
        const newUser = { ...user, ...updatedInfo };
        setUser(newUser);
        localStorage.setItem('userInfo', JSON.stringify(newUser));
    }
  };

  // --- MODIFICATION: Add `loading` to the provided value ---
  const value = { user, loading, login, logout, updateSafetyStatus, updateUser };

  // We no longer need the !loading check here, it will be handled by the routes
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};