import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Ticket, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { bookVirtualToken } from '../lib/queueService';
import { calculateWaitTimeRange, formatWaitDuration } from '../lib/queuePrediction';
import AuthModal from './AuthModal';
import TokenConfirmationModal from './TokenConfirmationModal';

export default function FacilityModal({ facility, onClose, onJoinQueueSuccess }) {
  const { currentUser, isSupabaseConfigured } = useAuth();
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);
  const [visitorName, setVisitorName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setVisitorName(currentUser.fullName);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!facility) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    if (isSupabaseConfigured && !currentUser) {
      setErrorBanner('Authentication Required: Please sign in or register to book your virtual queue token.');
      setAuthModalOpen(true);
      return;
    }

    setErrorBanner('');
    setLoading(true);

    try {
      const newToken = await bookVirtualToken({
        facilityId: facility.id,
        facilityName: facility.name,
        category: facility.category,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        visitorName: visitorName.trim() || currentUser?.fullName || 'Citizen',
        phone: phone.trim(),
        priority
      });

      // STRICT PERSISTENCE CONFIRMATION: Only render success if Supabase confirms token creation
      setGeneratedToken(newToken);
      if (onJoinQueueSuccess) {
        onJoinQueueSuccess(newToken);
      }
    } catch (err) {
      // CLEAR any previously generated token to avoid fake success
      setGeneratedToken(null);
      setErrorBanner(err.message || 'Failed to book queue token.');
      if (err.message?.includes('Unauthenticated') || err.message?.includes('AuthenticationRequired')) {
        setAuthModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (generatedToken) {
    return (
      <TokenConfirmationModal
        isOpen={Boolean(generatedToken)}
        token={generatedToken}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl my-8 overflow-hidden">
        
        {/* Header */}
        <div className="relative p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {facility.category}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                {facility.district || facility.location?.split(',')[1]?.trim() || 'Tamil Nadu'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{facility.name}</h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {facility.address || facility.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {facility.operatingHours}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                {facility.phone}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {/* Error Banner */}
          {errorBanner && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Booking Restriction:</strong>
                <span>{errorBanner}</span>
              </div>
            </div>
          )}

          {/* Generated Token Success Banner */}
          {generatedToken && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-xs animate-fadeIn">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Virtual Token Generated Successfully!</span>
                  </div>
                  <h4 className="text-3xl font-black tracking-wider text-emerald-900 font-mono">
                    Token #{generatedToken.tokenNumber}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Service: <strong>{generatedToken.serviceName}</strong> • For: <strong>{generatedToken.visitorName}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-700 block font-medium">Est. Call Window</span>
                  <span className="text-lg font-bold text-emerald-800">{generatedToken.estimatedCallTime}</span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5">({generatedToken.peopleAhead} ahead)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-700">Your token is active in the live tracking panel.</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}

          {/* Service Selection Step */}
          {!selectedService && !generatedToken && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Select Service to Join ({(facility.services || []).length})</span>
                </h3>
                <span className="text-xs text-slate-400 font-semibold">Step 1 of 2</span>
              </div>

              <div className="space-y-2.5">
                {(facility.services || []).map((service) => {
                  const activeCounters = (facility.counters || []).filter(c => c.status === 'active' || c.status === 'busy').length || 1;
                  const range = calculateWaitTimeRange(2, service.averageServiceMinutes, activeCounters);

                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex-1 pr-4">
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                          {service.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{service.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            Avg {service.averageServiceMinutes} mins
                          </span>
                          <span>•</span>
                          <span className="text-blue-700 font-medium">Est. Wait: {range.formattedRange}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Booking Confirmation Step */}
          {selectedService && !generatedToken && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Selected Service:</span>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedService.name}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Change Service
                </button>
              </div>

              {/* Authentication Status Notification */}
              {isSupabaseConfigured && !currentUser && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Sign in required to save and confirm your virtual token in Supabase.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 text-xs cursor-pointer shadow-xs"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {currentUser && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Booking with verified account: <strong>{currentUser.fullName}</strong></span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700">{currentUser.email}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Visitor Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                  placeholder="e.g. Anand Sundaram"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (For Turn SMS Notifications)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Queue Priority Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${priority === 'normal' ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <input
                      type="radio"
                      name="priority"
                      value="normal"
                      checked={priority === 'normal'}
                      onChange={() => setPriority('normal')}
                      className="text-blue-600"
                    />
                    <span>Normal Queue</span>
                  </label>
                  <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-semibold ${priority === 'senior' ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <input
                      type="radio"
                      name="priority"
                      value="senior"
                      checked={priority === 'senior'}
                      onChange={() => setPriority('senior')}
                      className="text-blue-600"
                    />
                    <span>Senior Citizen / Special</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-cyan-200" />
                  <span>{loading ? 'Confirming Token in Supabase...' : 'Confirm Virtual Token'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
