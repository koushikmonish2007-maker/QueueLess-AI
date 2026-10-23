/**
 * @file mockData.js
 * QueueLess AI — Team GEN4X (INTELLATHON 2K26)
 * Phase 1 Mock Dataset with explicit data models and consistent IDs.
 * Note: All data is illustrative for Phase 1 prototype demonstration.
 */

/**
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} name
 * @property {number} averageServiceMinutes
 * @property {string[]} supportedCounterIds
 * @property {string} description
 * @property {string} requirements
 */

/**
 * @typedef {Object} Counter
 * @property {string} id
 * @property {string} facilityId
 * @property {string} name
 * @property {string[]} supportedServiceIds
 * @property {'active' | 'busy' | 'break' | 'offline'} status
 * @property {string} staffName
 * @property {string} currentToken
 */

/**
 * @typedef {Object} Facility
 * @property {string} id
 * @property {string} name
 * @property {'Hospitals' | 'Government' | 'Banks' | 'Colleges' | 'Service Centers'} category
 * @property {string} location
 * @property {string} address
 * @property {number} rating
 * @property {number} activeQueues
 * @property {string} operatingHours
 * @property {string} phone
 * @property {Service[]} services
 * @property {Counter[]} counters
 */

/**
 * @typedef {Object} QueueToken
 * @property {string} id
 * @property {string} facilityId
 * @property {string} facilityName
 * @property {string} serviceId
 * @property {string} serviceName
 * @property {string} tokenNumber
 * @property {string} visitorName
 * @property {'waiting' | 'in_progress' | 'completed' | 'delayed'} status
 * @property {string} createdAt
 * @property {string} estimatedCallTime
 * @property {string} [counterId]
 * @property {string} [counterName]
 * @property {number} queuePosition
 * @property {number} peopleAhead
 * @property {number} estimatedWaitMinutes
 */

export const FACILITY_CATEGORIES = [
  'All',
  'Hospitals',
  'Government',
  'Banks',
  'Colleges',
  'Service Centers'
];

export const TN_DISTRICTS = [
  'All Districts',
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Salem',
  'Tirunelveli',
  'Vellore'
];

export const DEMO_LOCATIONS = [
  'All Locations',
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Salem',
  'Tirunelveli',
  'Vellore'
];

