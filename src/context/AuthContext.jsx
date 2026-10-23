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
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (isSupabaseConfigured && supabase) {
      // 1. Get initial session on application mount
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn('[AuthContext] Initial session check error:', error.message);
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      }).catch((err) => {
        if (!isMounted) return;
        console.warn('[AuthContext] Session retrieval failed:', err.message);
        setCurrentUser(null);
        setLoading(false);
      });

      // 2. Listen to Auth State Changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      // Supabase is unconfigured: strictly unauthenticated! Never use mock auto-login in production.
      console.info('[AuthContext] Supabase unconfigured or offline. Awaiting valid credentials.');
      setCurrentUser(null);
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

      const role = data?.role || authUser.user_metadata?.role || 'citizen';
      const fullName = data?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Citizen User';
      const phone = data?.phone || authUser.user_metadata?.phone || '';
      const facilityId = data?.facility_id || null;

      setCurrentUser({
        id: authUser.id,
        email: authUser.email,
        fullName,
        phone,
        role,
        facilityId,
        isLiveSession: true
      });
    } catch (err) {
      console.warn('[AuthContext] Profile fetch notice:', err.message);
      setCurrentUser({
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Citizen User',
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
    if (!isSupabaseConfigured || !supabase) {
      const configErr = new Error('Supabase authentication is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.');
      setAuthError(configErr.message);
      throw configErr;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    if (data?.user) {
      await fetchUserProfile(data.user);
    }
    return data;
  }

  // Sign Up with email, password, and metadata
  async function signUp(email, password, fullName, role = 'citizen') {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      const configErr = new Error('Supabase authentication is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.');
      setAuthError(configErr.message);
      throw configErr;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), role }
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
  }

  // Sign Out
  async function signOut() {
    setAuthError(null);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[AuthContext] Supabase signOut warning:', err.message);
      }
    }
    setCurrentUser(null);
  }

  // Switch demo persona (Requires live Supabase credentials)
  async function switchDemoRole(targetRole) {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase authentication is required. Mock persona switching is disabled in production.');
    }
    const demoEmail = targetRole === 'facility_admin' ? DEMO_USERS.facility_admin.email : DEMO_USERS.citizen.email;
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
  }

  // Reset password via Supabase Auth email
  async function resetPassword(email) {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      const configErr = new Error('Supabase authentication is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.');
      setAuthError(configErr.message);
      throw configErr;
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    return data;
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
