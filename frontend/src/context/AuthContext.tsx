'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import Cookies from 'js-cookie';


interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  userType: string | null;
  setIsAuthenticated: (value: boolean) => void;
  setUsername: (value: string | null) => void;
  setUserType: (value: string | null) => void;
  login: (token: string, username: string, userType: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const savedUsername = localStorage.getItem('username');
      const savedUserType = localStorage.getItem('userType');
      
      if (token && savedUsername) {
        // Set both localStorage and cookies
        localStorage.setItem('token', token);
        localStorage.setItem('username', savedUsername);
        localStorage.setItem('userType', savedUserType || '');
        
        Cookies.set('token', token);
        Cookies.set('username', savedUsername);
        Cookies.set('userType', savedUserType || '');
        
        setIsAuthenticated(true);
        setUsername(savedUsername);
        setUserType(savedUserType);
      } else {
        clearAuth();
      }
    };

    checkAuth();
  }, []);

  const clearAuth = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
    
    // Clear cookies
    Cookies.remove('token');
    Cookies.remove('username');
    Cookies.remove('userType');
    
    // Clear state
    setIsAuthenticated(false);
    setUsername(null);
    setUserType(null);
  };

  const login = (token: string, username: string, userType: string) => {
    // Set localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userType', userType);
    
    // Set cookies
    Cookies.set('token', token);
    Cookies.set('username', username);
    Cookies.set('userType', userType);
    
    // Update state
    setIsAuthenticated(true);
    setUsername(username);
    setUserType(userType);
  };

  const logout = async () => {
    try {
      // Get token before clearing storage
      const token = localStorage.getItem('token');
      
      // Clear storage first
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      localStorage.removeItem('rememberMe');
      
      // Update state
      setIsAuthenticated(false);
      setUsername(null);
      setUserType(null);
      
      // Only try to call API if we had a token
      if (token) {
        try {
          await authService.logout();
        } catch (error) {
          console.error('API logout error:', error);
          // Ignore API errors since we've already cleared local state
        }
      }
      
      // Always redirect
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  const value = {
    isAuthenticated,
    username,
    userType,
    setIsAuthenticated,
    setUsername,
    setUserType,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}