export const MOCK_FACILITIES = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Apex Super Specialty Hospital',
    category: 'Hospitals',
    district: 'Chennai',
    location: 'Anna Salai, Chennai',
    address: '42 Healthway Boulevard, Anna Salai, Chennai',
    rating: 4.8,
    activeQueues: 38,
    operatingHours: '24/7 (OPD 08:00 AM - 05:00 PM)',
    phone: '+91 (020) 2555-0199',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    description: 'Premier tertiary care hospital providing advanced outpatient consultations and diagnostic services.',
    services: [
      {
        id: '00000000-0000-0000-0001-000000000001',
        name: 'General OPD Consultation',
        averageServiceMinutes: 12,
        supportedCounterIds: ['00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000002'],
        description: 'First-tier physician evaluation, preliminary diagnosis, and referral routing.',
        requirements: 'Photo ID, previous medical prescription (if any)'
      },
      {
        id: '00000000-0000-0000-0001-000000000002',
        name: 'Cardiology Clinic',
        averageServiceMinutes: 20,
        supportedCounterIds: ['00000000-0000-0000-0002-000000000003'],
        description: 'Specialist ECG review, hypertension check, and cardiovascular care consultations.',
        requirements: 'Past ECG/blood report, doctor referral note'
      },
      {
        id: '00000000-0000-0000-0001-000000000003',
        name: 'Pathology & Blood Collection',
        averageServiceMinutes: 8,
        supportedCounterIds: [],
        description: 'Fasting blood draw, urine panel collections, and rapid routine screenings.',
        requirements: 'Doctor lab requisition slip, 10-12 hours fasting notice'
      }
    ],
    counters: [
      { id: '00000000-0000-0000-0002-000000000001', facilityId: '00000000-0000-0000-0000-000000000001', name: 'Counter 101 - OPD Intake', supportedServiceIds: ['00000000-0000-0000-0001-000000000001'], status: 'active', staffName: 'Dr. Aris Mehta', currentToken: null },
      { id: '00000000-0000-0000-0002-000000000002', facilityId: '00000000-0000-0000-0000-000000000001', name: 'Counter 102 - OPD Desk', supportedServiceIds: ['00000000-0000-0000-0001-000000000001'], status: 'active', staffName: 'Dr. Neha Verma', currentToken: null },
      { id: '00000000-0000-0000-0002-000000000003', facilityId: '00000000-0000-0000-0000-000000000001', name: 'Counter 201 - Cardiology Suite', supportedServiceIds: ['00000000-0000-0000-0001-000000000002'], status: 'active', staffName: 'Dr. K. Ramanathan', currentToken: null }
    ]
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Regional Passport & Citizen Seva Kendra',
    category: 'Government',
    district: 'Coimbatore',
    location: 'Gandhipuram, Coimbatore',
    address: 'Block C, Administrative Complex, Gandhipuram, Coimbatore',
    rating: 4.6,
    activeQueues: 52,
    operatingHours: '09:00 AM - 05:00 PM (Mon - Fri)',
    phone: '+91 (0422) 2444-8800',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    description: 'Centralized administrative hub for passport renewals, identity documents, and affidavits.',
    services: [
      {
        id: '00000000-0000-0000-0001-000000000004',
        name: 'Passport Renewal & Biometrics',
        averageServiceMinutes: 15,
        supportedCounterIds: ['00000000-0000-0000-0002-000000000004'],
        description: 'Biometric capture, document verification, and renewal clearance.',
        requirements: 'Original old passport, Aadhaar card, utility bill'
      }
    ],
    counters: [
      { id: '00000000-0000-0000-0002-000000000004', facilityId: '00000000-0000-0000-0000-000000000002', name: 'Desk A - Document Verification', supportedServiceIds: ['00000000-0000-0000-0001-000000000004'], status: 'active', staffName: 'Officer S. Deshmukh', currentToken: null }
    ]
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'National Commercial Bank — Financial City Branch',
    category: 'Banks',
    district: 'Madurai',
    location: 'KK Nagar, Madurai',
    address: 'Tower 4, Bypass Boulevard, KK Nagar, Madurai',
    rating: 4.7,
    activeQueues: 24,
    operatingHours: '10:00 AM - 04:30 PM (Mon - Sat)',
    phone: '+91 (0452) 2666-3322',
    imageUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
    description: 'Full-service financial facility handling retail banking, trade instruments, and fast teller queues.',
    services: [
      {
        id: '00000000-0000-0000-0001-000000000005',
        name: 'Retail Teller & Cash Transactions',
        averageServiceMinutes: 10,
        supportedCounterIds: [],
        description: 'Cash deposit, high-value demand drafts, and RTGS transfer requests.',
        requirements: 'Account passbook, cheque slip, PAN card for transactions > 50,000'
      }
    ],
    counters: []
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'State University — Registrar & Examination Hall',
    category: 'Colleges',
    district: 'Chennai',
    location: 'Guindy, Chennai',
    address: 'University Main Gate, North Academic Zone',
    rating: 4.5,
    activeQueues: 41,
    operatingHours: '10:00 AM - 04:00 PM (Mon - Fri)',
    phone: '+91 (044) 2569-1234',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Academic administrative services for transcript issuance, degree certificates, and hall ticket verification.',
    services: [],
    counters: []
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Unified Civic Municipal Service Center',
    category: 'Service Centers',
    district: 'Tiruchirappalli',
    location: 'South Valley',
    address: 'Ward 9, Municipal Square, South Valley',
    rating: 4.4,
    activeQueues: 33,
    operatingHours: '08:30 AM - 05:30 PM (Mon - Sat)',
    phone: '+91 (0431) 2712-9911',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'One-stop municipal services: property tax assessment, water utility billing, and trade licenses.',
    services: [],
    counters: []
  },
  {
    id: 'fac-hosp-02',
    name: 'City Children & Maternity Hospital',
    category: 'Hospitals',
    district: 'Salem',
    location: 'Fairlands, Salem',
    address: '18 Bloom Street, Fairlands, Salem',
    rating: 4.9,
    activeQueues: 19,
    operatingHours: '24/7 Service',
    phone: '+91 (0427) 2599-4400',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Pediatric care, immunization clinics, and prenatal wellness consultations with child-friendly queue systems.',
    services: [
      {
        id: 'srv-ped-01',
        name: 'Child Immunization & Growth Tracking',
        averageServiceMinutes: 10,
        supportedCounterIds: ['cnt-ped-01'],
        description: 'WHO-certified vaccination schedule administration and pediatric growth chart review.',
        requirements: 'Child immunization card, birth certificate'
      },
      {
        id: 'srv-ped-02',
        name: 'Pediatric Specialist Consultation',
        averageServiceMinutes: 18,
        supportedCounterIds: ['cnt-ped-02'],
        description: 'Comprehensive pediatric physician assessment.',
        requirements: 'Previous medical history, temperature chart'
      }
    ],
    counters: [
      { id: 'cnt-ped-01', facilityId: 'fac-hosp-02', name: 'Room 12 - Vaccine Bay', supportedServiceIds: ['srv-ped-01'], status: 'active', staffName: 'Nurse Pratibha', currentToken: 'PED-45' },
      { id: 'cnt-ped-02', facilityId: 'fac-hosp-02', name: 'Room 15 - OPD Specialist', supportedServiceIds: ['srv-ped-02'], status: 'active', staffName: 'Dr. Anand Iyer', currentToken: 'PED-46' }
    ]
  },
  {
    id: 'fac-gov-02',
    name: 'Palayamkottai Citizen Service & Aadhaar Center',
    category: 'Government',
    district: 'Tirunelveli',
    location: 'Palayamkottai, Tirunelveli',
    address: 'Collectorate Road, Palayamkottai, Tirunelveli',
    rating: 4.6,
    activeQueues: 28,
    operatingHours: '09:00 AM - 05:00 PM (Mon - Fri)',
    phone: '+91 (0462) 257-8811',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    description: 'Citizen verification, Aadhaar biometric updates, and civil registry queue management.',
    services: [
      {
        id: 'srv-aad-01',
        name: 'Aadhaar Biometric Update & Enrollment',
        averageServiceMinutes: 12,
        supportedCounterIds: ['cnt-aad-01'],
        description: 'Biometric update, demographic mobile link, and fresh enrollment.',
        requirements: 'Original ID proof, birth certificate'
      }
    ],
    counters: [
      { id: 'cnt-aad-01', facilityId: 'fac-gov-02', name: 'Counter 1 - Enrollment', supportedServiceIds: ['srv-aad-01'], status: 'active', staffName: 'K. Vignesh', currentToken: 'T-102' }
    ]
  },
  {
    id: 'fac-hosp-03',
    name: 'Vellore Regional Diagnostic & Healthcare Center',
    category: 'Hospitals',
    district: 'Vellore',
    location: 'Katpadi, Vellore',
    address: 'Health City Park, Katpadi, Vellore',
    rating: 4.7,
    activeQueues: 31,
    operatingHours: '24/7 (OPD 08:30 AM - 05:00 PM)',
    phone: '+91 (0416) 224-3300',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    description: 'Advanced diagnostic imaging, ultrasound screening, outpatient consultations, and express queue routing.',
    services: [
      {
        id: 'srv-vel-01',
        name: 'Diagnostic Ultrasound & Radiology',
        averageServiceMinutes: 15,
        supportedCounterIds: ['cnt-vel-01'],
        description: 'High-resolution abdominal ultrasound and digital chest radiographs.',
        requirements: 'Doctor lab requisition slip, 4 hours fasting'
      }
    ],
    counters: [
      { id: 'cnt-vel-01', facilityId: 'fac-hosp-03', name: 'Suite 4 - Radiology', supportedServiceIds: ['srv-vel-01'], status: 'active', staffName: 'Dr. S. Sundaram', currentToken: 'V-055' }
    ]
  }
];

