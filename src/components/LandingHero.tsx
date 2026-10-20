import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Tractor, 
  Wheat, 
  SunMedium, 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Scale, 
  Leaf, 
  TrendingUp,
  Mic,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { LanguageCode, ResourceListing } from '../types';
import { translations } from '../translations';

interface LandingHeroProps {
  currentLang: LanguageCode;
  onNavigate: (view: 'home' | 'sell' | 'buy' | 'barter-calc' | 'dashboard' | 'chat') => void;
  recentListings: ResourceListing[];
  onSelectListing: (listing: ResourceListing) => void;
  isDarkMode: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  currentLang,
  onNavigate,
  recentListings,
  onSelectListing,
  isDarkMode,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <div className={`space-y-12 pb-16 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#09130d] text-white' : 'bg-[#FAF6EE] text-[#1c241c]'
    }`}>
      
      {/* HERO SECTION */}
      <section className={`relative overflow-hidden pt-12 sm:pt-16 pb-0 border-b transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-[#09130d] border-[#18271c]' 
          : 'bg-[#FAF6EE] border-[#E8DFC8]'
      }`}>
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-7 relative z-10 px-4 sm:px-6 lg:px-8">
          
          {/* Display Headline */}
          <h1 className={`text-4xl sm:text-6xl lg:text-[4.2rem] font-extrabold tracking-tight leading-[1.12] ${
            isDarkMode ? 'text-white' : 'text-[#18291c]'
          }`}>
            {t.speakInOwnLang || 'Smart Resource & Residue Exchange for Modern Agriculture.'}
          </h1>

