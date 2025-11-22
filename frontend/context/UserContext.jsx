// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { whoamiAPI } from '../src/api/Auth.api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await whoamiAPI();
      setUser(userData);
      setError(null);
      console.log(userData);
    } catch (err) {
      console.log("No user logged in or session expired");
      setUser(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to refetch user data
  const refetchUser = () => {
    fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error, 
      setUser, 
      refetchUser  // Export this function
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};