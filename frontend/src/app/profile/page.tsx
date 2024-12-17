/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
// import Image from 'next/image';
// import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, Loader2, UserCircle } from 'lucide-react';
import api, { userService } from '@/services/api';
import type { UserProfile } from '@/services/api';
import Cookies from 'js-cookie';

interface ErrorState {
  phone: string;
  address: string;
  notes: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, userType } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    nama_lengkap: '',
    phone: '',
    address: '',
    notes: '',
    created_at: '',
    updated_at: ''
  });

  const [errors, setErrors] = useState<ErrorState>({
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const token = Cookies.get('token');
      
      if (!authLoading) {
        if (!token || !isAuthenticated) {
          router.push('/login');
          return;
        }
  
        try {
          setIsLoading(true);
          // Set token di header request
          api.defaults.headers.common['Authorization'] = `Token ${token}`;
          const data = await userService.getProfile();
          setProfile(data);
          setMessage('');
        } catch (error: any) {
          if (error.response?.status === 401) {
            Cookies.remove('token');
            router.push('/login');
          } else {
            setMessage('Gagal mengambil data profil. Silakan coba lagi.');
            setMessageType('error');
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    checkAuthAndFetchProfile();
  }, [isAuthenticated, authLoading, router]);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      phone: '',
      address: '',
      notes: ''
    };

    if (profile.phone && !/^[0-9]{10,13}$/.test(profile.phone)) {
      newErrors.phone = 'Nomor telepon harus 10-13 digit';
      isValid = false;
    }

    if (profile.address && profile.address.length < 10) {
      newErrors.address = 'Alamat minimal 10 karakter';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      await userService.updateProfile({
        phone: profile.phone,
        address: profile.address,
        notes: profile.notes
      });

      setMessage('Profil berhasil diperbarui');
      setMessageType('success');
      setIsEditing(false);

      const updatedData = await userService.getProfile();
      setProfile(updatedData);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Session expired' || error.message === 'No token found') {
          if (userType === 'ADMIN' || userType === 'STAFF') {
            router.push('/admin/login');
          } else {
            router.push('/login');
          }
        } else {
          setMessage('Gagal memperbarui profil. Silakan coba lagi.');
          setMessageType('error');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <Loader2 className="w-32 h-32 animate-spin text-black" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-400 overflow-x-hidden">
      <Navbar />
      
      {/* Enhanced Header Section */}
      <div className="bg-yellow-400 pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          {/* Decorative elements */}
          <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
          <div className="absolute top-24 right-12 w-12 h-12 rounded-full bg-primary border-4 border-black animate-bounce delay-300"></div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-8 relative">
            <span className="relative inline-block">
              PROFIL SAYA
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto font-ChickenSoup">
            Kelola informasi profil Anda di sini
          </p>
        </div>

        {/* Wave Border */}
        <div className="absolute bottom-50 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16" preserveAspectRatio="none">
            <path
              fill="#000000"
              d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16" preserveAspectRatio="none">
            <path
              fill="#F8E6C2"
              d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-primary rounded-3xl border-4 border-black p-8 relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-tertiary rounded-full border-4 border-black rotate-12"></div>
            
            {/* Profile Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-secondary w-24 h-24 rounded-full border-4 border-black flex items-center justify-center">
                <UserCircle className="w-16 h-16" />
              </div>
            </div>

            {message && (
              <div className={`mb-6 rounded-2xl border-4 border-black p-4 flex items-center gap-2 
                ${messageType === 'success' ? 'bg-tertiary' : 'bg-red-400'}`}>
                <AlertCircle className="w-6 h-6" />
                <span className="font-bold">{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-secondary rounded-2xl border-4 border-black p-4">
                    <label className="block font-black mb-2 tracking-wide">USERNAME</label>
                    <input
                      type="text"
                      value={profile.username}
                      className="w-full px-4 py-2 rounded-xl border-4 border-black bg-primary_bg font-ChickenSoup"
                      disabled
                    />
                  </div>

                  <div className="bg-secondary rounded-2xl border-4 border-black p-4">
                    <label className="block font-black mb-2 tracking-wide">EMAIL</label>
                    <input
                      type="email"
                      value={profile.email}
                      className="w-full px-4 py-2 rounded-xl border-4 border-black bg-primary_bg font-ChickenSoup"
                      disabled
                    />
                  </div>

                  <div className="bg-secondary rounded-2xl border-4 border-black p-4">
                    <label className="block font-black mb-2 tracking-wide">NAMA LENGKAP</label>
                    <input
                      type="text"
                      value={profile.nama_lengkap}
                      className="w-full px-4 py-2 rounded-xl border-4 border-black bg-primary_bg font-ChickenSoup"
                      disabled
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-tertiary rounded-2xl border-4 border-black p-4">
                    <label className="block font-black mb-2 tracking-wide">NOMOR TELEPON</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-xl border-4 border-black font-ChickenSoup
                        ${!isEditing ? 'bg-primary_bg' : 'bg-white'}`}
                      disabled={!isEditing}
                    />
                    {errors.phone && (
                      <p className="mt-2 font-bold text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="bg-tertiary rounded-2xl border-4 border-black p-4">
                    <label className="block font-black mb-2 tracking-wide">ALAMAT</label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 rounded-xl border-4 border-black resize-none font-ChickenSoup
                        ${!isEditing ? 'bg-primary_bg' : 'bg-white'}`}
                      disabled={!isEditing}
                    />
                    {errors.address && (
                      <p className="mt-2 font-bold text-red-600">{errors.address}</p>
                    )}
                  </div>

                  <div className="bg-tertiary rounded-2xl border-4 border-black p-4">
                    <label className="block font-black mb-2 tracking-wide">CATATAN</label>
                    <textarea
                      name="notes"
                      value={profile.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 rounded-xl border-4 border-black resize-none font-ChickenSoup
                        ${!isEditing ? 'bg-primary_bg' : 'bg-white'}`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3 bg-tertiary hover:bg-primary text-black rounded-full border-4 border-black font-black transition-colors"
                  >
                    EDIT PROFIL
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setErrors({ phone: '', address: '', notes: '' });
                        setMessage('');
                      }}
                      className="px-8 py-3 bg-primary_bg hover:bg-gray-200 text-black rounded-full border-4 border-black font-black transition-colors"
                      disabled={isSaving}
                    >
                      BATAL
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-tertiary hover:bg-primary text-black rounded-full border-4 border-black font-black transition-colors"
                      disabled={isSaving}
                    >
                      {isSaving ? 'MENYIMPAN...' : 'SIMPAN'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProfilePage;