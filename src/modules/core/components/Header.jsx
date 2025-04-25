import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';

export default function Header({ isScrolled }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-frost-900 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-orbitron font-bold text-white">
              <span className="text-frost-300">FROST</span> WARLORD
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`} end>
              Beranda
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`}>
              Blog
            </NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`}>
                  Dashboard
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className="btn-outline text-white border-white hover:bg-white hover:text-frost-700 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`}>
                  Login
                </NavLink>
                <NavLink to="/register" className="btn-primary cursor-pointer">
                  Daftar
                </NavLink>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 cursor-pointer"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-frost-900 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <NavLink 
              to="/" 
              className={({ isActive }) => `block py-2 nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
              end
            >
              Beranda
            </NavLink>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => `block py-2 nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Blog
            </NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => `block py-2 nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-white hover:text-red-300 transition duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => `block py-2 nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="block py-2 text-frost-300 font-bold hover:text-frost-200 transition duration-200"
                  onClick={closeMobileMenu}
                >
                  Daftar
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}