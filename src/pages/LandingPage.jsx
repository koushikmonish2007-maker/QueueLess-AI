import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Ticket, 
  Search, 
  Calendar, 
  ChevronRight, 
  Phone,
  Sparkles,
  HeartHandshake,
  Check,
  Ban
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  getCurrentState, 
  subscribeToQueueChanges, 
  cancelVirtualToken,
  getActiveUserToken,
  getLiveFacilities
} from '../lib/queueService';
import { MOCK_FACILITIES } from '../data/mockData';
import BookingWizardModal from '../components/BookingWizardModal';

export default function LandingPage() {
  const { currentUser, isSupabaseConfigured } = useAuth();
  const { language, t } = useLanguage();

  // State
  const [activeToken, setActiveToken] = useState(null);
  const [facilitiesList, setFacilitiesList] = useState(MOCK_FACILITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);
  const [selectedFacilityForWizard, setSelectedFacilityForWizard] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const facilitiesRef = useRef(null);
  const activeTokenRef = useRef(null);

  // 1. Fetch live facilities
  useEffect(() => {
    let isMounted = true;
    getLiveFacilities().then((liveData) => {
      if (isMounted && liveData && liveData.length > 0) {
        setFacilitiesList(liveData);
      }
    }).catch(err => {
      console.warn('[LandingPage] Facilities fetch notice:', err.message);
    });
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch live active token
  const refreshActiveToken = async () => {
    try {
      const realToken = await getActiveUserToken(currentUser?.id);
      setActiveToken(realToken);
    } catch (err) {
      console.warn('[LandingPage] Active token fetch notice:', err.message);
      const state = getCurrentState();
      setActiveToken(state.tokens?.[0] || null);
    }
  };

  useEffect(() => {
    refreshActiveToken();
    const cleanup = subscribeToQueueChanges('all', () => {
      refreshActiveToken();
    });
    return () => cleanup && cleanup();
  }, [currentUser?.id]);

  // Open booking wizard for a specific facility
  const handleOpenWizardForFacility = (fac) => {
    setSelectedFacilityForWizard(fac);
    setBookingWizardOpen(true);
  };

  // Open booking wizard from top hero button
  const handleOpenWizardGeneral = () => {
    setSelectedFacilityForWizard(null);
    setBookingWizardOpen(true);
  };

  // Cancel active token
  const handleConfirmCancelToken = async () => {
    if (!activeToken) return;
    setIsCancelling(true);
    try {
      await cancelVirtualToken(activeToken.id, 'Cancelled by citizen');
      setActiveToken(null);
      setCancelModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to cancel token');
    } finally {
      setIsCancelling(false);
    }
  };

  // Filter facilities
  const filteredFacilities = facilitiesList.filter(fac => {
    const matchesSearch = !searchQuery.trim() || 
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fac.district && fac.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fac.location && fac.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || fac.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Hospitals', 'Government', 'Banks', 'Colleges', 'Service Centers'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      
      {/* ================= 1. WELCOMING HERO HEADER ================= */}
      <section className="bg-gradient-to-b from-sky-100/70 via-teal-50/30 to-slate-50 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-sky-100/80">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs sm:text-sm font-extrabold shadow-xs">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{language === 'ta' ? 'அனைவருக்கும் எளிய மெய்நிகர் வரிசை' : 'Effortless Virtual Queuing for All Citizens'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {t('welcomeHeader')}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {t('welcomeSub')}
          </p>

          {/* ================= 2. THE THREE MAIN ACTIONS ================= */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            
            {/* ACTION 1: BOOK A TOKEN (LARGEST & MOST PROMINENT) */}
            <div className="md:col-span-1 rounded-3xl p-1 bg-gradient-to-tr from-teal-600 to-sky-400 shadow-xl shadow-teal-600/20 hover:scale-[1.02] transition-transform">
              <button
                type="button"
                onClick={handleOpenWizardGeneral}
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
                if (activeToken && activeTokenRef.current) {
                  activeTokenRef.current.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleOpenWizardGeneral();
                }
              }}
              className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-teal-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group focus:outline-hidden focus:ring-4 focus:ring-teal-100"
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
                    ? `${language === 'ta' ? 'தற்போதைய டோக்கன் எண்' : 'Active Token'}: #${activeToken.tokenNumber}`
                    : t('myTokenActionDesc')}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-teal-700">
                <span>{activeToken ? (language === 'ta' ? 'நிலவரத்தைக் காண்க' : 'Check Status') : (language === 'ta' ? 'டோக்கன் பெறுக' : 'Get a Token')}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>

            {/* ACTION 3: FIND FACILITIES */}
            <button
              type="button"
              onClick={() => {
                if (facilitiesRef.current) {
                  facilitiesRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-teal-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group focus:outline-hidden focus:ring-4 focus:ring-teal-100"
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
                <span>{language === 'ta' ? 'மையங்களைப் பார்க்க' : 'Browse All Centers'}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* ================= 3. ACTIVE TOKEN STATUS SECTION ================= */}
      <section ref={activeTokenRef} id="my-token-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {activeToken ? (
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
                  {activeToken.category || 'Public Service'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {activeToken.facilityName}
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-medium">
                  {activeToken.serviceName} • For: <strong>{activeToken.visitorName}</strong>
                </p>
              </div>

              {/* Status Pill */}
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

            {/* Giant Token Number & Queue Metrics */}
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

            {/* Cancel Button Option */}
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Need to cancel? You can safely release this token anytime.
              </span>
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              >
                {t('cancelToken')}
              </button>
            </div>

          </div>
        ) : (
          /* Empty State: No Active Token */
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('noActiveTokenTitle')}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
              {t('noActiveTokenFriendly')}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenWizardGeneral}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base shadow-md shadow-teal-600/25 transition-all cursor-pointer"
              >
                <Ticket className="w-5 h-5" />
                <span>{t('bookTokenAction')}</span>
              </button>
            </div>
          </div>
        )}

      </section>

      {/* ================= 4. FIND FACILITIES SECTION ================= */}
      <section ref={facilitiesRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-700">
              {language === 'ta' ? 'தமிழ்நாடு மையங்கள்' : 'Participating Centers'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t('findFacilitiesAction')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a facility below to choose your doctor or government desk.
            </p>
          </div>

          {/* Simple Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'தேடுங்கள்...' : 'Search facility name...'}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-4 focus:ring-teal-100 shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? (language === 'ta' ? 'அனைத்து மையங்கள்' : 'All Centers') :
               cat === 'Hospitals' ? (language === 'ta' ? 'மருத்துவமனைகள்' : 'Hospitals') :
               cat === 'Government' ? (language === 'ta' ? 'அரசு மையங்கள்' : 'Government') :
               cat === 'Banks' ? (language === 'ta' ? 'வங்கிகள்' : 'Banks') :
               cat}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800">
                    {facility.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {facility.district || facility.location}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {facility.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  {facility.description || facility.address}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {facility.operatingHours}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    {facility.phone}
                  </span>
                </div>
              </div>

              {/* Big Book Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenWizardForFacility(facility)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-99"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{language === 'ta' ? 'இந்த மையத்தில் டோக்கன் பெறுக' : 'Book Token at this Center'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Global Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={bookingWizardOpen}
        onClose={() => setBookingWizardOpen(false)}
        initialFacility={selectedFacilityForWizard}
        onBookingSuccess={() => {
          refreshActiveToken();
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
                disabled={isCancelling}
                onClick={handleConfirmCancelToken}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs"
              >
                {isCancelling ? 'Cancelling...' : (language === 'ta' ? 'ஆம், ரத்து செய்' : 'Yes, Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
