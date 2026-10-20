import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Scale, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageCode, ResourceListing, ChatMessage } from '../types';
import { translations } from '../translations';

interface ChatModalProps {
  listing: ResourceListing;
  currentLang: LanguageCode;
  onClose: () => void;
  onOpenBarterCalc: (offered: string, needed: string) => void;
  isDarkMode?: boolean;
}

const QUICK_REPLIES = [
  "Is this equipment available for 2 days this week?",
  "I have 25 quintals of dry wheat straw bales. Would you swap?",
  "Is an experienced operator included with the machinery?",
  "Can we do ₹850/day or swap for vermicompost?",
  "Let us finalize the date for field preparation."
];

export const ChatModal: React.FC<ChatModalProps> = ({
  listing,
  currentLang,
  onClose,
  onOpenBarterCalc,
  isDarkMode = false,
}) => {
  const t = translations[currentLang] || translations.en;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      listingId: listing.id,
      senderId: listing.sellerId,
      senderName: `${listing.sellerName} (Owner)`,
      text: `Sat Sri Akal / Namaste! Thank you for your interest in my ${listing.title}. What date or barter arrangement would you like to discuss?`,
      timestamp: 'Today at 10:15 AM',
      isSystemNote: false,
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerItem, setOfferItem] = useState('20 Quintals Wheat Straw Bales');
  const [offerCash, setOfferCash] = useState(0);
  const [offerDates, setOfferDates] = useState('Aug 20 - Aug 22');
  const [swapAgreed, setSwapAgreed] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showOfferForm]);

  const handleSendMessage = (customText?: string) => {
    const messageContent = (customText || inputText).trim();
    if (!messageContent) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      listingId: listing.id,
      senderId: 'current-user',
      senderName: 'You (Farmer)',
      text: messageContent,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, newMsg]);
    if (!customText) setInputText('');

    // Simulated Farmer Seller instant reply after 1.4 seconds
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        listingId: listing.id,
        senderId: listing.sellerId,
        senderName: `${listing.sellerName} (Owner)`,
        text: `Ji haan bilkul, that sounds very reasonable! I am ready to exchange and can inspect on Friday morning.`,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1400);
  };

  const handleSendOffer = () => {
    const offerMsg: ChatMessage = {
      id: `msg-offer-${Date.now()}`,
      listingId: listing.id,
      senderId: 'current-user',
      senderName: 'You (Farmer)',
      text: `Formal Barter Proposal submitted: "${offerItem}" for dates: ${offerDates}. Cash adjustment: ₹${offerCash}.`,
      timestamp: 'Just now',
      isOffer: true,
      offerDetails: {
        offeredItem: offerItem,
        cashAdjustment: offerCash,
        dates: offerDates,
        status: 'pending',
      }
    };

    setMessages(prev => [...prev, offerMsg]);
    setShowOfferForm(false);

    // Auto accept after 2 seconds
    setTimeout(() => {
      setSwapAgreed(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {}
    }, 2000);
  };

  return (
    <div 
      id="chat-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="chat-modal-container"
        className={`rounded-3xl max-w-2xl w-full h-[90vh] flex flex-col border-2 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 transition-colors ${
          isDarkMode 
            ? 'bg-[#101e14] border-[#223928] text-white shadow-emerald-950/40' 
            : 'bg-[#faf7f0] border-[#d9ceba] text-[#1c241c]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Chat Top Header */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between flex-shrink-0 ${
          isDarkMode ? 'bg-[#14261a] border-[#223928]' : 'bg-[#f2ece0] border-[#ded5c2]'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-[#1d3625] text-white' : 'hover:bg-[#e4dcce] text-[#554f40]'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-10 h-10 rounded-xl overflow-hidden border flex-shrink-0 ${
              isDarkMode ? 'bg-black/40 border-[#263e2d]' : 'bg-black/10 border-[#ded5c2]'
            }`}>
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-bold text-sm line-clamp-1 ${isDarkMode ? 'text-white' : 'text-[#1c291d]'}`}>
                  {listing.sellerName}
                </span>
                <span className={`px-1.5 py-0.5 rounded-sm font-bold text-[10px] ${
                  isDarkMode ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {listing.sellerBadge}
                </span>
              </div>
              <span className={`text-[11px] line-clamp-1 ${isDarkMode ? 'text-[#8ea493]' : 'text-[#6d6756]'}`}>
                Re: {listing.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenBarterCalc(listing.title, listing.barterExchangeNeeded)}
              title="Test Barter Balance"
              className={`hidden sm:flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700/60 hover:bg-amber-900/80' 
                  : 'text-amber-800 bg-amber-100 hover:bg-amber-200 border-amber-300'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>AI Value</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-[#1d3625] text-white' : 'hover:bg-[#e4dcce] text-[#554f40]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Privacy Notice Strip */}
        <div className={`px-4 py-1.5 text-[11px] flex items-center justify-center gap-2 flex-shrink-0 font-medium ${
          isDarkMode ? 'bg-[#183120] text-emerald-200' : 'bg-emerald-800 text-emerald-100'
        }`}>
          <Lock className="w-3 h-3 text-emerald-300" />
          <span>{t.privacyShieldActive || 'Privacy Shield Active: Chat is end-to-end protected. No phone number sharing necessary.'}</span>
        </div>

        {/* Swap Agreed Alert (if confirmed) */}
        {swapAgreed && (
          <div className={`border-b px-4 py-3 text-xs flex items-center justify-between animate-in fade-in duration-200 ${
            isDarkMode 
              ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200' 
              : 'bg-emerald-100 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <strong>{t.barterAgreedVerified || 'Barter Agreement Verified! Digital swap terms generated. Equipment reserved for specified dates.'}</strong>
              </div>
            </div>
            <span className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">
              VERIFIED SWAP
            </span>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Post Summary Card in Chat */}
          <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
            isDarkMode ? 'bg-[#15281b] border-[#253f2c] text-[#a4b8a8]' : 'bg-[#ede6d5]/70 border-[#ded5c2] text-[#524b3a]'
          }`}>
            <span className={`font-bold block ${isDarkMode ? 'text-emerald-400' : 'text-emerald-950'}`}>
              📌 {t.targetResource || 'Target Resource:'} {listing.title}
            </span>
            <span className="block">
              <strong>{t.wantedInExchange}:</strong> "{listing.barterExchangeNeeded}" (or ₹{listing.price}/{listing.priceUnit})
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === 'current-user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <span className={`text-[10px] px-1 font-medium ${isDarkMode ? 'text-[#8ea493]' : 'text-[#7d7665]'}`}>
                  {msg.senderName} • {msg.timestamp}
                </span>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : isDarkMode
                        ? 'bg-[#172c1d] text-white border border-[#274530] rounded-tl-xs'
                        : 'bg-white text-[#1f281e] border border-[#ded5c2] rounded-tl-xs'
                  }`}
                >
                  {msg.text}

                  {/* Special Barter Offer Card if present */}
                  {msg.isOffer && msg.offerDetails && (
                    <div className="mt-2.5 p-3 rounded-xl bg-black/20 border border-white/20 text-xs space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Proposed Barter Term:</span>
                      </div>
                      <div><strong>Offer:</strong> {msg.offerDetails.offeredItem}</div>
                      <div><strong>Dates:</strong> {msg.offerDetails.dates}</div>
                      {msg.offerDetails.cashAdjustment !== undefined && (
                        <div><strong>Cash Adj:</strong> ₹{msg.offerDetails.cashAdjustment}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className={`px-4 py-2 border-t flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0 ${
          isDarkMode ? 'bg-[#14261a] border-[#223928]' : 'bg-[#f4eee2] border-[#ded5c2]'
        }`}>
          <span className={`text-[11px] font-bold whitespace-nowrap ${isDarkMode ? 'text-[#8ea493]' : 'text-[#7d7666]'}`}>
            💡 {t.quickRepliesTitle || 'Quick:'}
          </span>
          {QUICK_REPLIES.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#182e1f] hover:bg-[#22402b] text-[#b8ccbc] hover:text-white border-[#2c4934]' 
                  : 'bg-white hover:bg-emerald-50 text-[#3b3527] hover:text-emerald-950 border-[#d8cdb4]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Structured Barter Offer Drawer */}
        {showOfferForm && (
          <div className={`p-4 border-t space-y-3 animate-in slide-in-from-bottom-2 duration-150 ${
            isDarkMode ? 'bg-[#182618] border-amber-600/50' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-bold text-xs flex items-center gap-1.5 ${
                isDarkMode ? 'text-amber-300' : 'text-amber-950'
              }`}>
                <Scale className="w-4 h-4 text-amber-500" />
                <span>{t.proposeDeal || 'Create Formal Barter Offer:'}</span>
              </h4>
              <button
                onClick={() => setShowOfferForm(false)}
                className={`text-xs font-bold cursor-pointer ${isDarkMode ? 'text-amber-300 hover:text-white' : 'text-amber-900'}`}
              >
                {t.close}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className={`text-[10px] font-semibold block ${isDarkMode ? 'text-[#a4b8a8]' : 'text-amber-900'}`}>
                  {t.whatYouGive || 'What you give:'}
                </span>
                <input
                  type="text"
                  value={offerItem}
                  onChange={(e) => setOfferItem(e.target.value)}
                  className={`w-full p-2 rounded-lg border font-medium ${
                    isDarkMode ? 'bg-[#1e3423] border-[#315339] text-white' : 'bg-white border-amber-300 text-black'
                  }`}
                />
              </div>
              <div>
                <span className={`text-[10px] font-semibold block ${isDarkMode ? 'text-[#a4b8a8]' : 'text-amber-900'}`}>
                  {t.preferredDates || 'Preferred Dates:'}
                </span>
                <input
                  type="text"
                  value={offerDates}
                  onChange={(e) => setOfferDates(e.target.value)}
                  className={`w-full p-2 rounded-lg border font-medium ${
                    isDarkMode ? 'bg-[#1e3423] border-[#315339] text-white' : 'bg-white border-amber-300 text-black'
                  }`}
                />
              </div>
              <div>
                <span className={`text-[10px] font-semibold block ${isDarkMode ? 'text-[#a4b8a8]' : 'text-amber-900'}`}>
                  {t.cashAdjustment || 'Cash Adjustment (₹):'}
                </span>
                <input
                  type="number"
                  value={offerCash}
                  onChange={(e) => setOfferCash(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border font-medium ${
                    isDarkMode ? 'bg-[#1e3423] border-[#315339] text-white' : 'bg-white border-amber-300 text-black'
                  }`}
                />
              </div>
            </div>

            <button
              onClick={handleSendOffer}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {t.submitBarterOffer || 'Submit Barter Offer to Seller'}
            </button>
          </div>
        )}

        {/* Input Bar & Actions */}
        <div className={`p-3 sm:p-4 border-t flex items-center gap-2 flex-shrink-0 ${
          isDarkMode ? 'bg-[#101e14] border-[#223928]' : 'bg-[#faf7f0] border-[#ded5c2]'
        }`}>
          
          <button
            id="btn-toggle-barter-deal"
            onClick={() => setShowOfferForm(!showOfferForm)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isDarkMode 
                ? 'bg-amber-950/60 hover:bg-amber-900 text-amber-300 border-amber-700/60' 
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">{t.proposeDeal || 'Propose Deal'}</span>
          </button>

          <input
            id="input-chat-message"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.typeMessagePlaceholder}
            className={`flex-1 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDarkMode 
                ? 'bg-[#162a1c] border-[#2b4831] text-white placeholder-[#687f6e]' 
                : 'bg-white border-[#d8cdb4] text-[#1c261c] placeholder-[#8c8574]'
            }`}
          />

          <button
            id="btn-send-chat-msg"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
