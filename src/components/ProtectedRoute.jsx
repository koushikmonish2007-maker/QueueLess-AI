import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 animate-pulse flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <div className="absolute -inset-2 rounded-2xl border border-cyan-400/30 animate-ping opacity-40" />
        </div>
        <h3 className="text-lg font-bold tracking-wide text-white mb-2">QueueLess AI 2.0</h3>
        <p className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Verifying security session...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    // Preserve intended destination path in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const isAuthorized =
      requiredRole === 'admin' || requiredRole === 'facility_admin'
        ? currentUser.role === 'facility_admin' || currentUser.role === 'super_admin'
        : currentUser.role === requiredRole;

    if (!isAuthorized) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-slate-200 shadow-xl text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              The Admin Portal is restricted to authorized facility staff and officers. Your current account role is <strong className="font-semibold text-slate-800 capitalize">"{currentUser.role.replace('_', ' ')}"</strong>.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Citizen Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return children ? children : <Outlet />;
}
