import React, { useState } from 'react';
import { 
  Phone, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  MapPin, 
  Lock, 
  KeyRound, 
  User, 
  RefreshCw,
  LogOut,
  Tractor
} from 'lucide-react';
import { LanguageCode, FarmerUser } from '../types';
import { translations } from '../translations';
import { AadaanLogoEmblem, AadaanBrandText } from './AadaanLogo';

export const DEFAULT_FARMER_PROFILES: FarmerUser[] = [
  {
    id: 'farmer-1',
    name: 'Ramesh Kumar',
    name_hi: 'रमेश कुमार',
    phone: '9876543210',
    village: 'Kisanpur',
    district: 'Patiala',
    state: 'Punjab',
    avatarText: 'RK',
    isVerified: true,
    trustScore: 4.9,
    totalSwaps: 12,
    joinedDate: 'Member since 2024'
  },
  {
    id: 'farmer-2',
    name: 'Sukhwinder Singh',
    name_hi: 'सुखविंदर सिंह',
    phone: '9812345678',
    village: 'Dhillon Kalan',
    district: 'Ludhiana',
    state: 'Punjab',
    avatarText: 'SS',
    isVerified: true,
    trustScore: 4.8,
    totalSwaps: 9,
    joinedDate: 'Member since 2024'
  },
  {
    id: 'farmer-3',
    name: 'Suresh Patel',
    name_hi: 'सुरेश पटेल',
    phone: '9723456789',
    village: 'Visnagar',
    district: 'Mehsana',
    state: 'Gujarat',
    avatarText: 'SP',
    isVerified: true,
    trustScore: 4.9,
    totalSwaps: 15,
    joinedDate: 'Member since 2023'
  },
  {
    id: 'farmer-4',
    name: 'Anita Devi',
    name_hi: 'अनीता देवी',
    phone: '9654321987',
    village: 'Sampla',
    district: 'Rohtak',
    state: 'Haryana',
    avatarText: 'AD',
    isVerified: true,
    trustScore: 5.0,
    totalSwaps: 8,
    joinedDate: 'Member since 2024'
  }
];

