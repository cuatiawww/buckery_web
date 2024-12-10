'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, UserCheck, UserX } from 'lucide-react';
import { adminService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface StaffMember {
    id: number;
    username: string;
    email: string;
    nama_lengkap: string;
    is_active: boolean;
  }
  
  const StaffList = () => {
    const router = useRouter();
    const { isAuthenticated, userType } = useAuth();
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      // Redirect if not authenticated or not admin
      if (!isAuthenticated || userType !== 'ADMIN') {
        router.push('/admin/login');
        return;
      }
  
      fetchStaffList();
    }, [isAuthenticated, userType, router]);
  
    const fetchStaffList = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await adminService.listStaff();
        console.log('Staff list response:', response); // Debug log
        
        if (response.status === 'success') {
          setStaffList(response.data);
        }
      } catch (error) {
        console.error('Error fetching staff list:', error);
        alert('Failed to fetch staff list');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold">Staff Management</h1>
            </div>
            <button
              onClick={() => router.push('/admin/staff/create')}
              className="flex items-center px-4 py-2 bg-tertiary text-black rounded-lg border-2 border-black hover:bg-secondary transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Staff
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {staff.nama_lengkap}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{staff.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{staff.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {staff.is_active ? (
                          <span className="flex items-center px-3 py-1 text-green-800 text-sm font-medium bg-green-100 rounded-full">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center px-3 py-1 text-red-800 text-sm font-medium bg-red-100 rounded-full">
                            <UserX className="h-4 w-4 mr-1" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffList;