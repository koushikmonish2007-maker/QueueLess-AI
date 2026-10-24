import React from 'react';
import { 
  ChevronRight, 
  RotateCcw, 
  Compass
} from 'lucide-react';
import { INDIAN_STATES_UTS, STATE_DISTRICTS_MAP } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const TOP_FEATURED_STATES = ['TN', 'KA', 'MH', 'DL', 'UP', 'TS', 'KL', 'GJ'];

export default function HierarchySelector({
  selectedStateCode = 'All',
  selectedDistrict = 'All Districts',
  selectedCity = '',
  onSelectState,
  onSelectDistrict,
  onSelectCity,
  onReset
}) {
  const { t } = useLanguage();

  const activeState = INDIAN_STATES_UTS.find(s => s.code === selectedStateCode);
  const availableDistricts = selectedStateCode !== 'All' && STATE_DISTRICTS_MAP[selectedStateCode]
    ? STATE_DISTRICTS_MAP[selectedStateCode]
    : [];

  const handleStateChange = (code) => {
    onSelectState(code);
    onSelectDistrict('All Districts');
    onSelectCity('');
  };

  const handleDistrictChange = (dist) => {
    onSelectDistrict(dist);
    onSelectCity('');
  };

  const isFiltered = selectedStateCode !== 'All' || selectedDistrict !== 'All Districts' || selectedCity;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
      {/* Top Breadcrumb Path */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onReset()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-colors ${
              selectedStateCode === 'All' ? 'bg-teal-50 text-teal-800 font-bold' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span className="text-base">🇮🇳</span>
            <span>All India (36 States & UTs)</span>
          </button>

          {selectedStateCode !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                type="button"
                onClick={() => onSelectDistrict('All Districts')}
                className={`px-2.5 py-1 rounded-xl transition-colors ${
                  selectedDistrict === 'All Districts' ? 'bg-teal-50 text-teal-800 font-bold' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {activeState?.name || selectedStateCode}
              </button>
            </>
          )}

          {selectedDistrict !== 'All Districts' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 font-bold">
                {selectedDistrict}
              </span>
            </>
          )}

          {selectedCity && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800 font-bold">
                {selectedCity}
              </span>
            </>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Location</span>
          </button>
        )}
      </div>

      {/* Quick State Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>Quick State Focus</span>
          </label>
          <span className="text-xs text-slate-400">Select to drill down</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleStateChange('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedStateCode === 'All'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All States & UTs
          </button>
          {TOP_FEATURED_STATES.map((code) => {
            const state = INDIAN_STATES_UTS.find(s => s.code === code);
            const isSelected = selectedStateCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleStateChange(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {state?.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cascading Dropdowns: State -> District -> City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        
        {/* 1. State / UT Select */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('stateLabel') || 'State / Union Territory'}
          </label>
          <div className="relative">
            <select
              value={selectedStateCode}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-slate-50/60 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all appearance-none pr-8 cursor-pointer"
            >
              <option value="All">All India (36 States & UTs)</option>
              <optgroup label="States">
                {INDIAN_STATES_UTS.filter(s => s.type === 'State').map(s => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Union Territories">
                {INDIAN_STATES_UTS.filter(s => s.type === 'Union Territory').map(s => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* 2. District Select */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('districtLabel') || 'District'}
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={selectedStateCode === 'All'}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-slate-50/60 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-teal-600 focus:bg-white disabled:opacity-50 disabled:bg-slate-100 transition-all appearance-none pr-8 cursor-pointer"
            >
              <option value="All Districts">
                {selectedStateCode === 'All' ? 'Select a State first' : 'All Districts'}
              </option>
              {availableDistricts.map(dist => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* 3. City / Locality Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('cityLabel') || 'City / Locality'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              placeholder="e.g. Mylapore, Koramangala..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-slate-50/60 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-teal-600 focus:bg-white placeholder:text-slate-400 transition-all"
            />
            {selectedCity && (
              <button
                type="button"
                onClick={() => onSelectCity('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
