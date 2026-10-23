import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import FacilitiesPage from './pages/FacilitiesPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HowItWorksPage from './pages/HowItWorksPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Directs authenticated users to the appropriate dashboard:
 * - Administrators (facility_admin, super_admin) -> /admin
 * - Citizens -> LandingPage (citizen experience)
 */
function RootRouteHandler() {
  const { currentUser } = useAuth();
  if (currentUser?.role === 'facility_admin' || currentUser?.role === 'super_admin') {
    return <Navigate to="/admin" replace />;
  }
  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Private Routes - requires authenticated session */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RootRouteHandler />} />
              <Route path="facilities" element={<FacilitiesPage />} />
              <Route path="citizen" element={<CitizenDashboard />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={['facility_admin', 'super_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all route inside layout */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Global Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

