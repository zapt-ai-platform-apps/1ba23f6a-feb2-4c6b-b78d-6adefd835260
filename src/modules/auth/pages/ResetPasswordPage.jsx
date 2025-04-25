import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useForm } from 'react-hook-form';

export default function ResetPasswordPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const password = watch('password');
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    if (!token) {
      setServerError('Token reset password tidak ditemukan');
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      await resetPassword(token, data.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 frost-card my-8">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-frost-800">Link Reset Password Tidak Valid</h2>
          <p className="mt-2 text-red-600">
            Token reset password tidak ditemukan. Silakan meminta link reset password baru.
          </p>
          <div className="mt-6">
            <Link to="/forgot-password" className="btn-primary">
              Minta Link Reset Password Baru
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 frost-card my-8">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-frost-800">Password Berhasil Diubah!</h2>
          <p className="mt-2 text-warlord-600">
            Password Anda telah berhasil diubah. Anda akan dialihkan ke halaman login dalam beberapa detik.
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
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="frost-form-group">
          <label htmlFor="password" className="frost-label">Password Baru</label>
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
          <label htmlFor="confirmPassword" className="frost-label">Konfirmasi Password Baru</label>
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
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn-primary w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="frost-loading mr-2"></span>
                <span>Mengubah Password...</span>
              </>
            ) : 'Ubah Password'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm text-warlord-600">
        <Link to="/login" className="text-frost-600 hover:text-frost-700">
          &larr; Kembali ke halaman login
        </Link>
      </div>
    </div>
  );
}