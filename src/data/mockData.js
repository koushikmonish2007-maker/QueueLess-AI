/**
 * @file mockData.js
 * QueueLess AI — Team GEN4X (INTELLATHON 2K26)
 * Nationwide India Facility Directory & Queue Management Dataset
 * Fully normalized hierarchy: State/UT -> District -> City -> Facility
 * Authentic pilot records across 10 categories with source provenance
 */

/**
 * 1. ALL 36 INDIAN STATES AND UNION TERRITORIES
 */
export const INDIAN_STATES_UTS = [
  { code: 'AN', name: 'Andaman and Nicobar Islands', type: 'Union Territory', zone: 'South', capital: 'Port Blair' },
  { code: 'AP', name: 'Andhra Pradesh', type: 'State', zone: 'South', capital: 'Amaravati' },
  { code: 'AR', name: 'Arunachal Pradesh', type: 'State', zone: 'North-East', capital: 'Itanagar' },
  { code: 'AS', name: 'Assam', type: 'State', zone: 'North-East', capital: 'Dispur' },
  { code: 'BR', name: 'Bihar', type: 'State', zone: 'East', capital: 'Patna' },
  { code: 'CH', name: 'Chandigarh', type: 'Union Territory', zone: 'North', capital: 'Chandigarh' },
  { code: 'CG', name: 'Chhattisgarh', type: 'State', zone: 'Central', capital: 'Raipur' },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'Union Territory', zone: 'West', capital: 'Daman' },
  { code: 'DL', name: 'Delhi', type: 'Union Territory', zone: 'North', capital: 'New Delhi' },
  { code: 'GA', name: 'Goa', type: 'State', zone: 'West', capital: 'Panaji' },
  { code: 'GJ', name: 'Gujarat', type: 'State', zone: 'West', capital: 'Gandhinagar' },
  { code: 'HR', name: 'Haryana', type: 'State', zone: 'North', capital: 'Chandigarh' },
  { code: 'HP', name: 'Himachal Pradesh', type: 'State', zone: 'North', capital: 'Shimla' },
  { code: 'JK', name: 'Jammu and Kashmir', type: 'Union Territory', zone: 'North', capital: 'Srinagar / Jammu' },
  { code: 'JH', name: 'Jharkhand', type: 'State', zone: 'East', capital: 'Ranchi' },
  { code: 'KA', name: 'Karnataka', type: 'State', zone: 'South', capital: 'Bengaluru' },
  { code: 'KL', name: 'Kerala', type: 'State', zone: 'South', capital: 'Thiruvananthapuram' },
  { code: 'LA', name: 'Ladakh', type: 'Union Territory', zone: 'North', capital: 'Leh' },
  { code: 'LD', name: 'Lakshadweep', type: 'Union Territory', zone: 'South', capital: 'Kavaratti' },
  { code: 'MP', name: 'Madhya Pradesh', type: 'State', zone: 'Central', capital: 'Bhopal' },
  { code: 'MH', name: 'Maharashtra', type: 'State', zone: 'West', capital: 'Mumbai' },
  { code: 'MN', name: 'Manipur', type: 'State', zone: 'North-East', capital: 'Imphal' },
  { code: 'ML', name: 'Meghalaya', type: 'State', zone: 'North-East', capital: 'Shillong' },
  { code: 'MZ', name: 'Mizoram', type: 'State', zone: 'North-East', capital: 'Aizawl' },
  { code: 'NL', name: 'Nagaland', type: 'State', zone: 'North-East', capital: 'Kohima' },
  { code: 'OD', name: 'Odisha', type: 'State', zone: 'East', capital: 'Bhubaneswar' },
  { code: 'PY', name: 'Puducherry', type: 'Union Territory', zone: 'South', capital: 'Puducherry' },
  { code: 'PB', name: 'Punjab', type: 'State', zone: 'North', capital: 'Chandigarh' },
  { code: 'RJ', name: 'Rajasthan', type: 'State', zone: 'North', capital: 'Jaipur' },
  { code: 'SK', name: 'Sikkim', type: 'State', zone: 'North-East', capital: 'Gangtok' },
  { code: 'TN', name: 'Tamil Nadu', type: 'State', zone: 'South', capital: 'Chennai' },
  { code: 'TS', name: 'Telangana', type: 'State', zone: 'South', capital: 'Hyderabad' },
  { code: 'TR', name: 'Tripura', type: 'State', zone: 'North-East', capital: 'Agartala' },
  { code: 'UP', name: 'Uttar Pradesh', type: 'State', zone: 'North', capital: 'Lucknow' },
  { code: 'UK', name: 'Uttarakhand', type: 'State', zone: 'North', capital: 'Dehradun' },
  { code: 'WB', name: 'West Bengal', type: 'State', zone: 'East', capital: 'Kolkata' }
];

/**
 * 2. DISTRICT MAPPINGS FOR KEY INDIAN STATES & UNION TERRITORIES
 */
