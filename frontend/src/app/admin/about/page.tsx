/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { aboutService, TeamMember, TimelineEvent } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus, AlertCircle } from 'lucide-react';

interface TeamFormState {
    id?: number;
    name: string;
    role: string;
    quote: string | null;
    member_type: 'FOUNDER' | 'TEAM';
    order: number;
    image: File | string | null;
  }
  
  interface TimelineFormState {
    id?: number;
    year: string;
    title: string;
    description: string;
    order: number;
    image: File | string | null;
  }

const AboutPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'team' | 'timeline'>('team');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [founders, setFounders] = useState<TeamMember[]>([]);

  const defaultTeamForm: TeamFormState = {
    name: '',
    role: '',
    quote: null,
    member_type: 'TEAM',
    order: 0,
    image: null
  };

  const defaultTimelineForm: TimelineFormState = {
    year: '',
    title: '',
    description: '',
    order: 0,
    image: null
  };

  const [teamFormData, setTeamFormData] = useState<TeamFormState>(defaultTeamForm);
  const [timelineFormData, setTimelineFormData] = useState<TimelineFormState>(defaultTimelineForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [founderData, teamData, timelineData] = await Promise.all([
        aboutService.getFounders(),     // Ambil data Founder
        aboutService.getTeamMembers(),  // Ambil data Team Member
        aboutService.getTimelineEvents() // Ambil data Timeline
      ]);
      
      setFounders(founderData);
      setTeamMembers(teamData);
      setTimelineEvents(timelineData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'team' | 'timeline') => {
    const file = e.target.files?.[0] || null;
    if (type === 'team') {
      setTeamFormData(prev => ({ ...prev, image: file }));
    } else {
      setTimelineFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append text fields
      formData.append('name', teamFormData.name);
      formData.append('role', teamFormData.role);
      if (teamFormData.quote) {
        formData.append('quote', teamFormData.quote);
      }
      formData.append('member_type', teamFormData.member_type);
      formData.append('order', teamFormData.order.toString());

      // Handle image
      if (teamFormData.image instanceof File) {
        formData.append('image', teamFormData.image);
      }

      if (teamFormData.id) {
        await aboutService.updateTeamMember(teamFormData.id, formData);
      } else {
        await aboutService.createTeamMember(formData);
      }

      setShowAddModal(false);
      setTeamFormData(defaultTeamForm);
      await fetchData();
    } catch (error) {
      console.error('Error submitting team data:', error);
      setError('Gagal menyimpan data tim');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
  
      // Pastikan semua field terisi
      if (!timelineFormData.year || !timelineFormData.title || !timelineFormData.description) {
        setError('Semua field harus diisi');
        return;
      }
  
      // Append semua field dengan nama yang benar
      formData.append('year', timelineFormData.year);
      formData.append('title', timelineFormData.title);
      formData.append('description', timelineFormData.description);
      formData.append('order', timelineFormData.order.toString());
  
      // Handle image jika ada
      if (timelineFormData.image instanceof File) {
        formData.append('image', timelineFormData.image);
      }
  
      // Log data yang akan dikirim untuk debugging
      console.log('Form Data to be sent:', {
        year: timelineFormData.year,
        title: timelineFormData.title,
        description: timelineFormData.description,
        order: timelineFormData.order,
        image: timelineFormData.image
      });
  
      if (timelineFormData.id) {
        await aboutService.updateTimelineEvent(timelineFormData.id, formData);
      } else {
        await aboutService.createTimelineEvent(formData);
      }
  
      setShowAddModal(false);
      setTimelineFormData(defaultTimelineForm);
      await fetchData();
    } catch (error: any) {
      console.error('Error submitting timeline data:', error);
      // Tampilkan error yang lebih spesifik
      if (error.response?.data) {
        setError(`Gagal menyimpan data timeline: ${JSON.stringify(error.response.data)}`);
      } else {
        setError('Gagal menyimpan data timeline');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, type: 'team' | 'timeline') => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      setIsLoading(true);
      if (type === 'team') {
        await aboutService.deleteTeamMember(id);
      } else {
        await aboutService.deleteTimelineEvent(id);
      }
      await fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      setError('Gagal menghapus data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (type: 'team' | 'timeline', data: TeamMember | TimelineEvent) => {
    if (type === 'team') {
      const member = data as TeamMember;
      setTeamFormData({
        id: member.id,
        name: member.name,
        role: member.role,
        quote: member.quote,
        member_type: member.member_type,
        order: member.order,
        image: member.image
      });
    } else {
      const event = data as TimelineEvent;
      setTimelineFormData({
        id: event.id,
        year: event.year,
        title: event.title,
        description: event.description,
        order: event.order,
        image: event.image
      });
    }
    setShowAddModal(true);
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
                Kembali ke Dashboard
              </Link>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-tertiary hover:bg-primary text-black px-4 py-2 rounded-lg border-4 border-black font-bold flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah {activeTab === 'team' ? 'Anggota Tim' : 'Timeline'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('team')}
              className={`${
                activeTab === 'team'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-bold text-lg`}
            >
              Tim Kami
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`${
                activeTab === 'timeline'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-bold text-lg`}
            >
              Perjalanan Kami
            </button>
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

       {/* Content */}
<div className="mt-6">
  {activeTab === 'team' ? (
    <>
      {/* Founders Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pendiri Buckery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {founders.map((member) => (
            <div key={member.id} className="bg-white rounded-lg border-4 border-black p-4">
              {member.image && (
                <div className="mb-4">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-2">{member.role}</p>
              <p className="text-gray-500 italic mb-4">{member.quote}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Urutan: {member.order}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setTeamFormData(member);
                      setShowAddModal(true);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id!, 'team')}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Tim Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg border-4 border-black p-4">
              {member.image && (
                <div className="mb-4">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-2">{member.role}</p>
              <p className="text-gray-500 italic mb-4">{member.quote}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Urutan: {member.order}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setTeamFormData(member);
                      setShowAddModal(true);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id!, 'team')}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <div className="space-y-6">
      {timelineEvents.map((event) => (
        <div key={event.id} className="bg-white rounded-lg border-4 border-black p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block bg-tertiary text-black px-3 py-1 rounded-full text-sm font-bold mb-2">
                {event.year}
              </span>
              <h3 className="text-xl font-bold">{event.title}</h3>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setTimelineFormData(event);
                  setShowAddModal(true);
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id!, 'timeline')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Hapus
              </button>
            </div>
          </div>
          <p className="text-gray-600">{event.description}</p>
          {event.image && (
            <div className="mt-4">
              <Image 
                src={event.image}
                alt={event.title}
                width={200}
                height={120}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          <span className="text-sm text-gray-500 mt-4 block">Urutan: {event.order}</span>
        </div>
      ))}
    </div>
  )}
</div>
      </div>

      {/* Add/Edit Modal */}
{showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8 relative">
      <h2 className="text-2xl font-bold mb-4 sticky top-0 bg-white">
        {activeTab === 'team' ? 'Tambah/Edit Anggota Tim' : 'Tambah/Edit Timeline'}
      </h2>
      
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <form onSubmit={activeTab === 'team' ? handleTeamSubmit : handleTimelineSubmit}>
          {/* Form fields based on active tab */}
          {activeTab === 'team' ? (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Nama</label>
                <input
                  type="text"
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Role</label>
                <input
                  type="text"
                  value={teamFormData.role}
                  onChange={(e) => setTeamFormData({...teamFormData, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Quote</label>
                <textarea
                  value={teamFormData.quote || ''} 
                  onChange={(e) => setTeamFormData({...teamFormData, quote: e.target.value || null})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Tipe Anggota</label>
                <select
                  value={teamFormData.member_type}
                  onChange={(e) => setTeamFormData({...teamFormData, member_type: e.target.value as 'FOUNDER' | 'TEAM'})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black"
                >
                  <option value="FOUNDER">Founder</option>
                  <option value="TEAM">Team Member</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Tahun</label>
                <input
                  type="text"
                  value={timelineFormData.year}
                  onChange={(e) => setTimelineFormData({...timelineFormData, year: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Judul</label>
                <input
                  type="text"
                  value={timelineFormData.title}
                  onChange={(e) => setTimelineFormData({...timelineFormData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Deskripsi</label>
                <textarea
                  value={timelineFormData.description}
                  onChange={(e) => setTimelineFormData({...timelineFormData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black"
                  rows={3}
                  required
                />
              </div>
            </div>
          )}

          {/* Common fields for both forms */}
          <div className="mt-4">
            <label className="block font-bold mb-1">Urutan</label>
            <input
              type="number"
              value={activeTab === 'team' ? teamFormData.order : timelineFormData.order}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (activeTab === 'team') {
                  setTeamFormData({...teamFormData, order: value});
                } else {
                  setTimelineFormData({...timelineFormData, order: value});
                }
              }}
              className="w-full px-4 py-2 rounded-lg border-2 border-black"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block font-bold mb-1">Gambar</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (activeTab === 'team') {
                    setTeamFormData({...teamFormData, image: file});
                  } else {
                    setTimelineFormData({...timelineFormData, image: file});
                  }
                }
              }}
              accept="image/*"
              className="w-full px-4 py-2 rounded-lg border-2 border-black"
            />
          </div>
        </form>
      </div>

      {/* Footer buttons - sticky at bottom */}
      <div className="sticky bottom-0 bg-white pt-4 mt-6 flex justify-end space-x-4 border-t">
        <button
          type="button"
          onClick={() => {
            setShowAddModal(false);
            if (activeTab === 'team') {
              setTeamFormData(defaultTeamForm);
            } else {
              setTimelineFormData(defaultTimelineForm);
            }
          }}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-lg border-4 border-black font-bold"
        >
          Batal
        </button>
        <button
          onClick={activeTab === 'team' ? handleTeamSubmit : handleTimelineSubmit}
          type="button"
          className="px-4 py-2 bg-tertiary hover:bg-primary text-black rounded-lg border-4 border-black font-bold"
        >
          {activeTab === 'team' ? 
            (teamFormData.id ? 'Update Anggota' : 'Tambah Anggota') : 
            (timelineFormData.id ? 'Update Timeline' : 'Tambah Timeline')
          }
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AboutPage;