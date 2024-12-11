'use client';

import React, { useState, useEffect } from 'react';
import { aboutService } from '@/services/api';
import type { TeamMember } from '@/services/api';

type FormData = {
  name: string;
  role: string;
  quote: string;
  image: File | null;
  member_type: 'FOUNDER' | 'TEAM';
  order: number;
};

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    quote: '',
    image: null,
    member_type: 'TEAM',
    order: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const founders = await aboutService.getFounders();
      const team = await aboutService.getTeamMembers();
      setMembers([...founders, ...team].sort((a, b) => a.order - b.order));
    } catch (error) {
      setError('Failed to fetch team members');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
  
      // Handle each field separately with proper type handling
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('member_type', formData.member_type);
      formDataToSend.append('order', formData.order.toString());
  
      // Handle optional fields
      if (formData.quote) {
        formDataToSend.append('quote', formData.quote);
      }
  
      // Handle image separately
      if (formData.image) {
        formDataToSend.append('image', formData.image, formData.image.name);
      }
  
      if (editingId) {
        await aboutService.updateTeamMember(editingId, formDataToSend);
      } else {
        await aboutService.createTeamMember(formDataToSend);
      }
  
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        role: '',
        quote: '',
        image: null,
        member_type: 'TEAM',
        order: 0
      });
      fetchMembers();
    } catch (error) {
      setError('Failed to save team member');
      console.error('Submit error:', error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      quote: member.quote || '',
      image: null,
      member_type: member.member_type,
      order: member.order
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await aboutService.deleteTeamMember(id);
        fetchMembers();
      } catch (error) {
        setError('Failed to delete team member');
        console.error('Delete error:', error);
      }
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({
                name: '',
                role: '',
                quote: '',
                image: null,
                member_type: 'TEAM',
                order: 0
              });
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add New Member'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          {error}
          <button 
            className="absolute top-0 right-0 p-4"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Member Type</label>
              <select
                name="member_type"
                value={formData.member_type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="TEAM">Team Member</option>
                <option value="FOUNDER">Founder</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Quote</label>
              <textarea
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingId ? 'Update Member' : 'Create Member'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.member_type === 'FOUNDER' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {member.member_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {member.quote}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
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