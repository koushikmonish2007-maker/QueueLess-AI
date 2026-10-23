import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Clock,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { currentUser, signIn, loading: authLoading, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Determine destination path based on role and location state
  const resolveDestination = (user) => {
    const fromPath = location.state?.from?.pathname;
    const isAdmin = user?.role === 'facility_admin' || user?.role === 'super_admin';
    const defaultDashboard = isAdmin ? '/admin' : '/citizen';

    if (!fromPath || fromPath === '/login' || fromPath === '/signup' || fromPath === '/register' || fromPath === '/') {
      return defaultDashboard;
    }

    // Citizen attempting to access admin route should go to citizen dashboard instead
    if (fromPath.startsWith('/admin') && !isAdmin) {
      return '/citizen';
    }

    return fromPath + (location.state?.from?.search || '') + (location.state?.from?.hash || '');
  };

  // If already authenticated, redirect straight to appropriate dashboard
  useEffect(() => {
    if (currentUser && !authLoading) {
      navigate(resolveDestination(currentUser), { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  // Check URL query parameters for reset success notices
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reset') === 'success') {
      setInfoMessage('Password reset link sent or updated. Please sign in with your credentials.');
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setLoading(true);

    try {
      const data = await signIn(email.trim(), password);
      const user = data?.user || currentUser;
      navigate(resolveDestination(user), { replace: true });
    } catch (err) {
      let msg = err.message || 'Failed to authenticate. Please verify your credentials.';
      const lower = msg.toLowerCase();
      if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('unable to connect') || lower.includes('unable to reach')) {
        msg = 'Unable to connect to the authentication server. Please check your internet connection or verify network permissions.';
      } else if (lower.includes('invalid login credentials')) {
        msg = 'Invalid email address or password. Please check your credentials and try again.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 animate-pulse flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Clock className="w-8 h-8 text-cyan-400 animate-spin-slow" />
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

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-slate-50 px-4 sm:px-6 lg:px-8 py-10 font-sans selection:bg-cyan-500 selection:text-white relative">
      {/* Background subtle radial gradient accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.08),rgba(255,255,255,0))] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Logo & Tagline Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group mb-2 focus:outline-hidden">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform mb-3">
              <div className="w-full h-full bg-[#0c1322] rounded-[14px] flex items-center justify-center">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                Queue<span className="text-cyan-600">Less</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 tracking-wider">
                AI 2.0
              </span>
            </div>
          </Link>
          <p className="text-sm font-medium text-slate-500">
            Skip the Queue. Save Your Time.
          </p>
        </div>

        {/* Premium SaaS Login Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-7 sm:p-9 relative overflow-hidden">
          {/* Subtle top gradient accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />

          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 mt-1.5">
              Enter your email and password to access your dashboard.
            </p>
          </div>

          {/* Missing Supabase Configuration Notice */}
          {!isSupabaseConfigured && (
            <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Deployment Notice: Supabase Environment Not Configured</strong>
                <p className="text-amber-800 leading-relaxed">
                  Live authentication requires <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">VITE_SUPABASE_ANON_KEY</code>. Please set them in your deployment platform settings (e.g. Vercel / Netlify environment variables).
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1">
                <strong className="block font-bold mb-0.5">Authentication Issue:</strong>
                <span>{errorMessage}</span>
                {errorMessage.toLowerCase().includes('email not confirmed') && (
                  <p className="mt-2 text-[11px] text-rose-700 bg-rose-100/60 p-2 rounded-lg">
                    <strong>Tip:</strong> Email verification is enabled on your Supabase project. Either verify your email link or confirm the user in your <strong>Supabase Dashboard &gt; Authentication &gt; Users</strong> table.
                  </p>
                )}
                {(errorMessage.toLowerCase().includes('unable to connect') || errorMessage.toLowerCase().includes('network')) && (
                  <div className="mt-2 text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-lg border border-rose-200/60 space-y-1">
                    <p><strong>Troubleshooting Steps:</strong></p>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      <li>Verify your device has an active internet connection.</li>
                      <li>If using Brave Shields or an adblocker (e.g. uBlock Origin), try temporarily disabling it for localhost.</li>
                      <li>Ensure your Supabase project is active and not paused in your Supabase Dashboard.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Notice Banner */}
          {infoMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-cyan-600 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-cyan-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 active:scale-[0.99]"
            >
              <span>{loading ? 'Authenticating in Supabase...' : 'Sign In to Dashboard'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              className="font-bold text-blue-600 hover:text-cyan-600 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Security Guarantee Micro-Badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected by Supabase Row-Level Security &amp; JWT Verification</span>
        </div>

      </div>
    </div>
  );
}
