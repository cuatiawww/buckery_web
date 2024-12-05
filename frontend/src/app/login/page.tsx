/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loginUser } from '@/services/authService';
import { Eye, EyeOff } from 'lucide-react';


interface FormData {
  emailUsername: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    emailUsername: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
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
    try {
      const response = await loginUser({
        email: formData.emailUsername,
        password: formData.password
      });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', formData.emailUsername);
        // Trigger storage event
        window.dispatchEvent(new Event('storage'));
        router.push('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
<div className="hidden md:flex md:w-1/2 bg-primary p-">
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Username
              </label>
              <input
                type="text"
                name="emailUsername"
                value={formData.emailUsername}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white border-2 border-black focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Password
              </label>
              <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    className="w-full p-3 rounded-lg bg-white border-2 border-black focus:outline-none focus:border-primary text-black tracking-widest"
    autoComplete="current-password"
    required
  />
  <button
    type="button"
    onClick={togglePasswordVisibility}
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
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm font-bold uppercase">
                Ingat Saya
              </label>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-tertiary text-black rounded-lg font-bold border-4 border-black uppercase hover:bg-secondary transition-colors"
            >
              Masuk
            </button>

            <div className="text-center mt-4">
              <p className="text-sm">
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