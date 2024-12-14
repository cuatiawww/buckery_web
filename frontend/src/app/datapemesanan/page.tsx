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

  return (
    <main className="min-h-screen bg-yellow-400">
      <Navbar />
      
      {/* Header with Navigation */}
      <div className="bg-primary pt-24 pb-16 relative">
      <div className="container mx-auto px-4 flex justify-between items-center mb-8">
        <Link href="/keranjang" className="flex items-center text-black">
          <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority />
          <span className="text-xl font-bold">KEMBALI</span>
        </Link>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black">Data Pemesanan</h1>
        </div>
        
        <div className="w-[144px]" />
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
      {/* Main Content */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-400 rounded-3xl border-4 border-black p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8">
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black"
                      placeholder="Nama lengkap sesuai profil"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">No. Telepon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black"
                      placeholder="Nomor telepon sesuai profil"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black"
                      placeholder="Email sesuai profil"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Alamat</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black resize-none"
                      placeholder="Alamat pengiriman sesuai profil"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Catatan</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black resize-none"
                      placeholder="Catatan tambahan untuk pesanan"
                    />
                  </div>
                </div>
              </div>

               {/* Delivery Options */}
 <div className="bg-sky-200 rounded-xl border-2 border-black p-4">
 <h3 className="font-bold text-xl mb-4">Pilih Pengiriman</h3>
 <div className="relative">
   <button
     type="button"
     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
     className="w-full bg-white px-4 py-3 rounded-xl border-2 border-black flex justify-between items-center font-bold"
   >
     {formData.deliveryMethod ? 
       deliveryOptions.find(opt => opt.id === formData.deliveryMethod)?.label : 
       'Pilih metode pengiriman'}
     <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
   </button>
   
   {isDropdownOpen && (
     <div className="absolute w-full mt-2 bg-white rounded-xl border-2 border-black overflow-hidden z-10">
       {deliveryOptions.map((option) => (
         <button
           type="button"
           key={option.id}
           onClick={() => handleDeliverySelect(option.id)}
           className="w-full px-4 py-3 text-left font-bold hover:bg-sky-100 transition-colors"
         >
           {option.label}
         </button>
       ))}
     </div>
   )}
 </div>
</div>

{/* Submit Button */}
<div className="flex justify-end">
 <button
   type="submit"
   disabled={!formData.deliveryMethod}
   className={`flex items-center space-x-2 px-8 py-4 rounded-xl border-4 border-black font-bold text-xl transition-colors
     ${formData.deliveryMethod ? 
       'bg-tertiary hover:bg-primary text-black' : 
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


