import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Building2, 
  SlidersHorizontal, 
  X, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { MOCK_FACILITIES, FACILITY_CATEGORIES, TN_DISTRICTS } from '../data/mockData';
import { getLiveFacilities } from '../lib/queueService';
import { useLanguage } from '../context/LanguageContext';
import FacilityCard from '../components/FacilityCard';
import BookingWizardModal from '../components/BookingWizardModal';

export default function FacilitiesPage() {
  const { t } = useLanguage();
  const [facilitiesList, setFacilitiesList] = useState(MOCK_FACILITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [activeModalFacility, setActiveModalFacility] = useState(null);
  const [tokenBanner, setTokenBanner] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getLiveFacilities().then((liveData) => {
      if (isMounted && liveData && liveData.length > 0) {
        setFacilitiesList(liveData);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter facilities based on search, category, and district
  const filteredFacilities = useMemo(() => {
    return facilitiesList.filter((facility) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        facility.name.toLowerCase().includes(query) ||
        facility.description.toLowerCase().includes(query) ||
        (facility.services && facility.services.some(s => s.name.toLowerCase().includes(query)));

      const matchesCategory =
        selectedCategory === 'All' || facility.category === selectedCategory;

      const matchesDistrict =
        selectedDistrict === 'All Districts' ||
        facility.district === selectedDistrict ||
        facility.location.toLowerCase().includes(selectedDistrict.toLowerCase());

      return matchesSearch && matchesCategory && matchesDistrict;
    });
  }, [facilitiesList, searchQuery, selectedCategory, selectedDistrict]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDistrict('All Districts');
  };

  const handleJoinSuccess = (token) => {
    setTokenBanner(token);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Tamil Nadu Queue Hub
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Live Directory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('browseFacilities')}
            </h1>
            <p className="text-base text-slate-600 mt-1.5">
              Search participating hospitals, government centers, banks, and academic halls in Tamil Nadu.
            </p>
          </div>
          <span className="text-sm font-bold px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 self-start md:self-auto">
            {filteredFacilities.length} centers active
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {tokenBanner && (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-between animate-fadeIn text-emerald-950">
          <div className="flex items-center gap-3.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-sm">
              <span className="font-extrabold text-base">Token #{tokenBanner.tokenNumber} Confirmed!</span>
              <p className="text-emerald-800 mt-0.5">
                {tokenBanner.serviceName} at {tokenBanner.facilityName} • Estimated call: <strong>{tokenBanner.estimatedCallTime}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setTokenBanner(null)}
            className="p-1.5 rounded-xl text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by center name, service (e.g. OPD, Aadhaar, Passport), or keyword..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-300 bg-slate-50/50 text-base font-medium focus:outline-hidden focus:border-teal-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* District Selector */}
          <div className="sm:w-64">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl border border-slate-300 bg-slate-50/50 text-base font-bold text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white cursor-pointer transition-all"
            >
              {TN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm pt-1">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {FACILITY_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      {filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onViewServices={(fac) => setActiveModalFacility(fac)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-lg">No participating centers found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            No facilities match your active search and district filters. Try selecting "All Districts".
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-teal-50 text-teal-800 text-sm font-bold hover:bg-teal-100 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 3-Step Guided Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={Boolean(activeModalFacility)}
        initialFacility={activeModalFacility}
        onClose={() => setActiveModalFacility(null)}
        onBookingSuccess={handleJoinSuccess}
      />
    </div>
  );
}
