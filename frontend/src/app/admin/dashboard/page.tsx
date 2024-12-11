// app/admin/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const AdminDashboard = () => {
  const router = useRouter();
  const { logout, username, userType } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
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
      title: 'Team Members',
      description: 'Kelola informasi dan profil anggota tim',
      link: '/admin/teammember',
      adminOnly: false,
      icon: '👥'
    },
    {
      title: 'Timeline',
      description: 'Kelola timeline dan sejarah perusahaan',
      link: '/admin/timeline',
      adminOnly: false,
      icon: '⏰'
    },
    {
      title: 'Contact Info',
      description: 'Update informasi kontak dan detail perusahaan',
      link: '/admin/contact',
      adminOnly: false,
      icon: '📞'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
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
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
  );
};

export default AdminDashboard;