import React from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Scale, 
  MessageSquare, 
  Leaf, 
  Lock, 
  Share2, 
  Tractor, 
  Star,
  ArrowRight
} from 'lucide-react';
import { LanguageCode, ResourceListing } from '../types';
import { translations } from '../translations';

interface ListingDetailModalProps {
  listing: ResourceListing;
  currentLang: LanguageCode;
  onClose: () => void;
  onOpenChat: (listing: ResourceListing) => void;
  onOpenBarterCalc: (offered: string, needed: string) => void;
  isDarkMode?: boolean;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  currentLang,
  onClose,
  onOpenChat,
  onOpenBarterCalc,
  isDarkMode = false,
}) => {
  const t = translations[currentLang] || translations.en;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out ${listing.title} on ${t.appName}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Listing link copied to clipboard!');
    }
  };

  return (
    <div 
      id="listing-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="listing-detail-modal-content"
        className={`rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border-2 shadow-2xl animate-in zoom-in-95 duration-150 transition-colors ${
          isDarkMode 
            ? 'bg-[#101e14] border-[#253e2d] text-white shadow-emerald-950/40' 
            : 'bg-[#faf7f0] border-[#d9ceba] text-[#1c241c]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className={`sticky top-0 z-10 backdrop-blur-md px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-[#101e14]/95 border-[#1e3424]' : 'bg-[#faf7f0]/95 border-[#e2d8c3]'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
              isDarkMode ? 'bg-emerald-500 text-black' : 'bg-emerald-800 text-white'
            }`}>
              {listing.category.toUpperCase()}
            </span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6e6756]'}`}>
              Post ID: #{listing.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#162a1c] border-[#294430] hover:bg-[#203a27] text-white' 
                  : 'bg-white border-[#ded5c2] hover:bg-[#f3ede1] text-[#4d4637]'
              }`}
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#162a1c] border-[#294430] hover:bg-[#203a27] text-white' 
                  : 'bg-white border-[#ded5c2] hover:bg-[#f3ede1] text-[#4d4637]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Main Hero Gallery */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
            <img 
              src={listing.images[0]} 
              alt={listing.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                listing.listingType === 'barter' ? 'bg-amber-600' : 'bg-emerald-700'
              }`}>
                {listing.listingType === 'barter' ? t.barterSwapBadge : t.rentDayBadge}
              </span>
              {listing.barterFairScore && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/80 backdrop-blur-xs text-emerald-400 border border-emerald-500/30">
                  {listing.barterFairScore}% {t.fairMatch}
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{listing.location.village}, {listing.location.district}, {listing.location.state}</span>
              </div>
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1c291d]'}`}>
                {currentLang === 'hi' && listing.title_hi ? listing.title_hi : listing.title}
              </h2>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6e6856]'}`}>
                Posted in {listing.location.village} • Verified Local Listing
              </p>
            </div>

            <div className={`p-3 sm:p-4 rounded-2xl border text-right ${
              isDarkMode ? 'bg-[#15271a] border-[#28422f]' : 'bg-white border-[#ded5c2]'
            }`}>
              <span className={`text-[10px] uppercase font-bold block ${isDarkMode ? 'text-[#7e9483]' : 'text-[#7e7766]'}`}>
                {t.directCashRate || 'Cash Rental Rate:'}
              </span>
              <span className={`text-2xl font-black ${isDarkMode ? 'text-[#4ade80]' : 'text-[#1e573c]'}`}>
                ₹{listing.price}{' '}
                <span className="text-xs font-normal opacity-80">{listing.priceUnit}</span>
              </span>
            </div>
          </div>

          {/* Barter Swap Requested Box */}
          {listing.barterExchangeNeeded && (
            <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-2 ${
              isDarkMode 
                ? 'bg-[#15271a] border-amber-600/60 text-white' 
                : 'bg-[#faf4e6] border-amber-500/70 text-[#1e2a1d]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-500">
                  <Scale className="w-4 h-4" />
                  <span>{t.barterSwapRequested || 'Barter Exchange Requested'}</span>
                </div>
                <button
                  onClick={() => onOpenBarterCalc(listing.title, listing.barterExchangeNeeded)}
                  className="text-xs font-bold text-amber-500 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>{t.evalSwapBalance || 'Evaluate Swap Balance →'}</span>
                </button>
              </div>
              <p className={`text-sm sm:text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#1e2b1d]'}`}>
                {listing.barterExchangeNeeded}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6e6856]'}`}>
              {t.whatToSell || 'Description & Equipment Details'}
            </h4>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-[#b2c6b6]' : 'text-[#484235]'}`}>
              {currentLang === 'hi' && listing.description_hi ? listing.description_hi : listing.description}
            </p>
          </div>

          {/* Seller Trust & Verification Card */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDarkMode ? 'bg-[#15271a] border-[#28422f]' : 'bg-white border-[#ded5c2]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                {listing.sellerName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1a281d]'}`}>
                    {listing.sellerName}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
                    isDarkMode ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    {listing.sellerBadge}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs mt-0.5">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {listing.sellerTrustScore} / 5.0
                  </span>
                  <span className={isDarkMode ? 'text-[#8ea493]' : 'text-[#6e6856]'}>
                    • {listing.totalSwaps} {t.swapsDone || 'Swaps Completed'}
                  </span>
                </div>
              </div>
            </div>

            <div className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
              isDarkMode ? 'bg-[#192e20] border-[#2d4934] text-emerald-300' : 'bg-[#f4efe4] border-[#ded5c2] text-[#4d4737]'
            }`}>
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.safePrivacyProtected}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              id="btn-modal-open-chat"
              onClick={() => {
                onClose();
                onOpenChat(listing);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{t.chatSecurely}</span>
            </button>

            <button
              id="btn-modal-open-barter-calc"
              onClick={() => onOpenBarterCalc(listing.title, listing.barterExchangeNeeded)}
              className={`w-full py-3.5 px-4 rounded-2xl border font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#182c1e] hover:bg-[#203a28] border-[#2c4733] text-amber-400' 
                  : 'bg-white hover:bg-amber-50 border-[#ded5c2] text-[#1c281d]'
              }`}
            >
              <Scale className="w-5 h-5 text-amber-500" />
              <span>{t.calculateSwap}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
