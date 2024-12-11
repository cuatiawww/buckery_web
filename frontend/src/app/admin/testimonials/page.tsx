/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { testimonialService } from '@/services/api';
import type { Testimonial } from '@/services/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function TestimonialManagement() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    message: '',
    tagline: '',
    image: null as File | null,
    is_active: true,
    order: 0
  });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      await fetchTestimonials();
    };
    
    checkAuthAndFetch();
  }, [router]);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await testimonialService.getAllTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      if (err?.message?.includes('login')) {
        router.push('/admin/login');
      } else {
        setError(err?.message || 'Failed to fetch testimonials');
        console.error('Fetch error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = Cookies.get('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username.trim());
      formDataToSend.append('message', formData.message.trim());
      formDataToSend.append('tagline', formData.tagline.trim());
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('is_active', formData.is_active.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingId !== null) {
        await testimonialService.updateTestimonial(editingId, formDataToSend);
      } else {
        await testimonialService.createTestimonial(formDataToSend);
      }
      
      await fetchTestimonials();
      setShowAddForm(false);
      setEditingId(null);
      setFormData({
        username: '',
        message: '',
        tagline: '',
        image: null,
        is_active: true,
        order: 0
      });
      
    } catch (err: any) {
      if (err?.message?.includes('login')) {
        router.push('/admin/login');
      } else {
        setError(err?.message || 'Failed to submit testimonial');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    setFormData({
      username: testimonial.username,
      message: testimonial.message,
      tagline: testimonial.tagline,
      image: null,
      is_active: testimonial.is_active,
      order: testimonial.order
    });
    setEditingId(testimonial.id);
    setShowAddForm(true);
    setError('');
  };

  const handleDelete = async (id: number) => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await testimonialService.deleteTestimonial(id);
      await fetchTestimonials();
    } catch (err: any) {
      if (err?.message?.includes('login')) {
        router.push('/admin/login');
      } else {
        setError(err?.message || 'Failed to delete testimonial');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (testimonial: Testimonial) => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await testimonialService.toggleStatus(testimonial.id, !testimonial.is_active);
      await fetchTestimonials();
    } catch (err: any) {
      if (err?.message?.includes('login')) {
        router.push('/admin/login');
      } else {
        setError(err?.message || 'Failed to update testimonial status');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Testimonial Management</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) {
              setEditingId(null);
              setFormData({
                username: '',
                message: '',
                tagline: '',
                image: null,
                is_active: true,
                order: 0
              });
            }
            setError('');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {showAddForm ? 'Cancel' : 'Add New Testimonial'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-2 border rounded"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2 border rounded"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded"
                min="0"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
                disabled={isSubmitting}
              />
              <label>Is Active</label>
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
                accept="image/*"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : (editingId ? 'Update Testimonial' : 'Create Testimonial')}
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
                    <Image
                      src={testimonial.image}
                      alt={testimonial.username}
                      className="h-10 w-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{testimonial.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {testimonial.tagline}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs overflow-hidden text-ellipsis">{testimonial.message}</div>
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
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(testimonial)}
                    className={`${
                      testimonial.is_active 
                        ? 'text-red-600 hover:text-red-900' 
                        : 'text-green-600 hover:text-green-900'
                    }`}
                    disabled={isSubmitting}
                  >
                    {testimonial.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isSubmitting}
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