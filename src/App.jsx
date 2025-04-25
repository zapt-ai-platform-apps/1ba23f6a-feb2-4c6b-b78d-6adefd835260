import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/modules/auth/AuthProvider';
import ProtectedRoute from '@/modules/auth/ProtectedRoute';

// Pages
import HomePage from '@/modules/core/pages/HomePage';
import RegisterPage from '@/modules/auth/pages/RegisterPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import VerifyPage from '@/modules/auth/pages/VerifyPage';
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import ProfilePage from '@/modules/dashboard/pages/ProfilePage';
import SchedulePage from '@/modules/dashboard/pages/SchedulePage';
import TeamsPage from '@/modules/dashboard/pages/TeamsPage';
import MatchesPage from '@/modules/dashboard/pages/MatchesPage';
import UploadsPage from '@/modules/dashboard/pages/UploadsPage';
import BlogPage from '@/modules/blog/pages/BlogPage';
import BlogPostPage from '@/modules/blog/pages/BlogPostPage';
import ChatPage from '@/modules/chat/pages/ChatPage';
import NotFoundPage from '@/modules/core/pages/NotFoundPage';

// Layout components
import Layout from '@/modules/core/components/Layout';
import DashboardLayout from '@/modules/dashboard/components/DashboardLayout';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="verify" element={<VerifyPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
          </Route>
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="uploads" element={<UploadsPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
          
          {/* 404 and fallback routes */}
          <Route path="404" element={<Layout><NotFoundPage /></Layout>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <div className="zapt-badge">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer">
            Made on ZAPT
          </a>
        </div>
      </AuthProvider>
    </Router>
  );
}