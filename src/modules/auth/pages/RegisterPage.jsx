import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const roleOptions = [
    { value: 'Tank', label: 'Tank' },
    { value: 'Marksman', label: 'Marksman' },
    { value: 'Mage', label: 'Mage' },
    { value: 'Assassin', label: 'Assassin' },
    { value: 'Support', label: 'Support' }
  ];
  
  const password = watch('password');
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      await registerUser(data);
      setSuccess(true);
      window.scrollTo(0, 0);
      setTimeout(() => {
        navigate('/login', { state: { fromRegister: true } });
      }, 3000);
    } catch (error) {
      setServerError(error.message);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 frost-card my-8">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-frost-800">Pendaftaran Berhasil!</h2>
          <p className="mt-2 text-warlord-600">
            Silahkan cek email Anda untuk verifikasi akun. 
            Anda akan diarahkan ke halaman login dalam beberapa detik.
          </p>
          <div className="mt-6">
            <Link to="/login" className="btn-primary">
              Ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6 frost-card my-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Anggota Frost Warlord</h1>
      
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}
      
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
            {...register('email', { 
              required: 'Email wajib diisi',
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                message: 'Email tidak valid' 
              }
            })}
          />
          {errors.email && <p className="frost-error">{errors.email.message}</p>}
        </div>
        
        <div className="frost-form-group">
          <label htmlFor="password" className="frost-label">Password</label>
          <input 
            id="password"
            type="password" 
            className="frost-input"
            {...register('password', { 
              required: 'Password wajib diisi',
              minLength: { value: 8, message: 'Password minimal 8 karakter' },
              pattern: { 
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
                message: 'Password harus mengandung huruf besar, huruf kecil, dan angka' 
              }
            })}
          />
          {errors.password && <p className="frost-error">{errors.password.message}</p>}
        </div>
        
        <div className="frost-form-group">
          <label htmlFor="confirmPassword" className="frost-label">Konfirmasi Password</label>
          <input 
            id="confirmPassword"
            type="password" 
            className="frost-input"
            {...register('confirmPassword', { 
              required: 'Konfirmasi password wajib diisi',
              validate: value => value === password || 'Password tidak cocok'
            })}
          />
          {errors.confirmPassword && <p className="frost-error">{errors.confirmPassword.message}</p>}
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
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn-primary w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="frost-loading mr-2"></span>
                <span>Mendaftar...</span>
              </>
            ) : 'Daftar Sekarang'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm text-warlord-600">
        Sudah punya akun? <Link to="/login" className="text-frost-600 hover:text-frost-700">Masuk di sini</Link>
      </div>
    </div>
  );
}