'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, PackageSearch, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminDashboard = () => {
  const router = useRouter();
  const { logout, username, userType } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      title: 'Staff Management',
      icon: <Users className="h-8 w-8" />,
      description: 'Manage staff accounts',
      link: '/admin/staff/list',
      adminOnly: true
    },
    {
      title: 'Products',
      icon: <PackageSearch className="h-8 w-8" />,
      description: 'Manage products and inventory',
      link: '/admin/products',
      adminOnly: false
    },
    {
      title: 'Reports',
      icon: <FileText className="h-8 w-8" />,
      description: 'View and generate reports',
      link: '/admin/reports',
      adminOnly: false
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {username} ({userType})</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            (item.adminOnly === false || userType === 'ADMIN') && (
              <div
                key={index}
                onClick={() => router.push(item.link)}
                className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            )
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;