import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/dashboard/profile', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { path: '/dashboard/schedule', label: 'Jadwal', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/dashboard/teams', label: 'Tim', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { path: '/dashboard/matches', label: 'Pertandingan', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { path: '/dashboard/uploads', label: 'Uploads', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { path: '/dashboard/chat', label: 'Chat Tim', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ];
  
  return (
    <div className="min-h-screen bg-frost-50">
      {/* Top navbar for mobile */}
      <div className="md:hidden bg-frost-800 text-white p-4 sticky top-0 z-40 shadow-md">
        <div className="flex justify-between items-center">
          <button 
            onClick={toggleMobileSidebar}
            className="p-2"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="font-orbitron text-lg font-bold">
            <span className="text-frost-300">FROST</span> WARLORD
          </div>
          <div className="h-6 w-6"></div> {/* Empty div for balance */}
        </div>
      </div>
      
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={closeMobileSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 z-40 h-screen bg-frost-800 text-white w-64
          md:sticky md:block md:h-screen
          transition-transform transform
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Sidebar header */}
          <div className="p-4 border-b border-frost-700">
            <div className="font-orbitron text-lg font-bold mb-4 md:mb-6 hidden md:block">
              <span className="text-frost-300">FROST</span> WARLORD
            </div>
            {user && (
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-frost-600 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-xs text-frost-300">{user.role}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar navigation */}
          <nav className="mt-4 px-3">
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 rounded-md
                      ${isActive 
                        ? 'bg-frost-700 text-white' 
                        : 'text-frost-100 hover:bg-frost-700 hover:text-white'}
                      transition-colors duration-200
                    `}
                    onClick={closeMobileSidebar}
                    end={item.path === '/dashboard'}
                  >
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Logout button */}
          <div className="mt-auto border-t border-frost-700 p-3 absolute bottom-0 w-full">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-frost-100 hover:bg-frost-700 hover:text-white rounded-md transition-colors duration-200 cursor-pointer"
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}