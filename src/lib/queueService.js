/**
 * @file queueService.js
 * QueueLess AI — Team GEN4X (INTELLATHON 2K26)
 * Unified Queue Data Service Layer: Supabase Cloud + Local Interactive Store
 * 
 * Supports full production PostgreSQL calls when Supabase credentials are present,
 * and maintains an active, reactive local store for safe demonstration when credentials are unset.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { MOCK_FACILITIES, MOCK_CITIZEN_ACTIVE_TOKENS } from '../data/mockData.js';
import { calculateEstimatedWaitTime } from './queuePrediction.js';

// Local Reactive State Store for offline/demo operation
// By default, NO active tokens exist until booked by citizen or loaded from Supabase.
let localTokens = [];
let localAdminQueue = [];
let localCounters = (MOCK_FACILITIES[0]?.counters || []).map(c => ({
  ...c,
  status: 'active',
  currentToken: null
}));
let localNotifications = [
  {
    id: 'notif-init-1',
    title: 'Welcome to QueueLess AI 2.0',
    message: 'Real-time queue tracking and smart departure guidance active.',
    type: 'info',
    createdAt: new Date().toISOString(),
    isRead: false
  }
];

// Local facility claims for interactive offline/demo verification
let localFacilityClaims = [
  {
    id: 'claim-pilot-001',
    facilityId: 'fac-rto-001',
    facilityName: 'Regional Transport Office (RTO) — Chennai South (TN-07)',
    claimantId: '00000000-0000-0000-0000-cit000000001',
    claimantName: 'Aditya Sharma',
    officialEmail: 'rto.chennaisouth@tn.gov.in',
    officialPhone: '+91 (044) 2441-2850',
    designation: 'Assistant Regional Transport Officer',
    governmentIdType: 'Government Employee Service Card',
    idProofUrl: 'https://parivahan.gov.in/staff-verification',
    authorizationLetterUrl: '',
    additionalNotes: 'Requesting administrative privileges to initialize physical counter dispatch for LLR and driving tests.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

const globalEmitter = typeof window !== 'undefined' 
  ? window 
  : (typeof globalThis !== 'undefined' ? (globalThis.__queueless_emitter = globalThis.__queueless_emitter || new EventTarget()) : null);

function notifyLocalSubscribers() {
  if (globalEmitter && typeof globalEmitter.dispatchEvent === 'function') {
    globalEmitter.dispatchEvent(new CustomEvent('queueless_state_update', {
      detail: { tokens: localTokens, queue: localAdminQueue, counters: localCounters, claims: localFacilityClaims }
    }));
  }
}

/**
 * Fetch live active facilities with nested services and counters from Supabase.
 * Falls back to MOCK_FACILITIES if offline or Supabase is unconfigured.
 */
