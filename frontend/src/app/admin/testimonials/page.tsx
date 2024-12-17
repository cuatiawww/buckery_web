/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { testimonialService } from '@/services/api';
import type { Testimonial } from '@/services/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AlertCircle, Loader2, PlusCircle, ArrowLeft} from 'lucide-react';

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

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setFormData({ ...formData, image: e.target.files[0] });
  //   }
  // };

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
              <a href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6 mr-2" />
                Back to Dashboard
              </a>
            </div>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingId(null);
                setFormData({
                  username: '',
                  message: '',
                  tagline: '',
                  image: null,
                  is_active: true,
                  order: 0
                });
              }}
              className="bg-tertiary hover:bg-primary text-black px-4 py-2 rounded-lg border-4 border-black font-bold flex items-center"
              disabled={isSubmitting}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Testimonial
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

        {showAddForm && (
          <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    rows={3}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-black mr-2"
                      disabled={isSubmitting}
                    />
                    <span className="font-semibold">Is Active</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    accept="image/*"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg border-4 border-black font-bold"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-tertiary hover:bg-primary rounded-lg border-4 border-black font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : (editingId ? 'Update Testimonial' : 'Add Testimonial')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Testimonial List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tagline</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Message</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-sm text-gray-900">{testimonial.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{testimonial.tagline}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs overflow-hidden text-ellipsis">{testimonial.message}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{testimonial.order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        testimonial.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testimonial.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                          disabled={isSubmitting}
                        >
                    
                          Edit
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(testimonial)}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                            testimonial.is_active
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          disabled={isSubmitting}
                        >
                          
                          {testimonial.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                          disabled={isSubmitting}
                        >
                         
                          Delete
                        </button>
                      </div>
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
}