import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    facilities: 'Facilities',
    myTokens: 'My Tokens',
    notifications: 'Notifications',
    support: 'Support',
    bookToken: 'Book Token',
    queueMap: 'Queue Map',
    analytics: 'Analytics',
    settings: 'Settings',
    help: 'Help',
    signIn: 'Sign In',
    citizen: 'Citizen',
    admin: 'Admin',
    switchPortal: 'Switch to Admin Console',

    // Hero Header
    heading: 'Skip the Queue. Save Your Time.',
    subtitle: 'Smart Virtual Queue Management for Tamil Nadu',
    searchPlaceholder: 'Search by district, facility, or service',
    allDistricts: 'All Districts',
    allCategories: 'All Categories',

    // Stats Cards
    myActiveToken: 'My Active Token',
    peopleAhead: 'People Ahead',
    estimatedWait: 'Estimated Wait Time',
    queueStatus: 'Queue Status',
    noActiveToken: 'No Active Token',
    noActiveTokenSubtitle: 'Join a virtual queue to start tracking',
    noQueuePosition: 'No pending queue position',
    aiPredictionReady: 'AI wait heuristics ready',
    readyToBook: 'Ready to Book',
    citizensAhead: 'citizens ahead',
    mins: 'mins',

    // Live Tracking
    liveTracking: 'Live Queue Tracking',
    liveTrackingSubtitle: 'Real-time telemetry and counter dispatch status',
    userTokenLabel: 'Your Virtual Token',
    servingNow: 'Currently Serving',
    queueProgress: 'Queue Progress Indicator',
    stepWaiting: 'Waiting',
    stepCalled: 'Called',
    stepInService: 'In Service',
    stepCompleted: 'Completed',
    leaveNow: 'Leave Now — Proceed to Counter',
    stayPut: 'Stay Put — We will alert you',
    cancelToken: 'Cancel Token',
    noActiveQueueTitle: 'No Active Queue Found',
    noActiveQueueDesc: 'You do not have any active virtual queue positions right now. Browse participating Tamil Nadu facilities below to book a token.',
    browseToJoin: 'Browse Facilities to Join Queue',

    // Browse Facilities
    browseFacilities: 'Browse & Book Facilities',
    browseFacilitiesSubtitle: 'Select a center in Tamil Nadu to book an appointment token',
    activeQueues: 'Active Queues',
    activeCounters: 'Counters Active',
    avgWait: 'Avg Wait',
    bookTokenBtn: 'Book Token',
    viewServices: 'View Services',
    showingFacilities: 'Showing',
    ofFacilities: 'facilities in Tamil Nadu',

    // Analytics
    queueActivity: 'Queue Activity Analytics',
    queueActivitySubtitle: 'Hourly queue density and processing throughput',
    noAnalyticsYet: 'No analytics data yet',
    noAnalyticsDesc: 'Live throughput records will appear here as tokens are processed in real time.',
    viewTrends: 'View District Hourly Trends',
    hourlyQueueVolume: 'Hourly Queue Volume',
    avgWaitMins: 'Average Wait (Minutes)',

    // Queue Map
    queueMapTitle: 'Tamil Nadu Virtual Queue Map',
    queueMapSubtitle: 'District-wise operational density and active public service centers',
    centerCount: 'Centers Active',

    // Settings & Help
    settingsTitle: 'Queue Management Preferences',
    travelBufferLabel: 'Travel Time Buffer (Minutes)',
    notificationsPref: 'Notification Alerts',
    helpTitle: 'How Virtual Queuing Works',
    helpSubtitle: 'Fast, dignified, and predictable public services',

    // Senior-Friendly Redesign Keys
    welcomeHeader: 'Welcome to QueueLess!',
    welcomeSub: 'Easy, comfortable queue booking for everyone. Skip physical lines and wait peacefully.',
    bookTokenAction: 'Book a Token',
    bookTokenActionDesc: 'Get your digital number in 3 easy, guided steps',
    myTokenAction: 'My Active Token',
    myTokenActionDesc: 'View your live position, desk number, and arrival alert',
    findFacilitiesAction: 'Find Facilities',
    findFacilitiesActionDesc: 'Hospitals, government seva kendras, and banks near you',
    step1Title: 'Step 1: Choose Facility',
    step1Sub: 'Where would you like to visit today?',
    step2Title: 'Step 2: Choose Service',
    step2Sub: 'Which service do you need at this center?',
    step3Title: 'Step 3: Confirm Booking',
    step3Sub: 'Verify details to generate your verified token',
    seniorCitizen: 'Senior Citizen / Special Assistance',
    seniorCitizenDesc: 'Check this box for elderly priority counter assistance',
    fullNameLabel: 'Your Full Name',
    fullNamePlaceholder: 'e.g. Ramesh Kumar',
    phoneLabel: 'Mobile Phone Number (Optional SMS alerts)',
    phonePlaceholder: '10-digit mobile number',
    confirmAndBook: 'Confirm & Get My Token',
    bookingSuccess: 'Token Generated Successfully!',
    bookingSuccessSub: 'You are now securely registered in the virtual queue.',
    calledAlert: 'YOUR TOKEN HAS BEEN CALLED!',
    calledAlertDesc: 'Please walk to your assigned counter desk now.',
    viewMyToken: 'View My Live Token',
    bookAnotherToken: 'Book Another Token',
    backToStep: 'Back',
    nextStep: 'Continue',
    assignedDesk: 'Assigned Counter Desk',
    peopleAheadCount: 'people ahead of you',
    minsEstimate: 'minutes approx. wait',
    noActiveTokenTitle: 'No Waiting Tokens Right Now',
    noActiveTokenFriendly: 'You are not in any queue right now. Whenever you need to visit a doctor or government desk, tap the big "Book a Token" button above!',
    callNextBtn: 'Call Next Citizen',
    waitingTab: 'Waiting in Line',
    calledTab: 'Currently Called',
    servingTab: 'At Service Desk',
    completedTab: 'Completed History',

    // Confirmation Popup Keys
    tokenConfirmedHeading: 'Token Confirmed!',
    tokenConfirmedSub: 'Your token has been booked successfully.',
    tokenNumberLabel: 'Token Number',
    facilityLabel: 'Facility',
    serviceLabel: 'Service',
    viewMyTokenBtn: 'View My Token',
    closeBtn: 'Close',
    seniorAssistanceBadge: 'Senior Citizen Priority'
  },
  ta: {
    // Navigation
    dashboard: 'முகப்புப்பலகை',
    facilities: 'மையங்கள்',
    myTokens: 'எனது டோக்கன்கள்',
    notifications: 'அறிவிப்புகள்',
    support: 'உதவி மையம்',
    bookToken: 'டோக்கன் பெறுக',
    queueMap: 'வரிசை வரைபடம்',
    analytics: 'பகுப்பாய்வு',
    settings: 'அமைப்புகள்',
    help: 'வழிகாட்டி',
    signIn: 'உள்நுழைக',
    citizen: 'குடிமகன்',
    admin: 'நிர்வாகி',
    switchPortal: 'நிர்வாக பலகைக்குச் செல்',

    // Hero Header
    heading: 'வரிசையைத் தவிருங்கள். உங்கள் நேரத்தைச் சேமியுங்கள்.',
    subtitle: 'தமிழ்நாட்டிற்கான நவீன மெய்நிகர் வரிசை மேலாண்மை',
    searchPlaceholder: 'மாவட்டம், மையம் அல்லது சேவையைத் தேடுங்கள்',
    allDistricts: 'அனைத்து மாவட்டங்கள்',
    allCategories: 'அனைத்துப் பிரிவுகள்',

    // Stats Cards
    myActiveToken: 'எனது டோக்கன்',
    peopleAhead: 'முன்னால் உள்ளவர்கள்',
    estimatedWait: 'மதிப்பிடப்பட்ட காத்திருப்பு நேரம்',
    queueStatus: 'வரிசை நிலை',
    noActiveToken: 'செயலில் உள்ள டோக்கன் இல்லை',
    noActiveTokenSubtitle: 'கீழே உள்ள மையத்தில் வரிசையில் சேருங்கள்',
    noQueuePosition: 'தற்போது வரிசை நிலை ஏதுமில்லை',
    aiPredictionReady: 'AI கணிப்பு தயாராக உள்ளது',
    readyToBook: 'முன்பதிவு செய்ய தயார்',
    citizensAhead: 'நபர்கள் முன்னால்',
    mins: 'நிமிடங்கள்',

    // Live Tracking
    liveTracking: 'நேரலை வரிசை கண்காணிப்பு',
    liveTrackingSubtitle: 'கவுண்டர் சேவை நிலை மற்றும் நேரலைத் தரவு',
    userTokenLabel: 'உங்கள் மெய்நிகர் டோக்கன்',
    servingNow: 'தற்போது சேவை பெறுபவர்',
    queueProgress: 'வரிசை முன்னேற்றக் குறியீடு',
    stepWaiting: 'காத்திருப்பில்',
    stepCalled: 'அழைக்கப்பட்டது',
    stepInService: 'சேவையில்',
    stepCompleted: 'முடிவடைந்தது',
    leaveNow: 'உடனே கிளம்புங்கள் — கவுண்டருக்குச் செல்லவும்',
    stayPut: 'காத்திருங்கள் — உரிய நேரத்தில் அறிவிக்கப்படும்',
    cancelToken: 'டோக்கனை ரத்து செய்',
    noActiveQueueTitle: 'செயலில் உள்ள டோக்கன் எதுவும் இல்லை',
    noActiveQueueDesc: 'தற்போது உங்களிடம் செயலில் உள்ள வரிசை டோக்கன் எதுவும் இல்லை. கீழே உள்ள மையங்களைத் தேர்வு செய்து புதிய டோக்கன் பெறலாம்.',
    browseToJoin: 'மையங்களைத் தேர்வு செய்து வரிசையில் சேரவும்',

    // Browse Facilities
    browseFacilities: 'மையங்களைத் தேர்வுசெய்து டோக்கன் பெறுக',
    browseFacilitiesSubtitle: 'தமிழ்நாட்டின் மருத்துவமனைகள், அரசு சேவை மற்றும் வங்கிகளில் முன்பதிவு செய்யுங்கள்',
    activeQueues: 'வரிசையில் உள்ளோர்',
    activeCounters: 'செயலில் உள்ள கவுண்டர்கள்',
    avgWait: 'சராசரி நேரம்',
    bookTokenBtn: 'டோக்கன் பெறுக',
    viewServices: 'சேவைகளைக் காண்க',
    showingFacilities: 'காட்டப்படும் மையங்கள்',
    ofFacilities: 'தமிழ்நாடு மையங்கள்',

    // Analytics
    queueActivity: 'வரிசைச் சுழற்சி பகுப்பாய்வு',
    queueActivitySubtitle: 'மணிநேர வரிசை அடர்த்தி மற்றும் சேவைத் திறன்',
    noAnalyticsYet: 'பகுப்பாய்வுத் தரவு இதுவரை இல்லை',
    noAnalyticsDesc: 'நேரலை டோக்கன்கள் சேவைக்கு வரும் போது புள்ளிவிவரங்கள் இங்கு உடனுக்குடன் தோன்றும்.',
    viewTrends: 'மாவட்ட மணிநேர போக்கைக் காண்க',
    hourlyQueueVolume: 'மணிநேர வரிசை எண்ணிக்கை',
    avgWaitMins: 'சராசரி காத்திருப்பு (நிமிடங்கள்)',

    // Queue Map
    queueMapTitle: 'தமிழ்நாடு மெய்நிகர் வரிசை வரைபடம்',
    queueMapSubtitle: 'மாவட்ட வாரியாக மையங்களின் வரிசை அடர்த்தி நிலவரம்',
    centerCount: 'செயலில் உள்ள மையங்கள்',

    // Settings & Help
    settingsTitle: 'வரிசை மேலாண்மை அமைப்புகள்',
    travelBufferLabel: 'பயணக் கூடுதல் நேரம் (நிமிடங்கள்)',
    notificationsPref: 'அறிவிப்பு எச்சரிக்கைகள்',
    helpTitle: 'மெய்நிகர் வரிசை எவ்வாறு செயல்படுகிறது?',
    helpSubtitle: 'விரைவான மற்றும் எளிதான பொதுச் சேவைகள்',

    // Senior-Friendly Redesign Keys
    welcomeHeader: 'க்யூலெஸ்-க்கு நல்வரவு!',
    welcomeSub: 'அனைவருக்கும் எளிதான, வசதியான வரிசை முன்பதிவு. நேரில் வரிசையில் நிற்காமல் மன அமைதியுடன் காத்திருங்கள்.',
    bookTokenAction: 'டோக்கன் பெறுக',
    bookTokenActionDesc: '3 எளிய படிகளில் உங்கள் எண்ணைப் பெறுங்கள்',
    myTokenAction: 'எனது நேரலை டோக்கன்',
    myTokenActionDesc: 'வரிசை எண், கவுண்டர் மற்றும் காத்திருப்பு நேரத்தைக் காண்க',
    findFacilitiesAction: 'மையங்களைத் தேடுக',
    findFacilitiesActionDesc: 'அருகிலுள்ள மருத்துவமனைகள், அரசு அலுவலகங்கள், வங்கிகள்',
    step1Title: 'படி 1: மையத்தைத் தேர்வு செய்க',
    step1Sub: 'இன்று நீங்கள் செல்ல விரும்பும் இடம் எது?',
    step2Title: 'படி 2: சேவையைத் தேர்வு செய்க',
    step2Sub: 'இந்த மையத்தில் உங்களுக்குத் தேவையான சேவை எது?',
    step3Title: 'படி 3: முன்பதிவை உறுதி செய்க',
    step3Sub: 'விவரங்களைச் சரிபார்த்து டோக்கனைப் பெறுங்கள்',
    seniorCitizen: 'மூத்த குடிமக்கள் / சிறப்பு உதவி',
    seniorCitizenDesc: 'முதியோர் முன்னுரிமை கவுண்டர் உதவிக்கு இதைத் தேர்ந்தெடுக்கவும்',
    fullNameLabel: 'உங்கள் முழுப் பெயர்',
    fullNamePlaceholder: 'உதா. ரமேஷ் குமார்',
    phoneLabel: 'மொபைல் எண் (SMS தகவல் பெற)',
    phonePlaceholder: '10 இலக்க மொபைல் எண்',
    confirmAndBook: 'உறுதி செய்து டோக்கன் பெறுக',
    bookingSuccess: 'டோக்கன் வெற்றிகரமாகப் பெறப்பட்டது!',
    bookingSuccessSub: 'மெய்நிகர் வரிசையில் உங்கள் பதிவு உறுதி செய்யப்பட்டது.',
    calledAlert: 'உங்கள் டோக்கன் அழைக்கப்பட்டது!',
    calledAlertDesc: 'உடனே உங்கள் கவுண்டர் மேசைக்குச் செல்லவும்.',
    viewMyToken: 'எனது டோக்கனைக் காண்க',
    bookAnotherToken: 'மற்றொரு டோக்கன் பெறுக',
    backToStep: 'பின்னே',
    nextStep: 'தொடர்க',
    assignedDesk: 'ஒதுக்கப்பட்ட கவுண்டர் மேசை',
    peopleAheadCount: 'நபர்கள் உங்களுக்கு முன்னால் உள்ளனர்',
    minsEstimate: 'நிமிடங்கள் உத்தேசக் காத்திருப்பு',
    noActiveTokenTitle: 'தற்போது காத்திருக்கும் டோக்கன்கள் இல்லை',
    noActiveTokenFriendly: 'நீங்கள் தற்போது எந்த வரிசையிலும் இல்லை. உங்களுக்கு மருத்துவமனை அல்லது அரசு சேவை தேவைப்படும் போது, மேலே உள்ள "டோக்கன் பெறுக" பொத்தானை அழுத்தவும்!',
    callNextBtn: 'அடுத்த நபரை அழைக்கவும்',
    waitingTab: 'வரிசையில் காத்திருப்போர்',
    calledTab: 'அழைக்கப்பட்டோர்',
    servingTab: 'சேவை பெறுவோர்',
    completedTab: 'முடிவடைந்தவை',

    // Confirmation Popup Keys
    tokenConfirmedHeading: 'டோக்கன் உறுதிசெய்யப்பட்டது!',
    tokenConfirmedSub: 'உங்கள் டோக்கன் வெற்றிகரமாக பதிவு செய்யப்பட்டது.',
    tokenNumberLabel: 'டோக்கன் எண்',
    facilityLabel: 'மையம்',
    serviceLabel: 'சேவை',
    viewMyTokenBtn: 'எனது டோக்கனைக் காண்க',
    closeBtn: 'மூடு',
    seniorAssistanceBadge: 'மூத்த குடிமக்கள் முன்னுரிமை'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('queueless_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('queueless_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
