// app/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle } from 'lucide-react';
import { userService, UserProfile } from '@/services/api';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, authLoading]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Gagal mengambil data profil');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.updateProfile({
        phone: profile.phone,
        address: profile.address,
        notes: profile.notes
      });
      setMessage('Profil berhasil diperbarui');
      setMessageType('success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Gagal memperbarui profil');
      setMessageType('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-400">
      <Navbar />
      
      <div className="bg-primary pt-24 pb-16 relative">
        <div className="container mx-auto px-4 flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center text-black">
            <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority />
            <span className="text-xl font-bold">KEMBALI</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black">Profil Saya</h1>
          </div>
          
          <div className="w-[144px]" />
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

      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-400 rounded-3xl border-4 border-black p-6">
            {message && (
              <div className={`mb-4 p-4 rounded-xl border-2 flex items-center gap-2 
                ${messageType === 'success' ? 'bg-green-100 border-green-700 text-green-700' : 'bg-red-100 border-red-700 text-red-700'}`}>
                <AlertCircle className="w-5 h-5" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2">Username</label>
                    <input
                      type="text"
                      value={profile.username}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black bg-gray-100"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black bg-gray-100"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      value={profile.nama_lengkap}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black bg-gray-100"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-xl border-2 border-black 
                        ${!isEditing && 'bg-gray-100'}`}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Alamat</label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 rounded-xl border-2 border-black resize-none
                        ${!isEditing && 'bg-gray-100'}`}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Catatan</label>
                    <textarea
                      name="notes"
                      value={profile.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 rounded-xl border-2 border-black resize-none
                        ${!isEditing && 'bg-gray-100'}`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-tertiary hover:bg-primary text-black rounded-xl border-4 border-black font-bold"
                  >
                    Edit Profil
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile(); // Reset form
                      }}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl border-4 border-black font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-tertiary hover:bg-primary text-black rounded-xl border-4 border-black font-bold"
                    >
                      Simpan
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
}