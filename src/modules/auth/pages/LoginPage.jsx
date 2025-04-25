import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  useEffect(() => {
    // Check if user came from registration page
    if (location.state?.fromRegister) {
      setRegistrationMessage('Pendaftaran berhasil! Silahkan cek email Anda untuk verifikasi akun sebelum login.');
    }
  }, [location]);
  
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      setServerError(error.message);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 frost-card my-8">
      <h1 className="text-2xl font-bold mb-6">Login Anggota Frost Warlord</h1>
      
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}
      
      {registrationMessage && (
        <div className="bg-frost-50 border border-frost-200 text-frost-700 px-4 py-3 rounded mb-4">
          {registrationMessage}
        </div>
      )}
      
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
        
        <div className="frost-form-group">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="frost-label">Password</label>
            <Link to="/forgot-password" className="text-sm text-frost-600 hover:text-frost-700">
              Lupa password?
            </Link>
          </div>
          <input 
            id="password"
            type="password" 
            className="frost-input"
            {...register('password', { 
              required: 'Password wajib diisi'
            })}
          />
          {errors.password && <p className="frost-error">{errors.password.message}</p>}
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
                <span>Masuk...</span>
              </>
            ) : 'Masuk'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm text-warlord-600">
        Belum punya akun? <Link to="/register" className="text-frost-600 hover:text-frost-700">Daftar di sini</Link>
      </div>
    </div>
  );
}