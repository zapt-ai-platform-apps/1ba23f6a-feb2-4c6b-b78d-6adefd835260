import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useForm } from 'react-hook-form';
import * as Sentry from '@sentry/browser';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', message: '' });
  
  const roleOptions = [
    { value: 'Tank', label: 'Tank' },
    { value: 'Marksman', label: 'Marksman' },
    { value: 'Mage', label: 'Mage' },
    { value: 'Assassin', label: 'Assassin' },
    { value: 'Support', label: 'Support' }
  ];
  
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('phone', user.phone);
      setValue('role', user.role);
      setValue('profilePicture', user.profilePicture || '');
    }
  }, [user, setValue]);
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setUpdateMessage({ type: '', message: '' });
    
    try {
      await updateProfile(data);
      setUpdateMessage({ 
        type: 'success', 
        message: 'Profil berhasil diperbarui!' 
      });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error updating profile:', error);
      Sentry.captureException(error);
      setUpdateMessage({ 
        type: 'error', 
        message: error.message || 'Gagal memperbarui profil.' 
      });
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="frost-loading frost-loading-lg"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-orbitron font-bold mb-6">Profil Saya</h1>
      
      {updateMessage.message && (
        <div className={`mb-6 p-4 rounded-md ${
          updateMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {updateMessage.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="frost-card p-6">
            <h2 className="text-xl font-bold mb-4">Edit Profil</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="frost-form-group">
                <label htmlFor="name" className="frost-label">Nama Lengkap</label>
                <input 
                  id="name"
                  type="text" 
                  className="frost-input"
                  {...register('name', { 
                    required: 'Nama lengkap wajib diisi',
                    minLength: { value: 3, message: 'Nama terlalu pendek' }
                  })}
                />
                {errors.name && <p className="frost-error">{errors.name.message}</p>}
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="phone" className="frost-label">Nomor HP</label>
                <input 
                  id="phone"
                  type="tel" 
                  className="frost-input"
                  {...register('phone', { 
                    required: 'Nomor HP wajib diisi',
                    pattern: { 
                      value: /^(\+62|62|0)[0-9]{8,15}$/, 
                      message: 'Format nomor HP tidak valid' 
                    }
                  })}
                />
                {errors.phone && <p className="frost-error">{errors.phone.message}</p>}
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="email" className="frost-label">Email</label>
                <input 
                  id="email"
                  type="email" 
                  className="frost-input"
                  value={user.email}
                  disabled
                />
                <p className="text-xs text-warlord-500 mt-1">Email tidak dapat diubah</p>
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="role" className="frost-label">Role dalam Tim</label>
                <select 
                  id="role"
                  className="frost-input"
                  {...register('role', { required: 'Role wajib dipilih' })}
                >
                  <option value="">-- Pilih Role --</option>
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.role && <p className="frost-error">{errors.role.message}</p>}
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="profilePicture" className="frost-label">URL Foto Profil (opsional)</label>
                <input 
                  id="profilePicture"
                  type="text" 
                  className="frost-input"
                  placeholder="https://example.com/your-image.jpg"
                  {...register('profilePicture')}
                />
              </div>
              
              <div className="mt-6">
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
                  ) : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="frost-card p-6">
            <h2 className="text-xl font-bold mb-4">Informasi Akun</h2>
            
            <div className="flex flex-col items-center mb-6">
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-frost-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-frost-600 flex items-center justify-center text-white text-4xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <h3 className="text-lg font-bold mt-3">{user.name}</h3>
              <p className="text-frost-600">{user.role}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-warlord-500">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-warlord-500">Nomor HP</p>
                <p>{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-warlord-500">Bergabung Pada</p>
                <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-warlord-500">Status</p>
                <p className="bg-green-100 text-green-800 inline-block px-2 py-1 rounded-full text-xs font-medium">
                  Aktif
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}