interface LoginPageProps {
  currentLang: LanguageCode;
  currentUser: FarmerUser | null;
  onLogin: (user: FarmerUser) => void;
  onLogout: () => void;
  onBack: () => void;
  isDarkMode?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentLang,
  currentUser,
  onLogin,
  onLogout,
  onBack,
  isDarkMode = false,
}) => {
  const t = translations[currentLang] || translations.en;

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [villageName, setVillageName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('1234');
  const [showOtpBanner, setShowOtpBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  // Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert(currentLang === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Generate simple 4-digit OTP
      const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(mockCode);
      setOtp(mockCode.split(''));
      setShowOtpBanner(true);
      setStep('otp');
    }, 600);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if this phone number matches an existing mock profile
      const matchedProfile = DEFAULT_FARMER_PROFILES.find(p => p.phone === phoneNumber.replace(/\D/g, ''));

      if (matchedProfile) {
        setLoginSuccessMessage(
          currentLang === 'hi' 
            ? `स्वागत है, ${matchedProfile.name_hi || matchedProfile.name}! लॉग इन सफल रहा।`
            : `Welcome back, ${matchedProfile.name}! Login successful.`
        );
        setTimeout(() => {
          onLogin(matchedProfile);
          onBack();
        }, 1200);
      } else if (fullName.trim() && villageName.trim()) {
        // Create user from register fields
        const newUser: FarmerUser = {
          id: `farmer-${Date.now()}`,
          name: fullName.trim(),
          phone: phoneNumber.replace(/\D/g, ''),
          village: villageName.trim(),
          district: districtName.trim() || 'Local District',
          state: 'India',
          avatarText: fullName.trim().slice(0, 2).toUpperCase(),
          isVerified: true,
          trustScore: 5.0,
          totalSwaps: 0,
          joinedDate: 'New Member'
        };
        setLoginSuccessMessage(
          currentLang === 'hi' 
            ? `खाता सफलतापूर्वक बन गया! स्वागत है, ${newUser.name}!`
            : `Account created successfully! Welcome, ${newUser.name}!`
        );
        setTimeout(() => {
          onLogin(newUser);
          onBack();
        }, 1200);
      } else {
        // Default new farmer user with clean initials
        const newUser: FarmerUser = {
          id: `farmer-${Date.now()}`,
          name: fullName.trim() || 'Kisan Bandhu',
          phone: phoneNumber.replace(/\D/g, ''),
          village: villageName.trim() || 'Kisanpur',
          district: districtName.trim() || 'Local Tehsil',
          state: 'Punjab',
          avatarText: (fullName.trim() || 'KB').slice(0, 2).toUpperCase(),
          isVerified: true,
          trustScore: 5.0,
          totalSwaps: 1,
          joinedDate: 'Member since today'
        };
        setLoginSuccessMessage(
          currentLang === 'hi'
            ? `सफलतापूर्वक लॉग इन हुआ! आपका स्वागत है!`
            : `Login successful! Welcome to आDaan!`
        );
        setTimeout(() => {
          onLogin(newUser);
          onBack();
        }, 1200);
      }
    }, 700);
  };

  // 1-Tap Login with a preset farmer profile
  const handleQuickProfileLogin = (profile: FarmerUser) => {
    setIsLoading(true);
    setLoginSuccessMessage(
      currentLang === 'hi'
        ? `${profile.name_hi || profile.name} के रूप में लॉग इन हो रहे हैं...`
        : `Logging in as ${profile.name}...`
    );
    setTimeout(() => {
      setIsLoading(false);
      onLogin(profile);
      onBack();
    }, 600);
  };

  return (
    <div className={`min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center transition-colors duration-200 ${
      isDarkMode ? 'text-white' : 'text-[#1c241c]'
    }`}>
      
      {/* Top back action */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-[#14261a] text-[#a4b8a8] hover:text-white hover:bg-[#1f3825]' 
              : 'bg-[#ede5d3] text-[#5a5445] hover:text-[#1c261c] hover:bg-[#e2d8c3]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentLang === 'hi' ? 'वापस जाएँ' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>{currentLang === 'hi' ? 'सुरक्षित किसान प्रमाणीकरण' : 'Secure Kisan Login'}</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className={`w-full max-w-2xl rounded-3xl border shadow-xl overflow-hidden transition-all duration-200 ${
        isDarkMode 
          ? 'bg-[#112117] border-[#223d2b] shadow-emerald-950/20' 
          : 'bg-white border-[#ded5c2] shadow-[#1c281d]/5'
      }`}>

        {/* Card Header with Brand Logo */}
        <div className={`p-6 sm:p-8 text-center border-b ${
          isDarkMode 
            ? 'bg-gradient-to-b from-[#14291c] to-[#112117] border-[#223d2b]' 
            : 'bg-gradient-to-b from-[#f9f5ec] to-white border-[#ece2d0]'
        }`}>
          <div className="flex justify-center mb-3">
            <AadaanLogoEmblem className="w-14 h-14" isDarkMode={isDarkMode} />
          </div>
          
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className={`text-2xl sm:text-3xl font-black ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              आ
            </span>
            <span className={`text-2xl sm:text-3xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-[#1e4d36]'}`}>
              Daan
            </span>
            <span className={`text-xs px-2 py-0.5 ml-1.5 rounded-full font-bold uppercase tracking-wider ${
              isDarkMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              {currentLang === 'hi' ? 'किसान पोर्टल' : 'Kisan Portal'}
            </span>
          </div>

          <p className={`text-xs sm:text-sm font-medium mt-1 ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6e6756]'}`}>
            {currentLang === 'hi' 
              ? 'आराम से मोबाइल नंबर या 1-क्लिक से लॉग इन करें' 
              : 'Effortless Mobile & 1-Tap Login for Farmers & Villagers'}
          </p>
        </div>

        {/* Currently Logged In Banner (if already logged in) */}
        {currentUser && (
          <div className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDarkMode ? 'bg-[#183120] border-[#294833]' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {currentUser.avatarText || 'RK'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-700 text-white font-bold">
                    {currentLang === 'hi' ? 'सक्रिय' : 'Active'}
                  </span>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                  {currentUser.village}, {currentUser.district} • +91 {currentUser.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onLogout();
                  setLoginSuccessMessage(currentLang === 'hi' ? 'लॉग आउट किया गया' : 'Logged out successfully');
                  setTimeout(() => setLoginSuccessMessage(null), 2000);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800' 
                    : 'bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'लॉग आउट' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Success toast overlay */}
        {loginSuccessMessage && (
          <div className="p-4 bg-emerald-600 text-white text-center font-bold text-sm flex items-center justify-center gap-2 animate-pulse">
            <CheckCircle2 className="w-5 h-5" />
            <span>{loginSuccessMessage}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* SECTION 1: 1-Tap Quick Farmer Login (Fastest & Easiest for Farmers) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className={`text-sm sm:text-base font-extrabold uppercase tracking-wide ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-700'
                }`}>
                  {currentLang === 'hi' ? '⚡ 1-क्लिक तुरंत किसान लॉग इन (आराम से चुनें):' : '⚡ 1-Tap Quick Kisan Login (Choose your profile):'}
                </h3>
              </div>
              <span className={`text-[11px] font-medium hidden sm:inline ${
                isDarkMode ? 'text-[#8da393]' : 'text-[#726a57]'
              }`}>
                {currentLang === 'hi' ? 'बिना पासवर्ड' : 'No Password Required'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEFAULT_FARMER_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleQuickProfileLogin(profile)}
                  disabled={isLoading}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer group ${
                    currentUser?.id === profile.id
                      ? isDarkMode 
                        ? 'bg-emerald-950/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/50' 
                        : 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                      : isDarkMode 
                        ? 'bg-[#15271b] border-[#253e2d] hover:border-emerald-400 hover:bg-[#1a3323]' 
                        : 'bg-[#faf7f0] border-[#ded5c2] hover:border-emerald-600 hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl font-extrabold text-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                      currentUser?.id === profile.id
                        ? 'bg-emerald-500 text-black'
                        : 'bg-emerald-700 text-white shadow-xs'
                    }`}>
                      {profile.avatarText}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-sm truncate ${
                          isDarkMode ? 'text-white group-hover:text-emerald-300' : 'text-[#1c281d] group-hover:text-emerald-900'
                        }`}>
                          {currentLang === 'hi' && profile.name_hi ? profile.name_hi : profile.name}
                        </span>
                        {profile.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-[11px] truncate flex items-center gap-1 mt-0.5 ${
                        isDarkMode ? 'text-[#8da393]' : 'text-[#6e6756]'
                      }`}>
                        <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span>{profile.village}, {profile.district}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-[11px] font-extrabold px-2 py-1 rounded-lg ${
                      isDarkMode ? 'bg-[#223d2b] text-emerald-300' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      ⭐ {profile.trustScore}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className={`flex-grow border-t ${isDarkMode ? 'border-[#223827]' : 'border-[#e4dcce]'}`} />
            <span className={`flex-shrink mx-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isDarkMode ? 'bg-[#14261a] border-[#223827] text-[#8ea493]' : 'bg-[#f4efe4] border-[#e2d8c3] text-[#6d6655]'
            }`}>
              {currentLang === 'hi' ? 'या अपना मोबाइल नंबर डालें' : 'OR Login with Mobile Number'}
            </span>
            <div className={`flex-grow border-t ${isDarkMode ? 'border-[#223827]' : 'border-[#e4dcce]'}`} />
          </div>

          {/* SECTION 2: Mobile Number + Instant Auto-OTP Login */}
          <div>
            {step === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-[#a4bba8]' : 'text-[#4e5c4e]'
                  }`}>
                    {currentLang === 'hi' ? 'किसान मोबाइल नंबर (+91)' : 'Farmer Mobile Number (+91)'}
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-sm font-bold text-emerald-600">+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className={`w-full pl-14 pr-4 py-3.5 rounded-2xl border text-base font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                        isDarkMode
                          ? 'bg-[#15271c] border-[#2a4531] text-white focus:ring-emerald-500 focus:border-emerald-500'
                          : 'bg-[#faf7f0] border-[#ded5c2] text-[#1c281d] focus:ring-emerald-600 focus:border-emerald-600'
                      }`}
                      required
                    />
                  </div>
                  <p className={`text-[11px] mt-1.5 ${isDarkMode ? 'text-[#7e9684]' : 'text-[#7e7665]'}`}>
                    {currentLang === 'hi'
                      ? 'लॉग इन करने के लिए कोई पासवर्ड याद रखने की जरूरत नहीं है।'
                      : 'No password to remember. We verify via a quick 4-digit code.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md ${
                    phoneNumber.length >= 10
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-900/30'
                      : 'bg-emerald-800/40 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      <span>{currentLang === 'hi' ? 'ओटीपी प्राप्त करें (Get OTP)' : 'Continue with OTP'}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                
                {/* Instant Demo OTP Banner for Zero Friction */}
                {showOtpBanner && (
                  <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDarkMode ? 'bg-amber-950/60 border-amber-600/50 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold">
                          {currentLang === 'hi' ? 'आपका 4-अंकीय ओटीपी कोड:' : 'Your 4-Digit OTP Code:'}
                        </div>
                        <div className="text-xl font-black tracking-widest text-emerald-500 mt-0.5">
                          {generatedOtp}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOtp(generatedOtp.split(''))}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      {currentLang === 'hi' ? 'स्वतः भरें (Auto-Fill)' : 'Auto-Fill OTP'}
                    </button>
                  </div>
                )}

                <div className="text-center">
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#8da393]' : 'text-[#6e6756]'}`}>
                    {currentLang === 'hi' ? 'मोबाइल नंबर पर भेजा गया:' : 'Code sent to:'} <strong className="text-emerald-400">+91 {phoneNumber}</strong>
                  </span>
                </div>

                {/* 4-digit input */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newOtp = [...otp];
                        newOtp[index] = val;
                        setOtp(newOtp);
                      }}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border focus:outline-hidden focus:ring-2 ${
                        isDarkMode
                          ? 'bg-[#15271c] border-[#2b4632] text-emerald-400 focus:ring-emerald-500'
                          : 'bg-[#faf7f0] border-[#ded5c2] text-emerald-800 focus:ring-emerald-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Optional Registration Details if new user */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkMode ? 'bg-[#15271c]/60 border-[#253e2d]' : 'bg-[#faf7f0] border-[#ded5c2]'
                }`}>
                  <span className={`text-xs font-bold block ${isDarkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>
                    {currentLang === 'hi' ? '📝 किसान का नाम व गाँव (वैकल्पिक):' : '📝 Farmer Name & Village (Optional):'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={currentLang === 'hi' ? 'आपका नाम (उदा: बलदेव सिंह)' : 'Your Name (e.g. Baldev Singh)'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-hidden ${
                        isDarkMode ? 'bg-[#101d14] border-[#263e2e] text-white' : 'bg-white border-[#ded5c2] text-[#1c281d]'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={currentLang === 'hi' ? 'गाँव / तहसील (उदा: नाभा)' : 'Village / Tehsil (e.g. Nabha)'}
                      value={villageName}
                      onChange={(e) => setVillageName(e.target.value)}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-hidden ${
                        isDarkMode ? 'bg-[#101d14] border-[#263e2e] text-white' : 'bg-white border-[#ded5c2] text-[#1c281d]'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className={`w-1/3 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                      isDarkMode 
                        ? 'bg-[#192d1f] text-[#8ea493] hover:text-white' 
                        : 'bg-[#ede5d3] text-[#5b5444] hover:text-black'
                    }`}
                  >
                    {currentLang === 'hi' ? 'नंबर बदलें' : 'Change No.'}
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length < 4}
                    className="w-2/3 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{currentLang === 'hi' ? 'लॉग इन पुष्टि करें (Verify & Login)' : 'Confirm & Login'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Panchayat & Security Pledge */}
          <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
            isDarkMode 
              ? 'bg-[#0f1d13] border-[#1d3523] text-[#869b8b]' 
              : 'bg-[#f8f4ec] border-[#e4dbca] text-[#6b6454]'
          }`}>
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div>
              <span className="font-bold text-emerald-500">
                {currentLang === 'hi' ? '100% नि:शुल्क एवं सुरक्षित:' : '100% Free & Panchayat-Friendly:'}
              </span>{' '}
              <span>
                {currentLang === 'hi'
                  ? 'आपकी निजी जानकारी केवल सत्यापित किसान सौदों के लिए सुरक्षित रखी जाती है।'
                  : 'Your phone number is protected. No spam, only direct neighbor barter & equipment sharing.'}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