export async function getLiveFacilities() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select(`
          id,
          name,
          category,
          category_id,
          subcategory,
          state_code,
          state,
          district,
          city,
          taluk,
          pincode,
          location,
          address,
          rating,
          operating_hours,
          phone,
          image_url,
          description,
          is_active,
          onboarding_status,
          is_booking_enabled,
          source_name,
          source_url,
          source_license,
          official_portal_url,
          last_synced_at,
          verification_notes,
          services (
            id,
            facility_id,
            name,
            description,
            average_service_minutes,
            requirements,
            is_active
          ),
          counters (
            id,
            facility_id,
            name,
            staff_name,
            status,
            supported_service_ids
          )
        `)
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        return data.map(f => {
          const mockMatch = MOCK_FACILITIES.find(m => m.id === f.id || m.name.toLowerCase() === f.name.toLowerCase());
          const isBookingEnabled = typeof f.is_booking_enabled === 'boolean' 
            ? f.is_booking_enabled 
            : (mockMatch?.isBookingEnabled ?? (f.onboarding_status === 'booking_enabled'));

          return {
            id: f.id,
            name: f.name,
            category: f.category,
            categoryId: f.category_id || mockMatch?.categoryId || 'govt_hospitals',
            subcategory: f.subcategory || mockMatch?.subcategory || '',
            stateCode: f.state_code || mockMatch?.stateCode || 'TN',
            state: f.state || mockMatch?.state || 'Tamil Nadu',
            district: f.district || mockMatch?.district || (f.location.includes(',') ? f.location.split(',')[1].trim() : 'Chennai'),
            city: f.city || mockMatch?.city || 'Chennai',
            taluk: f.taluk || mockMatch?.taluk || '',
            pincode: f.pincode || mockMatch?.pincode || '',
            location: f.location || `${f.district || 'Chennai'}, ${f.state || 'Tamil Nadu'}`,
            address: f.address,
            rating: Number(f.rating) || 4.8,
            activeQueues: isBookingEnabled ? (mockMatch?.activeQueues || 20) : 0,
            operatingHours: f.operating_hours,
            phone: f.phone,
            imageUrl: f.image_url || mockMatch?.imageUrl,
            description: f.description,
            onboardingStatus: f.onboarding_status || mockMatch?.onboardingStatus || 'booking_enabled',
            isBookingEnabled,
            sourceName: f.source_name || mockMatch?.sourceName || 'National Public Registry',
            sourceUrl: f.source_url || mockMatch?.sourceUrl || '',
            sourceLicense: f.source_license || mockMatch?.sourceLicense || 'Government Open Data License - India (GODL)',
            officialPortalUrl: f.official_portal_url || mockMatch?.officialPortalUrl || '',
            lastSyncedAt: f.last_synced_at || mockMatch?.lastSyncedAt || new Date().toISOString(),
            verificationNotes: f.verification_notes || mockMatch?.verificationNotes || '',
            services: (f.services || [])
              .filter(s => s.is_active !== false)
              .map(s => ({
                id: s.id,
                name: s.name,
                averageServiceMinutes: s.average_service_minutes || 15,
                supportedCounterIds: (f.counters || [])
                  .filter(c => c.supported_service_ids?.includes(s.id))
                  .map(c => c.id),
                description: s.description,
                requirements: s.requirements
              })),
            counters: (f.counters || []).map(c => ({
              id: c.id,
              facilityId: f.id,
              name: c.name,
              staffName: c.staff_name,
              status: c.status,
              supportedServiceIds: c.supported_service_ids || []
            }))
          };
        });
      }
    } catch (err) {
      console.warn('[QueueService] Supabase facilities fetch failed, using fallback:', err.message);
    }
  }

  return MOCK_FACILITIES;
}

/**
 * Fetch real active queue token for the citizen.
 * 1. Checks Supabase if configured & authenticated.
 * 2. Checks active session tokens in local store.
 * 3. Returns null if no real active token exists.
 */
