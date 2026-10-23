import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Clock,
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const { currentUser, signUp, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const destination = location.state?.from?.pathname || '/';

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (currentUser && !authLoading) {
      navigate(destination, { replace: true });
    }
  }, [currentUser, authLoading, navigate, destination]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessInfo(null);

    // Form Validations
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const data = await signUp(email.trim(), password, fullName.trim(), role);
      
      // Check whether session was immediately returned or email confirmation is pending
      if (data?.session) {
        // Immediate login!
        navigate(destination, { replace: true });
      } else {
        // Email confirmation is required by Supabase project settings
        setSuccessInfo({
          email: email.trim(),
          requiresEmailConfirmation: true
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Premium SaaS Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-7 sm:p-9 relative overflow-hidden">
          {/* Subtle top gradient accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />

          {/* Success with Email Confirmation Notice */}
          {successInfo ? (
            <div className="text-center py-4 animate-fadeIn">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Account Created!</h2>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                We have registered your account for <strong className="text-slate-900">{successInfo.email}</strong>.
              </p>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-left text-xs text-blue-900 mb-6 space-y-2">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Email Verification Required:</strong>
                    <p className="text-slate-600 mt-1">
                      Please check your inbox and click the confirmation link to activate your account.
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2 bg-white/70 p-2 rounded-lg border border-blue-100">
                      <strong>Developer Note:</strong> If testing in a sandbox without an active SMTP server, confirm the user in your <strong>Supabase Dashboard &gt; Authentication &gt; Users</strong> table or disable "Confirm email" in Auth Settings.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Create Account
                </h1>
                <p className="text-xs text-slate-500 mt-1.5">
                  Get started with QueueLess AI virtual queue management.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-0.5">Registration Issue:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Aditya Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${role === 'citizen' ? 'bg-blue-50/70 border-blue-400 text-blue-900 ring-1 ring-blue-400' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'}`}>
                      <input
                        type="radio"
                        name="role"
                        value="citizen"
                        checked={role === 'citizen'}
                        onChange={() => setRole('citizen')}
                        className="text-blue-600"
                      />
                      <span>Citizen</span>
                    </label>
                    <label className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${role === 'facility_admin' ? 'bg-blue-50/70 border-blue-400 text-blue-900 ring-1 ring-blue-400' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'}`}>
                      <input
                        type="radio"
                        name="role"
                        value="facility_admin"
                        checked={role === 'facility_admin'}
                        onChange={() => setRole('facility_admin')}
                        className="text-blue-600"
                      />
                      <span>Facility Staff</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 active:scale-[0.99]"
                >
                  <span>{loading ? 'Creating Supabase Account...' : 'Create Account'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Link to Login */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-cyan-600 transition-colors"
                >
                  Sign In here
                </Link>
              </div>
            </>
          )}

        </div>

        {/* Security Guarantee Micro-Badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Supabase Authentication &amp; Encrypted Credentials</span>
        </div>

      </div>
    </div>
  );
}
