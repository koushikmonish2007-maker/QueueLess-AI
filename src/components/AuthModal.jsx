import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, isSupabaseConfigured, signIn, signUp, signOut } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isRegister) {
        await signUp(email, password, fullName, role);
        setSuccessMessage('Account created successfully!');
      } else {
        await signIn(email, password);
        setSuccessMessage('Signed in successfully!');
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl glass-panel border border-brand-blue/30 shadow-2xl bg-navy-900 p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-cyan">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {currentUser ? 'User Profile & Identity' : isRegister ? 'Create Citizen Account' : 'Sign In to QueueLess AI'}
              </h3>
              <span className="text-[11px] text-slate-400">
                {isSupabaseConfigured ? 'Supabase Authentication Connected' : 'Phase 2 Local Identity Sandbox'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Logged In Display */}
        {currentUser ? (
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Active Persona</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan border border-brand-blue/30 capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{currentUser.fullName}</h4>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-blue hover:bg-brand-blue-light text-white transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form for Sign In / Sign Up */
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aditya Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="citizen">Citizen User (Book & Track Virtual Queues)</option>
                  <option value="facility_admin">Facility Administrator (Manage Counters & Call Queues)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-brand-blue hover:bg-brand-blue-light transition-all shadow-glow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMessage('');
                }}
                className="text-xs text-brand-cyan hover:underline"
              >
                {isRegister ? 'Already registered? Sign in here' : 'Need an account? Sign up here'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