export const MOCK_CITIZEN_ACTIVE_TOKENS = [
  {
    id: 'tok-cit-001',
    facilityId: '00000000-0000-0000-0000-000000000001',
    facilityName: 'Apex Super Specialty Hospital',
    category: 'Hospitals',
    serviceId: '00000000-0000-0000-0001-000000000002',
    serviceName: 'Cardiology Clinic',
    tokenNumber: 'C-044',
    visitorName: 'Aditya Sharma',
    status: 'waiting',
    createdAt: 'Today, 10:15 AM',
    estimatedCallTime: '11:10 AM',
    counterId: '00000000-0000-0000-0002-000000000003',
    counterName: 'Counter 201 - Cardiology Suite',
    queuePosition: 3,
    peopleAhead: 2,
    estimatedWaitMinutes: 24,
    currentServingToken: 'C-042',
    travelTimeMinutes: 18,
    recommendedDepartureTime: '10:42 AM',
    departureStatus: 'leave_soon', // 'stay_put' | 'leave_soon' | 'leave_now'
    facilityLocation: 'Metro Central (3.8 km away)',
    notes: 'Please bring your previous ECG and prescription papers.'
  },
  {
    id: 'tok-cit-002',
    facilityId: '00000000-0000-0000-0000-000000000002',
    facilityName: 'Regional Passport & Citizen Seva Kendra',
    category: 'Government',
    serviceId: '00000000-0000-0000-0001-000000000004',
    serviceName: 'Passport Renewal & Biometrics',
    tokenNumber: 'G-315',
    visitorName: 'Aditya Sharma',
    status: 'waiting',
    createdAt: 'Today, 01:20 PM',
    estimatedCallTime: '02:45 PM',
    counterId: '00000000-0000-0000-0002-000000000004',
    counterName: 'Desk A - Document Verification',
    queuePosition: 12,
    peopleAhead: 11,
    estimatedWaitMinutes: 75,
    currentServingToken: 'G-301',
    travelTimeMinutes: 25,
    recommendedDepartureTime: '02:05 PM',
    departureStatus: 'stay_put',
    facilityLocation: 'Civic Center (7.2 km away)',
    notes: 'Keep original ARN printout and national ID ready.'
  }
];

