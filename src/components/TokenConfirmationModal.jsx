import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Ticket, Building2, Layers, User, X, ArrowRight, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * TokenConfirmationModal
 * 
 * Friendly, senior-accessible Token Booking Confirmation Popup.
 * Displayed strictly after Supabase confirms that a real queue token has been created.
 * 
 * @param {{
 *   isOpen: boolean,
 *   token: {
 *     tokenNumber: string,
 *     facilityName: string,
 *     serviceName: string,
 *     visitorName?: string,
 *     priority?: string,
 *     estimatedCallTime?: string,
 *     peopleAhead?: number
 *   } | null,
 *   onClose: () => void,
 *   onViewMyToken?: (token: any) => void
 * }} props
 */
export default function TokenConfirmationModal({ 
  isOpen, 
  token, 
  onClose,
  onViewMyToken 
}) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Close on Escape key for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !token) return null;

  const handleViewToken = () => {
    onClose();
    if (onViewMyToken) {
      onViewMyToken(token);
    } else {
      // If already on /citizen, scroll to the token section smoothly
      if (location.pathname === '/citizen') {
        const tokenElem = document.getElementById('my-token-section');
        if (tokenElem) {
          tokenElem.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to the Citizen Dashboard My Token section
        navigate('/citizen');
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-desc"
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-emerald-500 shadow-2xl p-6 sm:p-8 text-center animate-scaleUp overflow-hidden my-auto focus:outline-hidden"
        tabIndex={-1}
      >
        
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top Close Button (Accessible touch target) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-2xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          aria-label={t('closeBtn')}
        >
          <X className="w-6 h-6" />
        </button>

        {/* 1. Green Checkmark Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-5 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-600 stroke-[2.5]" />
        </div>

        {/* 2. Heading: "Token Confirmed!" */}
        <h2 
          id="confirmation-modal-title"
          className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
        >
          {t('tokenConfirmedHeading')}
        </h2>

        {/* 3. Description: "Your token has been booked successfully." */}
        <p 
          id="confirmation-modal-desc"
          className="text-base sm:text-lg text-slate-600 mt-2 font-medium leading-relaxed max-w-sm mx-auto"
        >
          {t('tokenConfirmedSub')}
        </p>

        {/* 4. ACTUAL Token Number in large bold text */}
        <div className="my-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-teal-50 to-sky-50/40 border-2 border-teal-500 shadow-inner">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-800 block">
            {t('tokenNumberLabel')}
          </span>
          <div className="text-5xl sm:text-6xl font-black font-mono text-teal-700 tracking-wider my-2.5 select-all">
            #{token.tokenNumber}
          </div>
          {token.priority === 'senior' && (
            <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
              <span>{t('seniorAssistanceBadge')}</span>
            </div>
          )}
        </div>

        {/* 5. Facility Name and Selected Service */}
        <div className="text-left bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3.5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('facilityLabel')}
              </span>
              <strong className="text-base sm:text-lg font-extrabold text-slate-900 block truncate">
                {token.facilityName || 'Public Service Center'}
              </strong>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-slate-200/80">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('serviceLabel')}
              </span>
              <strong className="text-base font-bold text-slate-800 block truncate">
                {token.serviceName || 'Standard Service'}
              </strong>
            </div>
          </div>

          {token.visitorName && (
            <div className="flex items-start gap-3 pt-3 border-t border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('fullNameLabel')}
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-700 block truncate">
                  {token.visitorName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 6 & 7. Large Accessible Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleViewToken}
            className="w-full py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-99 focus:ring-4 focus:ring-teal-200 focus:outline-hidden"
          >
            <Ticket className="w-5 h-5" />
            <span>{t('viewMyTokenBtn')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base transition-colors cursor-pointer focus:ring-2 focus:ring-slate-300 focus:outline-hidden"
          >
            {t('closeBtn')}
          </button>
        </div>

      </div>
    </div>
  );
}
