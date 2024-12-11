'use client';

import React, { useState, useEffect } from 'react';
import { testimonialService } from '@/services/api';
import type { Testimonial } from '@/services/api';

// Remove custom interfaces and use React's built-in types
type FormData = {
  username: string;
  message: string;
  tagline: string;
  image: File | null;
  order: number;
  is_active: boolean;
};

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    message: '',
    tagline: '',
    image: null,
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await testimonialService.getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      setError('Failed to fetch testimonials');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // File input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  // Text and checkbox input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Perbaikan cara menghandle FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          // Handle setiap tipe data secara spesifik
          if (typeof value === 'boolean') {
            formDataToSend.append(key, value ? 'true' : 'false');
          } 
          else if (typeof value === 'number') {
            formDataToSend.append(key, value.toString());
          }
          else if (value instanceof File) {
            formDataToSend.append(key, value);
          }
          else {
            formDataToSend.append(key, String(value));
          }
        }
      });
  
      if (editingId) {
        await testimonialService.updateTestimonial(editingId, formDataToSend);
      } else {
        await testimonialService.createTestimonial(formDataToSend);
      }
  
      setShowForm(false);
      setEditingId(null);
      setFormData({
        username: '',
        message: '',
        tagline: '',
        image: null,
        order: 0,
        is_active: true
      });
      fetchTestimonials();
    } catch (error) {
      setError('Failed to save testimonial');
      console.error('Submit error:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      username: testimonial.username,
      message: testimonial.message,
      tagline: testimonial.tagline,
      image: null,
      order: testimonial.order,
      is_active: testimonial.is_active
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await testimonialService.toggleStatus(id, !currentStatus);
      fetchTestimonials();
    } catch (error) {
      setError('Failed to update testimonial status');
      console.error('Toggle status error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialService.deleteTestimonial(id);
        fetchTestimonials();
      } catch (error) {
        setError('Failed to delete testimonial');
        console.error('Delete error:', error);
      }
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Testimonial Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({
                username: '',
                message: '',
                tagline: '',
                image: null,
                order: 0,
                is_active: true
              });
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add New Testimonial'}
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
              <label className="block mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
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
            <div>
              <label className="block mb-1">Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded"
                />
                Active
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingId ? 'Update Testimonial' : 'Create Testimonial'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tagline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{testimonial.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {testimonial.tagline}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {testimonial.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {testimonial.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    testimonial.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {testimonial.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(testimonial.id, testimonial.is_active)}
                    className={testimonial.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                  >
                    {testimonial.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
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