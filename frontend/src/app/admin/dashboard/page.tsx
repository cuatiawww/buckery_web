/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Cookies from 'js-cookie';
import api from '@/services/api';

const AdminDashboard = () => {
  const router = useRouter();
  const { logout, username, userType } = useAuth();

  const handleAdminLogout = async () => {
    try {
      // Hapus token admin dan redirect ke admin login
      Cookies.remove('token');
      Cookies.remove('username');
      Cookies.remove('userType');
      delete api.defaults.headers.common['Authorization'];
      router.push('/admin/login');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const menuItems = [
    {
      title: 'Staff Management',
      description: 'Kelola akun staff, tambah/hapus staff, dan atur hak akses',
      link: '/admin/staff',
      adminOnly: true,
      icon: '👥'
    },
    {
      title: 'Products',
      description: 'Kelola produk, kategori, stok, dan harga',
      link: '/admin/products',
      adminOnly: false,
      icon: '📦'
    },
    {
      title: 'Testimonials',
      description: 'Kelola testimonial dan ulasan dari pelanggan',
      link: '/admin/testimonials',
      adminOnly: false,
      icon: '💬'
    },
    {
      title: 'Contact Info',
      description: 'Update informasi kontak dan detail perusahaan',
      link: '/admin/contactinfo',
      adminOnly: false,
      icon: '📞'
    },
    {
      title: 'Tentang Kami',
      description: 'Kelola informasi tim dan perjalanan perusahaan',
      link: '/admin/about',
      adminOnly: false,
      icon: '👥'
    },
    
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back, <span className="font-medium">{username}</span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {userType}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item, index) => {
              if (item.adminOnly && userType !== 'ADMIN') {
                return null;
              }

              return (
                <div
                  key={index}
                  onClick={() => router.push(item.link)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {item.title}
                      </h3>
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tombol Kembali ke Web */}
      <div className="flex justify-center mt-4 mb-8">
        <Link href="/">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
            Kembali ke Web
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-600 font-ChickenSoup">
              © 2024 Buckery. All rights reserved | #LembutnyaMagis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;