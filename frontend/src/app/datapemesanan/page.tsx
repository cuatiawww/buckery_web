/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userService, UserProfile } from '@/services/api';
import Navbar from '@/components/Navbar';
import { ArrowRight, ChevronDown, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  deliveryMethod: string;
}

const Page = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    deliveryMethod: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');

  const deliveryOptions = [
    { id: 'pickup', label: 'Pick Up (ambil sendiri)', price: 0 },
    { id: 'local', label: 'Antar (hanya daerah karawang)', price: 10000 },
    { id: 'gojek', label: 'Go-Jek, Grab, Shopee food.', price: 15000 },
    { id: 'courier', label: 'Jarak jauh (JNE, JNT, Paxel)', price: 20000 }
  ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await userService.getProfile();
        // Pre-fill form with profile data
        setFormData(prev => ({
          ...prev,
          name: profileData.nama_lengkap || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          address: profileData.address || '',
          notes: profileData.notes || ''
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Gagal memuat data profil');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeliverySelect = (id: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: id
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.deliveryMethod) {
      alert('Mohon lengkapi semua data yang diperlukan');
      return;
    }
    try {
      localStorage.setItem('orderData', JSON.stringify(formData));
      router.push('/pembayaran');
    } catch (error) {
      console.error('Error:', error);
      setError('Gagal menyimpan data pesanan');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <Loader2 className="w-32 h-32 animate-spin text-black" />
      </div>
    );
  }
  const OrderDataHeader = () => (
    <div className="bg-yellow-400 pt-32 pb-16 relative">
      <div className="container mx-auto px-4">
        {/* Decorative elements */}
        <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
        <div className="absolute top-24 right-12 w-12 h-12 rounded-full bg-primary border-4 border-black animate-bounce delay-300"></div>

        <div className="flex justify-between items-center">
          <Link href="/keranjang" className="flex items-center text-black hover:scale-105 transition-transform">
            <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority className="transform hover:-translate-x-2 transition-transform" />
            <span className="text-xl font-black hidden md:block">KEMBALI</span>
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-black text-black relative">
            <span className="relative inline-block">
              DATA PEMESANAN
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
            </span>
          </h1>

          <div className="w-24 md:w-32"></div> {/* Spacer for centering */}
        </div>
      </div>

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
  );

  return (
    <main className="min-h-screen bg-yellow-400 overflow-x-hidden">
      <Navbar />
      <OrderDataHeader />
      
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-primary rounded-[32px] border-4 border-black p-8 transform transition-all duration-500 hover:-translate-y-2 relative">
            {/* Decorative corner */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-200 border-4 border-black text-black rounded-xl font-ChickenSoup">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="relative mb-8">
                    <h2 className="text-3xl font-black relative z-10">DATA DIRI</h2>
                    <div className="absolute -bottom-2 left-0 w-32 h-4 bg-tertiary -rotate-1"></div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-black mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101"
                        placeholder="Nama lengkap sesuai profil"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-black mb-2">No. Telepon</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101"
                        placeholder="Nomor telepon sesuai profil"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-black mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101"
                        placeholder="Email sesuai profil"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-black mb-2">Alamat</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101 resize-none"
                        placeholder="Alamat pengiriman sesuai profil"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-black mb-2">Catatan</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101 resize-none"
                        placeholder="Catatan tambahan untuk pesanan"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Section */}
                <div className="space-y-6">
                  <div className="relative mb-8">
                    <h2 className="text-3xl font-black relative z-10">PENGIRIMAN</h2>
                    <div className="absolute -bottom-2 left-0 w-40 h-4 bg-secondary -rotate-1"></div>
                  </div>

                  <div className="bg-[#9CD7E3] rounded-xl border-4 border-black p-6">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-white px-6 py-4 rounded-xl border-4 border-black flex justify-between items-center font-ChickenSoup text-lg hover:bg-gray-50 transition-colors"
                      >
                        {formData.deliveryMethod ? 
                          deliveryOptions.find(opt => opt.id === formData.deliveryMethod)?.label : 
                          'Pilih metode pengiriman'}
                        <ChevronDown className={`w-6 h-6 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute w-full mt-2 bg-white rounded-xl border-4 border-black overflow-hidden z-10">
                          {deliveryOptions.map((option) => (
                            <button
                              type="button"
                              key={option.id}
                              onClick={() => handleDeliverySelect(option.id)}
                              className="w-full px-6 py-4 text-left font-ChickenSoup text-lg hover:bg-tertiary transition-colors"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={!formData.deliveryMethod}
                  className={`flex items-center space-x-4 px-8 py-4 rounded-xl border-4 border-black font-ChickenSoup text-xl transition-all duration-300 hover:-translate-y-2 transform
                    ${formData.deliveryMethod ? 
                      'bg-tertiary hover:bg-secondary text-black' : 
                      'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                >
                  <span>LANJUT KE PEMBAYARAN</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Page;


