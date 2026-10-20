import React, { useState } from 'react';
import { 
  Tractor, 
  Globe2, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Scale, 
  UserCheck, 
  Sun, 
  Moon, 
  ChevronDown,
  Sparkles,
  Volume2,
  LogIn,
  User
} from 'lucide-react';
import { LanguageCode, FarmerUser } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentLang: LanguageCode;
  currentUser?: FarmerUser | null;
  onLangChange: (lang: LanguageCode) => void;
  activeView: 'home' | 'sell' | 'buy' | 'barter-calc' | 'dashboard' | 'chat' | 'login';
  onNavigate: (view: 'home' | 'sell' | 'buy' | 'barter-calc' | 'dashboard' | 'chat' | 'login') => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}


const LANGUAGES: { code: LanguageCode; label: string; native: string; short: string }[] = [
  { code: 'en', label: 'English', native: 'English', short: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', short: 'हिं' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', short: 'ਪੰ' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', short: 'म' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', short: 'বা' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', short: 'తె' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', short: 'த' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', short: 'ગુ' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', short: 'ಕ' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  currentUser,
  onLangChange,
  activeView,
  onNavigate,
  unreadCount,
  onOpenNotifications,
  isDarkMode,
  onToggleTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const t = translations[currentLang] || translations.en;

  const handleNavClick = (view: 'home' | 'sell' | 'buy' | 'barter-calc' | 'dashboard' | 'chat' | 'login') => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
          isDarkMode 
            ? 'bg-[#0a140e]/95 border-[#1b2b1f] text-white' 
            : 'bg-[#fdfbf7]/95 border-[#e6decb] text-[#1c241c]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Brand Logo with Agricultural Theme */}
            <div 
              id="logo-brand-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              {/* Agricultural Barter & Residue Exchange Emblem */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#123824] to-[#081b10] border border-amber-500/40 p-1.5 flex items-center justify-center shadow-md shadow-emerald-950/30 group-hover:scale-105 group-hover:border-amber-400 transition-all duration-200 flex-shrink-0">
                <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                  {/* Top Barter Arc (Golden Wheat Yellow) */}
                  <path d="M7 16A9 9 0 0 1 23.5 10" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M22 6.5l2.5 3.5-4 1" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#f59e0b" />
                  {/* Bottom Barter Arc (Agriculture Emerald Green) */}
                  <path d="M25 16A9 9 0 0 1 8.5 22" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M10 25.5l-2.5-3.5 4-1" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#10b981" />
                  {/* Center Sprout & Wheat Grain Stalk */}
                  <path d="M16 22V12" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M16 12C16 12 13 10 13 7C16 7 17 9 17 9" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#fbbf24" />
                  <path d="M16 15C16 15 19 13.5 19 11C16.5 11 15.5 12.5 15.5 12.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="#34d399" />
                  <circle cx="16" cy="18" r="1.5" fill="#f59e0b" />
                </svg>
              </div>

              <div>
                <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight leading-none">
                  <span className={isDarkMode ? 'text-amber-400 drop-shadow-xs' : 'text-amber-600 font-black'}>
                    आ
                  </span>
                  <span className={isDarkMode ? 'text-emerald-400 drop-shadow-xs' : 'text-[#1e4d36] font-extrabold'}>
                    Daan
                  </span>
                </div>
                <p className={`text-[11px] leading-none font-medium mt-1 ${isDarkMode ? 'text-emerald-300/80' : 'text-[#4e5c4e]'} hidden sm:block`}>
                  {t.tagline || 'Smart Resource & Residue Exchange'}
                </p>
              </div>
            </div>

            {/* Center Navigation Links (Desktop) */}
            <nav className={`hidden lg:flex items-center gap-1 p-1.5 rounded-2xl border ${
              isDarkMode 
                ? 'bg-[#111f15] border-[#1d3022]' 
                : 'bg-[#ede8dc]/70 border-[#ded5c2]'
            }`}>
              <button
                id="nav-home-btn"
                onClick={() => handleNavClick('home')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                  activeView === 'home'
                    ? isDarkMode 
                      ? 'bg-emerald-500 text-[#09130c] shadow-xs' 
                      : 'bg-white text-emerald-950 shadow-xs'
                    : isDarkMode
                      ? 'text-[#9cb0a1] hover:text-white hover:bg-white/10'
                      : 'text-[#5a5649] hover:text-[#1c241c] hover:bg-white/50'
                }`}
              >
                {t.homeNav}
              </button>
              <button
                id="nav-sell-btn"
                onClick={() => handleNavClick('sell')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                  activeView === 'sell'
                    ? isDarkMode
                      ? 'bg-emerald-500 text-[#09130c] shadow-xs'
                      : 'bg-emerald-700 text-white shadow-xs'
                    : isDarkMode
                      ? 'text-[#9cb0a1] hover:text-white hover:bg-white/10'
                      : 'text-[#5a5649] hover:text-[#1c241c] hover:bg-white/50'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.sellNav}</span>
              </button>
              <button
                id="nav-buy-btn"
                onClick={() => handleNavClick('buy')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                  activeView === 'buy'
                    ? isDarkMode
                      ? 'bg-emerald-500 text-[#09130c] shadow-xs'
                      : 'bg-emerald-700 text-white shadow-xs'
                    : isDarkMode
                      ? 'text-[#9cb0a1] hover:text-white hover:bg-white/10'
                      : 'text-[#5a5649] hover:text-[#1c241c] hover:bg-white/50'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t.buyNav}</span>
              </button>
              <button
                id="nav-calc-btn"
                onClick={() => handleNavClick('barter-calc')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                  activeView === 'barter-calc'
                    ? isDarkMode
                      ? 'bg-amber-400 text-[#09130c] shadow-xs'
                      : 'bg-amber-100 text-amber-950 shadow-xs border border-amber-300'
                    : isDarkMode
                      ? 'text-[#9cb0a1] hover:text-white hover:bg-white/10'
                      : 'text-[#5a5649] hover:text-[#1c241c] hover:bg-white/50'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.calcNav}</span>
              </button>
              <button
                id="nav-profile-btn"
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                  activeView === 'dashboard'
                    ? isDarkMode
                      ? 'bg-emerald-500 text-[#09130c] shadow-xs'
                      : 'bg-white text-emerald-900 shadow-xs'
                    : isDarkMode
                      ? 'text-[#9cb0a1] hover:text-white hover:bg-white/10'
                      : 'text-[#5a5649] hover:text-[#1c241c] hover:bg-white/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.profileNav}</span>
              </button>
            </nav>

            {/* Right Actions: EN/हिं Language Pills, Theme Toggle Switch, Notifications, Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Quick EN / हिं + Dropdown Pill */}
              <div className="relative flex items-center">
                <div 
                  className={`flex items-center p-1 rounded-full border transition-all ${
                    isDarkMode 
                      ? 'bg-[#122117] border-[#223528]' 
                      : 'bg-[#ebe3d3] border-[#ded2bd]'
                  }`}
                >
                  <button
                    id="btn-lang-quick-en"
                    onClick={() => onLangChange('en')}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      currentLang === 'en'
                        ? isDarkMode
                          ? 'bg-[#4ade80] text-[#072410] shadow-xs'
                          : 'bg-[#1e4d36] text-white shadow-xs'
                        : isDarkMode
                          ? 'text-[#8ba291] hover:text-white'
                          : 'text-[#443e32] hover:text-[#1c241c]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    id="btn-lang-quick-hi"
                    onClick={() => onLangChange('hi')}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      currentLang === 'hi'
                        ? isDarkMode
                          ? 'bg-[#4ade80] text-[#072410] shadow-xs'
                          : 'bg-[#1e4d36] text-white shadow-xs'
                        : isDarkMode
                          ? 'text-[#8ba291] hover:text-white'
                          : 'text-[#443e32] hover:text-[#1c241c]'
                    }`}
                  >
                    हिं
                  </button>
                  
                  {/* Dropdown toggle for remaining languages */}
                  <button
                    id="btn-lang-more-dropdown"
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    title="More regional languages"
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      isDarkMode ? 'text-[#8ba291] hover:text-white' : 'text-[#625c4e] hover:text-black'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Extended Languages Dropdown */}
                {isLangDropdownOpen && (
                  <div 
                    id="language-dropdown-menu"
                    className={`absolute right-0 top-12 w-52 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                      isDarkMode 
                        ? 'bg-[#101e14] border-[#263a2c] text-white shadow-emerald-950/40' 
                        : 'bg-white border-[#ded5c2] text-[#1c241c]'
                    }`}
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                      Regional Languages / भाषाएं
                    </div>
                    <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          id={`lang-opt-${lang.code}`}
                          onClick={() => {
                            onLangChange(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-colors cursor-pointer ${
                            currentLang === lang.code
                              ? isDarkMode
                                ? 'bg-emerald-600/30 text-emerald-400 font-bold'
                                : 'bg-emerald-100 text-emerald-950 font-bold'
                              : isDarkMode
                                ? 'text-[#b2c4b7] hover:bg-[#1a2d1f]'
                                : 'text-[#383329] hover:bg-[#f6f2e9]'
                          }`}
                        >
                          <span className="font-semibold">{lang.native}</span>
                          <span className="text-[10px] opacity-70">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dark & Light Theme Toggle Switch */}
              <button
                id="btn-theme-toggle"
                onClick={onToggleTheme}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark and light theme"
                className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center cursor-pointer border ${
                  isDarkMode 
                    ? 'bg-[#15271a] border-[#294230]' 
                    : 'bg-[#e2d7be] border-[#ccbe9f]'
                }`}
              >
                <div className="w-full flex items-center justify-between px-1 pointer-events-none text-xs">
                  <Sun className={`w-3.5 h-3.5 ${isDarkMode ? 'text-amber-400/50' : 'text-amber-700'}`} />
                  <Moon className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-slate-500/50'}`} />
                </div>

                <div 
                  className={`absolute top-1 w-6 h-6 rounded-full bg-gradient-to-br transition-all duration-300 flex items-center justify-center shadow-md ${
                    isDarkMode 
                      ? 'right-1 from-amber-400 to-amber-500 text-[#09130c]' 
                      : 'left-1 from-amber-500 to-amber-600 text-white'
                  }`}
                >
                  {isDarkMode ? (
                    <Sun className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </div>
              </button>

              {/* Farmer Login / Profile Quick Action */}
              {currentUser ? (
                <button
                  id="nav-user-profile-btn"
                  onClick={() => handleNavClick('login')}
                  title={currentLang === 'hi' ? 'किसान खाता / लॉग इन' : 'Farmer Profile / Login'}
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'login'
                      ? isDarkMode
                        ? 'bg-emerald-500 text-black border-emerald-400 shadow-xs'
                        : 'bg-[#1e4d36] text-white border-[#1e4d36] shadow-xs'
                      : isDarkMode 
                        ? 'bg-[#15281c] border-[#294532] text-emerald-300 hover:border-emerald-400 hover:bg-[#1a3323]' 
                        : 'bg-[#faf6ee] border-[#ded5c2] text-[#1c281d] hover:border-emerald-600 hover:bg-[#f3ede0]'
                  }`}
                >
                  <div className="w-5 h-5 rounded-lg bg-emerald-700 text-white text-[10px] font-black flex items-center justify-center">
                    {currentUser.avatarText || 'RK'}
                  </div>
                  <span className="max-w-[85px] truncate">{currentUser.name}</span>
                </button>
              ) : (
                <button
                  id="nav-login-action-btn"
                  onClick={() => handleNavClick('login')}
                  className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                    activeView === 'login'
                      ? isDarkMode
                        ? 'bg-emerald-500 text-black shadow-xs'
                        : 'bg-[#1e4d36] text-white shadow-xs'
                      : isDarkMode 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-950/40' 
                        : 'bg-[#1e4d36] hover:bg-[#153a28] text-white hover:shadow-[#1e4d36]/20'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'लॉग इन' : 'Login'}</span>
                </button>
              )}

              {/* Notifications Bell */}
              <button
                id="btn-notifications-drawer"
                onClick={onOpenNotifications}
                className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'text-[#9ab09f] hover:text-white hover:bg-[#15251a]' 
                    : 'text-[#4a4639] hover:text-[#1c241c] hover:bg-[#f0ebe0]'
                }`}
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* High-Visibility Hamburger Menu Button */}
              <button
                id="btn-mobile-hamburger"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl border-2 font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-[#122417] border-emerald-500/80 text-emerald-300 hover:bg-emerald-950 hover:border-emerald-400 hover:shadow-emerald-900/30' 
                    : 'bg-[#f4eee1] border-[#1e4d36] text-[#1e4d36] hover:bg-emerald-50 hover:shadow-[#1e4d36]/20'
                }`}
                aria-label="Toggle navigation menu"
                title="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-rose-400 stroke-[2.5]" />
                ) : (
                  <Menu className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Hamburger Drawer Menu - Rendered at top level with full viewport bounds */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100vh', width: '100vw' }}>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Left Vertical Sliding Drawer */}
          <div 
            id="mobile-drawer-menu"
            className={`relative z-10 w-80 max-w-[85vw] h-full flex flex-col justify-between p-6 shadow-2xl border-r transform transition-transform duration-300 ease-out overflow-y-auto ${
              isDarkMode 
                ? 'bg-[#08120b] border-[#1e3423] text-white shadow-emerald-950/80' 
                : 'bg-[#faf7f2] border-[#ded5c2] text-[#1c241c]'
            }`}
          >
            <div className="space-y-6">
              {/* Drawer Top Header with Brand & Close Button */}
              <div className={`flex items-center justify-between pb-4 border-b ${
                isDarkMode ? 'border-[#1b3120]' : 'border-[#e4dcce]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#123824] to-[#081b10] border border-amber-500/40 p-1 flex items-center justify-center shadow-md shadow-emerald-950/40 flex-shrink-0">
                    <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                      <path d="M7 16A9 9 0 0 1 23.5 10" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M22 6.5l2.5 3.5-4 1" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#f59e0b" />
                      <path d="M25 16A9 9 0 0 1 8.5 22" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M10 25.5l-2.5-3.5 4-1" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#10b981" />
                      <path d="M16 22V12" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M16 12C16 12 13 10 13 7C16 7 17 9 17 9" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#fbbf24" />
                      <path d="M16 15C16 15 19 13.5 19 11C16.5 11 15.5 12.5 15.5 12.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="#34d399" />
                      <circle cx="16" cy="18" r="1.5" fill="#f59e0b" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center text-xl font-black tracking-tight leading-none">
                      <span className={isDarkMode ? 'text-amber-400 drop-shadow-xs' : 'text-amber-600 font-black'}>
                        आ
                      </span>
                      <span className={isDarkMode ? 'text-emerald-400 drop-shadow-xs' : 'text-[#1e4d36] font-extrabold'}>
                        Daan
                      </span>
                    </div>
                    <p className={`text-[11px] font-medium mt-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-[#506353]'}`}>
                      {t.panchayatVerified || 'Panchayat-Verified'}
                    </p>
                  </div>
                </div>

                <button
                  id="btn-close-drawer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-xl cursor-pointer transition-colors ${
                    isDarkMode ? 'text-[#8ea493] hover:text-white bg-[#142318] hover:bg-[#1f3726]' : 'text-[#5c5545] hover:text-black bg-[#ede6d8] hover:bg-[#ded5c2]'
                  }`}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panchayat Verification Tag */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                isDarkMode 
                  ? 'bg-[#102214] border-[#223d28] text-emerald-300' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-semibold">{t.panchayatVerified}</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  Verified
                </span>
              </div>

              {/* Vertical Navigation Items */}
              <nav className="space-y-2">
                <button
                  id="m-nav-home"
                  onClick={() => handleNavClick('home')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeView === 'home' 
                      ? isDarkMode ? 'bg-emerald-500 text-black shadow-md' : 'bg-[#1e4d36] text-white shadow-md' 
                      : isDarkMode ? 'text-[#c0d1c4] hover:bg-[#132417] hover:text-white' : 'text-[#333027] hover:bg-[#ede7d8]'
                  }`}
                >
                  <Tractor className={`w-5 h-5 ${activeView === 'home' ? (isDarkMode ? 'text-black' : 'text-emerald-300') : 'text-emerald-500'}`} />
                  <span>{t.homeNav}</span>
                </button>

                <button
                  id="m-nav-sell"
                  onClick={() => handleNavClick('sell')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeView === 'sell' 
                      ? isDarkMode ? 'bg-emerald-500 text-black shadow-md' : 'bg-[#1e4d36] text-white shadow-md' 
                      : isDarkMode ? 'text-[#c0d1c4] hover:bg-[#132417] hover:text-white' : 'text-[#333027] hover:bg-[#ede7d8]'
                  }`}
                >
                  <PlusCircle className={`w-5 h-5 ${activeView === 'sell' ? (isDarkMode ? 'text-black' : 'text-emerald-300') : 'text-emerald-500'}`} />
                  <span>{t.sellNav}</span>
                </button>

                <button
                  id="m-nav-buy"
                  onClick={() => handleNavClick('buy')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeView === 'buy' 
                      ? isDarkMode ? 'bg-emerald-500 text-black shadow-md' : 'bg-[#1e4d36] text-white shadow-md' 
                      : isDarkMode ? 'text-[#c0d1c4] hover:bg-[#132417] hover:text-white' : 'text-[#333027] hover:bg-[#ede7d8]'
                  }`}
                >
                  <Search className={`w-5 h-5 ${activeView === 'buy' ? (isDarkMode ? 'text-black' : 'text-emerald-300') : 'text-emerald-500'}`} />
                  <span>{t.buyNav}</span>
                </button>

                <button
                  id="m-nav-calc"
                  onClick={() => handleNavClick('barter-calc')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeView === 'barter-calc' 
                      ? isDarkMode ? 'bg-amber-400 text-black shadow-md' : 'bg-amber-600 text-white shadow-md' 
                      : isDarkMode ? 'text-[#c0d1c4] hover:bg-[#132417] hover:text-white' : 'text-[#333027] hover:bg-[#ede7d8]'
                  }`}
                >
                  <Scale className={`w-5 h-5 ${activeView === 'barter-calc' ? 'text-black' : 'text-amber-500'}`} />
                  <span>{t.calcNav}</span>
                </button>

                <button
                  id="m-nav-profile"
                  onClick={() => handleNavClick('dashboard')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeView === 'dashboard' 
                      ? isDarkMode ? 'bg-emerald-500 text-black shadow-md' : 'bg-[#1e4d36] text-white shadow-md' 
                      : isDarkMode ? 'text-[#c0d1c4] hover:bg-[#132417] hover:text-white' : 'text-[#333027] hover:bg-[#ede7d8]'
                  }`}
                >
                  <UserCheck className={`w-5 h-5 ${activeView === 'dashboard' ? (isDarkMode ? 'text-black' : 'text-emerald-300') : 'text-emerald-500'}`} />
                  <span>{t.profileNav}</span>
                </button>

                <button
                  id="m-nav-login"
                  onClick={() => handleNavClick('login')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeView === 'login' 
                      ? isDarkMode ? 'bg-emerald-500 text-black shadow-md' : 'bg-[#1e4d36] text-white shadow-md' 
                      : isDarkMode ? 'bg-[#13281b] text-emerald-300 hover:bg-[#1c3a26]' : 'bg-[#f0e9dc] text-[#1c281d] hover:bg-[#e4dcce]'
                  }`}
                >
                  <LogIn className={`w-5 h-5 ${activeView === 'login' ? 'text-black' : 'text-emerald-500'}`} />
                  <span>{currentUser ? (currentLang === 'hi' ? 'किसान खाता बदलें / लॉग इन' : `Switch / Login (${currentUser.name})`) : (currentLang === 'hi' ? 'किसान लॉग इन' : 'Farmer Login')}</span>
                </button>
              </nav>

              {/* Language Selection Inside Drawer */}
              <div className="space-y-2 pt-2">
                <span className={`text-xs font-bold uppercase tracking-wider block ${isDarkMode ? 'text-[#8ba291]' : 'text-[#696353]'}`}>
                  Choose Language / भाषा चुनें:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => onLangChange(lang.code)}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? isDarkMode 
                            ? 'bg-emerald-500 text-black border-emerald-400' 
                            : 'bg-[#1e4d36] text-white border-[#1e4d36]'
                          : isDarkMode 
                            ? 'bg-[#112015] text-[#a4bba8] border-[#1e3423] hover:bg-[#182e1f]' 
                            : 'bg-[#f0eade] text-[#423d32] border-[#ddd3c0] hover:bg-[#e4ddcd]'
                      }`}
                    >
                      {lang.native}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section inside Left Drawer: Theme Switch and Stubble reduction badge */}
            <div className={`pt-4 border-t space-y-3 ${isDarkMode ? 'border-[#1b3120]' : 'border-[#e4dcce]'}`}>
              <div className="flex items-center justify-between px-1">
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#8ca391]' : 'text-[#5f594a]'}`}>
                  {isDarkMode ? 'Dark Theme' : 'Light Theme'}
                </span>
                <button
                  onClick={onToggleTheme}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    isDarkMode 
                      ? 'bg-[#14261a] text-amber-400 border-[#25422d]' 
                      : 'bg-white text-emerald-950 border-[#ded5c2]'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                </button>
              </div>

              <div className={`text-[11px] text-center font-medium ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-900/80'}`}>
                🌱 {t.stubbleReductionPledge || '100% Stubble Burning Reduction'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