export const MOCK_CITIZEN_HISTORY = [
  {
    id: 'tok-hist-01',
    facilityName: 'National Commercial Bank',
    serviceName: 'KYC & Account Modernization',
    tokenNumber: 'K-039',
    date: 'Yesterday, 03:15 PM',
    status: 'completed',
    counterName: 'Desk 5 (KYC / Accounts)',
    actualWaitTime: '12 mins',
    savedTimeEstimate: '38 mins'
  },
  {
    id: 'tok-hist-02',
    facilityName: 'Unified Civic Municipal Center',
    serviceName: 'Property Tax Assessment',
    tokenNumber: 'M-112',
    date: '08 Oct 2026',
    status: 'completed',
    counterName: 'Window 1 - Property Tax',
    actualWaitTime: '8 mins',
    savedTimeEstimate: '52 mins'
  },
  {
    id: 'tok-hist-03',
    facilityName: 'Apex Super Specialty Hospital',
    serviceName: 'Pathology & Blood Collection',
    tokenNumber: 'P-198',
    date: '02 Oct 2026',
    status: 'completed',
    counterName: 'Counter 108 - Pathology Lab',
    actualWaitTime: '6 mins',
    savedTimeEstimate: '45 mins'
  }
];

export const MOCK_ADMIN_QUEUE = [
  {
    id: 'tok-adm-01',
    tokenNumber: 'H-104',
    visitorName: 'Rohan Deshmukh',
    service: 'General OPD Consultation',
    assignedCounter: 'Counter 101 - OPD Intake',
    status: 'in_service',
    waitTime: '14 min',
    calledAt: '10:48 AM',
    priority: 'Normal'
  },
  {
    id: 'tok-adm-02',
    tokenNumber: 'H-105',
    visitorName: 'Sunita Agarwal',
    service: 'General OPD Consultation',
    assignedCounter: 'Counter 102 - OPD Desk',
    status: 'in_service',
    waitTime: '11 min',
    calledAt: '10:50 AM',
    priority: 'Normal'
  },
  {
    id: 'tok-adm-03',
    tokenNumber: 'C-042',
    visitorName: 'Harish Patel',
    service: 'Cardiology Clinic',
    assignedCounter: 'Counter 201 - Cardiology Suite',
    status: 'called',
    waitTime: '22 min',
    calledAt: '10:40 AM',
    priority: 'Senior'
  },
  {
    id: 'tok-adm-04',
    tokenNumber: 'C-043',
    visitorName: 'Meenakshi Sundaram',
    service: 'Cardiology Clinic',
    assignedCounter: 'Unassigned',
    status: 'waiting',
    waitTime: '18 min',
    calledAt: 'Pending',
    priority: 'Normal'
  },
  {
    id: 'tok-adm-05',
    tokenNumber: 'C-044',
    visitorName: 'Aditya Sharma',
    service: 'Cardiology Clinic',
    assignedCounter: 'Unassigned',
    status: 'waiting',
    waitTime: '24 min',
    calledAt: 'Pending',
    priority: 'Normal'
  },
  {
    id: 'tok-adm-06',
    tokenNumber: 'P-211',
    visitorName: 'Tanya Banerjee',
    service: 'Pathology & Blood Collection',
    assignedCounter: 'Counter 101 - OPD Intake',
    status: 'in_service',
    waitTime: '5 min',
    calledAt: '10:53 AM',
    priority: 'Normal'
  },
  {
    id: 'tok-adm-07',
    tokenNumber: 'P-212',
    visitorName: 'Girish Kumar',
    service: 'Pathology & Blood Collection',
    assignedCounter: 'Counter 108',
    status: 'waiting',
    waitTime: '8 min',
    calledAt: 'Pending',
    priority: 'Normal'
  },
  {
    id: 'tok-adm-08',
    tokenNumber: 'H-103',
    visitorName: 'Fatima Zafar',
    service: 'General OPD Consultation',
    assignedCounter: 'Counter 101',
    status: 'completed',
    waitTime: '13 min',
    calledAt: '10:35 AM',
    priority: 'Normal'
  },
  {
    id: 'tok-adm-09',
    tokenNumber: 'H-102',
    visitorName: 'Devendra Patil',
    service: 'General OPD Consultation',
    assignedCounter: 'Counter 102',
    status: 'completed',
    waitTime: '10 min',
    calledAt: '10:32 AM',
    priority: 'Normal'
  },
  {
    id: 'tok-adm-10',
    tokenNumber: 'H-106',
    visitorName: 'Amitabh Sen',
    service: 'General OPD Consultation',
    assignedCounter: 'Unassigned',
    status: 'delayed',
    waitTime: '32 min',
    calledAt: 'Not Present (Grace 5m)',
    priority: 'Normal'
  }
];

