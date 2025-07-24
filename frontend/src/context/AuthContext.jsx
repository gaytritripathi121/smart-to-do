import React, { createContext, useState, useEffect } from 'react';
import { login, register, logout as logoutService } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUser(!!token);
  }, []);

  const handleLogin = async (data) => {
    const res = await login(data);
    localStorage.setItem('token', res.data.token);
    setUser(true);
  };

  const handleRegister = async (data) => {
    const res = await register(data);
    localStorage.setItem('token', res.data.token);
    setUser(true);
  };

  const handleLogout = () => {
    logoutService();
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
