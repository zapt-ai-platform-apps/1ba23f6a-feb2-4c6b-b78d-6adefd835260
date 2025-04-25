import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { forgotPassword } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 frost-card my-8">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-frost-800">Email Terkirim</h2>
          <p className="mt-2 text-warlord-600">
            Jika alamat email Anda terdaftar di sistem kami, Anda akan menerima email dengan instruksi untuk mereset password.
            Silakan periksa kotak masuk dan folder spam Anda.
          </p>
          <div className="mt-6">
            <Link to="/login" className="btn-primary">
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6 frost-card my-8">
      <h1 className="text-2xl font-bold mb-6">Lupa Password</h1>
      
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}
      
      <p className="mb-4 text-warlord-600">
        Masukkan alamat email yang Anda gunakan untuk mendaftar, dan kami akan mengirimkan Anda tautan untuk mereset password.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
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
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn-primary w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="frost-loading mr-2"></span>
                <span>Mengirim...</span>
              </>
            ) : 'Kirim Link Reset Password'}
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