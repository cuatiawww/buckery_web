// app/admin/staff/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/api';
import type { StaffData } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface FormState {
  username: string;
  email: string;
  password: string;
  nama_lengkap: string;
  user_type: string;
}

interface UpdateStatusData {
  is_active: boolean;
}

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<StaffData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { token, isAuthenticated, userType } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    nama_lengkap: '',
    user_type: 'STAFF'
  });

  useEffect(() => {
    const checkAndFetch = async () => {
      if (!isAuthenticated || !token || userType !== 'ADMIN') {
        router.push('/admin/login');
        return;
      }
      await fetchStaffList();
    };

    checkAndFetch();
  }, [isAuthenticated, token, userType, router]);

  const fetchStaffList = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await adminService.listStaff();
      if (response?.data) {
        setStaffList(response.data);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch staff list');
      console.error('Fetch staff error:', err);
      // if (err?.response?.status === 401) {
      //   router.push('/admin/login');
      // }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
  
    try {
      setError('');
      await adminService.createStaff({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nama_lengkap: formData.nama_lengkap,
        user_type: 'STAFF'
      });
      
      setShowAddForm(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        nama_lengkap: '',
        user_type: 'STAFF'
      });
      
      await fetchStaffList();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push('/admin/login');
        return;
      }
      
      if (err?.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(Array.isArray(errorMessages) ? errorMessages.join('\n') : 'Invalid form data');
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create staff');
      }
    }
  };

  const handleUpdateStatus = async (staffId: number, isActive: boolean) => {
    if (!token) return;

    try {
      setError('');
      const updateData: UpdateStatusData = { is_active: isActive };
      await adminService.updateStaff(staffId, updateData);
      await fetchStaffList();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push('/admin/login');
        return;
      }
      setError('Failed to update staff status');
      console.error('Update status error:', err);
    }
  };

  if (isLoading && isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !token || userType !== 'ADMIN') {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : 'Add New Staff'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Staff
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{staff.nama_lengkap}</div>
                  <div className="text-sm text-gray-500">{staff.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {staff.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    staff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleUpdateStatus(staff.id!, !staff.is_active)}
                    className={`${
                      staff.is_active 
                        ? 'text-red-600 hover:text-red-900' 
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {staff.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}