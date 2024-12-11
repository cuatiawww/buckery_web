'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  userType: string | null;
  token: string | null;
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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      // Check both localStorage and cookies, prefer cookies for security
      const tokenFromCookie = Cookies.get('token');
      const tokenFromStorage = localStorage.getItem('token');
      const usernameFromCookie = Cookies.get('username');
      const userTypeFromCookie = Cookies.get('userType');

      const finalToken = tokenFromCookie || tokenFromStorage;
      
      if (finalToken && usernameFromCookie) {
        // Synchronize storage
        synchronizeAuth(finalToken, usernameFromCookie, userTypeFromCookie || '');
        
        // Update state
        setToken(finalToken);
        setIsAuthenticated(true);
        setUsername(usernameFromCookie);
        setUserType(userTypeFromCookie || null);
      } else {
        clearAuth();
      }
    };

    checkAuth();
  }, []);

  const synchronizeAuth = (token: string, username: string, userType: string) => {
    // Set cookies (primary storage)
    Cookies.set('token', token, { secure: true, sameSite: 'strict' });
    Cookies.set('username', username, { secure: true, sameSite: 'strict' });
    Cookies.set('userType', userType, { secure: true, sameSite: 'strict' });
    
    // Set localStorage (backup)
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userType', userType);
  };

  const clearAuth = () => {
    // Clear cookies
    Cookies.remove('token');
    Cookies.remove('username');
    Cookies.remove('userType');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
    
    // Clear state
    setToken(null);
    setIsAuthenticated(false);
    setUsername(null);
    setUserType(null);
  };

  const login = (newToken: string, username: string, userType: string) => {
    // Synchronize storage
    synchronizeAuth(newToken, username, userType);
    
    // Update state
    setToken(newToken);
    setIsAuthenticated(true);
    setUsername(username);
    setUserType(userType);
  };

  const logout = async () => {
    try {
      const currentToken = token || Cookies.get('token');
      
      // Clear all auth data first
      clearAuth();
      
      // Call logout API if we had a token
      if (currentToken) {
        try {
          await authService.logout();
        } catch (error) {
          console.error('API logout error:', error);
          // Continue with logout even if API call fails
        }
      }
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure we still redirect even if there's an error
      router.push('/login');
    }
  };

  const value = {
    isAuthenticated,
    username,
    userType,
    token, // Expose token through context
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