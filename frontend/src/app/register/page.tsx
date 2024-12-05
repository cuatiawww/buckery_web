/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { registerUser } from '@/services/authService';
import { Eye, EyeOff } from 'lucide-react';

interface FormData {
  namaLengkap: string;
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await registerUser({
        email: formData.email,
        username: formData.username,
        nama_lengkap: formData.namaLengkap,
        password: formData.password
      });
      if (response.token) {
        localStorage.setItem('token', response.token);
        router.push('/login');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
      console.error('Registration failed:', error);
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
          <h2 className="text-3xl font-bold mb-8 text-center">DAFTAR AKUN</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white border-2 border-black focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white border-2 border-black focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
      autoComplete="new-password"
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

            <button
              type="submit"
              className="w-full p-3 bg-tertiary text-black rounded-lg font-bold uppercase border-4 border-black hover:bg-secondary  transition-colors"
            >
              Daftar
            </button>

            <div className="text-center mt-4">
              <p className="text-sm">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Masuk
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;