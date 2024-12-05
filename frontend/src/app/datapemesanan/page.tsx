'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import Footer from '@/components/Footer';

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
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    deliveryMethod: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const deliveryOptions = [
    { id: 'pickup', label: 'Pick Up (ambil sendiri)', price: 0 },
    { id: 'local', label: 'Antar (hanya daerah karawang)', price: 10000 },
    { id: 'gojek', label: 'Go-Jek, Grab, Shopee food.', price: 15000 },
    { id: 'courier', label: 'Jarak jauh (JNE, JNT, Paxel)', price: 20000 }
  ];

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
    console.log('Form Data:', formData); // Debug log
    if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.deliveryMethod) {
      alert('Mohon lengkapi semua data yang diperlukan');
      return;
    }
    try {
      localStorage.setItem('orderData', JSON.stringify(formData));
      console.log('Data tersimpan di localStorage'); // Debug log
      router.push('/pembayaran');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-yellow-400">
      <Navbar />
      
      {/* Header with Navigation */}
      <div className="container mx-auto px-4 pt-32 pb-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <ArrowLeft className="w-8 h-8" />
            <span>KEMBALI</span>
          </button>
          <h1 className="text-4xl font-bold">DATA PEMESANAN</h1>
          <div className="w-32" />
        </div>
      </div>

      {/* Wave Border */}
      <div className="relative">
        <svg viewBox="0 0 1440 120" className="w-full h-16" preserveAspectRatio="none">
          <path
            fill="#F8E6C2"
            d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-400 rounded-3xl border-4 border-black p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Map Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari titik alamat"
                      className="w-full px-4 py-2 rounded-xl border-2 border-black pr-10"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      🔍
                    </button>
                  </div>
                  <div className="w-full h-[300px] bg-white rounded-xl border-2 border-black">
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500">Peta Lokasi</p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Isi nama lengkap anda"
                      className="w-full px-4 py-2 rounded-xl border-2 border-black"
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
                      placeholder="Isi no telepon aktif anda"
                      className="w-full px-4 py-2 rounded-xl border-2 border-black"
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
                      placeholder="Isi email aktif anda"
                      className="w-full px-4 py-2 rounded-xl border-2 border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Alamat</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Isi alamat lengkap untuk alamat pengiriman"
                      rows={4}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Catatan</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Silahkan masukkan catatan jika diperlukan"
                      rows={4}
                      className="w-full px-4 py-2 rounded-xl border-2 border-black resize-none"
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
                      'bg-yellow-400 hover:bg-yellow-500 text-black' : 
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