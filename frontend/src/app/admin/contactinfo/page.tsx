/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { contactService } from '@/services/api';
import type { ContactInfo } from '@/services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AlertCircle, Loader2, ArrowLeft, MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';

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

        <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-black"
                      placeholder="-6.2088"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-black"
                      placeholder="106.8456"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Alternative Phone</label>
                  <input
                    type="text"
                    value={formData.phone_number2}
                    onChange={(e) => setFormData({ ...formData, phone_number2: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    <Instagram className="w-4 h-4 inline mr-1" />
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Business Hours Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Business Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Weekday Hours</label>
                  <input
                    type="text"
                    value={formData.weekday_hours}
                    onChange={(e) => setFormData({ ...formData, weekday_hours: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    placeholder="09:00 - 17:00"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Saturday Hours</label>
                  <input
                    type="text"
                    value={formData.saturday_hours}
                    onChange={(e) => setFormData({ ...formData, saturday_hours: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    placeholder="10:00 - 15:00"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sunday Hours</label>
                  <input
                    type="text"
                    value={formData.sunday_hours}
                    onChange={(e) => setFormData({ ...formData, sunday_hours: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    placeholder="Closed"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-tertiary hover:bg-primary text-black rounded-lg border-4 border-black font-bold flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Contact Information'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}