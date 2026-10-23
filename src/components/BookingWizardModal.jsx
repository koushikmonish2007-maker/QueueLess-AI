import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, 
  Building2, 
  Ticket, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  HeartHandshake, 
  Sparkles,
  AlertCircle,
  Search,
  Check,
  User,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { bookVirtualToken, getLiveFacilities } from '../lib/queueService';
import { MOCK_FACILITIES } from '../data/mockData';
import TokenConfirmationModal from './TokenConfirmationModal';

export default function BookingWizardModal({ 
  isOpen, 
  onClose, 
  initialFacility = null,
  onBookingSuccess 
}) {
  const { currentUser, isSupabaseConfigured } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Wizard Steps: 1 = Facility, 2 = Service, 3 = Confirm, 4 = Success
  const [step, setStep] = useState(initialFacility ? 2 : 1);
  const [facilities, setFacilities] = useState(MOCK_FACILITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Selected Data
  const [selectedFacility, setSelectedFacility] = useState(initialFacility || null);
  const [selectedService, setSelectedService] = useState(null);
  
  // Form Inputs
  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSeniorPriority, setIsSeniorPriority] = useState(false);
  
  // Booking state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [confirmedToken, setConfirmedToken] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  // Initialize facilities from Supabase
  useEffect(() => {
    let isMounted = true;
    getLiveFacilities().then((liveFacs) => {
      if (isMounted && liveFacs && liveFacs.length > 0) {
        setFacilities(liveFacs);
      }
    }).catch((err) => {
      console.warn('[BookingWizard] Facilities fetch notice:', err.message);
    });
    return () => { isMounted = false; };
  }, []);

  // Sync initialFacility or currentUser
  useEffect(() => {
    if (initialFacility) {
      setSelectedFacility(initialFacility);
      setStep(2);
    }
  }, [initialFacility]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setVisitorName(currentUser.fullName);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Filter facilities
  const filteredFacilities = facilities.filter(fac => {
    const matchesSearch = !searchQuery.trim() || 
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fac.district && fac.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fac.location && fac.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || fac.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Hospitals', 'Government', 'Banks', 'Colleges', 'Service Centers'];

  const handleSelectFacility = (fac) => {
    setSelectedFacility(fac);
    setSelectedService(null);
    setErrorBanner('');
    setStep(2);
  };

  const handleSelectService = (srv) => {
    setSelectedService(srv);
    setErrorBanner('');
    setStep(3);
  };

  const handleConfirmBooking = async (e) => {
    if (e) e.preventDefault();
    // Guard 1: Prevent duplicate bookings if user clicks repeatedly
    if (isSubmitting) return;
    if (!selectedFacility || !selectedService) return;

    if (isSupabaseConfigured && !currentUser) {
      setErrorBanner(language === 'ta' 
        ? 'டோக்கன் பெற முதலில் உள்நுழையவும். தயவுசெய்து கணக்கில் உள்நுழையவும்.' 
        : 'Authentication Required: Please sign in or register to book your verified queue token.');
      return;
    }

    if (!visitorName.trim()) {
      setErrorBanner(language === 'ta' 
        ? 'தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும்.' 
        : 'Please enter your full name to proceed.');
      return;
    }

    setErrorBanner('');
    setIsSubmitting(true);

    try {
      // Calls real Supabase RPC book_queue_token
      const token = await bookVirtualToken({
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.name,
        category: selectedFacility.category,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        visitorName: visitorName.trim(),
        phone: phone.trim(),
        priority: isSeniorPriority ? 'senior' : 'normal'
      });

      if (!token || !token.tokenNumber) {
        throw new Error('Database booking failed: No valid token confirmed by Supabase.');
      }

      // ONLY after Supabase confirms the booking was saved successfully:
      setConfirmedToken(token);
      setShowConfirmationPopup(true);
      if (onBookingSuccess) {
        onBookingSuccess(token);
      }
    } catch (err) {
      console.error('[BookingWizard] Booking failed:', err.message);
      // If booking fails, show a clear error message instead of a success popup!
      setConfirmedToken(null);
      setShowConfirmationPopup(false);
      setErrorBanner(err.message || 'Failed to book token. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSelectedFacility(null);
    setSelectedService(null);
    setConfirmedToken(null);
    setShowConfirmationPopup(false);
    setErrorBanner('');
    onClose();
  };

  // If Supabase booking confirmed, show the dedicated friendly Token Confirmation Popup
  if (showConfirmationPopup && confirmedToken) {
    return (
      <TokenConfirmationModal
        isOpen={showConfirmationPopup}
        token={confirmedToken}
        onClose={handleResetAndClose}
        onViewMyToken={() => {
          handleResetAndClose();
          if (location.pathname === '/citizen') {
            const tokenElem = document.getElementById('my-token-section');
            if (tokenElem) {
              tokenElem.scrollIntoView({ behavior: 'smooth' });
            }
          } else {
            navigate('/citizen');
          }
        }}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-wizard-title"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Friendly Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-50 via-teal-50/40 to-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h2 id="booking-wizard-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {t('bookTokenAction')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {step === 1 && t('step1Sub')}
                {step === 2 && t('step2Sub')}
                {step === 3 && t('step3Sub')}
                {step === 4 && t('bookingSuccessSub')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Friendly Progress Indicator Bar (Steps 1 to 3) */}
        {step <= 3 && (
          <div className="px-6 pt-4 pb-2 bg-white border-b border-slate-100">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {/* Step 1 Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > 1 ? 'bg-teal-600 text-white' : step === 1 ? 'bg-teal-700 text-white ring-4 ring-teal-100' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className={`text-xs sm:text-sm font-semibold hidden sm:inline ${step >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {language === 'ta' ? 'மையம்' : 'Facility'}
                </span>
              </div>

              <div className={`flex-1 h-1 mx-2 sm:mx-3 rounded-full ${step > 1 ? 'bg-teal-500' : 'bg-slate-200'}`} />

              {/* Step 2 Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > 2 ? 'bg-teal-600 text-white' : step === 2 ? 'bg-teal-700 text-white ring-4 ring-teal-100' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span className={`text-xs sm:text-sm font-semibold hidden sm:inline ${step >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {language === 'ta' ? 'சேவை' : 'Service'}
                </span>
              </div>

              <div className={`flex-1 h-1 mx-2 sm:mx-3 rounded-full ${step > 2 ? 'bg-teal-500' : 'bg-slate-200'}`} />

              {/* Step 3 Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step === 3 ? 'bg-teal-700 text-white ring-4 ring-teal-100' : 'bg-slate-100 text-slate-400'
                }`}>
                  3
                </div>
                <span className={`text-xs sm:text-sm font-semibold hidden sm:inline ${step === 3 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {language === 'ta' ? 'உறுதி செய்' : 'Confirm'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          
          {/* Error Banner */}
          {errorBanner && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="block font-bold">Notice:</strong>
                <span>{errorBanner}</span>
              </div>
            </div>
          )}

          {/* ================= STEP 1: CHOOSE FACILITY ================= */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ta' ? 'மருத்துவமனை அல்லது இடத்தை தேடுங்கள்...' : 'Search by hospital, center name, or district...'}
                    className="w-full pl-11 pr-4 py-3 text-base rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition-all shadow-xs"
                  />
                </div>

                {/* Category Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['All', 'Hospitals', 'Government', 'Banks'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-teal-700 text-white shadow-xs font-bold' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'All' ? (language === 'ta' ? 'அனைத்தும்' : 'All') :
                       cat === 'Hospitals' ? (language === 'ta' ? 'மருத்துவமனை' : 'Hospitals') :
                       cat === 'Government' ? (language === 'ta' ? 'அரசு சேவை' : 'Government') :
                       cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facility Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {filteredFacilities.map((fac) => (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => handleSelectFacility(fac)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md hover:bg-teal-50/20 text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800">
                          {fac.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          {fac.district || 'Tamil Nadu'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                        {fac.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {fac.description || fac.address}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-teal-700">
                      <span>{language === 'ta' ? 'தேர்வு செய்க' : 'Select this Center'}</span>
                      <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 2: CHOOSE SERVICE ================= */}
          {step === 2 && selectedFacility && (
            <div className="space-y-4 animate-fadeIn">
              {/* Selected Facility Reminder Badge */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                      {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட மையம்' : 'Selected Facility'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{selectedFacility.name}</h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-teal-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'மாற்று' : 'Change'}
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                {t('step2Title')}:
              </h3>

              {/* Service Cards List */}
              <div className="space-y-3">
                {(selectedFacility.services || []).map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleSelectService(srv)}
                    className="w-full p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 text-left transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-xs"
                  >
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {srv.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                        {srv.description}
                      </p>
                      {srv.requirements && (
                        <p className="text-xs text-amber-700 font-medium mt-1.5 bg-amber-50 px-2.5 py-1 rounded-lg inline-block">
                          {language === 'ta' ? 'தேவையானவை:' : 'Bring with you:'} {srv.requirements}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-teal-600" />
                        ~{srv.averageServiceMinutes || 15} {t('mins')}
                      </span>
                      <div className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs sm:text-sm font-bold group-hover:bg-teal-700 transition-colors flex items-center gap-1 shadow-xs">
                        <span>{language === 'ta' ? 'தேர்வு செய்' : 'Choose'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONFIRM BOOKING ================= */}
          {step === 3 && selectedFacility && selectedService && (
            <form onSubmit={handleConfirmBooking} className="space-y-5 animate-fadeIn">
              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    {language === 'ta' ? 'முன்பதிவு சுருக்கம்' : 'Booking Summary'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    {language === 'ta' ? 'சேவையை மாற்று' : 'Edit Service'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block">{language === 'ta' ? 'மையம்' : 'Facility'}:</span>
                    <strong className="text-slate-900 text-base">{selectedFacility.name}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">{language === 'ta' ? 'சேவை' : 'Service'}:</span>
                    <strong className="text-slate-900 text-base">{selectedService.name}</strong>
                  </div>
                </div>
              </div>

              {/* Citizen Details Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                    {t('fullNameLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder={t('fullNamePlaceholder')}
                      className="w-full pl-11 pr-4 py-3 text-base rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-4 focus:ring-teal-100 font-medium transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                    {t('phoneLabel')}
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('phonePlaceholder')}
                      className="w-full pl-11 pr-4 py-3 text-base rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-4 focus:ring-teal-100 font-medium transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Senior Citizen / Special Assistance Toggle */}
                <div 
                  onClick={() => setIsSeniorPriority(!isSeniorPriority)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSeniorPriority 
                      ? 'bg-amber-50/80 border-amber-400 text-amber-950' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSeniorPriority ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="block text-sm sm:text-base font-bold">
                        {t('seniorCitizen')}
                      </strong>
                      <span className="text-xs text-slate-600">
                        {t('seniorCitizenDesc')}
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={isSeniorPriority}
                    onChange={(e) => setIsSeniorPriority(e.target.checked)}
                    className="w-6 h-6 text-teal-600 rounded-lg border-slate-300 focus:ring-teal-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Buttons: Back & Confirm */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 rounded-2xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>{t('backToStep')}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'ta' ? 'டோக்கன் பதிவு செய்யப்படுகிறது...' : 'Booking your secure token...'}</span>
                    </div>
                  ) : (
                    <>
                      <Ticket className="w-6 h-6" />
                      <span>{t('confirmAndBook')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 4: FRIENDLY SUCCESS SCREEN ================= */}
          {step === 4 && confirmedToken && (
            <div className="py-6 sm:py-8 text-center space-y-5 animate-fadeIn">
              {/* Big Celebration Icon */}
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t('bookingSuccess')}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-md mx-auto">
                  {language === 'ta' 
                    ? 'உங்கள் மெய்நிகர் வரிசை டோக்கன் உருவாக்கப்பட்டது. வரிசை நிலவரம் உடனுக்குடன் புதுப்பிக்கப்படும்.'
                    : 'Your virtual token has been verified. You can comfortably relax at home or nearby until called.'}
                </p>
              </div>

              {/* Big Prominent Token Badge */}
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-b from-teal-50 to-white border-2 border-teal-500 shadow-md">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-teal-800">
                  {language === 'ta' ? 'உங்கள் டோக்கன் எண்' : 'Your Token Number'}
                </span>
                <div className="text-5xl sm:text-6xl font-black font-mono text-teal-700 tracking-wider my-2">
                  #{confirmedToken.tokenNumber}
                </div>
                <div className="text-xs sm:text-sm text-slate-700 font-semibold space-y-1 pt-2 border-t border-teal-100">
                  <p><strong>{confirmedToken.facilityName}</strong></p>
                  <p className="text-slate-500">{confirmedToken.serviceName} • {confirmedToken.visitorName}</p>
                </div>
              </div>

              {/* Friendly Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 px-6 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>{t('viewMyToken')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setSelectedFacility(null);
                    setSelectedService(null);
                    setConfirmedToken(null);
                  }}
                  className="px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  {t('bookAnotherToken')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
