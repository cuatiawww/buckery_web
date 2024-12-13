/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/api';
import { AlertCircle, Loader2, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';  
import Link from 'next/link';

interface StaffMember {
  id?: number;
  username: string;
  email: string;
  nama_lengkap: string;
  user_type: string;
  is_active: boolean;
}

const StaffManagementPage = () => {
  const router = useRouter();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nama_lengkap: '',
    user_type: 'STAFF',
  });

  // Fetch staff list
  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.listStaff();
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to fetch staff list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsLoading(true);
      await adminService.createStaff(formData);
      setShowAddForm(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        nama_lengkap: '',
        user_type: 'STAFF',
      });
      await fetchStaffList();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create staff');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStaffStatus = async (staffId: number, isActive: boolean) => {
    try {
      await adminService.updateStaff(staffId, { is_active: !isActive });
      await fetchStaffList();
    } catch (error) {
      console.error('Error updating staff status:', error);
      setError('Failed to update staff status');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-tertiary hover:bg-primary text-black px-4 py-2 rounded-lg border-4 border-black font-bold flex items-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add New Staff
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Add Staff Form */}
        {showAddForm && (
          <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Add New Staff</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border-2 border-black"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg border-4 border-black font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-tertiary hover:bg-primary rounded-lg border-4 border-black font-bold"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{staff.nama_lengkap}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{staff.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{staff.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        staff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => staff.id && toggleStaffStatus(staff.id, staff.is_active)}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          staff.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
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
      </div>
    </div>
  );
};

export default StaffManagementPage;