/**
 * @file AuthContext.jsx
 * QueueLess AI — Team GEN4X (INTELLATHON 2K26)
 * Supabase Authentication & Role-Based Access Control Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  citizen: {
    id: '00000000-0000-0000-0000-cit000000001',
    email: 'aditya.citizen@queueless.ai',
    fullName: 'Aditya Sharma',
    phone: '+91 98765 43210',
    role: 'citizen',
    facilityId: null
  },
  facility_admin: {
    id: '00000000-0000-0000-0000-adm000000001',
    email: 'dr.mehta.admin@apexhealth.org',
    fullName: 'Dr. Aris Mehta (Facility Administrator)',
    phone: '+91 98220 11223',
    role: 'facility_admin',
    facilityId: '00000000-0000-0000-0000-000000000001' // Apex Hospital
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(isSupabaseConfigured ? null : DEMO_USERS.citizen);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      }).catch(() => {
        setCurrentUser(null);
        setLoading(false);
      });

      // 2. Listen to Auth State Changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline/Demo Mode: Initialize with demo citizen
      setCurrentUser(DEMO_USERS.citizen);
      setLoading(false);
    }
  }, []);

  async function fetchUserProfile(authUser) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCurrentUser({
        id: authUser.id,
        email: authUser.email,
        fullName: data?.full_name || authUser.user_metadata?.full_name || 'Citizen User',
        phone: data?.phone || authUser.user_metadata?.phone || '',
        role: data?.role || authUser.user_metadata?.role || 'citizen',
        facilityId: data?.facility_id || null,
        isLiveSession: true
      });
    } catch (err) {
      console.warn('[AuthContext] Profile fetch notice:', err.message);
      setCurrentUser({
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        phone: authUser.user_metadata?.phone || '',
        role: authUser.user_metadata?.role || 'citizen',
        facilityId: null,
        isLiveSession: true
      });
    } finally {
      setLoading(false);
    }
  }

  // Sign In with email & password
  async function signIn(email, password) {
    setAuthError(null);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        throw error;
      }
      if (data?.user) {
        await fetchUserProfile(data.user);
      }
      return data;
    } else {
      // Local demo mock sign in
      if (email.includes('admin')) {
        setCurrentUser(DEMO_USERS.facility_admin);
      } else {
        setCurrentUser({ ...DEMO_USERS.citizen, email });
      }
      return { user: currentUser };
    }
  }

  // Sign Up with email, password, and metadata
  async function signUp(email, password, fullName, role = 'citizen') {
    setAuthError(null);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role }
        }
      });
      if (error) {
        setAuthError(error.message);
        throw error;
      }
      if (data?.session?.user) {
        await fetchUserProfile(data.session.user);
      }
      return data;
    } else {
      // Local demo mock sign up
      const newUser = {
        id: `usr-${Date.now()}`,
        email,
        fullName,
        role,
        facilityId: null
      };
      setCurrentUser(newUser);
      return { user: newUser };
    }
  }

  // Sign Out
  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  }

  // Switch demo persona (Citizen vs Facility Admin)
  async function switchDemoRole(targetRole) {
    setAuthError(null);
    if (isSupabaseConfigured && supabase) {
      const demoEmail = targetRole === 'facility_admin' ? DEMO_USERS.facility_admin.email : DEMO_USERS.citizen.email;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: 'Password123!'
        });
        if (error) {
          throw error;
        }
        if (data?.user) {
          await fetchUserProfile(data.user);
        }
      } catch (err) {
        console.warn(`[AuthContext] Supabase demo auth failed (${err.message}), activating local demo persona:`, targetRole);
        setCurrentUser(DEMO_USERS[targetRole] || DEMO_USERS.facility_admin);
      }
    } else {
      if (targetRole === 'facility_admin') {
        setCurrentUser(DEMO_USERS.facility_admin);
      } else {
        setCurrentUser(DEMO_USERS.citizen);
      }
    }
  }

  // Reset password via Supabase Auth email
  async function resetPassword(email) {
    setAuthError(null);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) {
        setAuthError(error.message);
        throw error;
      }
      return data;
    } else {
      return { success: true };
    }
  }

  const value = {
    currentUser,
    isSupabaseConfigured,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    switchDemoRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
