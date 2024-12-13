/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/login/page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';

const AdminLoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    emailUsername: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Login attempt with:', formData);
      const response = await authService.adminStaffLogin(formData);
      console.log('Login response:', response);
  
      if (!['ADMIN', 'STAFF'].includes(response.user_type)) {
        setError('Access denied. This login is only for admin and staff.');
        return;
      }
  
      if (response.token) {
        login(response.token, response.username, response.user_type);
        
        // Tambahkan delay sebelum redirect untuk memastikan state terupdate
        setTimeout(() => {
          // Debug log sebelum redirect
          console.log('Auth state before redirect:', {
            token: Cookies.get('token'),
            username: Cookies.get('username'),
            userType: Cookies.get('userType')
          });
          router.push('/admin/dashboard');
        }, 100);
      }
    } catch (error: any) {
      console.error('Login error:', error); // Debug log
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join('\n'));
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-4">
        <div className="w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/Pict1.jpg"
            alt="Buckery Admin"
            width={600}
            height={800}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 bg-primary p-8 flex flex-col justify-center ">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold mb-8 text-center">ADMIN LOGIN</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                name="emailUsername"
                value={formData.emailUsername}
                onChange={(e) => setFormData({ ...formData, emailUsername: e.target.value })}
                className="w-full p-3 rounded-lg bg-white border-2 border-black focus:outline-none focus:border-primary font-form"
                required
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white border-2 border-black focus:outline-none focus:border-primary font-form"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm font-semibold">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-tertiary text-black rounded-lg font-semibold border-4 border-black hover:bg-secondary transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;