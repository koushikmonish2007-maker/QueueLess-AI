import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Users, 
  ArrowRight, 
  Calendar, 
  ChevronRight, 
  Phone,
  Sparkles,
  Ban,
  Check,
  User,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  getCurrentState, 
  subscribeToQueueChanges, 
  cancelVirtualToken,
  getActiveUserToken 
} from '../lib/queueService';
import BookingWizardModal from '../components/BookingWizardModal';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { currentUser, isSupabaseConfigured } = useAuth();
  const { language, t } = useLanguage();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);
  
  // Cancel Confirmation Modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTargetToken, setCancelTargetToken] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Refresh active user token
  const refreshLiveToken = async () => {
    try {
      const liveToken = await getActiveUserToken(currentUser?.id);
      if (liveToken) {
        setTokens([liveToken]);
      } else {
        const state = getCurrentState();
        setTokens(state.tokens || []);
      }
    } catch (err) {
      console.warn('[CitizenDashboard] Live token check notice:', err.message);
      const state = getCurrentState();
      setTokens(state.tokens || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLiveToken();

    const cleanup = subscribeToQueueChanges('all', () => {
      refreshLiveToken();
    });

    return () => cleanup && cleanup();
  }, [currentUser?.id]);

  useEffect(() => {
    if (window.location.hash === '#my-token' || window.location.hash === '#my-token-section') {
      const el = document.getElementById('my-token-section');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200);
      }
    }
  }, []);

  const activeToken = tokens[0] || null;

  const handleConfirmCancel = async () => {
    if (!cancelTargetToken) return;
    setCancelLoading(true);
    try {
      await cancelVirtualToken(cancelTargetToken.id, 'Cancelled by citizen');
      setTokens([]);
      setCancelModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to cancel token');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      
      {/* ================= 1. WELCOMING HEADER ================= */}
      <section className="bg-gradient-to-b from-sky-100/70 via-teal-50/30 to-slate-50 pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-sky-100/80">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs sm:text-sm font-extrabold shadow-xs">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{language === 'ta' ? 'குடிமக்கள் போர்ட்டல்' : 'Citizen Self-Service Portal'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {t('welcomeHeader')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto">
            {currentUser?.fullName 
              ? `${language === 'ta' ? 'வணக்கம்' : 'Hello'}, ${currentUser.fullName}! ${t('welcomeSub')}`
              : t('welcomeSub')}
          </p>

          {/* ================= 2. THE THREE MAIN ACTIONS ================= */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            
            {/* ACTION 1: BOOK A TOKEN (LARGEST & MOST PROMINENT) */}
            <div className="rounded-3xl p-1 bg-gradient-to-tr from-teal-600 to-sky-400 shadow-xl shadow-teal-600/20 hover:scale-[1.02] transition-transform">
              <button
                type="button"
                onClick={() => setBookingWizardOpen(true)}
                className="w-full h-full p-6 sm:p-7 rounded-[22px] bg-white text-left flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-teal-200"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md mb-4">
                    <Ticket className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                    {language === 'ta' ? 'முதன்மைச் செயல்' : 'Primary Action'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
                    {t('bookTokenAction')}
                  </h2>
                  <p className="text-sm text-slate-600 font-medium mt-1.5 leading-relaxed">
                    {t('bookTokenActionDesc')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-base font-extrabold text-teal-700">
                  <span>{language === 'ta' ? 'இப்போதே தொடங்குக' : 'Start in 3 Steps'}</span>
                  <ArrowRight className="w-5 h-5 text-teal-600" />
                </div>
              </button>
            </div>

            {/* ACTION 2: MY TOKEN */}
            <button
              type="button"
              onClick={() => {
                if (!activeToken) {
                  setBookingWizardOpen(true);
                }
              }}
              className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 hover:border-teal-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group focus:outline-hidden focus:ring-4 focus:ring-teal-100"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {t('myTokenAction')}
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                  {activeToken 
                    ? `${language === 'ta' ? 'தற்போதைய எண்' : 'Active Token'}: #${activeToken.tokenNumber}`
                    : t('myTokenActionDesc')}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-teal-700">
                <span>{activeToken ? (language === 'ta' ? 'நிலவரம் கீழே உள்ளது' : 'Active Below') : (language === 'ta' ? 'டோக்கன் பெறுக' : 'Get a Token')}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>

            {/* ACTION 3: FIND FACILITIES */}
            <Link
              to="/facilities"
              className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 hover:border-teal-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group focus:outline-hidden focus:ring-4 focus:ring-teal-100"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {t('findFacilitiesAction')}
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                  {t('findFacilitiesActionDesc')}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-teal-700">
                <span>{language === 'ta' ? 'மையங்களைக் காண்க' : 'View Directory'}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ================= 3. CURRENT TOKEN STATUS SECTION ================= */}
      <main id="my-token-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <span className="w-3 h-3 rounded-full bg-teal-500 animate-ping inline-block mr-2" />
            Loading your verified token status...
          </div>
        ) : activeToken ? (
          <div className="rounded-3xl bg-white border-2 border-teal-500 shadow-xl p-6 sm:p-8 space-y-6">
            
            {/* Urgent Alert Banner if CALLED */}
            {activeToken.status === 'called' && (
              <div className="p-5 rounded-2xl bg-amber-500 text-white shadow-lg animate-pulse flex items-start gap-4">
                <AlertCircle className="w-8 h-8 shrink-0 text-white" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-wide">
                    {t('calledAlert')}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold mt-1">
                    {t('calledAlertDesc')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                  {activeToken.category || 'Public Service Center'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {activeToken.facilityName}
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-medium">
                  {activeToken.serviceName} • For: <strong>{activeToken.visitorName}</strong>
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm sm:text-base font-black ${
                  activeToken.status === 'called' 
                    ? 'bg-amber-100 text-amber-900 border-2 border-amber-300' 
                    : activeToken.status === 'in_service' 
                    ? 'bg-blue-100 text-blue-900 border-2 border-blue-300' 
                    : 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300'
                }`}>
                  <span className="w-3 h-3 rounded-full bg-current animate-ping" />
                  {activeToken.status === 'called' ? t('stepCalled') :
                   activeToken.status === 'in_service' ? t('stepInService') :
                   t('stepWaiting')}
                </span>
              </div>
            </div>

            {/* Giant Token Number & Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center py-2">
              
              {/* Token Number */}
              <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-800">
                  {language === 'ta' ? 'டோக்கன் எண்' : 'Your Token Number'}
                </span>
                <div className="text-5xl sm:text-6xl font-black font-mono text-teal-700 tracking-wider my-2">
                  #{activeToken.tokenNumber}
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  {language === 'ta' ? 'வரிசையில் பதிவு செய்யப்பட்டது' : 'Registered in live queue'}
                </span>
              </div>

              {/* People Ahead */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
                  {language === 'ta' ? 'முன்னால் உள்ளவர்கள்' : 'People Ahead of You'}
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 my-2">
                  {activeToken.peopleAhead ?? 0}
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  {t('peopleAheadCount')}
                </span>
              </div>

              {/* Estimated Wait */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
                  {t('estimatedWait')}
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 my-2">
                  ~{activeToken.estimatedWaitMinutes || 15}
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  {t('minsEstimate')}
                </span>
              </div>

            </div>

            {/* Assistance and Cancellation Options */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                Senior citizens and mothers with infants receive priority desk attention.
              </span>

              <button
                type="button"
                onClick={() => {
                  setCancelTargetToken(activeToken);
                  setCancelModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              >
                {t('cancelToken')}
              </button>
            </div>

          </div>
        ) : (
          /* Empty State: No Active Token */
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('noActiveTokenTitle')}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
              {t('noActiveTokenFriendly')}
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setBookingWizardOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base shadow-md shadow-teal-600/25 transition-all cursor-pointer"
              >
                <Ticket className="w-5 h-5" />
                <span>{t('bookTokenAction')}</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Global Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={bookingWizardOpen}
        onClose={() => setBookingWizardOpen(false)}
        onBookingSuccess={() => {
          refreshLiveToken();
        }}
      />

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Ban className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'ta' ? 'டோக்கனை ரத்து செய்யவா?' : 'Cancel Active Token?'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'ta' 
                ? 'உங்கள் வரிசை இடம் விடுவிக்கப்படும். நீங்கள் எப்போது வேண்டுமானாலும் புதிய டோக்கனைப் பெறலாம்.' 
                : 'Your reserved queue position will be released. You can book a new token at any time.'}
            </p>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
              >
                {language === 'ta' ? 'வேண்டாம்' : 'Keep Token'}
              </button>
              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleConfirmCancel}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs"
              >
                {cancelLoading ? 'Cancelling...' : (language === 'ta' ? 'ஆம், ரத்து செய்' : 'Yes, Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
