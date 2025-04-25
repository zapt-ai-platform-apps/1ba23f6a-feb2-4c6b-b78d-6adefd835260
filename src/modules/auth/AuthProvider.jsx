import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user data exists in local storage
    const storedUser = localStorage.getItem('frostWarlordUser');
    const storedToken = localStorage.getItem('frostWarlordToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        Sentry.captureException(err);
        localStorage.removeItem('frostWarlordUser');
        localStorage.removeItem('frostWarlordToken');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data and token
      localStorage.setItem('frostWarlordUser', JSON.stringify(data.user));
      localStorage.setItem('frostWarlordToken', data.session.access_token);
      
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('frostWarlordUser');
    localStorage.removeItem('frostWarlordToken');
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('frostWarlordToken');
  };

  const verifyEmail = async (token) => {
    try {
      setError(null);
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      return data;
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      return data;
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      return data;
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const token = getToken();
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update stored user data
      const updatedUser = { ...user, ...data };
      localStorage.setItem('frostWarlordUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return data;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}