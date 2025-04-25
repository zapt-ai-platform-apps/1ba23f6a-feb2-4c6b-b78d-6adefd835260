import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useForm } from 'react-hook-form';
import * as Sentry from '@sentry/browser';

export default function SchedulePage() {
  const { user, getToken } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      Sentry.captureException(err);
      setError('Gagal memuat jadwal. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const eventData = {
        ...data,
        startTime: new Date(`${data.eventDate}T${data.startTime}`).toISOString(),
        endTime: new Date(`${data.eventDate}T${data.endTime}`).toISOString()
      };
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh events list
      fetchEvents();
      reset();
      setFormVisible(false);
    } catch (err) {
      console.error('Error creating event:', err);
      Sentry.captureException(err);
      setError('Gagal membuat jadwal baru. Silakan coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleForm = () => {
    setFormVisible(!formVisible);
    if (!formVisible) {
      reset();
      setError(null);
    }
  };
  
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.startTime).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(event);
    return acc;
  }, {});
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-orbitron font-bold">Jadwal Tim</h1>
        {user && (
          <button 
            onClick={toggleForm} 
            className="btn-primary flex items-center cursor-pointer"
          >
            {formVisible ? (
              <>
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tutup Form
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Jadwal
              </>
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Form to add new schedule */}
      {formVisible && (
        <div className="frost-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Tambah Jadwal Baru</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="frost-form-group">
                <label htmlFor="title" className="frost-label">Judul Kegiatan</label>
                <input 
                  id="title"
                  type="text" 
                  className="frost-input"
                  placeholder="Contoh: Latihan Rutin / Turnamen"
                  {...register('title', { 
                    required: 'Judul kegiatan wajib diisi' 
                  })}
                />
                {errors.title && <p className="frost-error">{errors.title.message}</p>}
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="eventType" className="frost-label">Jenis Kegiatan</label>
                <select 
                  id="eventType"
                  className="frost-input"
                  {...register('eventType', { 
                    required: 'Jenis kegiatan wajib dipilih' 
                  })}
                >
                  <option value="">-- Pilih Jenis --</option>
                  <option value="training">Latihan</option>
                  <option value="tournament">Turnamen</option>
                  <option value="meeting">Rapat Tim</option>
                  <option value="other">Lainnya</option>
                </select>
                {errors.eventType && <p className="frost-error">{errors.eventType.message}</p>}
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="eventDate" className="frost-label">Tanggal</label>
                <input 
                  id="eventDate"
                  type="date" 
                  className="frost-input"
                  {...register('eventDate', { 
                    required: 'Tanggal wajib diisi' 
                  })}
                />
                {errors.eventDate && <p className="frost-error">{errors.eventDate.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="frost-form-group">
                  <label htmlFor="startTime" className="frost-label">Waktu Mulai</label>
                  <input 
                    id="startTime"
                    type="time" 
                    className="frost-input"
                    {...register('startTime', { 
                      required: 'Waktu mulai wajib diisi' 
                    })}
                  />
                  {errors.startTime && <p className="frost-error">{errors.startTime.message}</p>}
                </div>
                
                <div className="frost-form-group">
                  <label htmlFor="endTime" className="frost-label">Waktu Selesai</label>
                  <input 
                    id="endTime"
                    type="time" 
                    className="frost-input"
                    {...register('endTime', { 
                      required: 'Waktu selesai wajib diisi' 
                    })}
                  />
                  {errors.endTime && <p className="frost-error">{errors.endTime.message}</p>}
                </div>
              </div>
              
              <div className="frost-form-group md:col-span-2">
                <label htmlFor="description" className="frost-label">Deskripsi (opsional)</label>
                <textarea 
                  id="description"
                  className="frost-input"
                  rows="3"
                  placeholder="Deskripsi atau detail tambahan tentang kegiatan"
                  {...register('description')}
                ></textarea>
              </div>
              
              <div className="frost-form-group">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    className="h-4 w-4 text-frost-600 rounded border-frost-300 focus:ring-frost-500"
                    {...register('isPublic')}
                    defaultChecked={true}
                  />
                  <span className="ml-2">Tampilkan di Publik</span>
                </label>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={toggleForm}
                className="btn-secondary cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="btn-primary cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="frost-loading mr-2"></span>
                    <span>Menyimpan...</span>
                  </>
                ) : 'Simpan Jadwal'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="frost-loading frost-loading-lg"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="frost-card p-6 text-center">
          <p className="text-warlord-600">Belum ada jadwal yang tersedia.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(eventsByDate).map(([date, dayEvents]) => (
            <div key={date} className="frost-card overflow-hidden">
              <div className="bg-frost-800 text-white p-4">
                <h2 className="font-orbitron">{date}</h2>
              </div>
              <div className="divide-y divide-frost-100">
                {dayEvents.map(event => (
                  <div key={event.id} className="p-4 hover:bg-frost-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-frost-800">{event.title}</h3>
                        <div className="flex items-center text-sm text-warlord-600 mt-1">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(event.startTime).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', minute: '2-digit'
                          })} - {new Date(event.endTime).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                        {event.description && (
                          <p className="mt-2 text-warlord-700">{event.description}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        event.eventType === 'training' ? 'bg-blue-100 text-blue-800' :
                        event.eventType === 'tournament' ? 'bg-amber-100 text-amber-800' :
                        event.eventType === 'meeting' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.eventType === 'training' ? 'Latihan' :
                         event.eventType === 'tournament' ? 'Turnamen' :
                         event.eventType === 'meeting' ? 'Rapat' :
                         'Lainnya'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}