          {/* Subtitle */}
          <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium ${
            isDarkMode ? 'text-[#a9baa8]' : 'text-[#4e5b50]'
          }`}>
            {t.speakSubtitle || 'Snap, swap, and save. Turn idle farm assets into local value. Our AI lists it, finds nearby farmers, and sets up a secure, direct exchange.'}
          </p>

          {/* Clean Quick Action & Value Highlights */}
          <div className="max-w-2xl mx-auto pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
              isDarkMode 
                ? 'bg-[#122418] border-[#24422e] text-emerald-300' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t.panchayatVerified}</span>
            </div>

            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
              isDarkMode 
                ? 'bg-[#182618] border-[#293d2b] text-teal-300' 
                : 'bg-teal-50 border-teal-200 text-teal-950'
            }`}>
              <Leaf className="w-4 h-4 text-teal-500" />
              <span>{t.stubbleReductionPledge || 'Zero Stubble Burning'}</span>
            </div>

            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
              isDarkMode 
                ? 'bg-[#1e1e12] border-[#443818] text-amber-300' 
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <Scale className="w-4 h-4 text-amber-500" />
              <span>{t.fairValueScore}</span>
            </div>
          </div>

        </div>

        {/* Decorative Continuous Golden Sand Arches - Full Width Edge to Edge with 0 Gaps */}
        <div className="w-full mt-10 sm:mt-14 mb-0 overflow-hidden">
          <div className="w-full flex items-end justify-between gap-0 p-0 m-0">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div 
                key={i} 
                className={`flex-1 h-14 sm:h-20 lg:h-24 rounded-t-full transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-[#786b43]/90 border-t border-x border-[#8e7f53]/60' 
                    : 'bg-[#ebdcb9] border-t border-x border-[#ded0ab]'
                }`}
              />
            ))}
          </div>
          {/* Bottom flush base line */}
          <div className={`w-full h-1.5 ${isDarkMode ? 'bg-[#786b43]/90' : 'bg-[#ebdcb9]'}`} />
        </div>
      </section>

      {/* THE TWO CORE OPTIONS: SELL (BARTER) OR BUY (EXPLORE) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          
          {/* OPTION 1: SELL / LIST / BARTER */}
          <div 
            id="card-landing-sell-option"
            onClick={() => onNavigate('sell')}
            className={`group relative cursor-pointer text-left p-6 sm:p-7 rounded-3xl transition-all duration-200 border-2 hover:scale-[1.02] shadow-xl ${
              isDarkMode 
                ? 'bg-[#112317] border-emerald-700/80 text-white shadow-emerald-950/20' 
                : 'bg-[#1e4d36] border-emerald-800 text-white shadow-emerald-950/15'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                <PlusCircle className="w-6 h-6 text-emerald-100" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 text-emerald-100 uppercase tracking-wide border border-white/20">
                {t.barterSwapBadge}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
              {t.sellOptionBtn}
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-4">
              {t.sellHeroSubtitle}
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200 group-hover:text-white transition-colors">
              <span>{t.startRegionalVoice}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* OPTION 2: BUY / FIND / RENT */}
          <div 
            id="card-landing-buy-option"
            onClick={() => onNavigate('buy')}
            className={`group relative cursor-pointer text-left p-6 sm:p-7 rounded-3xl transition-all duration-200 border-2 hover:scale-[1.02] shadow-xl ${
              isDarkMode 
                ? 'bg-[#142318] border-[#29422e] text-white shadow-black/30' 
                : 'bg-white border-[#ded6c4] text-[#1f281e] shadow-[#383329]/8'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                isDarkMode 
                  ? 'bg-amber-950/60 border-amber-800/60 text-amber-400 group-hover:bg-amber-900/80' 
                  : 'bg-amber-50 border-amber-200 text-amber-700 group-hover:bg-amber-100'
              }`}>
                <Search className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                isDarkMode ? 'bg-[#1c3021] text-[#b8ccbc]' : 'bg-[#f4ede0] text-[#554d3d]'
              }`}>
                5km - 50km {t.radiusKm}
              </span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#1c261b]'}`}>
              {t.buyOptionBtn}
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-[#a1b3a3]' : 'text-[#645f50]'}`}>
              {t.buyHeroSubtitle}
            </p>
            <div className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              isDarkMode ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-[#1e4d36] group-hover:text-[#163a29]'
            }`}>
              <span>{t.searchPostsBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Quick Barter Calculator CTA Banner */}
        <div className="max-w-4xl mx-auto mt-4">
          <div 
            onClick={() => onNavigate('barter-calc')}
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer transition-all ${
              isDarkMode 
                ? 'bg-[#122116] border-amber-900/40 hover:border-amber-500/60 text-white' 
                : 'bg-[#faf5eb] border-[#e2d8c3] hover:border-amber-600 text-[#1e2a1d]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  {t.barterCalculatorTitle}
                </h4>
                <p className={`text-xs ${isDarkMode ? 'text-[#97aba0]' : 'text-[#6e6856]'}`}>
                  {t.barterCalculatorDesc}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold flex items-center gap-1.5 flex-shrink-0 shadow-xs cursor-pointer hover:bg-amber-400 transition-colors">
              <span>{t.calculateSwap}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Real-time Environmental & Economic Impact Counters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs ${
          isDarkMode 
            ? 'bg-[#112015] border-[#223526]' 
            : 'bg-[#f4eee2] border-[#e2d7c1]'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-emerald-400' : 'text-[#1e573c]'
              }`}>
                <Leaf className="w-4 h-4" />
                <span>{t.stubbleReductionPledge}</span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#1e2a1d]'}`}>
                {t.impactTitle}
              </h3>
            </div>
            <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border ${
              isDarkMode 
                ? 'bg-[#16271a] border-[#2b4230] text-[#a4b8a8]' 
                : 'bg-white border-[#ded5be] text-[#6e6856]'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t.impactSubtitle}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#16261b] border-[#253a2a]' : 'bg-white border-[#e3d8c2]'
            }`}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2">
                <Tractor className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#192b1b]'}`}>
                480+
              </div>
              <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-[#8ea493]' : 'text-[#666050]'}`}>
                {t.machinesShared}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#16261b] border-[#253a2a]' : 'bg-white border-[#e3d8c2]'
            }`}>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center mb-2">
                <Wheat className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#192b1b]'}`}>
                1,250 T
              </div>
              <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-[#8ea493]' : 'text-[#666050]'}`}>
                {t.stubbleSaved}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#16261b] border-[#253a2a]' : 'bg-white border-[#e3d8c2]'
            }`}>
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-500 flex items-center justify-center mb-2">
                <Leaf className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#192b1b]'}`}>
                1,875 T
              </div>
              <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-[#8ea493]' : 'text-[#666050]'}`}>
                {t.co2Prevented}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#16261b] border-[#253a2a]' : 'bg-white border-[#e3d8c2]'
            }`}>
              <div className="w-8 h-8 rounded-lg bg-lime-500/20 text-lime-600 flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#192b1b]'}`}>
                ₹18.4 L
              </div>
              <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-[#8ea493]' : 'text-[#666050]'}`}>
                {t.farmerSavings}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resource Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1c291d]'}`}>
              {t.exploreCategories}
            </h3>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#8ea493]' : 'text-[#666052]'}`}>
              {t.exploreCategoriesSub}
            </p>
          </div>
          <button
            onClick={() => onNavigate('buy')}
            className={`text-xs sm:text-sm font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-[#1e4d36] hover:text-[#163a29]'
            }`}
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('buy')}
            className={`p-5 rounded-2xl border hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all duration-150 group ${
              isDarkMode ? 'bg-[#132317] border-[#223527]' : 'bg-white border-[#ded5c2]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <h4 className={`font-bold text-sm sm:text-base mb-1 ${isDarkMode ? 'text-white' : 'text-[#1b261b]'}`}>
              {t.machinery}
            </h4>
            <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#8fa394]' : 'text-[#6d6757]'}`}>
              {t.machinerySub}
            </p>
          </div>

          <div 
            onClick={() => onNavigate('buy')}
            className={`p-5 rounded-2xl border hover:border-amber-500 hover:shadow-md cursor-pointer transition-all duration-150 group ${
              isDarkMode ? 'bg-[#132317] border-[#223527]' : 'bg-white border-[#ded5c2]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-105 transition-transform">
              <Wheat className="w-6 h-6" />
            </div>
            <h4 className={`font-bold text-sm sm:text-base mb-1 ${isDarkMode ? 'text-white' : 'text-[#1b261b]'}`}>
              {t.biomass}
            </h4>
            <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#8fa394]' : 'text-[#6d6757]'}`}>
              {t.biomassSub}
            </p>
          </div>

          <div 
            onClick={() => onNavigate('buy')}
            className={`p-5 rounded-2xl border hover:border-teal-500 hover:shadow-md cursor-pointer transition-all duration-150 group ${
              isDarkMode ? 'bg-[#132317] border-[#223527]' : 'bg-white border-[#ded5c2]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-600 mb-3 group-hover:scale-105 transition-transform">
              <SunMedium className="w-6 h-6" />
            </div>
            <h4 className={`font-bold text-sm sm:text-base mb-1 ${isDarkMode ? 'text-white' : 'text-[#1b261b]'}`}>
              {t.irrigation}
            </h4>
            <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#8fa394]' : 'text-[#6d6757]'}`}>
              {t.irrigationSub}
            </p>
          </div>

          <div 
            onClick={() => onNavigate('buy')}
            className={`p-5 rounded-2xl border hover:border-slate-500 hover:shadow-md cursor-pointer transition-all duration-150 group ${
              isDarkMode ? 'bg-[#132317] border-[#223527]' : 'bg-white border-[#ded5c2]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-500/20 flex items-center justify-center text-slate-600 mb-3 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <h4 className={`font-bold text-sm sm:text-base mb-1 ${isDarkMode ? 'text-white' : 'text-[#1b261b]'}`}>
              {t.tools}
            </h4>
            <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#8fa394]' : 'text-[#6d6757]'}`}>
              {t.toolsSub}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