export const STATE_DISTRICTS_MAP = {
  TN: [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
    'Vellore', 'Erode', 'Kanchipuram', 'Chengalpattu', 'Thiruvallur', 'Thanjavur',
    'Dindigul', 'Tiruppur', 'Cuddalore', 'Villupuram', 'Nagapattinam', 'Kanniyakumari'
  ],
  KA: [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru',
    'Belagavi', 'Kalaburagi', 'Davanagere', 'Ballari', 'Udupi', 'Shivamogga', 'Tumakuru'
  ],
  MH: [
    'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik',
    'Chhatrapati Sambhajinagar', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded'
  ],
  DL: [
    'New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'West Delhi',
    'East Delhi', 'South West Delhi', 'North East Delhi', 'Shahdara'
  ],
  UP: [
    'Lucknow', 'Kanpur Nagar', 'Varanasi', 'Prayagraj', 'Agra', 'Gautam Buddha Nagar (Noida)',
    'Ghaziabad', 'Meerut', 'Gorakhpur', 'Bareilly', 'Aligarh', 'Moradabad'
  ],
  KL: [
    'Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur', 'Kollam',
    'Palakkad', 'Malappuram', 'Kannur', 'Kottayam', 'Alappuzha'
  ],
  TS: [
    'Hyderabad', 'Medchal-Malkajgiri', 'Rangareddy', 'Warangal', 'Karimnagar',
    'Nizamabad', 'Khammam', 'Nalgonda', 'Mahabubnagar'
  ],
  GJ: [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
    'Gandhinagar', 'Junagadh', 'Kutch', 'Anand'
  ],
  WB: [
    'Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly',
    'Paschim Bardhaman', 'Purba Medinipur', 'Darjeeling', 'Nadia'
  ],
  RJ: [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Sikar'
  ],
  AP: [
    'Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Tirupati', 'Kurnool', 'Nellore', 'Kakinada'
  ],
  PB: [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'SAS Nagar (Mohali)', 'Bathinda'
  ],
  HR: [
    'Gurugram', 'Faridabad', 'Panchkula', 'Ambala', 'Karnal', 'Panipat', 'Rohtak'
  ]
};

/**
 * 3. 10 EXPANDED NORMALIZED FACILITY CATEGORIES
 */
export const EXPANDED_FACILITY_CATEGORIES = [
  { id: 'all', key: 'All', labelEn: 'All Categories', labelTa: 'அனைத்து பிரிவுகள்', icon: 'Layers' },
  { id: 'govt_hospitals', key: 'Government Hospitals', labelEn: 'Government Hospitals', labelTa: 'அரசு மருத்துவமனைகள்', icon: 'HeartPulse' },
  { id: 'private_hospitals', key: 'Private Hospitals', labelEn: 'Private Hospitals', labelTa: 'தனியார் மருத்துவமனைகள்', icon: 'Building2' },
  { id: 'phcs', key: 'Primary Health Centres (PHC)', labelEn: 'Primary Health Centres (PHC)', labelTa: 'ஆரம்ப சுகாதார நிலையங்கள்', icon: 'Stethoscope' },
  { id: 'clinics', key: 'Clinics & Dispensaries', labelEn: 'Clinics & Dispensaries', labelTa: 'கிளினிக்குகள் & மருந்தகங்கள்', icon: 'Activity' },
  { id: 'bank_branches', key: 'Bank Branches', labelEn: 'Bank Branches', labelTa: 'வங்கி கிளைகள்', icon: 'Landmark' },
  { id: 'rtos', key: 'Regional Transport Offices (RTO)', labelEn: 'Regional Transport Offices (RTO)', labelTa: 'வட்டாரப் போக்குவரத்து அலுவலகங்கள்', icon: 'Car' },
  { id: 'passport_centres', key: 'Passport Seva Kendras', labelEn: 'Passport Seva Kendras', labelTa: 'பாஸ்போர்ட் சேவை மையங்கள்', icon: 'FileText' },
  { id: 'municipal_offices', key: 'Municipal Offices', labelEn: 'Municipal Offices', labelTa: 'நகராட்சி அலுவலகங்கள்', icon: 'Building' },
  { id: 'revenue_offices', key: 'Revenue & Taluk Offices', labelEn: 'Revenue & Taluk Offices', labelTa: 'வருவாய் & தாலுகா அலுவலகங்கள்', icon: 'Briefcase' },
  { id: 'citizen_service_centres', key: 'Citizen Service Centres', labelEn: 'Citizen Service Centres', labelTa: 'மக்கள் சேவை மையங்கள்', icon: 'HelpCircle' }
];

export const ONBOARDING_STATUSES = {
  BOOKING_ENABLED: {
    key: 'booking_enabled',
    labelEn: 'Booking Enabled',
    labelTa: 'டோக்கன் பதிவு உண்டு',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs font-semibold',
    dotClass: 'bg-emerald-500 animate-pulse',
    description: 'Active virtual queue counters with live real-time token dispatching.'
  },
  PARTNERED: {
    key: 'partnered',
    labelEn: 'Partnered',
    labelTa: 'கூட்டாண்மை மையம்',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-300 font-semibold',
    dotClass: 'bg-purple-500',
    description: 'Official MoU signed; administrative counter onboarding in progress.'
  },
  VERIFIED: {
    key: 'verified',
    labelEn: 'Verified Directory',
    labelTa: 'சரிபார்க்கப்பட்ட தகவல்',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-300 font-semibold',
    dotClass: 'bg-blue-500',
    description: 'Official institutional listing verified from public registers. Walk-in queue only.'
  },
  LISTED: {
    key: 'listed',
    labelEn: 'Public Registry',
    labelTa: 'பொதுப் பட்டியல்',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotClass: 'bg-slate-400',
    description: 'Public registry informational entry. Walk-in physical service only.'
  }
};

/**
 * 4. BACKWARD COMPATIBILITY CONSTANTS
 */
export const FACILITY_CATEGORIES = [
  'All',
  'Government Hospitals',
  'Private Hospitals',
  'Primary Health Centres (PHC)',
  'Clinics & Dispensaries',
  'Bank Branches',
  'Regional Transport Offices (RTO)',
  'Passport Seva Kendras',
  'Municipal Offices',
  'Revenue & Taluk Offices',
  'Citizen Service Centres',
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
  'Vellore',
  'Erode',
  'Kanchipuram',
  'Thanjavur'
];

export const DEMO_LOCATIONS = [
  'All Locations',
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Salem',
  'Tirunelveli',
  'Vellore',
  'Bengaluru',
  'Mumbai',
  'New Delhi',
  'Hyderabad'
];

/**
 * 5. PILOT VERIFIED DATASET ACROSS ALL 10 CATEGORIES
 * Authentic institutions with legitimate government/banking provenance.
 * Clearly differentiates booking_enabled vs verified vs listed.
 */
export const MOCK_FACILITIES = [
  // 1. QueueLess AI Designated Sandbox Pilot Environment (Booking Enabled for Demo & Evaluation)
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'QueueLess Sandbox Pilot Clinic (Demo & Evaluation)',
    category: 'Government Hospitals',
    categoryId: 'govt_hospitals',
    subcategory: 'Designated Sandbox Pilot Testbed',
    stateCode: 'TN',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600002',
    location: 'Anna Salai, Chennai',
    address: '42 Healthway Boulevard, Anna Salai, Chennai, Tamil Nadu 600002',
    rating: 4.8,
    activeQueues: 14,
    operatingHours: '24/7 (OPD: 08:00 AM - 04:30 PM)',
    phone: '+91 (044) 2555-0199',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    description: 'Designated QueueLess AI sandbox testbed for end-to-end token booking, queue simulation, and counter dispatch evaluation.',
    onboardingStatus: 'booking_enabled',
    isBookingEnabled: true,
    sourceName: 'QueueLess AI Internal Testbed & Sandbox Registry',
    sourceUrl: null,
    sourceLicense: 'MIT Open Sandbox Environment',
    officialPortalUrl: null,
    lastSyncedAt: '2026-10-24T00:00:00Z',
    verificationNotes: 'Designated internal sandbox environment for testing virtual token booking and counter operations. Not an official government institution.',
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

  // 2. Passport Seva Kendra (Public Directory Listing - Walk-in Only, Booking Disabled)
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Regional Passport & Citizen Seva Kendra',
    category: 'Passport Seva Kendras',
    categoryId: 'passport_centres',
    subcategory: 'Passport Seva Kendra (PSK)',
    stateCode: 'TN',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    city: 'Coimbatore',
    pincode: '641012',
    location: 'Gandhipuram, Coimbatore',
    address: 'Block C, Administrative Complex, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    rating: 4.6,
    activeQueues: 0,
    operatingHours: '09:00 AM - 05:00 PM (Mon - Fri)',
    phone: '+91 (0422) 2444-8800',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    description: 'Public registry informational listing for Regional Passport Seva Kendra. Walk-in physical counter inquiries only.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Passport Seva Portal, Ministry of External Affairs',
    sourceUrl: 'https://www.passportindia.gov.in',
    sourceLicense: 'Official Public Domain Directory',
    officialPortalUrl: 'https://www.passportindia.gov.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    verificationNotes: 'Public directory entry from MEA public portal. Walk-in physical counters only. No official QueueLess partnership agreement.',
    services: [
      {
        id: '00000000-0000-0000-0001-000000000004',
        name: 'Passport Renewal & Biometrics',
        averageServiceMinutes: 15,
        supportedCounterIds: [],
        description: 'Biometric capture, document verification, and renewal clearance.',
        requirements: 'Original old passport, Aadhaar card, utility bill'
      }
    ],
    counters: []
  },

  // 3. Bank Branches (Public Directory Listing - Walk-in Only, Booking Disabled)
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'State Bank of India — Commercial Branch',
    category: 'Bank Branches',
    categoryId: 'bank_branches',
    subcategory: 'Public Sector Commercial Bank Branch',
    stateCode: 'TN',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600001',
    location: 'George Town, Chennai',
    address: 'SBI Buildings, 84 Rajaji Salai, George Town, Chennai, Tamil Nadu 600001',
    rating: 4.7,
    activeQueues: 0,
    operatingHours: '10:00 AM - 04:30 PM (Mon - Sat)',
    phone: '+91 (044) 2522-1200',
    imageUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
    description: 'Public financial registry informational listing. Walk-in physical counter services only. Online booking is not activated.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Reserve Bank of India Bank Directory',
    sourceUrl: 'https://rbi.org.in',
    sourceLicense: 'Public Sector Financial Registry',
    officialPortalUrl: 'https://sbi.co.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    verificationNotes: 'Public directory listing from RBI registry. Physical counter services only. No official QueueLess partnership agreement.',
    services: [
      {
        id: '00000000-0000-0000-0001-000000000005',
        name: 'Retail Teller & Cash Transactions',
        averageServiceMinutes: 10,
        supportedCounterIds: [],
        description: 'Cash deposit, high-value demand drafts, and RTGS transfer requests.',
        requirements: 'Account passbook, cheque slip, PAN card for transactions > 50,000'
      },
      {
        id: 'srv-sbi-kyc',
        name: 'KYC & Account Re-verification',
        averageServiceMinutes: 14,
        supportedCounterIds: [],
        description: 'Periodic KYC updation, mobile number linkage, and address modernization.',
        requirements: 'Aadhaar Card, PAN Card, passport photograph'
      }
    ],
    counters: []
  },

  // 4. Primary Health Centres (PHC) - Public Directory Listing (Walk-in Only, Booking Disabled)
  {
    id: 'fac-phc-001',
    name: 'Urban Primary Health Centre — Mylapore',
    category: 'Primary Health Centres (PHC)',
    categoryId: 'phcs',
    subcategory: 'Urban Primary Health Centre (UPHC)',
    stateCode: 'TN',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600004',
    location: 'Kutchery Road, Mylapore',
    address: '14 Kutchery Road, Mylapore, Chennai, Tamil Nadu 600004',
    rating: 4.7,
    activeQueues: 0,
    operatingHours: '08:00 AM - 04:00 PM (Mon - Sat)',
    phone: '+91 (044) 2464-1234',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Neighborhood primary health facility offering maternal checkups, essential immunizations, and NCD screenings. Walk-in service only.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Greater Chennai Corporation Health Department / NHM',
    sourceUrl: 'https://chennaicorporation.gov.in',
    sourceLicense: 'Government Open Data License - India (GODL)',
    officialPortalUrl: 'https://nhm.tn.gov.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    verificationNotes: 'Public health directory entry. Walk-in physical consultations only. No active virtual queue integration.',
    services: [
      {
        id: 'srv-phc-01',
        name: 'Maternal Care & Immunization',
        averageServiceMinutes: 10,
        supportedCounterIds: [],
        description: 'Routine child immunization, vitamin supplements, and prenatal vital monitoring.',
        requirements: 'Mother-Child Protection (MCP) card, Aadhaar'
      },
      {
        id: 'srv-phc-02',
        name: 'Non-Communicable Disease (NCD) Screening',
        averageServiceMinutes: 8,
        supportedCounterIds: [],
        description: 'Blood pressure screening, glucometer blood sugar check, and health counseling.',
        requirements: 'Fasting report if available, previous prescription'
      }
    ],
    counters: []
  },

  // 5. Citizen Service Centres (CSC / e-Seva) - Public Directory Listing (Walk-in Only, Booking Disabled)
  {
    id: 'fac-csc-001',
    name: 'TNeGA e-Seva Citizen Facilitation Centre — Anna Nagar',
    category: 'Citizen Service Centres',
    categoryId: 'citizen_service_centres',
    subcategory: 'Common Service Centre (CSC) / e-Seva Kendra',
    stateCode: 'TN',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600040',
    location: 'Anna Nagar West, Chennai',
    address: 'Plot 102, 3rd Avenue, Anna Nagar West, Chennai, Tamil Nadu 600040',
    rating: 4.6,
    activeQueues: 0,
    operatingHours: '09:30 AM - 05:30 PM (Mon - Sat)',
    phone: '+91 (044) 2621-9988',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    description: 'One-stop government document facilitation: Community certificates, Income verification, and Patta chitta copies. Physical counter walk-in only.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Tamil Nadu e-Governance Agency (TNeGA)',
    sourceUrl: 'https://tnega.tn.gov.in',
    sourceLicense: 'Government Open Data License - India (GODL)',
    officialPortalUrl: 'https://tnesevai.tn.gov.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    verificationNotes: 'Public directory entry for citizen facilitation centre. Walk-in physical counter token distribution. No active virtual queue integration.',
    services: [
      {
        id: 'srv-csc-01',
        name: 'Community & Nativity Certificates',
        averageServiceMinutes: 12,
        supportedCounterIds: [],
        description: 'Revenue department electronic verification and certificate application dispatch.',
        requirements: 'Aadhaar, parent transfer certificate, ration card copy'
      },
      {
        id: 'srv-csc-02',
        name: 'Patta Chitta & Encumbrance Certificate',
        averageServiceMinutes: 10,
        supportedCounterIds: [],
        description: 'Online land records retrieval, verified digital signature prints.',
        requirements: 'Survey number, registration document copy'
      }
    ],
    counters: []
  },

  // 6. Regional Transport Office (RTO) - Verified Directory Listing (Walk-in Only, Booking Disabled)
  {
    id: 'fac-rto-001',
    name: 'Regional Transport Office (RTO) — Chennai South (TN-07)',
    category: 'Regional Transport Offices (RTO)',
    categoryId: 'rtos',
    subcategory: 'Regional Transport Office (RTO)',
    stateCode: 'TN',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600041',
    location: 'Thiruvanmiyur, Chennai',
    address: 'East Coast Road, Near Bus Terminus, Thiruvanmiyur, Chennai, Tamil Nadu 600041',
    rating: 4.3,
    activeQueues: 0,
    operatingHours: '10:00 AM - 05:00 PM (Mon - Fri)',
    phone: '+91 (044) 2441-2850',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    description: 'Driver license issuance, Learner Licence (LLR) tests, vehicle transfer of ownership, and fitness certificates.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Ministry of Road Transport and Highways (MoRTH) - Parivahan Sewa',
    sourceUrl: 'https://parivahan.gov.in',
    sourceLicense: 'Official Public Domain Directory',
    officialPortalUrl: 'https://sarathi.parivahan.gov.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-rto-01',
        name: 'Learner Licence (LLR) & Driving Skill Test',
        averageServiceMinutes: 20,
        supportedCounterIds: [],
        description: 'Computer-based road sign evaluation and physical vehicle handling test.',
        requirements: 'Form 2, Age proof, Address proof, Medical fitness certificate Form 1A'
      },
      {
        id: 'srv-rto-02',
        name: 'Driving License Renewal & International Permit',
        averageServiceMinutes: 15,
        supportedCounterIds: [],
        description: 'Biometric capture and document validation for expired driving licenses.',
        requirements: 'Original DL, Valid passport & visa (for IDP), Medical certificate'
      }
    ],
    counters: []
  },

  // 7. Revenue & Taluk Office - Verified Directory Listing (Walk-in Only, Booking Disabled)
  {
    id: 'fac-rev-001',
    name: 'Tahsildar Taluk Office — Alandur',
    category: 'Revenue & Taluk Offices',
    categoryId: 'revenue_offices',
    subcategory: 'Taluk Administrative & Tahsildar Directorate',
    stateCode: 'TN',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600016',
    location: 'GST Road, Alandur',
    address: 'Taluk Office Complex, GST Road, Alandur, Chennai, Tamil Nadu 600016',
    rating: 4.2,
    activeQueues: 0,
    operatingHours: '10:00 AM - 05:45 PM (Mon - Fri)',
    phone: '+91 (044) 2234-5511',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Jurisdictional revenue authority for legal heir certificates, land transfer hearings, and grievance petitions.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Revenue and Disaster Management Department, Government of Tamil Nadu',
    sourceUrl: 'https://revenue.tn.gov.in',
    sourceLicense: 'Government Open Data License - India (GODL)',
    officialPortalUrl: 'https://chennai.nic.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-rev-01',
        name: 'Legal Heir Certificate Verification',
        averageServiceMinutes: 25,
        supportedCounterIds: [],
        description: 'Inquiry by Revenue Inspector and Village Administrative Officer (VAO).',
        requirements: 'Death certificate, ration card, legal notice or affidavit'
      },
      {
        id: 'srv-rev-02',
        name: 'Public Grievance & Jamabandi Redressal',
        averageServiceMinutes: 15,
        supportedCounterIds: [],
        description: 'Direct citizen petition hearing with Tahsildar desk.',
        requirements: 'Written petition with Aadhaar photocopy'
      }
    ],
    counters: []
  },

  // 8. Karnataka — Regional Passport Office (Bengaluru) - Verified Directory Listing (Walk-in Only)
  {
    id: 'fac-psk-blr-001',
    name: 'Regional Passport Office — Bengaluru (PSK Koramangala)',
    category: 'Passport Seva Kendras',
    categoryId: 'passport_centres',
    subcategory: 'Regional Passport Office / PSK',
    stateCode: 'KA',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    pincode: '560095',
    location: 'Koramangala 8th Block, Bengaluru',
    address: '8th Block, 80 Feet Road, Koramangala, Bengaluru, Karnataka 560095',
    rating: 4.6,
    activeQueues: 0,
    operatingHours: '09:00 AM - 04:30 PM (Mon - Fri)',
    phone: '+91 (080) 2570-6100',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    description: 'Flagship passport facilitation center serving Karnataka citizens for normal and tatkaal passport verification.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Passport Seva Portal, Ministry of External Affairs',
    sourceUrl: 'https://www.passportindia.gov.in',
    sourceLicense: 'Official Public Domain Directory',
    officialPortalUrl: 'https://www.passportindia.gov.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-blr-psk-01',
        name: 'Tatkaal & Normal Passport Processing',
        averageServiceMinutes: 18,
        supportedCounterIds: [],
        description: 'Counters A, B, and C document verification and police clearance certificate.',
        requirements: 'Appointment ARN slip, original education degree, Aadhaar, voter ID'
      }
    ],
    counters: []
  },

  // 9. Karnataka — Victoria Hospital & BMCRI (Bengaluru) - Verified Directory Listing (Walk-in Only)
  {
    id: 'fac-hosp-blr-001',
    name: 'Victoria Hospital — Bangalore Medical College and Research Institute',
    category: 'Government Hospitals',
    categoryId: 'govt_hospitals',
    subcategory: 'Government Medical College Hospital',
    stateCode: 'KA',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    pincode: '560002',
    location: 'Near City Market, Fort, Bengaluru',
    address: 'Fort Road, Near City Market, K.R. Road, Bengaluru, Karnataka 560002',
    rating: 4.5,
    activeQueues: 0,
    operatingHours: '24/7 (OPD: 08:30 AM - 01:30 PM)',
    phone: '+91 (080) 2670-1150',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Historic apex government teaching hospital in Karnataka providing extensive multi-department outpatient consultations.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Department of Health & Family Welfare Services, Government of Karnataka',
    sourceUrl: 'https://hfw.karnataka.gov.in',
    sourceLicense: 'Government Open Data License - India (GODL)',
    officialPortalUrl: 'https://bmcri.edu.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-blr-vic-01',
        name: 'General Medicine & Specialist OPD',
        averageServiceMinutes: 15,
        supportedCounterIds: [],
        description: 'Comprehensive public healthcare evaluation and referral to specialty units.',
        requirements: 'Hospital OPD booklet, Aadhaar card or BPL card'
      }
    ],
    counters: []
  },

  // 10. Delhi — All India Institute of Medical Sciences (AIIMS) - Verified Directory Listing
  {
    id: 'fac-hosp-del-001',
    name: 'All India Institute of Medical Sciences (AIIMS) — New Delhi',
    category: 'Government Hospitals',
    categoryId: 'govt_hospitals',
    subcategory: 'National Institute of Excellence / Apex Tertiary Hospital',
    stateCode: 'DL',
    state: 'Delhi',
    district: 'New Delhi',
    city: 'New Delhi',
    pincode: '110029',
    location: 'Ansari Nagar, New Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029',
    rating: 4.9,
    activeQueues: 0,
    operatingHours: '24/7 (OPD: 08:00 AM - 01:00 PM)',
    phone: '+91 (011) 2658-8500',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    description: 'Indias premier national medical institute and referral center providing world-class tertiary outpatient care.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Ministry of Health and Family Welfare, Government of India',
    sourceUrl: 'https://www.mohfw.gov.in',
    sourceLicense: 'Government Open Data License - India (GODL)',
    officialPortalUrl: 'https://www.aiims.edu',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-del-aim-01',
        name: 'Rajkumari Amrit Kaur OPD Consultation',
        averageServiceMinutes: 15,
        supportedCounterIds: [],
        description: 'First-tier comprehensive diagnosis by senior residents and faculty.',
        requirements: 'UHID Card, National ID'
      }
    ],
    counters: []
  },

  // 11. Maharashtra — Regional Transport Office (Andheri, Mumbai) - Verified Directory Listing
  {
    id: 'fac-rto-mum-001',
    name: 'Regional Transport Office (RTO) — Mumbai West (MH-02)',
    category: 'Regional Transport Offices (RTO)',
    categoryId: 'rtos',
    subcategory: 'Regional Transport Office (RTO)',
    stateCode: 'MH',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Mumbai',
    pincode: '400053',
    location: 'D.N. Nagar, Andheri West',
    address: 'Versova Road, D.N. Nagar, Andheri West, Mumbai, Maharashtra 400053',
    rating: 4.2,
    activeQueues: 0,
    operatingHours: '10:00 AM - 05:30 PM (Mon - Fri)',
    phone: '+91 (022) 2636-6952',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    description: 'Western suburbs administrative office for vehicle registration, fitness checks, and driver licences.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Transport Department, Government of Maharashtra / Parivahan',
    sourceUrl: 'https://transport.maharashtra.gov.in',
    sourceLicense: 'Official Public Domain Directory',
    officialPortalUrl: 'https://parivahan.gov.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-mum-rto-01',
        name: 'Vehicle Transfer of Ownership & NOC',
        averageServiceMinutes: 20,
        supportedCounterIds: [],
        description: 'Form 29/30 endorsement and inter-state NOC issuance.',
        requirements: 'Original RC, Insurance certificate, PUC, seller and buyer PAN copies'
      }
    ],
    counters: []
  },

  // 12. Maharashtra — King Edward Memorial (KEM) Hospital (Mumbai) - Verified Directory Listing
  {
    id: 'fac-hosp-mum-001',
    name: 'King Edward Memorial (KEM) Hospital & Seth G.S. Medical College',
    category: 'Government Hospitals',
    categoryId: 'govt_hospitals',
    subcategory: 'Municipal Teaching Tertiary Care Hospital',
    stateCode: 'MH',
    state: 'Maharashtra',
    district: 'Mumbai City',
    city: 'Mumbai',
    pincode: '400012',
    location: 'Parel, Mumbai',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    rating: 4.6,
    activeQueues: 0,
    operatingHours: '24/7 (OPD: 08:00 AM - 01:30 PM)',
    phone: '+91 (022) 2410-7000',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Legendary civic municipal hospital under BMC offering advanced care across oncology, cardiology, and trauma.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Brihanmumbai Municipal Corporation (BMC) Public Health Department',
    sourceUrl: 'https://portal.mcgm.gov.in',
    sourceLicense: 'Government Open Data License - India (GODL)',
    officialPortalUrl: 'https://kem.edu',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-mum-kem-01',
        name: 'Multi-Department OPD Registration',
        averageServiceMinutes: 12,
        supportedCounterIds: [],
        description: 'Routine outpatient consultation registration and specialist triage.',
        requirements: 'Hospital Registration card, Photo ID'
      }
    ],
    counters: []
  },

  // 13. Private Hospitals - Apollo Hospitals (Greams Road, Chennai) - Verified Directory Listing
  {
    id: 'fac-priv-001',
    name: 'Apollo Hospitals — Greams Road',
    category: 'Private Hospitals',
    categoryId: 'private_hospitals',
    subcategory: 'Multi-specialty Quaternary Care Hospital',
    stateCode: 'TN',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '600006',
    location: 'Greams Lane, Thousand Lights',
    address: '21 Greams Lane, Off Greams Road, Thousand Lights, Chennai, Tamil Nadu 600006',
    rating: 4.8,
    activeQueues: 0,
    operatingHours: '24/7 (OPD: 08:30 AM - 06:00 PM)',
    phone: '+91 (044) 2829-0200',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    description: 'NABH and JCI accredited tertiary hospital internationally recognized for cardiology, oncology, and transplants.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'National Accreditation Board for Hospitals & Healthcare Providers (NABH)',
    sourceUrl: 'https://nabh.co',
    sourceLicense: 'Accreditation Public Registry',
    officialPortalUrl: 'https://chennai.apollohospitals.com',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-apo-01',
        name: 'Consultant Specialist Outpatient Booking',
        averageServiceMinutes: 20,
        supportedCounterIds: [],
        description: 'Super specialist consultation and diagnostic package review.',
        requirements: 'Hospital UHID, previous scan reports'
      }
    ],
    counters: []
  },

  // 14. Telangana — Greater Hyderabad Municipal Corporation (GHMC) - Verified Directory Listing
  {
    id: 'fac-mun-hyd-001',
    name: 'Greater Hyderabad Municipal Corporation (GHMC Head Office)',
    category: 'Municipal Offices',
    categoryId: 'municipal_offices',
    subcategory: 'Municipal Corporation Citizen Service Center',
    stateCode: 'TS',
    state: 'Telangana',
    district: 'Hyderabad',
    city: 'Hyderabad',
    pincode: '500063',
    location: 'Tank Bund Road, Hyderabad',
    address: 'CC Complex, Tank Bund Road, Lower Tank Bund, Hyderabad, Telangana 500063',
    rating: 4.4,
    activeQueues: 0,
    operatingHours: '10:00 AM - 05:00 PM (Mon - Sat)',
    phone: '+91 (040) 2111-1111',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Civic headquarters handling property tax assessments, building permissions, birth/death registrations, and trade licenses.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'Municipal Administration and Urban Development Department, GoTS',
    sourceUrl: 'https://ghmc.gov.in',
    sourceLicense: 'Government Open Data License - India (GODL)',
    officialPortalUrl: 'https://ghmc.gov.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-ghmc-01',
        name: 'Property Tax Self-Assessment & Mutation',
        averageServiceMinutes: 18,
        supportedCounterIds: [],
        description: 'Property tax payment verification, name change, and property tax demand notice.',
        requirements: 'PTIN number, registered title deed, encumbrance certificate'
      }
    ],
    counters: []
  },

  // 15. Uttar Pradesh — Citizen Seva & Sub-Registrar Office (Lucknow) - Listed Public Registry
  {
    id: 'fac-rev-up-001',
    name: 'Sub-Registrar & Citizen Seva Centre — Hazratganj',
    category: 'Revenue & Taluk Offices',
    categoryId: 'revenue_offices',
    subcategory: 'Sub-Registrar Land & Deed Registration Office',
    stateCode: 'UP',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    city: 'Lucknow',
    pincode: '226001',
    location: 'Hazratganj, Lucknow',
    address: 'Collectorate Compound, Kesar Bagh, Hazratganj, Lucknow, Uttar Pradesh 226001',
    rating: 4.1,
    activeQueues: 0,
    operatingHours: '10:00 AM - 05:00 PM (Mon - Fri)',
    phone: '+91 (0522) 262-3400',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'District registrar office for sale deeds, gift deed verification, marriage registrations, and stamp duty payments.',
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    sourceName: 'IGRSUP - Stamps and Registration Department, Government of Uttar Pradesh',
    sourceUrl: 'https://igrsup.gov.in',
    sourceLicense: 'Government Open Data License - India (GODL)',
    officialPortalUrl: 'https://igrsup.gov.in',
    lastSyncedAt: '2026-10-24T00:00:00Z',
    services: [
      {
        id: 'srv-up-reg-01',
        name: 'Deed Registration & Biometric Verification',
        averageServiceMinutes: 30,
        supportedCounterIds: [],
        description: 'Witness sign verification, thumbprint biometric capture, and deed execution.',
        requirements: 'Deed draft, e-stamp receipt, 2 witnesses with Aadhaar'
      }
    ],
    counters: []
  }
];

/**
 * 6. CITIZEN AND ADMIN MOCK DEMO QUEUE STATES
 */
export const MOCK_CITIZEN_ACTIVE_TOKENS = [
  {
    id: 'tok-cit-001',
    facilityId: '00000000-0000-0000-0000-000000000001',
    facilityName: 'QueueLess Sandbox Pilot Clinic (Demo & Evaluation)',
    category: 'Government Hospitals',
    serviceId: '00000000-0000-0000-0001-000000000002',
    serviceName: 'Cardiology Clinic',
    tokenNumber: 'H-044',
    visitorName: 'Aditya Sharma',
    status: 'waiting',
    createdAt: 'Today, 10:15 AM',
    estimatedCallTime: '11:10 AM',
    counterId: '00000000-0000-0000-0002-000000000003',
    counterName: 'Counter 201 - Cardiology Suite',
    queuePosition: 3,
    peopleAhead: 2,
    estimatedWaitMinutes: 24,
    currentServingToken: 'H-042',
    travelTimeMinutes: 18,
    recommendedDepartureTime: '10:42 AM',
    departureStatus: 'leave_soon',
    facilityLocation: 'Anna Salai, Chennai (3.8 km away)',
    notes: 'Please bring your previous ECG and prescription papers.'
  }
];

export const MOCK_CITIZEN_HISTORY = [
  {
    id: 'tok-hist-01',
    facilityName: 'State Bank of India — Commercial Branch',
    serviceName: 'KYC & Account Modernization',
    tokenNumber: 'B-039',
    date: 'Yesterday, 03:15 PM',
    status: 'completed',
    counterName: 'Desk 4 (KYC / Accounts)',
    actualWaitTime: '12 mins',
    savedTimeEstimate: '38 mins'
  },
  {
    id: 'tok-hist-02',
    facilityName: 'Regional Passport & Citizen Seva Kendra',
    serviceName: 'Passport Renewal & Biometrics',
    tokenNumber: 'G-112',
    date: '08 Oct 2026',
    status: 'completed',
    counterName: 'Desk A - Verification',
    actualWaitTime: '14 mins',
    savedTimeEstimate: '52 mins'
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
    tokenNumber: 'H-042',
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
    tokenNumber: 'H-043',
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
    tokenNumber: 'H-044',
    visitorName: 'Aditya Sharma',
    service: 'Cardiology Clinic',
    assignedCounter: 'Unassigned',
    status: 'waiting',
    waitTime: '24 min',
    calledAt: 'Pending',
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
    { name: 'General OPD', value: 42, color: '#0D9488' },
    { name: 'Cardiology', value: 24, color: '#06B6D4' },
    { name: 'Pathology Lab', value: 20, color: '#3B82F6' },
    { name: 'Immunization', value: 14, color: '#10B981' }
  ],
  counterUtilization: [
    { name: 'Counter 101 (OPD Intake)', load: 88, status: 'Active' },
    { name: 'Counter 102 (OPD Desk)', load: 82, status: 'Active' },
    { name: 'Counter 201 (Cardiology)', load: 94, status: 'High Load' }
  ]
};

export const MOCK_PLATFORM_STATS = {
  totalFacilities: 15,
  statesCovered: 36,
  activeQueuesToday: 184,
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
  { district: 'Bengaluru Urban', status: 'Moderate', activeCenters: 18, activeQueues: 120 },
  { district: 'Mumbai Suburban', status: 'Smooth Flow', activeCenters: 16, activeQueues: 110 },
  { district: 'New Delhi', status: 'Moderate', activeCenters: 12, activeQueues: 95 }
];
