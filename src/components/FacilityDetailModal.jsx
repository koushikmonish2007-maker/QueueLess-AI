import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  Ticket, 
  Layers, 
  FileText, 
  AlertCircle, 
  Building2, 
  Award,
  Sparkles,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useLanguage } from '../context/LanguageContext';

export default function FacilityDetailModal({
  facility,
  isOpen,
  onClose,
  onBookToken,
  onClaimFacility
}) {
  const { t } = useLanguage();

  if (!isOpen || !facility) return null;

  const isBookingEnabled = facility.isBookingEnabled && facility.onboardingStatus === 'booking_enabled';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image & badges */}
        <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden shrink-0">
          <img
            src={facility.imageUrl}
            alt={facility.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-xs">
              {facility.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-sky-200 border border-slate-700 shadow-xs">
              {facility.state}
            </span>
          </div>

          {/* Bottom Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={facility.onboardingStatus} size="sm" />
              {facility.subcategory && (
                <span className="text-xs font-medium text-slate-300">
                  • {facility.subcategory}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {facility.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Key Contact & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Address</span>
                <span className="font-medium text-slate-900">{facility.address || facility.location}</span>
                {facility.pincode && (
                  <span className="text-xs text-slate-500 block mt-0.5">PIN: {facility.pincode} • District: {facility.district}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Operational Hours</span>
                <span className="font-medium text-slate-900">{facility.operatingHours}</span>
                <span className="text-xs text-slate-500 block mt-0.5">Standard Public Timings</span>
              </div>
            </div>

            {facility.phone && (
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Helpline / Phone</span>
                  <a href={`tel:${facility.phone}`} className="font-medium text-teal-700 hover:underline">
                    {facility.phone}
                  </a>
                </div>
              </div>
            )}

            {facility.officialPortalUrl && (
              <div className="flex items-start gap-2.5">
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('officialWebsite')}</span>
                  <a 
                    href={facility.officialPortalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-teal-700 hover:underline flex items-center gap-1"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {facility.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                About this Center
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {facility.description}
              </p>
            </div>
          )}

          {/* Status Explanation Card */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            isBookingEnabled
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-sky-50/70 border-sky-200 text-slate-900'
          }`}>
            {isBookingEnabled ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-sky-700 mt-0.5 shrink-0" />
            )}
            <div className="text-sm">
              <span className="font-extrabold block mb-0.5">
                {isBookingEnabled ? 'Virtual Queue Active' : 'Walk-in Physical Service Center'}
              </span>
              <p className="leading-relaxed text-xs sm:text-sm">
                {isBookingEnabled
                  ? 'This facility is an active QueueLess partner. You can book an online virtual queue token right now and receive live counter arrival alerts on your mobile.'
                  : t('walkInNotice')}
              </p>
            </div>
          </div>

          {/* Services & Document Requirements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Available Services & Document Requirements ({(facility.services || []).length})</span>
              </h4>
              <span className="text-xs text-slate-500">Carry required originals</span>
            </div>

            <div className="space-y-2.5">
              {(facility.services || []).map((srv) => (
                <div 
                  key={srv.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {srv.name}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 self-start sm:self-auto">
                      ~{srv.averageServiceMinutes || 15} mins per person
                    </span>
                  </div>

                  {srv.description && (
                    <p className="text-xs text-slate-600 mb-1.5">
                      {srv.description}
                    </p>
                  )}

                  {srv.requirements && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50/80 border border-amber-200/60 p-2 rounded-xl mt-1">
                      <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span><strong>Required Documents:</strong> {srv.requirements}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Official Source Provenance Footer Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Official Source Provenance</span>
            </div>
            <p>
              <strong>Registry Source:</strong> {facility.sourceName || 'National Public Service Registry'}
            </p>
            <p>
              <strong>Open License:</strong> {facility.sourceLicense || 'Government Open Data License - India (GODL)'}
            </p>
            {facility.lastSyncedAt && (
              <p>
                <strong>Last Verified:</strong> {new Date(facility.lastSyncedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onClaimFacility) onClaimFacility(facility);
            }}
            className="w-full sm:w-auto text-xs sm:text-sm font-bold text-slate-700 hover:text-teal-800 hover:underline flex items-center justify-center gap-1.5 py-2 px-3 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Are you staff? Claim this facility</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>

            {isBookingEnabled ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookToken(facility);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Token Now</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-500 bg-slate-200 border border-slate-300 cursor-not-allowed"
                title="Online booking disabled. Walk-in only."
              >
                <span>Walk-in Queue Only</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
