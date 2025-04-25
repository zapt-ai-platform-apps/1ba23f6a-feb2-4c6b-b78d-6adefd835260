import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="text-center px-4">
        <h1 className="text-9xl font-orbitron font-bold text-frost-300">404</h1>
        <h2 className="text-4xl font-bold text-frost-700 mt-4 mb-6">Halaman Tidak Ditemukan</h2>
        <p className="text-lg text-warlord-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak ditemukan atau sudah tidak tersedia.
        </p>
        <Link to="/" className="btn-primary px-8 py-3">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}