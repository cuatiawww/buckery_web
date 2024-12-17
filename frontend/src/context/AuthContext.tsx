/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api, { authService } from '@/services/api';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { clearCartGlobal } from './CartContext';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  userType: string | null;
  token: string | null;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUsername: (value: string | null) => void;
  setUserType: (value: string | null) => void;
  login: (token: string, username: string, userType: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
  onLogout?: () => void; // Callback untuk clear cart
};

export function AuthProvider({ children, onLogout }: AuthProviderProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const tokenFromCookie = Cookies.get('token') || localStorage.getItem('token');
        
        if (tokenFromCookie) {
          api.defaults.headers.common['Authorization'] = `Token ${tokenFromCookie}`;
          
          try {
            const userTypeFromStorage = Cookies.get('userType') || localStorage.getItem('userType');
            const usernameFromStorage = Cookies.get('username') || localStorage.getItem('username');
            
            setToken(tokenFromCookie);
            setIsAuthenticated(true);
            setUsername(usernameFromStorage);
            setUserType(userTypeFromStorage);
            
            await api.get('/user/profile/');
          } catch (error) {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAuth();
  }, []);

  const synchronizeAuth = (token: string, username: string, userType: string) => {
    const cookieOptions: Cookies.CookieAttributes = { 
      expires: 7, 
      path: '/',
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production'
    };
    
    Cookies.set('token', token, cookieOptions);
    Cookies.set('username', username, cookieOptions);
    Cookies.set('userType', userType, cookieOptions);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userType', userType);
    
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  };

  const clearAuth = () => {
    delete api.defaults.headers.common['Authorization'];
    Cookies.remove('token', { path: '/' });
    Cookies.remove('username', { path: '/' });
    Cookies.remove('userType', { path: '/' });
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    setToken(null);
    setIsAuthenticated(false);
    setUsername(null);
    setUserType(null);
    clearCartGlobal();
  };

  const login = (newToken: string, username: string, userType: string) => {
    synchronizeAuth(newToken, username, userType);
    setToken(newToken);
    setIsAuthenticated(true);
    setUsername(username);
    setUserType(userType);
  };

  const logout = async () => {
    try {
      await authService.logout();
      clearAuth();
      if (onLogout) {
        onLogout(); // Panggil callback untuk clear cart
      }
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      clearAuth();
      if (onLogout) {
        onLogout(); // Panggil callback untuk clear cart
      }
      router.push('/login');
    }
  };

  const value = {
    isAuthenticated,
    username,
    userType,
    token,
    isLoading,
    setIsAuthenticated,
    setUsername,
    setUserType,
    login,
    logout
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

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