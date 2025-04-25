import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={isScrolled} />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Call to action section - show only on homepage if not authenticated */}
      {location.pathname === '/' && !isAuthenticated && (
        <section className="bg-frost-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-orbitron mb-6">Gabung Sekarang dan Tunjukkan Skillmu!</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Jadilah bagian dari tim e-sport Mobile Legends yang berkomitmen untuk menjadi yang terdepan di panggung kompetitif.
            </p>
            <Link to="/register" className="btn-primary text-lg py-3 px-8">
              Daftar Jadi Anggota
            </Link>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
}