export async function getActiveUserToken(citizenId = null) {
  if (isSupabaseConfigured && supabase) {
    try {
      let effectiveCitizenId = citizenId;
      if (!effectiveCitizenId) {
        const { data: { session } } = await supabase.auth.getSession();
        effectiveCitizenId = session?.user?.id;
      }

      if (effectiveCitizenId) {
        const { data, error } = await supabase
          .from('queue_tokens')
          .select(`
            id,
            token_number,
            status,
            created_at,
            priority,
            facility_id,
            service_id,
            counter_id,
            visitor_name,
            phone
          `)
          .eq('citizen_id', effectiveCitizenId)
          .in('status', ['waiting', 'called', 'in_service'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const fac = MOCK_FACILITIES.find(f => f.id === data.facility_id);
          const srv = fac?.services?.find(s => s.id === data.service_id);

          const { count: aheadCount } = await supabase
            .from('queue_tokens')
            .select('id', { count: 'exact', head: true })
            .eq('facility_id', data.facility_id)
            .eq('service_id', data.service_id)
            .eq('status', 'waiting')
            .lt('created_at', data.created_at);

          return {
            id: data.id,
            facilityId: data.facility_id,
            facilityName: fac?.name || 'Participating Facility',
            category: fac?.category || 'General',
            serviceId: data.service_id,
            serviceName: srv?.name || 'Standard Service',
            tokenNumber: data.token_number,
            visitorName: data.visitor_name,
            phone: data.phone,
            status: data.status,
            createdAt: data.created_at,
            peopleAhead: aheadCount || 0,
            estimatedWaitMinutes: Math.max(5, (aheadCount || 0) * (srv?.averageServiceMinutes || 15)),
            isLiveSupabase: true
          };
        }
      }
    } catch (err) {
      console.warn('[QueueService] Supabase token check failed:', err.message);
    }

    // When Supabase is configured, do not fall back to fake mock tokens
    return null;
  }

  // Session token booked by user during active session (only in local sandbox mode)
  const sessionToken = localTokens.find(
    t => t.status === 'waiting' || t.status === 'called' || t.status === 'in_service'
  );
  if (sessionToken) {
    return { ...sessionToken, isLiveSupabase: false };
  }

  // No real active token exists
  return null;
}

/**
 * 1. Book a virtual queue token
 * Enforces strict Supabase RPC execution and prevents fake local success.
 */
export async function bookVirtualToken({
  facilityId,
  serviceId,
  facilityName,
  serviceName,
  category,
  visitorName,
  phone = '',
  priority = 'normal'
}) {
  if (isSupabaseConfigured && supabase) {
    // 1. Verify that an authenticated session exists in Supabase
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !session || !session.user) {
      throw new Error('Unauthenticated: You must be signed in to book a virtual queue token in Supabase. Please sign in or register.');
    }

    // Verify facility onboarding & booking status client-side prior to RPC call
    const targetFac = MOCK_FACILITIES.find(m => m.id === facilityId);
    if (targetFac && (!targetFac.isBookingEnabled || targetFac.onboardingStatus !== 'booking_enabled')) {
      throw new Error('BookingNotEnabled: Virtual queuing is only available for officially partnered facilities with verified queue management. This facility is currently an informational directory listing.');
    }

    // 2. Invoke the official book_queue_token PostgreSQL RPC
    const { data, error } = await supabase.rpc('book_queue_token', {
      p_facility_id: facilityId,
      p_service_id: serviceId,
      p_visitor_name: visitorName.trim(),
      p_phone: phone.trim() || null,
      p_priority: priority
    });

    if (error) {
      // Re-throw the actual safe database error. Never silently fallback!
      throw new Error(error.message || 'Database booking failed.');
    }

    if (!data || !data.id) {
      throw new Error('Database booking failed: No confirmation token returned by Supabase.');
    }

    // 3. Construct confirmed token object from confirmed Supabase row
    const peopleAhead = data.people_ahead || 0;
    const estWait = Math.max(10, peopleAhead * 15);
    const callTimeDate = new Date(Date.now() + estWait * 60000);
    const estimatedCallTime = callTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const confirmedToken = {
      id: data.id,
      facilityId: data.facility_id,
      facilityName: facilityName || 'Participating Facility',
      category: category || 'General',
      serviceId: data.service_id,
      serviceName: serviceName || 'Standard Service',
      tokenNumber: data.token_number,
      visitorName: data.visitor_name,
      phone: data.phone,
      priority: data.priority,
      status: data.status,
      createdAt: data.created_at || new Date().toISOString(),
      tokenDate: data.token_date,
      estimatedCallTime,
      peopleAhead,
      estimatedWaitMinutes: estWait,
      isLiveSupabase: true
    };

    // Keep active in local reactivity store
    localTokens = [confirmedToken, ...localTokens.filter(t => t.id !== confirmedToken.id)];

    // Synchronize into localAdminQueue so it appears immediately in the waiting queue
    const newAdminToken = {
      id: confirmedToken.id,
      facilityId: confirmedToken.facilityId,
      serviceId: confirmedToken.serviceId,
      tokenNumber: confirmedToken.tokenNumber,
      visitorName: confirmedToken.visitorName,
      phone: confirmedToken.phone,
      service: confirmedToken.serviceName,
      assignedCounter: 'Unassigned',
      counterId: null,
      status: 'waiting',
      priority: confirmedToken.priority === 'senior' ? 'Senior' : confirmedToken.priority === 'emergency' ? 'Emergency' : 'Normal',
      calledAt: 'Pending',
      waitTime: 'Just now',
      createdAt: confirmedToken.createdAt
    };
    localAdminQueue = [...localAdminQueue.filter(q => q.id !== confirmedToken.id), newAdminToken];

    notifyLocalSubscribers();

    return confirmedToken;
  }

  // Supabase not configured error
  throw new Error('ConfigurationError: Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

/**
 * 2. Cancel an active token
 */
export async function cancelVirtualToken(tokenId, reason = 'Cancelled by citizen') {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('cancel_queue_token', {
      p_token_id: tokenId,
      p_reason: reason
    });
    if (error) {
      throw new Error(error.message || 'Failed to cancel token in Supabase.');
    }
    localTokens = localTokens.filter(t => t.id !== tokenId);
    notifyLocalSubscribers();
    return data;
  }

  // Local state update
  localTokens = localTokens.map(t => t.id === tokenId ? { ...t, status: 'cancelled', cancellationReason: reason } : t);
  localAdminQueue = localAdminQueue.map(q => q.id === tokenId ? { ...q, status: 'delayed' } : q);

  localNotifications = [
    {
      id: `notif-${Date.now()}`,
      title: 'Token Cancelled',
      message: `Token has been successfully cancelled (${reason}).`,
      type: 'status_update',
      createdAt: new Date().toISOString(),
      isRead: false
    },
    ...localNotifications
  ];

  notifyLocalSubscribers();
  return { success: true };
}

/**
 * 3. Fetch Live Facility Queue for Admin Console
 * Strictly queries Supabase queue_tokens and counters for the specified facilityId.
 * Never falls back to fake/mock tokens when Supabase is configured.
 */
export async function getLiveFacilityQueue(facilityId) {
  if (!facilityId) {
    return { queue: [], counters: [] };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('queue_tokens')
        .select(`
          id,
          token_number,
          token_date,
          visitor_name,
          phone,
          priority,
          status,
          counter_id,
          facility_id,
          called_at,
          service_started_at,
          completed_at,
          created_at,
          service_id,
          services (
            id,
            name
          )
        `)
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Database error fetching queue: ${error.message}`);
      }

      // Fetch counters for this facility
      const { data: countersData, error: countersErr } = await supabase
        .from('counters')
        .select('id, facility_id, name, staff_name, status, current_token_id, supported_service_ids')
        .eq('facility_id', facilityId);

      if (countersErr) {
        throw new Error(`Database error fetching counters: ${countersErr.message}`);
      }

      const countersMap = new Map((countersData || []).map(c => [c.id, c.name]));

      const liveQueue = (data || []).map(item => {
        const createdDate = new Date(item.created_at);
        const calledDate = item.called_at ? new Date(item.called_at) : null;
        let waitTimeStr = 'Just now';
        if (calledDate) {
          const diffMins = Math.max(1, Math.round((calledDate - createdDate) / 60000));
          waitTimeStr = `${diffMins} min`;
        } else if (item.status === 'waiting') {
          const diffMins = Math.max(0, Math.round((Date.now() - createdDate) / 60000));
          waitTimeStr = diffMins === 0 ? 'Just now' : `${diffMins} min`;
        } else if (item.status === 'completed' && item.completed_at) {
          const diffMins = Math.max(1, Math.round((new Date(item.completed_at) - createdDate) / 60000));
          waitTimeStr = `${diffMins} min`;
        }

        return {
          id: item.id,
          facilityId: item.facility_id,
          tokenNumber: item.token_number,
          visitorName: item.visitor_name,
          phone: item.phone,
          service: item.services?.name || 'General Service',
          serviceId: item.service_id,
          assignedCounter: countersMap.get(item.counter_id) || (item.counter_id ? 'Assigned Desk' : 'Unassigned'),
          counterId: item.counter_id,
          status: item.status, // 'waiting' | 'called' | 'in_service' | 'completed' | 'cancelled'
          priority: item.priority === 'emergency' ? 'Emergency' : item.priority === 'senior' ? 'Senior' : 'Normal',
          calledAt: item.called_at ? new Date(item.called_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item.status === 'called' ? 'Just now' : 'Pending'),
          serviceStartedAt: item.service_started_at,
          completedAt: item.completed_at ? new Date(item.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          createdAt: item.created_at,
          waitTime: waitTimeStr
        };
      });

      const liveCounters = (countersData || []).map(c => {
        const currentTokenObj = liveQueue.find(q => q.id === c.current_token_id);
        return {
          id: c.id,
          facilityId: c.facility_id,
          name: c.name,
          staffName: c.staff_name,
          status: c.status,
          currentToken: currentTokenObj?.tokenNumber || null,
          supportedServiceIds: c.supported_service_ids || []
        };
      });

      localAdminQueue = liveQueue;
      localCounters = liveCounters;
      notifyLocalSubscribers();
      return { queue: liveQueue, counters: liveCounters };
    } catch (err) {
      console.error('[QueueService] Supabase getLiveFacilityQueue failed:', err.message);
      // Re-throw database error: Never fall back to fake/mock tokens!
      throw err;
    }
  }

  const filteredLocalQueue = facilityId 
    ? localAdminQueue.filter(q => !q.facilityId || q.facilityId === facilityId)
    : localAdminQueue;
  const filteredLocalCounters = facilityId
    ? localCounters.filter(c => !c.facilityId || c.facilityId === facilityId)
    : localCounters;
  return { queue: filteredLocalQueue, counters: filteredLocalCounters };
}

/**
 * 4. Admin: Call Next Token (Atomically changes status from 'waiting' to 'called')
 */
export async function adminCallNextToken(counterId) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('call_next_token', {
      p_counter_id: counterId
    });
    if (error) {
      throw new Error(error.message || 'Database call_next_token failed.');
    }

    if (data) {
      // If message indicates queue is empty
      if (data.success === false) {
        return { success: false, message: data.message || 'No citizens currently waiting in queue.' };
      }

      // Successfully called in Supabase!
      const calledTokenId = data.id;
      const calledTokenNum = data.token_number || data.tokenNumber;
      const counterObj = localCounters.find(c => c.id === counterId) || { name: 'Counter Desk' };
      const calledTimeStr = data.called_at 
        ? new Date(data.called_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update localAdminQueue: change status to 'called'
      const existingIdx = localAdminQueue.findIndex(q => q.id === calledTokenId || q.tokenNumber === calledTokenNum);
      if (existingIdx >= 0) {
        localAdminQueue[existingIdx] = {
          ...localAdminQueue[existingIdx],
          id: calledTokenId,
          tokenNumber: calledTokenNum,
          status: 'called',
          assignedCounter: counterObj.name,
          counterId,
          calledAt: calledTimeStr
        };
      } else {
        localAdminQueue = [{
          id: calledTokenId,
          tokenNumber: calledTokenNum,
          visitorName: data.visitor_name || 'Citizen',
          service: 'Assigned Service',
          assignedCounter: counterObj.name,
          counterId,
          status: 'called',
          priority: data.priority === 'emergency' ? 'Emergency' : data.priority === 'senior' ? 'Senior' : 'Normal',
          calledAt: calledTimeStr,
          createdAt: data.created_at || new Date().toISOString(),
          waitTime: 'Just now'
        }, ...localAdminQueue];
      }

      // Update localTokens for citizen view: status = 'called'
      localTokens = localTokens.map(t => {
        if (t.id === calledTokenId || t.tokenNumber === calledTokenNum) {
          return {
            ...t,
            id: calledTokenId,
            status: 'called',
            counterId,
            counterName: counterObj.name,
            peopleAhead: 0,
            queuePosition: 1,
            departureStatus: 'leave_now'
          };
        }
        if (t.status === 'waiting' && t.peopleAhead > 0) {
          return {
            ...t,
            peopleAhead: Math.max(0, t.peopleAhead - 1),
            queuePosition: Math.max(1, t.queuePosition - 1)
          };
        }
        return t;
      });

      // Update counter state: status = 'busy'
      localCounters = localCounters.map(c => 
        c.id === counterId ? { ...c, status: 'busy', currentToken: calledTokenNum } : c
      );

      notifyLocalSubscribers();
      return { 
        success: true, 
        token: {
          id: calledTokenId,
          tokenNumber: calledTokenNum,
          status: 'called',
          assignedCounter: counterObj.name
        }
      };
    }
  }

  // Local state atomic queue call (offline sandbox mode only)
  const waitingTokens = localAdminQueue.filter(q => q.status === 'waiting');
  if (waitingTokens.length === 0) {
    return { success: false, message: 'No citizens currently waiting in queue.' };
  }

  const sortedWaiting = [...waitingTokens].sort((a, b) => {
    const priorityOrder = { emergency: 1, senior: 2, normal: 3, Emergency: 1, Senior: 2, Normal: 3 };
    const prioA = priorityOrder[a.priority] || 3;
    const prioB = priorityOrder[b.priority] || 3;
    if (prioA !== prioB) return prioA - prioB;
    return (new Date(a.createdAt || 0)) - (new Date(b.createdAt || 0));
  });

  const tokenToCall = sortedWaiting[0];
  const counterObj = localCounters.find(c => c.id === counterId) || localCounters[0];
  const calledTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  localAdminQueue = localAdminQueue.map(q => {
    if (q.id === tokenToCall.id) {
      return {
        ...q,
        status: 'called',
        assignedCounter: counterObj?.name || 'Counter Desk',
        counterId: counterObj?.id || counterId,
        calledAt: calledTime
      };
    }
    return q;
  });

  localTokens = localTokens.map(t => {
    if (t.id === tokenToCall.id || t.tokenNumber === tokenToCall.tokenNumber) {
      return {
        ...t,
        status: 'called',
        counterId: counterObj?.id || counterId,
        counterName: counterObj?.name || 'Counter Desk',
        peopleAhead: 0,
        queuePosition: 1,
        departureStatus: 'leave_now'
      };
    }
    if (t.status === 'waiting' && t.peopleAhead > 0) {
      return {
        ...t,
        peopleAhead: Math.max(0, t.peopleAhead - 1),
        queuePosition: Math.max(1, t.queuePosition - 1)
      };
    }
    return t;
  });

  localCounters = localCounters.map(c => 
    c.id === counterId ? { ...c, status: 'busy', currentToken: tokenToCall.tokenNumber } : c
  );

  localNotifications = [
    {
      id: `notif-${Date.now()}`,
      title: `Token Called: #${tokenToCall.tokenNumber}`,
      message: `Please proceed to ${counterObj?.name || 'Counter Desk'}.`,
      type: 'token_called',
      createdAt: new Date().toISOString(),
      isRead: false
    },
    ...localNotifications
  ];

  notifyLocalSubscribers();
  return { 
    success: true, 
    token: {
      ...tokenToCall,
      status: 'called',
      assignedCounter: counterObj?.name || 'Counter Desk'
    } 
  };
}

