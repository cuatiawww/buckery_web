/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService, FormDataLogin } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormDataLogin>({
    emailUsername: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setError(''); // Clear error when user types
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.userLogin(formData);
      if (response.token) {
        login(response.token, response.username, response.user_type);
        
        // Redirect based on user type
        if (response.user_type === 'ADMIN' || response.user_type === 'STAFF') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join('\n'));
      } else {
        setError('Login gagal. Silakan periksa kembali username dan password Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-4">
        <div className="w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/Pict1.jpg"
            alt="Buckery"
            width={600}
            height={800}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 bg-primary p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold mb-8 text-center">LOGIN</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                name="emailUsername"
                value={formData.emailUsername}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white border-2 border-black focus:outline-none focus:border-primary font-form"
                required
                placeholder="Masukkan username Anda"
                disabled={isLoading}
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
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white border-2 border-black focus:outline-none focus:border-primary font-form"
                  autoComplete="current-password"
                  required
                  placeholder="Masukkan password Anda"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
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
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm font-semibold">
                Ingat Saya
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-tertiary text-black rounded-lg font-semibold border-4 border-black hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm font-form">
                Belum punya akun?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Daftar
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;