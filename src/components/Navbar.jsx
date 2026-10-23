import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  User, 
  Bell, 
  HelpCircle, 
  Menu, 
  X, 
  Globe, 
  Building2, 
  Ticket, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  LogOut,
  Sparkles,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentState, markNotificationAsRead } from '../lib/queueService';
import BookingWizardModal from './BookingWizardModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getCurrentState().notifications || []);

  const { currentUser, isSupabaseConfigured, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Sync notifications with queue service updates
  useEffect(() => {
    const handleStateUpdate = (e) => {
      if (e.detail?.notifications) {
        setNotifications([...e.detail.notifications]);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('queueless_state_update', handleStateUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('queueless_state_update', handleStateUpdate);
      }
    };
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close user profile dropdown on outside click
  useEffect(() => {
    function handleClickOutsideUserMenu(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutsideUserMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideUserMenu);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    for (const notif of notifications.filter(n => !n.isRead)) {
      await markNotificationAsRead(notif.id);
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        
        {/* Soft, Welcoming Top Helpline & Staff Bar */}
        <div className="bg-sky-50/70 border-b border-sky-100 text-slate-600 py-1.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="font-semibold text-slate-700">
                {language === 'ta' 
                  ? 'தமிழ்நாடு மெய்நிகர் வரிசை மேலாண்மை' 
                  : 'Universal Public Service Virtual Queue Platform'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="hidden sm:inline text-slate-500">
                {language === 'ta' ? 'அவசர உதவி:' : 'Helpline:'} <strong>1800-425-0022</strong>
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <Link 
                to="/admin" 
                className="font-bold text-teal-700 hover:text-teal-900 transition-colors flex items-center gap-1"
              >
                <span>{language === 'ta' ? 'அலுவலர் போர்ட்டல்' : 'Staff / Admin Portal'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Friendly Logo & Brand Name */}
            <Link to="/" className="flex items-center gap-3.5 group focus:outline-hidden">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/25 group-hover:bg-teal-700 transition-all">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
                    Queue<span className="text-teal-600">Less</span>
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800">
                    2.0
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold -mt-0.5">
                  {language === 'ta' ? 'எளிதான வரிசை முன்பதிவு' : 'Easy Virtual Queuing for Everyone'}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation: 3 Main Actions */}
            <nav className="hidden lg:flex items-center gap-3">
              {/* 1. Book Token (Prominent) */}
              <button
                type="button"
                onClick={() => setBookingWizardOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-extrabold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/25 transition-all cursor-pointer active:scale-98"
              >
                <Ticket className="w-5 h-5" />
                <span>{t('bookTokenAction')}</span>
              </button>

              {/* 2. My Token */}
              <NavLink
                to="/citizen"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                    isActive
                      ? 'text-teal-800 bg-teal-50 border-2 border-teal-500 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <User className="w-5 h-5 text-teal-600" />
                <span>{t('myTokens')}</span>
              </NavLink>

              {/* 3. Find Facilities */}
              <NavLink
                to="/facilities"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                    isActive
                      ? 'text-teal-800 bg-teal-50 border-2 border-teal-500 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Building2 className="w-5 h-5 text-teal-600" />
                <span>{t('facilities')}</span>
              </NavLink>
            </nav>

            {/* Right Utilities: Language Switch, Notifications, User */}
            <div className="flex items-center gap-3">
              
              {/* Prominent Tamil / English Toggle Button */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-black text-slate-800 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Change language / மொழியை மாற்றுக"
              >
                <Globe className="w-4 h-4 text-teal-600" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white text-teal-700 font-extrabold border border-slate-200">
                  {language === 'en' ? 'EN' : 'தமிழ்'}
                </span>
              </button>

              {/* Notifications Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2.5 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fadeIn">
                    <div className="p-4 bg-sky-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-teal-600" />
                        <span className="font-bold text-base text-slate-900">{t('notifications')}</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-xs text-teal-700 hover:underline font-bold cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm">
                          No notifications at this time.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 text-sm ${notif.isRead ? 'bg-white opacity-80' : 'bg-teal-50/40 font-medium'}`}
                          >
                            <span className="font-bold text-slate-900 block">{notif.title}</span>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Account / Menu */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-bold text-slate-800 hidden md:block max-w-[120px] truncate">
                      {currentUser.fullName || 'Citizen'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Popover */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fadeIn p-2 text-sm">
                      <div className="p-3 bg-slate-50 rounded-2xl mb-2">
                        <strong className="block text-slate-900 font-bold truncate">{currentUser.fullName}</strong>
                        <span className="text-xs text-slate-500 font-mono block truncate">{currentUser.email}</span>
                      </div>

                      <Link
                        to="/citizen"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-800 font-semibold"
                      >
                        <Ticket className="w-4 h-4 text-teal-600" />
                        <span>{t('myTokens')}</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-800 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        <span>Staff Admin Console</span>
                      </Link>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors"
                >
                  {t('signIn')}
                </Link>
              )}

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl lg:hidden text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white p-5 space-y-3 animate-fadeIn">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setBookingWizardOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-teal-600 text-white font-extrabold text-lg shadow-md shadow-teal-600/30"
            >
              <Ticket className="w-6 h-6" />
              <span>{t('bookTokenAction')}</span>
            </button>

            <NavLink
              to="/citizen"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-bold text-base"
            >
              <User className="w-5 h-5 text-teal-600" />
              <span>{t('myTokens')}</span>
            </NavLink>

            <NavLink
              to="/facilities"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-bold text-base"
            >
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>{t('facilities')}</span>
            </NavLink>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-sky-50 text-teal-800 font-bold text-base"
            >
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Staff / Admin Console</span>
            </Link>
          </div>
        )}
      </header>

      {/* Global Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={bookingWizardOpen}
        onClose={() => setBookingWizardOpen(false)}
        onBookingSuccess={() => {
          navigate('/citizen');
        }}
      />
    </>
  );
}