export const MOCK_ADMIN_ANALYTICS = {
  hourlyTraffic: [
    { hour: '08 AM', waiting: 8, served: 12, estWaitMinutes: 10 },
    { hour: '09 AM', waiting: 19, served: 24, estWaitMinutes: 16 },
    { hour: '10 AM', waiting: 38, served: 32, estWaitMinutes: 25 },
    { hour: '11 AM', waiting: 44, served: 36, estWaitMinutes: 28 },
    { hour: '12 PM', waiting: 35, served: 30, estWaitMinutes: 21 },
    { hour: '01 PM', waiting: 22, served: 18, estWaitMinutes: 14 },
    { hour: '02 PM', waiting: 29, served: 26, estWaitMinutes: 18 },
    { hour: '03 PM', waiting: 32, served: 28, estWaitMinutes: 19 },
    { hour: '04 PM', waiting: 18, served: 22, estWaitMinutes: 12 }
  ],
  serviceDistribution: [
    { name: 'General OPD', value: 42, color: '#2563EB' },
    { name: 'Cardiology', value: 24, color: '#06B6D4' },
    { name: 'Pathology Lab', value: 20, color: '#3B82F6' },
    { name: 'Pharmacy', value: 14, color: '#10B981' }
  ],
  counterUtilization: [
    { name: 'Counter 101 (OPD)', load: 88, status: 'Active' },
    { name: 'Counter 102 (OPD)', load: 82, status: 'Active' },
    { name: 'Counter 201 (Cardiology)', load: 94, status: 'High Load' },
    { name: 'Counter 108 (Pathology)', load: 68, status: 'Optimal' },
    { name: 'Counter 115 (Pharmacy)', load: 45, status: 'Idle / Break' }
  ]
};

export const MOCK_PLATFORM_STATS = {
  totalFacilities: 64,
  activeQueuesToday: 1248,
  averageWaitSavedMinutes: 47,
  citizenSatisfactionRate: 98.4
};

export const MOCK_HOURLY_ANALYTICS = [
  { hour: '08:00', volume: 18, waitMinutes: 8 },
  { hour: '09:00', volume: 42, waitMinutes: 14 },
  { hour: '10:00', volume: 78, waitMinutes: 26 },
  { hour: '11:00', volume: 96, waitMinutes: 32 },
  { hour: '12:00', volume: 74, waitMinutes: 24 },
  { hour: '13:00', volume: 38, waitMinutes: 12 },
  { hour: '14:00', volume: 56, waitMinutes: 18 },
  { hour: '15:00', volume: 68, waitMinutes: 22 },
  { hour: '16:00', volume: 52, waitMinutes: 16 },
  { hour: '17:00', volume: 24, waitMinutes: 9 }
];

export const MOCK_DISTRICT_MAP_DATA = [
  { district: 'Chennai', status: 'Moderate', activeCenters: 22, activeQueues: 186 },
  { district: 'Coimbatore', status: 'Smooth Flow', activeCenters: 14, activeQueues: 92 },
  { district: 'Madurai', status: 'Moderate', activeCenters: 11, activeQueues: 74 },
  { district: 'Tiruchirappalli', status: 'Smooth Flow', activeCenters: 9, activeQueues: 58 },
  { district: 'Salem', status: 'Smooth Flow', activeCenters: 7, activeQueues: 41 },
  { district: 'Tirunelveli', status: 'Smooth Flow', activeCenters: 6, activeQueues: 33 },
  { district: 'Vellore', status: 'Moderate', activeCenters: 8, activeQueues: 49 },
  { district: 'Erode', status: 'Smooth Flow', activeCenters: 5, activeQueues: 29 }
];