/**
 * 5. Admin: Start Service (Transitions 'called' to 'in_service')
 */
export async function adminStartService(tokenId) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('start_token_service', { p_token_id: tokenId });
    if (error) {
      throw new Error(error.message || 'Database start_token_service failed.');
    }
    localAdminQueue = localAdminQueue.map(q => q.id === tokenId ? { ...q, status: 'in_service' } : q);
    localTokens = localTokens.map(t => t.id === tokenId ? { ...t, status: 'in_service' } : t);
    notifyLocalSubscribers();
    return { success: true, data };
  }

  localAdminQueue = localAdminQueue.map(q => q.id === tokenId ? { ...q, status: 'in_service' } : q);
  localTokens = localTokens.map(t => t.id === tokenId ? { ...t, status: 'in_service' } : t);
  notifyLocalSubscribers();
  return { success: true };
}

/**
 * 6. Admin: Complete Service (Transitions 'in_service' or 'called' to 'completed', frees counter)
 */
export async function adminCompleteService(tokenId) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('complete_token_service', { p_token_id: tokenId });
    if (error) {
      throw new Error(error.message || 'Database complete_token_service failed.');
    }
  }

  const completedItem = localAdminQueue.find(q => q.id === tokenId);
  const completedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Mark token as completed in queue (retained for queue history!)
  localAdminQueue = localAdminQueue.map(q => {
    if (q.id === tokenId) {
      return {
        ...q,
        status: 'completed',
        completedAt: completedTime
      };
    }
    return q;
  });

  localTokens = localTokens.map(t => {
    if (t.id === tokenId) {
      return {
        ...t,
        status: 'completed',
        completedAt: completedTime
      };
    }
    return t;
  });

  // Free assigned counter back to active
  if (completedItem?.assignedCounter || completedItem?.counterId) {
    localCounters = localCounters.map(c => {
      if (c.id === completedItem?.counterId || c.name === completedItem?.assignedCounter) {
        return { ...c, status: 'active', currentToken: null };
      }
      return c;
    });
  }

  localNotifications = [
    {
      id: `notif-${Date.now()}`,
      title: 'Service Completed',
      message: `Service for Token #${completedItem?.tokenNumber || ''} has been concluded. Counter is now open.`,
      type: 'status_update',
      createdAt: new Date().toISOString(),
      isRead: false
    },
    ...localNotifications
  ];

  notifyLocalSubscribers();
  return { success: true };
}

