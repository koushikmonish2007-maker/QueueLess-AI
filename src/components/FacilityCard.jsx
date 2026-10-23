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
  Wrench, 
  Star,
  Layers,
  Ticket
} from 'lucide-react';
import { formatWaitDuration } from '../lib/queuePrediction';
import { useLanguage } from '../context/LanguageContext';

function getCategoryIcon(category) {
  switch (category) {
    case 'Hospitals': return HeartPulse;
    case 'Government': return Landmark;
    case 'Banks': return Building2;
    case 'Colleges': return GraduationCap;
    case 'Service Centers': return Wrench;
    default: return Building2;
  }
}

/**
 * FacilityCard component in SaaS theme
 * 
 * @param {{
 *  facility: import('../data/mockData').Facility,
 *  onViewServices: (facility: import('../data/mockData').Facility) => void
 * }} props
 */
export default function FacilityCard({ facility, onViewServices }) {
  const { t } = useLanguage();
  const CategoryIcon = getCategoryIcon(facility.category);
  
  // Calculate wait estimate
  const minAvgWait = Math.min(...(facility.services || [{ averageServiceMinutes: 15 }]).map(s => s.averageServiceMinutes));
  const activeCounters = (facility.counters || []).filter(c => c.status === 'active' || c.status === 'busy').length || 2;
  const illustrativeWait = Math.round(((facility.activeQueues || 20) * minAvgWait) / Math.max(1, activeCounters * 2));

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-500 transition-all duration-200 flex flex-col group">
      {/* Facility Image & Tags */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={facility.imageUrl}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-xs text-teal-800 shadow-xs border border-teal-100">
          <CategoryIcon className="w-4 h-4 text-teal-600" />
          <span>{facility.category}</span>
        </div>

        {/* District Tag */}
        <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/90 backdrop-blur-xs text-sky-200 border border-slate-700 shadow-xs">
          {facility.district || facility.location?.split(',')[1]?.trim() || 'Tamil Nadu'}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-xs text-slate-800 shadow-xs">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{facility.rating || '4.8'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
            {facility.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1.5">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate">{facility.location || facility.address}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {facility.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100/80 mb-5 text-sm">
          <div>
            <span className="text-slate-500 text-xs font-semibold block">{t('avgWait')}:</span>
            <div className="flex items-center gap-1.5 font-bold text-teal-700 mt-0.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>~{formatWaitDuration(illustrativeWait)}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-xs font-semibold block">{t('activeQueues')}:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <Users className="w-4 h-4 text-teal-600" />
              <span>{facility.activeQueues || 18} citizens</span>
            </div>
          </div>
        </div>

        {/* Services Badges */}
        <div className="mb-6 flex-1">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500 font-bold mb-2.5">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Available Services ({(facility.services || []).length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(facility.services || []).slice(0, 2).map((srv) => (
              <span
                key={srv.id}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium"
              >
                {srv.name}
              </span>
            ))}
            {(facility.services || []).length > 2 && (
              <span className="text-xs px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 font-bold">
                +{(facility.services || []).length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button: Book Token */}
        <button
          type="button"
          onClick={() => onViewServices(facility)}
          className="w-full mt-auto flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
        >
          <Ticket className="w-5 h-5 text-sky-200" />
          <span>{t('bookTokenBtn')}</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
