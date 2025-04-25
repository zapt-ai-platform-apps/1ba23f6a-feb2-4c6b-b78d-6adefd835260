import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';

export default function VerifyPage() {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Token verifikasi tidak ditemukan');
      return;
    }
    
    const verify = async () => {
      setIsVerifying(true);
      try {
        await verifyEmail(token);
        setVerificationStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage(error.message);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verify();
  }, [token, verifyEmail, navigate]);
  
  if (verificationStatus === 'loading' || isVerifying) {
    return (
      <div className="max-w-md mx-auto p-6 frost-card my-8">
        <div className="text-center">
          <div className="frost-loading frost-loading-lg mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">Memverifikasi Email</h2>
          <p className="mt-2 text-warlord-600">Mohon tunggu, sedang memproses verifikasi...</p>
        </div>
      </div>
    );
  }
  
  if (verificationStatus === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 frost-card my-8">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-frost-800">Verifikasi Berhasil!</h2>
          <p className="mt-2 text-warlord-600">
            Email Anda telah terverifikasi. Anda sekarang dapat login ke akun Anda.
            Anda akan dialihkan ke halaman login dalam beberapa detik.
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
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold mt-4 text-frost-800">Verifikasi Gagal</h2>
        <p className="mt-2 text-red-600">{errorMessage || 'Terjadi kesalahan saat memverifikasi email Anda.'}</p>
        <div className="mt-6 flex flex-col space-y-3">
          <Link to="/register" className="btn-primary">
            Daftar Ulang
          </Link>
          <Link to="/" className="btn-secondary">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}