/**
 * 6. Admin: Update Counter Status (Open, Close, Break)
 */
export async function adminUpdateCounterStatus(counterId, status) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('update_counter_status', {
      p_counter_id: counterId,
      p_status: status
    });
    if (error) {
      throw new Error(error.message || 'Database update_counter_status failed.');
    }
    return data;
  }

  localCounters = localCounters.map(c => c.id === counterId ? { ...c, status } : c);
  notifyLocalSubscribers();
  return { success: true };
}

/**
 * Admin: Cancel or No-Show Token
 */
export async function adminCancelToken(tokenId, reason = 'Marked as no-show by staff') {
  return cancelVirtualToken(tokenId, reason);
}

/**
 * 7. Realtime Subscription Handler
 */
export function subscribeToQueueChanges(facilityId, onUpdate) {
  if (isSupabaseConfigured && supabase) {
    const channelId = `realtime_queue_${facilityId || 'all'}_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_tokens' },
        (payload) => {
          console.info('[Realtime] Queue Token change received:', payload);
          if (onUpdate) onUpdate({ type: 'token_change', payload });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'counters' },
        (payload) => {
          console.info('[Realtime] Counter change received:', payload);
          if (onUpdate) onUpdate({ type: 'counter_change', payload });
        }
      )
      .subscribe((status) => {
        console.info(`[Realtime Channel ${channelId}]:`, status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Fallback to local event listener
  const listener = (e) => {
    if (onUpdate) onUpdate(e.detail);
  };
  if (globalEmitter && typeof globalEmitter.addEventListener === 'function') {
    globalEmitter.addEventListener('queueless_state_update', listener);
  }

  return () => {
    if (globalEmitter && typeof globalEmitter.removeEventListener === 'function') {
      globalEmitter.removeEventListener('queueless_state_update', listener);
    }
  };
}

/**
 * Getter for current tokens and counters state
 */
export function getCurrentState() {
  return {
    tokens: localTokens,
    queue: localAdminQueue,
    counters: localCounters,
    notifications: localNotifications
  };
}

/**
 * 8. Fetch Anonymized Queue Metrics (No PII Exposed)
 */
export async function fetchPublicQueueMetrics(facilityId, serviceId = null) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.rpc('get_public_queue_metrics', {
        p_facility_id: facilityId,
        p_service_id: serviceId
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[QueueService] fetchPublicQueueMetrics failed, using local metrics:', err.message);
    }
  }

  // Local fallback metrics
  const waitingTokens = localAdminQueue.filter(q => q.status === 'waiting');
  const calledTokens = localAdminQueue.filter(q => q.status === 'called' || q.status === 'in_progress');
  const activeCounters = localCounters.filter(c => c.status === 'active' || c.status === 'busy');

  return {
    facility_id: facilityId,
    waiting_count: waitingTokens.length,
    currently_serving: calledTokens.map(t => t.tokenNumber),
    serving_tokens: calledTokens.map(t => t.tokenNumber),
    active_counters_count: activeCounters.length,
    average_service_minutes: 15,
    estimated_wait_minutes: Math.round((waitingTokens.length * 15) / Math.max(1, activeCounters.length))
  };
}

/**
 * 9. Mark Notification as Read (Supabase + Local Fallback)
 * Adheres to RLS and trigger constraints (only is_read is updated)
 */
export async function markNotificationAsRead(notificationId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[QueueService] markNotificationAsRead Supabase update failed:', err.message);
    }
  }

  localNotifications = localNotifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
  notifyLocalSubscribers();
  return { success: true };
}

/**
 * 10. Facility Claim Management (Secure Admin Elevation Workflow)
 * Zero client-side role self-granting: Super admin approval strictly required.
 */

/**
 * Submit an official administrative claim for a facility
 */
export async function submitFacilityClaim({
  facilityId,
  facilityName,
  claimantName,
  officialEmail,
  officialPhone,
  designation,
  governmentIdType,
  idProofUrl = '',
  authorizationLetterUrl = '',
  additionalNotes = ''
}) {
  if (!facilityId || !officialEmail || !officialPhone || !designation) {
    throw new Error('InvalidInput: Facility ID, official email, phone, and designation are required.');
  }

  // 1. Supabase Cloud submission if configured & user is authenticated
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Unauthenticated: You must be signed in to submit an institutional claim.');
      }

      const { data, error } = await supabase
        .from('facility_claims')
        .insert({
          facility_id: facilityId,
          claimant_id: session.user.id,
          claimant_name: claimantName || session.user.user_metadata?.full_name || 'Staff Representative',
          official_email: officialEmail.trim(),
          official_phone: officialPhone.trim(),
          designation: designation.trim(),
          government_id_type: governmentIdType || 'Employee ID Card',
          id_proof_url: idProofUrl,
          authorization_letter_url: authorizationLetterUrl,
          additional_notes: additionalNotes,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Database submission failed.');
      }

      return data;
    } catch (err) {
      console.warn('[QueueService] Supabase claim insert notice:', err.message);
      // If error is authentication or constraint, propagate it
      if (err.message.includes('Unauthenticated') || err.message.includes('Unique')) {
        throw err;
      }
    }
  }

  // 2. Interactive local state store fallback
  const newClaim = {
    id: `claim-${Date.now()}`,
    facilityId,
    facilityName: facilityName || 'Claimed Facility',
    claimantId: '00000000-0000-0000-0000-cit000000001',
    claimantName: claimantName || 'Staff Representative',
    officialEmail: officialEmail.trim(),
    officialPhone: officialPhone.trim(),
    designation: designation.trim(),
    governmentIdType: governmentIdType || 'Institutional Service Card',
    idProofUrl: idProofUrl || 'Verified in official directory',
    authorizationLetterUrl: authorizationLetterUrl || '',
    additionalNotes: additionalNotes || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  localFacilityClaims = [newClaim, ...localFacilityClaims];
  notifyLocalSubscribers();
  return newClaim;
}

/**
 * Fetch all facility claims (Super Admin view or Claimant view)
 */
export async function getFacilityClaims(claimantId = null) {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('facility_claims')
        .select(`
          id,
          facility_id,
          claimant_id,
          claimant_name,
          official_email,
          official_phone,
          designation,
          government_id_type,
          id_proof_url,
          authorization_letter_url,
          additional_notes,
          status,
          reviewed_by,
          reviewed_at,
          review_notes,
          created_at,
          facilities:facility_id (
            name,
            category,
            state,
            district,
            city,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (claimantId) {
        query = query.eq('claimant_id', claimantId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(c => ({
          ...c,
          facilityName: c.facilities?.name || 'Facility'
        }));
      }
    } catch (err) {
      console.warn('[QueueService] Supabase claims fetch notice:', err.message);
    }
  }

  if (claimantId) {
    return localFacilityClaims.filter(c => c.claimantId === claimantId);
  }
  return localFacilityClaims;
}

/**
 * Approve a facility claim (Strictly Super Admin only)
 * Elevates claimant to facility_admin and partners facility
 */
export async function approveFacilityClaim(claimId, adminNotes = 'Approved following institutional credential verification.') {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('approve_facility_claim', {
      p_claim_id: claimId,
      p_admin_notes: adminNotes
    });
    if (error) {
      throw new Error(error.message || 'Failed to approve facility claim in database.');
    }
    return data;
  }

  // Local fallback
  localFacilityClaims = localFacilityClaims.map(c => 
    c.id === claimId 
      ? { ...c, status: 'approved', reviewedAt: new Date().toISOString(), reviewNotes: adminNotes } 
      : c
  );
  notifyLocalSubscribers();
  return { success: true, claimId, status: 'approved' };
}

/**
 * Reject a facility claim with documented reason (Super Admin only)
 */
export async function rejectFacilityClaim(claimId, reason = 'Verification documentation could not be authenticated.') {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('reject_facility_claim', {
      p_claim_id: claimId,
      p_reason: reason
    });
    if (error) {
      throw new Error(error.message || 'Failed to reject claim in database.');
    }
    return data;
  }

  // Local fallback
  localFacilityClaims = localFacilityClaims.map(c => 
    c.id === claimId 
      ? { ...c, status: 'rejected', reviewedAt: new Date().toISOString(), reviewNotes: reason } 
      : c
  );
  notifyLocalSubscribers();
  return { success: true, claimId, status: 'rejected' };
}


