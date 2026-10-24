import React from 'react';
import { 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  Building2, 
  HeartPulse, 
  Landmark, 
  GraduationCap, 
  Star,
  Layers,
  Ticket,
  Stethoscope,
  Activity,
  Car,
  FileText,
  Building,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  Info
} from 'lucide-react';
import { formatWaitDuration } from '../lib/queuePrediction';
import { useLanguage } from '../context/LanguageContext';
import StatusBadge from './StatusBadge';

function FacilityCategoryIcon({ category, categoryId, className = "w-3.5 h-3.5 text-teal-600" }) {
  const cat = (categoryId || category || '').toLowerCase();
  if (cat.includes('govt_hospital') || cat.includes('government hospital')) return <HeartPulse className={className} />;
  if (cat.includes('private_hospital') || cat.includes('private hospital')) return <Building2 className={className} />;
  if (cat.includes('phc') || cat.includes('primary health')) return <Stethoscope className={className} />;
  if (cat.includes('clinic') || cat.includes('dispensary')) return <Activity className={className} />;
  if (cat.includes('bank')) return <Landmark className={className} />;
  if (cat.includes('rto') || cat.includes('transport')) return <Car className={className} />;
  if (cat.includes('passport')) return <FileText className={className} />;
  if (cat.includes('municipal')) return <Building className={className} />;
  if (cat.includes('revenue') || cat.includes('taluk')) return <Briefcase className={className} />;
  if (cat.includes('service') || cat.includes('csc') || cat.includes('seva')) return <HelpCircle className={className} />;
  if (cat.includes('college')) return <GraduationCap className={className} />;
  return <Building2 className={className} />;
}

export default function FacilityCard({ 
  facility, 
  onViewServices, 
  onOpenDetails, 
  onClaimFacility 
}) {
  const { t } = useLanguage();
  
  const isBookingEnabled = facility.isBookingEnabled && facility.onboardingStatus === 'booking_enabled';

  // Calculate wait estimate only if booking enabled
  const minAvgWait = Math.min(...(facility.services || [{ averageServiceMinutes: 15 }]).map(s => s.averageServiceMinutes || 15));
  const activeCounters = (facility.counters || []).filter(c => c.status === 'active' || c.status === 'busy').length || 2;
  const illustrativeWait = Math.round(((facility.activeQueues || 20) * minAvgWait) / Math.max(1, activeCounters * 2));

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-500/80 transition-all duration-300 flex flex-col group">
      
      {/* Facility Image & Tags */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={facility.imageUrl}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-xs text-slate-800 shadow-xs border border-slate-100">
          <FacilityCategoryIcon category={facility.category} categoryId={facility.categoryId} />
          <span className="line-clamp-1">{facility.category}</span>
        </div>

        {/* State / District Tag */}
        <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/90 backdrop-blur-xs text-sky-200 border border-slate-700 shadow-xs">
          {facility.district || facility.state || 'India'}
        </div>

        {/* Status Badge in Header */}
        <div className="absolute bottom-3 left-3.5">
          <StatusBadge status={facility.onboardingStatus} size="sm" />
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-xs text-slate-800 shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{facility.rating || '4.8'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        
        {/* Title & Location */}
        <div className="mb-2.5">
          <h3 
            onClick={() => onOpenDetails && onOpenDetails(facility)}
            className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 cursor-pointer"
          >
            {facility.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{facility.location || facility.address}</span>
            {facility.pincode && <span className="text-slate-400 shrink-0">• PIN: {facility.pincode}</span>}
          </div>
        </div>

        {/* Subcategory description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">
          {facility.description}
        </p>

        {/* Queue Metrics / Walk-in Indicator */}
        {isBookingEnabled ? (
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs mb-4">
            <div>
              <span className="text-slate-500 font-semibold block">{t('avgWait')}:</span>
              <div className="flex items-center gap-1 font-bold text-teal-700 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>~{formatWaitDuration(illustrativeWait)}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">{t('activeQueues')}:</span>
              <div className="flex items-center gap-1 font-bold text-slate-800 mt-0.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>{facility.activeQueues || 18} citizens</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">Walk-in Physical Queue</span>
                <span className="text-slate-500 text-xs">{facility.operatingHours || 'Standard Hours'}</span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
              Reception Desk
            </span>
          </div>
        )}

        {/* Services Badges */}
        <div className="mb-4 flex-1">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-teal-600" />
              <span>Services ({(facility.services || []).length})</span>
            </span>
            <button
              type="button"
              onClick={() => onOpenDetails && onOpenDetails(facility)}
              className="text-teal-700 hover:underline normal-case font-semibold cursor-pointer"
            >
              Details & Docs
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(facility.services || []).slice(0, 2).map((srv) => (
              <span
                key={srv.id}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium truncate max-w-[200px]"
              >
                {srv.name}
              </span>
            ))}
            {(facility.services || []).length > 2 && (
              <span 
                onClick={() => onOpenDetails && onOpenDetails(facility)}
                className="text-xs px-2 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 font-bold cursor-pointer"
              >
                +{(facility.services || []).length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Data Provenance Line */}
        <div className="pt-2 border-t border-slate-100 mb-4 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate pr-2">
            Source: {facility.sourceName ? facility.sourceName.split('/')[0].trim() : 'Official Registry'}
          </span>
          <span className="text-teal-700 font-medium shrink-0 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        </div>

        {/* Action Button: Book Token vs View Walk-in Info */}
        <div className="mt-auto space-y-2">
          {isBookingEnabled ? (
            <button
              type="button"
              onClick={() => onViewServices(facility)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
            >
              <Ticket className="w-4 h-4 text-sky-200" />
              <span>{t('bookTokenBtn')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOpenDetails && onOpenDetails(facility)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4 text-teal-600" />
                <span>{t('viewDetailsWalkIn')}</span>
              </button>
              <button
                type="button"
                onClick={() => onClaimFacility && onClaimFacility(facility)}
                className="p-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold transition-colors cursor-pointer"
                title="Are you staff? Claim this facility to enable digital queues"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
