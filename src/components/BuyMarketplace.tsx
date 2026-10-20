import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Tractor, 
  Wheat, 
  SunMedium, 
  Wrench, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Lock,
  PlusCircle
} from 'lucide-react';
import { LanguageCode, ResourceListing } from '../types';
import { translations } from '../translations';

interface BuyMarketplaceProps {
  currentLang: LanguageCode;
  listings: ResourceListing[];
  onSelectListing: (listing: ResourceListing) => void;
  onBack: () => void;
  onNavigateToSell: () => void;
  isDarkMode?: boolean;
}

export const BuyMarketplace: React.FC<BuyMarketplaceProps> = ({
  currentLang,
  listings,
  onSelectListing,
  onBack,
  onNavigateToSell,
  isDarkMode = false,
}) => {
  const t = translations[currentLang] || translations.en;

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [radiusKm, setRadiusKm] = useState<number>(30);
  const [selectedListingType, setSelectedListingType] = useState<string>('all');
  const [villageFilter, setVillageFilter] = useState('');

  // Filtered Listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Listing Type filter
      if (selectedListingType !== 'all' && item.listingType !== selectedListingType) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q) || (item.title_hi && item.title_hi.toLowerCase().includes(q));
        const matchesDesc = item.description.toLowerCase().includes(q) || (item.description_hi && item.description_hi.toLowerCase().includes(q));
        const matchesSub = item.subCategory.toLowerCase().includes(q);
        const matchesVillage = item.location.village.toLowerCase().includes(q) || item.location.district.toLowerCase().includes(q);
        const matchesBarter = item.barterExchangeNeeded.toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesSub && !matchesVillage && !matchesBarter) {
          return false;
        }
      }

      // Village filter
      if (villageFilter.trim()) {
        const v = villageFilter.toLowerCase();
        const matchesLoc = item.location.village.toLowerCase().includes(v) || item.location.district.toLowerCase().includes(v);
        if (!matchesLoc) return false;
      }

      return true;
    });
  }, [listings, selectedCategory, selectedListingType, searchQuery, villageFilter]);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-200 ${
      isDarkMode ? 'text-white' : 'text-[#1c241c]'
    }`}>
      
      {/* Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
        isDarkMode ? 'border-[#1f3325]' : 'border-[#e5dcce]'
      }`}>
        <div className="flex items-center gap-3">
          <button
            id="btn-buy-back-to-home"
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              isDarkMode 
                ? 'bg-[#15271a] text-[#a4b8a8] hover:text-white hover:bg-[#1f3825]' 
                : 'bg-[#ede5d3] text-[#5a5445] hover:text-[#1c261c] hover:bg-[#e2d8c3]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#1a281e]'
            }`}>
              {t.buyHeroTitle}
            </h1>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6e6858]'}`}>
              {t.buyHeroSubtitle}
            </p>
          </div>
        </div>

        <button
          id="btn-buy-go-to-sell"
          onClick={onNavigateToSell}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.sellOptionBtn}</span>
        </button>
      </div>

      {/* Search & Location Bar */}
      <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
        isDarkMode ? 'bg-[#112217] border-[#223d2b]' : 'bg-white border-[#e0d7c5]'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Main Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className={`absolute left-3.5 top-3.5 w-4 h-4 ${
              isDarkMode ? 'text-[#7e9684]' : 'text-[#8c8574]'
            }`} />
            <input 
              type="text"
              id="input-marketplace-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDarkMode 
                  ? 'bg-[#182c1e] border-[#2b4432] text-white placeholder-[#687f6e]' 
                  : 'bg-[#faf6ee] border-[#ded4c0] text-[#1c241c] placeholder-[#8c8574]'
              }`}
            />
          </div>

          {/* Village / District Search */}
          <div className="md:col-span-3 relative">
            <MapPin className={`absolute left-3.5 top-3.5 w-4 h-4 ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
            }`} />
            <input 
              type="text"
              id="input-village-filter"
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              placeholder={`${t.villageName} / ${t.districtName}`}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDarkMode 
                  ? 'bg-[#182c1e] border-[#2b4432] text-white placeholder-[#687f6e]' 
                  : 'bg-[#faf6ee] border-[#ded4c0] text-[#1c241c] placeholder-[#8c8574]'
              }`}
            />
          </div>

          {/* Radius Distance Slider */}
          <div className={`md:col-span-3 flex flex-col justify-center px-3 py-1.5 rounded-xl border ${
            isDarkMode ? 'bg-[#182c1e] border-[#2b4432]' : 'bg-[#faf6ee] border-[#ded4c0]'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className={isDarkMode ? 'text-[#8ea493]' : 'text-[#6d6656]'}>{t.nearbyFilter}:</span>
              <span className={isDarkMode ? 'text-emerald-400' : 'text-emerald-800'}>{radiusKm} km</span>
            </div>
            <input 
              type="range"
              min="5"
              max="100"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full h-1.5 bg-emerald-500/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

        </div>

        {/* Category Pills & Deal Type Filter */}
        <div className={`flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t ${
          isDarkMode ? 'border-[#1e3424]' : 'border-[#eee6d6]'
        }`}>
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: t.allCategories, icon: SlidersHorizontal },
              { id: 'machinery', label: t.machinery, icon: Tractor },
              { id: 'biomass', label: t.biomass, icon: Wheat },
              { id: 'irrigation', label: t.irrigation, icon: SunMedium },
              { id: 'tools', label: t.tools, icon: Wrench },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-emerald-500 text-black shadow-xs'
                        : 'bg-[#1e4d36] text-white shadow-xs'
                      : isDarkMode
                        ? 'bg-[#182c1e] text-[#a4bba8] hover:bg-[#203928] hover:text-white border border-[#2b4432]'
                        : 'bg-[#f4efe4] text-[#554f41] hover:bg-[#eae1d0] border border-[#ded5c2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Deal Type: All / Barter Swap Only / Rent Only */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isDarkMode ? 'bg-[#182c1e] border-[#2b4432]' : 'bg-[#ede5d5] border-[#ded5c2]'
          }`}>
            <button
              onClick={() => setSelectedListingType('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedListingType === 'all'
                  ? isDarkMode ? 'bg-emerald-500 text-black' : 'bg-[#1e4d36] text-white'
                  : isDarkMode ? 'text-[#8ea493] hover:text-white' : 'text-[#645e50] hover:text-black'
              }`}
            >
              {t.allCategories}
            </button>
            <button
              onClick={() => setSelectedListingType('barter')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedListingType === 'barter'
                  ? isDarkMode ? 'bg-amber-500 text-black' : 'bg-amber-700 text-white'
                  : isDarkMode ? 'text-[#8ea493] hover:text-white' : 'text-[#645e50] hover:text-black'
              }`}
            >
              {t.barterSwapBadge}
            </button>
            <button
              onClick={() => setSelectedListingType('rent')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedListingType === 'rent'
                  ? isDarkMode ? 'bg-emerald-500 text-black' : 'bg-[#1e4d36] text-white'
                  : isDarkMode ? 'text-[#8ea493] hover:text-white' : 'text-[#645e50] hover:text-black'
              }`}
            >
              {t.rentDayBadge}
            </button>
          </div>

        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs ${
        isDarkMode 
          ? 'bg-[#122316] border-emerald-500/30 text-emerald-300' 
          : 'bg-[#edf7ee] border-emerald-300 text-[#1b4e33]'
      }`}>
        <Lock className="w-4 h-4 flex-shrink-0 text-emerald-600" />
        <span>{t.privacyNotice}</span>
      </div>

      {/* Listings Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 text-xs font-bold">
          <span className={isDarkMode ? 'text-[#8ea493]' : 'text-[#6d6656]'}>
            {filteredListings.length} {t.activeListings} ({t.radiusKm} {radiusKm} km)
          </span>
          {(searchQuery || selectedCategory !== 'all' || selectedListingType !== 'all' || villageFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedListingType('all');
                setVillageFilter('');
              }}
              className="text-emerald-500 hover:underline cursor-pointer"
            >
              {t.resetFilters}
            </button>
          )}
        </div>

        {filteredListings.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${
            isDarkMode ? 'bg-[#112217] border-[#223d2b]' : 'bg-white border-[#e0d7c5]'
          }`}>
            <Wheat className={`w-12 h-12 mx-auto mb-3 opacity-40 ${isDarkMode ? 'text-emerald-400' : 'text-amber-700'}`} />
            <h3 className="text-lg font-bold mb-1">{t.noListingsFound}</h3>
            <p className={`text-xs max-w-md mx-auto mb-4 ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6d6656]'}`}>
              {t.noListingsSub}
            </p>
            <button
              onClick={onNavigateToSell}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer hover:bg-emerald-500 shadow-md"
            >
              {t.sellOptionBtn}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                id={`listing-card-${item.id}`}
                onClick={() => onSelectListing(item)}
                className={`rounded-3xl border overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col group ${
                  isDarkMode 
                    ? 'bg-[#112217] border-[#223d2b] hover:border-emerald-500' 
                    : 'bg-white border-[#ded5c2] hover:border-[#1e4d36]'
                }`}
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs ${
                      item.listingType === 'barter' ? 'bg-amber-600' : 'bg-emerald-700'
                    }`}>
                      {item.listingType === 'barter' ? t.barterSwapBadge : t.rentDayBadge}
                    </span>
                    {item.barterFairScore && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/75 backdrop-blur-xs text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {item.barterFairScore}% {t.fairMatch}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{item.location.village}, {item.location.district}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className={`font-bold text-base line-clamp-1 transition-colors ${
                      isDarkMode ? 'text-white group-hover:text-emerald-400' : 'text-[#1c281d] group-hover:text-[#1e4d36]'
                    }`}>
                      {currentLang === 'hi' && item.title_hi ? item.title_hi : item.title}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${isDarkMode ? 'text-[#8fa394]' : 'text-[#666050]'}`}>
                      {currentLang === 'hi' && item.description_hi ? item.description_hi : item.description}
                    </p>
                  </div>

                  {/* Barter Swap Requested Badge */}
                  {item.barterExchangeNeeded && (
                    <div className={`p-2.5 rounded-xl border text-xs ${
                      isDarkMode 
                        ? 'bg-[#16271c] border-[#294230] text-emerald-300' 
                        : 'bg-[#f5f0e4] border-[#e2d8c3] text-[#332f25]'
                    }`}>
                      <span className="font-bold text-amber-600">{t.wantedInExchange}:</span>{' '}
                      <span className="font-medium">{item.barterExchangeNeeded}</span>
                    </div>
                  )}

                  {/* Footer details */}
                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isDarkMode ? 'border-[#1e3424]' : 'border-[#eee6d6]'
                  }`}>
                    <div>
                      <span className={`text-[10px] uppercase font-bold block ${
                        isDarkMode ? 'text-[#7e9483]' : 'text-[#7e7766]'
                      }`}>
                        {t.rateValue}
                      </span>
                      <span className={`text-base font-extrabold ${
                        isDarkMode ? 'text-[#4ade80]' : 'text-[#1e573c]'
                      }`}>
                        ₹{item.price}{' '}
                        <span className="text-xs font-normal opacity-80">{item.priceUnit}</span>
                      </span>
                    </div>
                    <button className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      isDarkMode 
                        ? 'bg-[#1b3121] text-emerald-400 hover:bg-emerald-500 hover:text-black' 
                        : 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200'
                    }`}>
                      {t.viewDetails}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
