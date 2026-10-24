import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  X, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  MOCK_FACILITIES, 
  EXPANDED_FACILITY_CATEGORIES 
} from '../data/mockData';
import { getLiveFacilities } from '../lib/queueService';
import { useLanguage } from '../context/LanguageContext';
import FacilityCard from '../components/FacilityCard';
import HierarchySelector from '../components/HierarchySelector';
import FacilityDetailModal from '../components/FacilityDetailModal';
import FacilityClaimModal from '../components/FacilityClaimModal';
import BookingWizardModal from '../components/BookingWizardModal';

const ITEMS_PER_PAGE = 12;

export default function FacilitiesPage() {
  const { t } = useLanguage();
  const [facilitiesList, setFacilitiesList] = useState(MOCK_FACILITIES);
  
  // Hierarchy state
  const [selectedStateCode, setSelectedStateCode] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'booking_enabled' | 'verified' | 'listed'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [detailModalFacility, setDetailModalFacility] = useState(null);
  const [claimModalFacility, setClaimModalFacility] = useState(null);
  const [bookingWizardFacility, setBookingWizardFacility] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [tokenBanner, setTokenBanner] = useState(null);
  const [claimSuccessBanner, setClaimSuccessBanner] = useState(false);

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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStateCode, selectedDistrict, selectedCity, selectedCategory, selectedStatus, searchQuery]);

  // Hierarchical + Category + Status + Search filtering
  const filteredFacilities = useMemo(() => {
    return facilitiesList.filter((facility) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        facility.name.toLowerCase().includes(query) ||
        (facility.description && facility.description.toLowerCase().includes(query)) ||
        (facility.district && facility.district.toLowerCase().includes(query)) ||
        (facility.city && facility.city.toLowerCase().includes(query)) ||
        (facility.pincode && facility.pincode.includes(query)) ||
        (facility.services && facility.services.some(s => s.name.toLowerCase().includes(query)));

      // 2. State Filter
      const matchesState = selectedStateCode === 'All' || 
        facility.stateCode === selectedStateCode ||
        (facility.state && facility.state.toLowerCase() === selectedStateCode.toLowerCase());

      // 3. District Filter
      const matchesDistrict = selectedDistrict === 'All Districts' ||
        facility.district === selectedDistrict ||
        (facility.location && facility.location.toLowerCase().includes(selectedDistrict.toLowerCase()));

      // 4. City Filter
      const matchesCity = !selectedCity.trim() ||
        (facility.city && facility.city.toLowerCase().includes(selectedCity.toLowerCase().trim())) ||
        (facility.location && facility.location.toLowerCase().includes(selectedCity.toLowerCase().trim())) ||
        (facility.address && facility.address.toLowerCase().includes(selectedCity.toLowerCase().trim()));

      // 5. Category Filter
      const matchesCategory = selectedCategory === 'All' || 
        facility.category === selectedCategory ||
        facility.categoryId === selectedCategory;

      // 6. Onboarding Status Filter
      let matchesStatus = true;
      if (selectedStatus === 'booking_enabled') {
        matchesStatus = facility.isBookingEnabled === true && facility.onboardingStatus === 'booking_enabled';
      } else if (selectedStatus === 'verified') {
        matchesStatus = facility.onboardingStatus === 'verified';
      } else if (selectedStatus === 'listed') {
        matchesStatus = facility.onboardingStatus === 'listed';
      }

      return matchesSearch && matchesState && matchesDistrict && matchesCity && matchesCategory && matchesStatus;
    });
  }, [facilitiesList, searchQuery, selectedStateCode, selectedDistrict, selectedCity, selectedCategory, selectedStatus]);

  // Pagination calculation
  const totalItems = filteredFacilities.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFacilities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFacilities, currentPage]);

  const handleResetAll = () => {
    setSelectedStateCode('All');
    setSelectedDistrict('All Districts');
    setSelectedCity('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleOpenBookingWizard = (fac) => {
    setBookingWizardFacility(fac);
    setIsWizardOpen(true);
  };

  const handleBookingSuccess = (token) => {
    setIsWizardOpen(false);
    setTokenBanner(token);
  };

  const bookingEnabledCount = facilitiesList.filter(f => f.isBookingEnabled).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-teal-50/70 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1.5">
                <span>🇮🇳</span>
                <span>Nationwide India Directory</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>36 States & UTs Live</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                Official Provenance Verified
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('nationwideTitle')}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
              Explore participating hospitals, bank branches, RTOs, passport kendras, revenue offices, and citizen centers across India.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
            <span className="text-sm font-extrabold px-4 py-2 rounded-2xl bg-slate-900 text-white shadow-xs">
              {totalItems} Facilities Listed
            </span>
            <span className="text-xs font-bold text-teal-700">
              ⚡ {bookingEnabledCount} Booking Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Banners */}
      {tokenBanner && (
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-between animate-fadeIn text-emerald-950">
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
            className="p-1.5 rounded-xl text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {claimSuccessBanner && (
        <div className="p-4 sm:p-5 rounded-3xl bg-teal-50 border border-teal-200 shadow-sm flex items-center justify-between animate-fadeIn text-teal-950">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
            <div className="text-sm">
              <span className="font-bold text-base">Institutional Claim Registered</span>
              <p className="text-teal-800 mt-0.5">
                Your credentials are queued for super administrator verification. You will be alerted upon review.
              </p>
            </div>
          </div>
          <button
            onClick={() => setClaimSuccessBanner(false)}
            className="p-1.5 rounded-xl text-teal-600 hover:text-teal-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 1. Hierarchical State -> District -> City Selector */}
      <HierarchySelector
        selectedStateCode={selectedStateCode}
        selectedDistrict={selectedDistrict}
        selectedCity={selectedCity}
        onSelectState={setSelectedStateCode}
        onSelectDistrict={setSelectedDistrict}
        onSelectCity={setSelectedCity}
        onReset={() => {
          setSelectedStateCode('All');
          setSelectedDistrict('All Districts');
          setSelectedCity('');
        }}
      />

      {/* 2. Search, Status & Category Filters */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        
        {/* Top Row: Search + Status Toggle */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-300 bg-slate-50/50 text-sm sm:text-base font-medium focus:outline-hidden focus:border-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedStatus('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Statuses
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('booking_enabled')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                selectedStatus === 'booking_enabled'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>⚡ Booking Enabled</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                selectedStatus === 'verified'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>✓ Verified</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('listed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'listed'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Walk-in Only
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Browse by Category</span>
            </span>
            <span className="text-xs text-slate-400">10 Normalized Categories</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {EXPANDED_FACILITY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <span className="text-sm font-bold text-slate-700">
          {t('showingFacilities')} <strong className="text-teal-700">{paginatedFacilities.length}</strong> {t('ofFacilities')} (Total {totalItems})
        </span>
        
        {totalItems > 0 && (
          <span className="text-xs font-semibold text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Facilities Grid */}
      {paginatedFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedFacilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onViewServices={handleOpenBookingWizard}
              onOpenDetails={setDetailModalFacility}
              onClaimFacility={setClaimModalFacility}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Facilities Found in Selected Location
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            We could not find any facilities matching your filters in this state/district. Try broadening your location or resetting filters.
          </p>
          <button
            type="button"
            onClick={handleResetAll}
            className="px-6 py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-xs">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('prevPage')}</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <span>{t('nextPage')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <FacilityDetailModal
        facility={detailModalFacility}
        isOpen={Boolean(detailModalFacility)}
        onClose={() => setDetailModalFacility(null)}
        onBookToken={(fac) => {
          setDetailModalFacility(null);
          handleOpenBookingWizard(fac);
        }}
        onClaimFacility={(fac) => {
          setDetailModalFacility(null);
          setClaimModalFacility(fac);
        }}
      />

      <FacilityClaimModal
        facility={claimModalFacility}
        isOpen={Boolean(claimModalFacility)}
        onClose={() => setClaimModalFacility(null)}
        onClaimSuccess={() => {
          setClaimModalFacility(null);
          setClaimSuccessBanner(true);
        }}
      />

      <BookingWizardModal
        isOpen={isWizardOpen}
        initialFacility={bookingWizardFacility}
        onClose={() => setIsWizardOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

    </div>
  );
}
