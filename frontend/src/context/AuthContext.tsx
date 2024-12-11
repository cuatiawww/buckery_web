'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api, { authService } from '@/services/api';
import Cookies from 'js-cookie';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
        const tokenFromCookie = Cookies.get('token');
        console.log('Token from cookie:', tokenFromCookie); // Debug log

        if (tokenFromCookie) {
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Token ${tokenFromCookie}`;
          
          // Try to fetch profile to validate token
          try {
            await api.get('/user/profile/');
            // If successful, set auth state
            setToken(tokenFromCookie);
            setIsAuthenticated(true);
            setUsername(Cookies.get('username') || null);
            setUserType(Cookies.get('userType') || null);
          } catch (error) {
            console.error('Token validation failed:', error);
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);


  const synchronizeAuth = (token: string, username: string, userType: string) => {
    // Set cookies dengan opsi yang benar
    const cookieOptions: Cookies.CookieAttributes = { 
      secure: true, 
      sameSite: 'Strict', // Perhatikan 'S' kapital
      expires: 7 
    };
    
    Cookies.set('token', token, cookieOptions);
    Cookies.set('username', username, cookieOptions);
    Cookies.set('userType', userType, cookieOptions);
    
    // Set localStorage sebagai backup
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userType', userType);

    // Set axios default header
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
};

const clearAuth = () => {
  delete api.defaults.headers.common['Authorization'];
  Cookies.remove('token');
  Cookies.remove('username');
  Cookies.remove('userType');
  localStorage.clear();
  setToken(null);
  setIsAuthenticated(false);
  setUsername(null);
  setUserType(null);
};

  const login = (newToken: string, username: string, userType: string) => {
    synchronizeAuth(newToken, username, userType);
    setToken(newToken);
    setIsAuthenticated(true);
    setUsername(username);
    setUserType(userType);
  };

  // const logout = async () => {
  //   setIsLoading(true);
  //   try {
  //     const currentToken = token || Cookies.get('token');
      
  //     if (currentToken) {
  //       try {
  //         await authService.logout();
  //       } catch (error) {
  //         console.error('API logout error:', error);
  //       }
  //     }
      
  //     clearAuth();
  //     router.push('/login');
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //     clearAuth();
  //     router.push('/login');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const logout = async () => {
    setIsLoading(true);
    try {
      const currentToken = token || Cookies.get('token');
      const currentUserType = userType || Cookies.get('userType');
      
      if (currentToken) {
        try {
          await authService.logout();
        } catch (error) {
          console.error('API logout error:', error);
        }
      }
      
      clearAuth();
      // Arahkan ke halaman yang berbeda berdasarkan userType
      if (currentUserType === 'ADMIN' || currentUserType === 'STAFF') {
        router.push('/admin/login');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      clearAuth();
      router.push('/login');
    } finally {
      setIsLoading(false);
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