/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { contactService } from '@/services/api';
import type { ContactInfo } from '@/services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ContactInfoManagement() {
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    location: '',
    whatsapp_number: '',
    phone_number2: '',
    email: '',
    instagram: '',
    weekday_hours: '',
    saturday_hours: '',
    sunday_hours: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchContactInfo();
  }, [router]);

  const fetchContactInfo = async () => {
    try {
      setIsLoading(true);
      const data = await contactService.getContactInfo();
      setContactInfo(data);
      if (data) {
        setFormData({
          location: data.location || '',
          whatsapp_number: data.whatsapp_number || '',
          phone_number2: data.phone_number2 || '',
          email: data.email || '',
          instagram: data.instagram || '',
          weekday_hours: data.weekday_hours || '',
          saturday_hours: data.saturday_hours || '',
          sunday_hours: data.sunday_hours || '',
          latitude: data.latitude?.toString() || '',
          longitude: data.longitude?.toString() || ''
        });
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
      setError('Failed to load contact information');
    } finally {
      setIsLoading(false);
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

      const dataToSubmit = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (contactInfo?.id) {
        await contactService.updateContactInfo(contactInfo.id, dataToSubmit);
      } else {
        await contactService.createContactInfo(dataToSubmit);
      }

      await fetchContactInfo();
      alert('Contact information saved successfully!');
    } catch (err: any) {
      setError(err?.message || 'Failed to save contact information');
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Contact Information Management</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-1">Alternative Phone Number</label>
            <input
              type="text"
              value={formData.phone_number2}
              onChange={(e) => setFormData({ ...formData, phone_number2: e.target.value })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-1">Instagram</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-1">Weekday Hours</label>
            <input
              type="text"
              value={formData.weekday_hours}
              onChange={(e) => setFormData({ ...formData, weekday_hours: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
              placeholder="e.g. 09:00 - 17:00"
            />
          </div>

          <div>
            <label className="block mb-1">Saturday Hours</label>
            <input
              type="text"
              value={formData.saturday_hours}
              onChange={(e) => setFormData({ ...formData, saturday_hours: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
              placeholder="e.g. 10:00 - 15:00"
            />
          </div>

          <div>
            <label className="block mb-1">Sunday Hours</label>
            <input
              type="text"
              value={formData.sunday_hours}
              onChange={(e) => setFormData({ ...formData, sunday_hours: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
              placeholder="e.g. Closed"
            />
          </div>

          <div>
            <label className="block mb-1">Latitude</label>
            <input
              type="text"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
              placeholder="e.g. -6.2088"
            />
          </div>

          <div>
            <label className="block mb-1">Longitude</label>
            <input
              type="text"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
              placeholder="e.g. 106.8456"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Contact Information'}
        </button>
      </form>
    </div>
  );
}