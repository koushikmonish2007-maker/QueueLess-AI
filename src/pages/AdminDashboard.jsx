import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Play, 
  Check, 
  Pause, 
  RefreshCw, 
  ShieldCheck, 
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getLiveFacilityQueue, 
  getLiveFacilities, 
  adminCallNextToken, 
  adminStartService, 
  adminCompleteService, 
  adminCancelToken, 
  adminUpdateCounterStatus, 
  subscribeToQueueChanges,
  getFacilityClaims,
  approveFacilityClaim,
  rejectFacilityClaim
} from '../lib/queueService';
import { MOCK_FACILITIES } from '../data/mockData';

export default function AdminDashboard() {
  const { currentUser, isSupabaseConfigured } = useAuth();
  
  // Tab state: 'waiting' | 'called' | 'serving' | 'history' | 'claims'
  const [activeQueueTab, setActiveQueueTab] = useState('waiting');
  const [facilities, setFacilities] = useState(MOCK_FACILITIES);
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [queueState, setQueueState] = useState({ queue: [], counters: [] });
  
  // Claims state for Super Admin & Facility Admins
  const [facilityClaims, setFacilityClaims] = useState([]);
  const [claimsFilter, setClaimsFilter] = useState('all');
  const [claimActionLoading, setClaimActionLoading] = useState(false);
  
  // Feedback messages
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isFacilityAdmin = currentUser?.role === 'facility_admin';
  const isAdmin = isSuperAdmin || isFacilityAdmin;
  const adminFacilityId = currentUser?.facilityId;
  const hasNoFacilityAssigned = isAdmin && !isSuperAdmin && !adminFacilityId;

  // 1. Fetch live facilities on mount
  useEffect(() => {
    let isMounted = true;
    async function initFacilities() {
      try {
        const liveFacs = await getLiveFacilities();
        if (isMounted && liveFacs && liveFacs.length > 0) {
          setFacilities(liveFacs);
        }
      } catch (err) {
        console.warn('[AdminDashboard] Facilities fetch notice:', err.message);
      }
    }
    initFacilities();
    return () => { isMounted = false; };
  }, []);

  // 2. Sync selectedFacilityId
  useEffect(() => {
    if (isFacilityAdmin && adminFacilityId) {
      setSelectedFacilityId(adminFacilityId);
    } else if (isSuperAdmin) {
      if (!selectedFacilityId && facilities.length > 0) {
        setSelectedFacilityId(facilities[0].id);
      }
    } else if (!selectedFacilityId && facilities.length > 0) {
      setSelectedFacilityId(adminFacilityId || facilities[0].id);
    }
  }, [adminFacilityId, isFacilityAdmin, isSuperAdmin, facilities, selectedFacilityId]);

  // 3. Load Queue Data for Selected Facility
  const loadQueueData = async (facId) => {
    if (!facId) {
      setQueueState({ queue: [], counters: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    try {
      const live = await getLiveFacilityQueue(facId);
      if (live) {
        setQueueState({
          queue: live.queue || [],
          counters: live.counters || []
        });
      }
    } catch (err) {
      console.error('[AdminDashboard] Queue load error:', err.message);
      setLoadError(err.message || 'Failed to fetch queue tokens from database.');
      setQueueState({ queue: [], counters: [] });
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Realtime subscription
  useEffect(() => {
    if (!selectedFacilityId || hasNoFacilityAssigned) {
      setIsLoading(false);
      return;
    }

    loadQueueData(selectedFacilityId);

    const cleanup = subscribeToQueueChanges(selectedFacilityId, () => {
      loadQueueData(selectedFacilityId);
    });

    return () => cleanup && cleanup();
  }, [selectedFacilityId, hasNoFacilityAssigned]);

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0] || null;

  // Token categories
  const waitingTokens = queueState.queue.filter(q => q.status === 'waiting');
  const calledTokens = queueState.queue.filter(q => q.status === 'called');
  const inServiceTokens = queueState.queue.filter(q => q.status === 'in_service' || q.status === 'in_progress');
  const completedTokens = queueState.queue.filter(q => q.status === 'completed');
  
  const _activeCounters = queueState.counters.filter(c => c.status === 'active' || c.status === 'busy');
  const firstActiveCounter = queueState.counters.find(c => c.status === 'active');

  // Load facility claims
  const loadClaims = async () => {
    try {
      const claims = await getFacilityClaims(isSuperAdmin ? null : currentUser?.id);
      setFacilityClaims(claims || []);
    } catch (err) {
      console.warn('[AdminDashboard] Claims load notice:', err.message);
    }
  };

  useEffect(() => {
    loadClaims();
  }, [currentUser?.id, isSuperAdmin]);

  const triggerToast = (msg, isErr = false) => {
    if (isErr) {
      setActionErrorMessage(msg);
      setTimeout(() => setActionErrorMessage(''), 4500);
    } else {
      setActionSuccessMessage(msg);
      setTimeout(() => setActionSuccessMessage(''), 3500);
    }
  };

  const handleApproveClaim = async (claimId) => {
    if (!isSuperAdmin) {
      triggerToast('Strict Security Policy: Only super administrators can approve institutional claims.', true);
      return;
    }
    setClaimActionLoading(true);
    try {
      await approveFacilityClaim(claimId, 'Institutional credentials authenticated by super administrator.');
      await loadClaims();
      triggerToast('Facility claim approved! Administrator privileges granted to claimant.');
    } catch (err) {
      triggerToast(err.message, true);
    } finally {
      setClaimActionLoading(false);
    }
  };

  const handleRejectClaim = async (claimId) => {
    if (!isSuperAdmin) {
      triggerToast('Only super administrators can reject institutional claims.', true);
      return;
    }
    const reason = window.prompt('Please enter the reason for rejecting this claim:', 'Official credentials could not be authenticated against institutional records.');
    if (!reason) return;
    setClaimActionLoading(true);
    try {
      await rejectFacilityClaim(claimId, reason);
      await loadClaims();
      triggerToast('Facility claim rejected.');
    } catch (err) {
      triggerToast(err.message, true);
    } finally {
      setClaimActionLoading(false);
    }
  };

  // Actions
  const handleCallNext = async (counterId) => {
    if (!isAdmin) {
      triggerToast('Permission Denied: Must be logged in as Facility Administrator.', true);
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const targetCounterId = counterId || firstActiveCounter?.id || queueState.counters[0]?.id;
      const result = await adminCallNextToken(targetCounterId);
      if (result.success) {
        await loadQueueData(selectedFacilityId);
        triggerToast(`Token #${result.token?.tokenNumber || ''} called successfully!`);
      } else {
        triggerToast(result.message || 'No citizens currently waiting in queue.', true);
      }
    } catch (err) {
      triggerToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartService = async (tokenId) => {
    if (!isAdmin) return;
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await adminStartService(tokenId);
      await loadQueueData(selectedFacilityId);
      triggerToast('Service consultation started.');
    } catch (err) {
      triggerToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteService = async (tokenId) => {
    if (!isAdmin) return;
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await adminCompleteService(tokenId);
      await loadQueueData(selectedFacilityId);
      triggerToast('Service completed successfully. Counter desk is now open.');
    } catch (err) {
      triggerToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelToken = async (tokenId) => {
    if (!isAdmin) return;
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await adminCancelToken(tokenId, 'Marked as no-show by staff');
      await loadQueueData(selectedFacilityId);
      triggerToast('Token marked as cancelled/no-show.');
    } catch (err) {
      triggerToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCounterStatusToggle = async (counterId, currentStatus) => {
    if (!isAdmin) return;
    if (isProcessing) return;
    setIsProcessing(true);
    const nextStatus = currentStatus === 'active' ? 'break' : currentStatus === 'break' ? 'offline' : 'active';
    try {
      await adminUpdateCounterStatus(counterId, nextStatus);
      await loadQueueData(selectedFacilityId);
      triggerToast(`Counter status updated to: ${nextStatus.toUpperCase()}`);
    } catch (err) {
      triggerToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      
      {/* Top Staff Navigation Header */}
      <section className="bg-gradient-to-b from-sky-50 via-teal-50/20 to-slate-50 border-b border-slate-200/90 pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Facility Info & Actions Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800">
                  Staff Queue Console
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {isSupabaseConfigured ? 'Live Database Active' : 'Sandbox Demo Mode'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {selectedFacility?.name || 'Facility Operations'}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Hospital and facility queue dispatching with atomic call next & counter controls.
              </p>
            </div>

            {/* Facility Selector & Quick Refresh */}
            <div className="flex flex-wrap items-center gap-3">
              {isFacilityAdmin && adminFacilityId ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-sm font-bold text-slate-800 shadow-xs">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>{selectedFacility?.name}</span>
                </div>
              ) : (
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-sm font-bold text-slate-800 shadow-xs cursor-pointer focus:ring-2 focus:ring-teal-500"
                >
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={() => loadQueueData(selectedFacilityId)}
                disabled={isLoading}
                className="p-3 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                title="Refresh Queue"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Toast Notices */}
          {actionSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {actionErrorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{actionErrorMessage}</span>
            </div>
          )}

          {loadError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Database Notice:</strong>
                <span>{loadError}</span>
              </div>
            </div>
          )}

          {/* ================= PROMINENT CALL NEXT HERO BUTTON ================= */}
          <div className="p-6 rounded-3xl bg-white border-2 border-teal-500 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-teal-700">
                Primary Dispatch Action
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {waitingTokens.length === 0 
                  ? 'Queue is Clear (No Citizens Waiting)' 
                  : `${waitingTokens.length} Citizens Waiting in Queue`}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {firstActiveCounter 
                  ? `Next available desk: ${firstActiveCounter.name} (${firstActiveCounter.staffName})`
                  : 'All operational desks are currently busy or offline.'}
              </p>
            </div>

            <button
              type="button"
              disabled={isProcessing || waitingTokens.length === 0 || !firstActiveCounter}
              onClick={() => handleCallNext(firstActiveCounter?.id)}
              className="w-full md:w-auto px-8 py-5 rounded-2xl text-lg font-black text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/30 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer active:scale-98"
            >
              <PhoneCall className="w-6 h-6" />
              <span>
                {waitingTokens.length === 0 
                  ? 'No Waiting Citizens' 
                  : !firstActiveCounter 
                  ? 'All Desks Busy' 
                  : `Call Next (${firstActiveCounter.name})`}
              </span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waiting in Queue</span>
              <div className="text-3xl font-black text-amber-600 mt-1">{waitingTokens.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Currently Called</span>
              <div className="text-3xl font-black text-blue-600 mt-1">{calledTokens.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">At Service Desks</span>
              <div className="text-3xl font-black text-teal-600 mt-1">{inServiceTokens.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Today</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">{completedTokens.length}</div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ================= OPERATIONAL COUNTER STATIONS ================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Operational Counter Stations ({queueState.counters.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage doctor consultation rooms, teller windows, and desk staff.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queueState.counters.map((cnt) => {
              const currentTokenObj = queueState.queue.find(
                q => (q.counterId === cnt.id || q.assignedCounter === cnt.name || q.tokenNumber === cnt.currentToken) &&
                     (q.status === 'called' || q.status === 'in_service' || q.status === 'in_progress')
              );

              return (
                <div
                  key={cnt.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{cnt.name}</h3>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        cnt.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : cnt.status === 'busy' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {cnt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      Staff: <strong className="text-slate-800">{cnt.staffName}</strong>
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Assigned Token:</span>
                      <strong className="text-base font-black font-mono text-teal-700">
                        {currentTokenObj ? `#${currentTokenObj.tokenNumber}` : (cnt.currentToken || 'Standby')}
                      </strong>
                    </div>
                  </div>

                  {/* Actions for this counter */}
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                    {currentTokenObj ? (
                      currentTokenObj.status === 'called' ? (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleStartService(currentTokenObj.id)}
                          className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Consultation</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleCompleteService(currentTokenObj.id)}
                          className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete Desk</span>
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        disabled={isProcessing || cnt.status !== 'active' || waitingTokens.length === 0}
                        onClick={() => handleCallNext(cnt.id)}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Next</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleCounterStatusToggle(cnt.id, cnt.status)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Pause className="w-3.5 h-3.5 text-amber-600" />
                      <span>Toggle Status</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 4 CLEARLY SEPARATED TOKEN SECTIONS ================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Big, Clear Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveQueueTab('waiting')}
              className={`px-5 py-3 rounded-2xl text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeQueueTab === 'waiting'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>1. Waiting in Line</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeQueueTab === 'waiting' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-800'
              }`}>
                {waitingTokens.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab('called')}
              className={`px-5 py-3 rounded-2xl text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeQueueTab === 'called'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>2. Currently Called</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeQueueTab === 'called' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-800'
              }`}>
                {calledTokens.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab('serving')}
              className={`px-5 py-3 rounded-2xl text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeQueueTab === 'serving'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>3. At Service Desk</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeQueueTab === 'serving' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-800'
              }`}>
                {inServiceTokens.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab('history')}
              className={`px-5 py-3 rounded-2xl text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeQueueTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>4. Completed History</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeQueueTab === 'history' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-800'
              }`}>
                {completedTokens.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab('claims')}
              className={`px-5 py-3 rounded-2xl text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeQueueTab === 'claims'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>5. Facility Claims Review</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeQueueTab === 'claims' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-800'
              }`}>
                {facilityClaims.filter(c => c.status === 'pending').length}
              </span>
            </button>
          </div>

          {/* TAB 1: WAITING TOKENS */}
          {activeQueueTab === 'waiting' && (
            <div className="space-y-4 animate-fadeIn">
              {waitingTokens.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-base">
                  No citizens currently waiting in line. The queue is clear!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {waitingTokens.map((tok, idx) => (
                    <div
                      key={tok.id}
                      className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                            Position #{idx + 1}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            Wait: {tok.waitTime}
                          </span>
                        </div>
                        <div className="text-3xl font-black font-mono text-amber-900 my-1">
                          #{tok.tokenNumber}
                        </div>
                        <strong className="block text-slate-900 text-base">{tok.visitorName}</strong>
                        <span className="text-xs text-slate-600">{tok.service}</span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleCancelToken(tok.id)}
                          className="text-xs text-rose-600 hover:underline font-bold"
                        >
                          Mark No-Show
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURRENTLY CALLED */}
          {activeQueueTab === 'called' && (
            <div className="space-y-4 animate-fadeIn">
              {calledTokens.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-base">
                  No citizens currently called. Tap &ldquo;Call Next&rdquo; above to dispatch the next ticket.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {calledTokens.map((tok) => (
                    <div
                      key={tok.id}
                      className="p-5 rounded-2xl bg-blue-50/70 border-2 border-blue-400 shadow-sm flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-blue-800">
                          Dispatched Ticket
                        </span>
                        <div className="text-4xl font-black font-mono text-blue-700 my-1">
                          #{tok.tokenNumber}
                        </div>
                        <strong className="block text-slate-900 text-base">{tok.visitorName}</strong>
                        <p className="text-xs text-slate-600">{tok.service}</p>
                        <p className="text-xs font-bold text-blue-900 mt-2 bg-blue-100 px-2.5 py-1 rounded-lg inline-block">
                          Desk: {tok.assignedCounter}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleStartService(tok.id)}
                          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Service</span>
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleCompleteService(tok.id)}
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AT SERVICE DESK (IN SERVICE) */}
          {activeQueueTab === 'serving' && (
            <div className="space-y-4 animate-fadeIn">
              {inServiceTokens.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-base">
                  No active consultations at the moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inServiceTokens.map((tok) => (
                    <div
                      key={tok.id}
                      className="p-5 rounded-2xl bg-teal-50 border-2 border-teal-500 shadow-sm flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                          Active Consultation
                        </span>
                        <div className="text-4xl font-black font-mono text-teal-700 my-1">
                          #{tok.tokenNumber}
                        </div>
                        <strong className="block text-slate-900 text-base">{tok.visitorName}</strong>
                        <p className="text-xs text-slate-600">{tok.service}</p>
                        <p className="text-xs font-bold text-teal-900 mt-2 bg-teal-100 px-2.5 py-1 rounded-lg inline-block">
                          Desk: {tok.assignedCounter}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleCompleteService(tok.id)}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Complete Service &amp; Free Desk</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPLETED HISTORY */}
          {activeQueueTab === 'history' && (
            <div className="space-y-4 animate-fadeIn">
              {completedTokens.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-base">
                  No completed appointments yet today.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {completedTokens.map((tok) => (
                    <div key={tok.id} className="py-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold font-mono">
                          #{tok.tokenNumber}
                        </div>
                        <div>
                          <strong className="block text-slate-900">{tok.visitorName}</strong>
                          <span className="text-xs text-slate-500">{tok.service} • {tok.assignedCounter}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                          Completed
                        </span>
                        <span className="text-xs text-slate-400 block mt-0.5">{tok.completedAt || 'Today'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FACILITY CLAIMS REVIEW (SUPER ADMIN WORKFLOW) */}
          {activeQueueTab === 'claims' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Claims Security Notice */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3 text-sm text-purple-950">
                <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Secure Administrative Approval Process</strong>
                  <p className="text-xs text-purple-900 mt-0.5">
                    Authorized hospital, bank, or government representatives submit claims to manage queues. Super administrators review department email domains and employee proofs before granting the <code>facility_admin</code> role. Self-escalation is strictly prevented by database triggers.
                  </p>
                </div>
              </div>

              {/* Claims Filter Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {['all', 'pending', 'approved', 'rejected'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setClaimsFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        claimsFilter === st
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st} ({st === 'all' ? facilityClaims.length : facilityClaims.filter(c => c.status === st).length})
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={loadClaims}
                  className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Claims</span>
                </button>
              </div>

              {/* Claims List */}
              {facilityClaims.filter(c => claimsFilter === 'all' || c.status === claimsFilter).length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-base">
                  No facility claims found for the selected filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {facilityClaims
                    .filter(c => claimsFilter === 'all' || c.status === claimsFilter)
                    .map((claim) => (
                      <div
                        key={claim.id}
                        className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                              Facility Claim Request
                            </span>
                            <h3 className="text-lg font-bold text-slate-900">
                              {claim.facilityName || 'Facility'}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              claim.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : claim.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              {claim.status}
                            </span>
                          </div>
                        </div>

                        {/* Claimant Credentials Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block">Claimant Name &amp; Title</span>
                            <strong className="text-slate-800 text-sm block mt-0.5">{claim.claimantName}</strong>
                            <span className="text-slate-600">{claim.designation}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold block">Official Contact</span>
                            <a href={`mailto:${claim.officialEmail}`} className="text-teal-700 font-semibold hover:underline block mt-0.5">
                              {claim.officialEmail}
                            </a>
                            <span className="text-slate-600">{claim.officialPhone}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold block">Proof Document</span>
                            <strong className="text-slate-800 block mt-0.5">{claim.governmentIdType}</strong>
                            {claim.idProofUrl && (
                              <span className="text-slate-500 truncate block">Ref: {claim.idProofUrl}</span>
                            )}
                          </div>
                        </div>

                        {claim.additionalNotes && (
                          <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200">
                            <strong>Administrative Request Notes:</strong> {claim.additionalNotes}
                          </div>
                        )}

                        {claim.reviewNotes && (
                          <div className="p-3 rounded-xl bg-purple-50 text-xs text-purple-900 border border-purple-200">
                            <strong>Reviewer Notes:</strong> {claim.reviewNotes}
                          </div>
                        )}

                        {/* Actions for Pending Claims */}
                        {claim.status === 'pending' && (
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              disabled={claimActionLoading}
                              onClick={() => handleRejectClaim(claim.id)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Reject Claim
                            </button>
                            <button
                              type="button"
                              disabled={claimActionLoading}
                              onClick={() => handleApproveClaim(claim.id)}
                              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve as Facility Admin</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}
