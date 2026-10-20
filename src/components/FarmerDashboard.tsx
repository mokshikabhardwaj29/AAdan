import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Star, 
  Leaf, 
  Award, 
  CheckCircle2, 
  ArrowLeft, 
  PlusCircle,
  MessageSquare,
  Sparkles,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { LanguageCode, ResourceListing, FarmerUser } from '../types';
import { translations } from '../translations';

interface FarmerDashboardProps {
  currentLang: LanguageCode;
  currentUser?: FarmerUser | null;
  myListings: ResourceListing[];
  onBack: () => void;
  onNavigateToSell: () => void;
  onSelectListing: (listing: ResourceListing) => void;
  onOpenChat: (listing: ResourceListing) => void;
  onDeleteListing: (listingId: string) => void;
  onClearAllPosts?: () => void;
  onOpenLogin?: () => void;
  isDarkMode?: boolean;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentLang,
  currentUser,
  myListings,
  onBack,
  onNavigateToSell,
  onSelectListing,
  onOpenChat,
  onDeleteListing,
  onClearAllPosts,
  onOpenLogin,
  isDarkMode = false,
}) => {
  const t = translations[currentLang] || translations.en;
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const farmerName = currentUser?.name || t.farmerName || 'Ramesh Kumar';
  const farmerLocation = currentUser 
    ? `${currentUser.village}, ${currentUser.district} District, ${currentUser.state}` 
    : (t.farmerLocation || 'Kisanpur, Patiala District, Punjab');
  const avatarInitials = currentUser?.avatarText || 'RK';
  const trustScoreVal = currentUser?.trustScore ? `${currentUser.trustScore} / 5.0` : '4.9 / 5.0';
  const swapsVal = currentUser?.totalSwaps !== undefined ? `${currentUser.totalSwaps} Verified` : (t.swapsCompleted || '12 Verified');


  const handleDownloadCert = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteListing(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-200 ${
      isDarkMode ? 'text-white' : 'text-[#1c241c]'
    }`}>
      
      {/* Header Bar */}
      <div className={`flex items-center justify-between border-b pb-4 ${
        isDarkMode ? 'border-[#1e3424]' : 'border-[#e5dcce]'
      }`}>
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-[#14261a] text-[#a4b8a8] hover:text-white hover:bg-[#1f3825]' 
              : 'bg-[#ede5d3] text-[#5a5445] hover:text-[#1c261c] hover:bg-[#e2d8c3]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className={`text-sm sm:text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#1c261c]'}`}>
            {t.myFarmDashboard}
          </span>
          <button
            onClick={onNavigateToSell}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addNewResource || '+ Add New Resource'}</span>
          </button>
        </div>
      </div>

      {/* Profile & Trust Score Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 ${
        isDarkMode ? 'bg-[#112217] border-[#223d2b]' : 'bg-white border-[#ded5c2]'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md flex-shrink-0">
              {avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl sm:text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1a2b1a]'}`}>
                  {farmerName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs border flex items-center gap-1 ${
                  isDarkMode 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {t.verifiedKisan}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-[#8fa394]' : 'text-[#6e6756]'}`}>
                {farmerLocation} • {t.panchayatVerified}
              </p>
              {onOpenLogin && (
                <button
                  onClick={onOpenLogin}
                  className={`text-[11px] font-semibold underline mt-1.5 inline-block cursor-pointer transition-colors ${
                    isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  {currentLang === 'hi' ? '🔄 किसान प्रोफ़ाइल / खाता बदलें (Switch Farmer / Login)' : '🔄 Switch Farmer / Login Account'}
                </button>
              )}
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
            isDarkMode ? 'bg-[#182c1e] border-[#2b4432]' : 'bg-[#faf7f0] border-[#ded5c2]'
          }`}>
            <div className="text-center px-2">
              <span className={`text-[10px] uppercase font-bold block ${isDarkMode ? 'text-[#8ea493]' : 'text-[#7d7564]'}`}>
                {t.trustScore}
              </span>
              <div className="text-lg font-black text-amber-500 flex items-center justify-center gap-0.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{trustScoreVal}</span>
              </div>
            </div>
            <div className={`h-8 w-px ${isDarkMode ? 'bg-[#2b4432]' : 'bg-[#ded5c2]'}`} />
            <div className="text-center px-2">
              <span className={`text-[10px] uppercase font-bold block ${isDarkMode ? 'text-[#8ea493]' : 'text-[#7d7564]'}`}>
                {t.swapsDone || 'Swaps Done'}
              </span>
              <div className={`text-lg font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {swapsVal}
              </div>
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className={`space-y-2 pt-4 border-t ${isDarkMode ? 'border-[#1e3424]' : 'border-[#ede7d8]'}`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#8ea493]' : 'text-[#686150]'}`}>
            {t.trustBadgesTitle || 'Earned Trust & Sustainability Badges:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              isDarkMode ? 'bg-[#16271c] border-[#253d2c]' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>
                  {t.badgePanchayatVerified || 'Panchayat Verified'}
                </div>
                <div className={`text-[10px] ${isDarkMode ? 'text-[#8ea493]' : 'text-emerald-800'}`}>
                  {t.badgeGovtDesc || 'Govt ID & Land Record'}
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              isDarkMode ? 'bg-[#16271c] border-[#253d2c]' : 'bg-amber-50 border-amber-200'
            }`}>
              <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-amber-950'}`}>
                  {t.badgeTopCare || 'Top Care Exchanger'}
                </div>
                <div className={`text-[10px] ${isDarkMode ? 'text-[#8ea493]' : 'text-amber-800'}`}>
                  {t.badgeTopCareDesc || '100% On-Time Returns'}
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              isDarkMode ? 'bg-[#16271c] border-[#253d2c]' : 'bg-teal-50 border-teal-200'
            }`}>
              <Leaf className="w-5 h-5 text-teal-500 flex-shrink-0" />
              <div>
                <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-teal-950'}`}>
                  {t.badgeZeroStubble || 'Zero-Stubble Hero'}
                </div>
                <div className={`text-[10px] ${isDarkMode ? 'text-[#8ea493]' : 'text-teal-800'}`}>
                  {t.badgeZeroStubbleDesc || '24 Tons Parali Saved'}
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              isDarkMode ? 'bg-[#16271c] border-[#253d2c]' : 'bg-slate-50 border-slate-200'
            }`}>
              <CheckCircle2 className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div>
                <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  {t.badgeFastResponder || 'Fast Responder'}
                </div>
                <div className={`text-[10px] ${isDarkMode ? 'text-[#8ea493]' : 'text-slate-700'}`}>
                  {t.badgeFastResponderDesc || 'Replies under 10 mins'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Certificate Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200 uppercase">
              <Leaf className="w-3.5 h-3.5" />
              <span>{t.bioeconomyCertTitle || 'Bioeconomy Impact Certificate'}</span>
            </div>
            <h4 className="text-lg font-bold">
              {t.co2SavedHeader || '36.2 Tons of CO₂ Emissions Prevented'}
            </h4>
            <p className="text-xs text-emerald-100/90 max-w-md">
              {t.bioeconomyCertDesc || "By bartering straw bales and sharing machinery hours, you helped keep village air clean."}
            </p>
          </div>

          <button
            onClick={handleDownloadCert}
            className="px-4 py-2 bg-white text-emerald-950 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            {downloadSuccess ? (t.certSavedSuccess || '✓ Certificate Saved') : (t.downloadCert || 'Download Certificate')}
          </button>
        </div>

      </div>

      {/* My Active Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1c2a1c]'}`}>
              {t.myBroadcastedResources || 'My Broadcasted Resources'} ({myListings.length})
            </h3>
            {myListings.length > 0 && onClearAllPosts && (
              <button
                id="btn-clear-all-posts"
                onClick={onClearAllPosts}
                className="text-xs font-semibold text-rose-500 hover:text-rose-400 cursor-pointer underline underline-offset-2"
                title="Clear all listed demo items"
              >
                {t.clearAllPosts || 'Clear All Posts'}
              </button>
            )}
          </div>

          <button
            onClick={onNavigateToSell}
            className={`text-xs font-bold cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-xl border ${
              isDarkMode 
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400 hover:bg-emerald-900/60' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.addNewResource || '+ Add New Resource'}</span>
          </button>
        </div>

        {myListings.length === 0 ? (
          <div className={`p-8 rounded-3xl border text-center space-y-4 ${
            isDarkMode ? 'bg-[#112217] border-[#223d2b]' : 'bg-white border-[#ded5c2]'
          }`}>
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-900/30 flex items-center justify-center text-emerald-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#1a2b1a]'}`}>
                No active listings published yet
              </h4>
              <p className={`text-xs max-w-md mx-auto ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6e6756]'}`}>
                Turn underused machinery or crop residues into local value. Create your first listing using voice or quick intake.
              </p>
            </div>
            <button
              onClick={onNavigateToSell}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addNewResource || '+ Add New Resource'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myListings.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectListing(item)}
                className={`p-4 rounded-3xl border flex gap-4 items-center justify-between transition-all hover:shadow-md cursor-pointer relative group ${
                  isDarkMode ? 'bg-[#112217] border-[#223d2b] hover:border-emerald-500' : 'bg-white border-[#ded5c2] hover:border-[#1e4d36]'
                }`}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/10 flex-shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                    isDarkMode 
                      ? 'text-emerald-300 bg-emerald-950/70 border-emerald-700' 
                      : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                  }`}>
                    {item.category}
                  </span>
                  <h4 className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-[#1b261b]'}`}>
                    {item.title}
                  </h4>
                  <div className={`text-xs truncate ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6e6756]'}`}>
                    {t.wantedInExchange}: {item.barterExchangeNeeded}
                  </div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-emerald-400' : 'text-[#1c291c]'}`}>
                    ₹{item.price}/{item.priceUnit}
                  </div>
                </div>

                {/* Actions: Chat & Delete */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChat(item);
                    }}
                    title="Open Chat"
                    className={`p-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isDarkMode 
                        ? 'bg-[#1b3220] hover:bg-emerald-500 hover:text-black text-emerald-400' 
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {confirmDeleteId === item.id ? (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 bg-rose-950/80 border border-rose-600/80 p-1 rounded-xl animate-in fade-in"
                    >
                      <button
                        id={`btn-confirm-del-${item.id}`}
                        onClick={(e) => handleDelete(e, item.id)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-extrabold rounded-lg cursor-pointer"
                        title="Confirm Delete"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(null);
                        }}
                        className="px-1.5 py-1 text-[10px] text-zinc-300 hover:text-white cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn-delete-listing-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(item.id);
                      }}
                      title={t.deleteListing || "Delete listing"}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isDarkMode 
                          ? 'bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-900/40' 
                          : 'bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
