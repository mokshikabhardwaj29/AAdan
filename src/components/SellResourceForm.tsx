import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Tractor, 
  Wheat, 
  SunMedium, 
  Wrench, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle,
  HelpCircle,
  Smartphone,
  RefreshCw,
  Scale,
  Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageCode, ResourceCategory, ResourceListing, AIListingEnrichmentResponse, FarmerUser } from '../types';
import { translations } from '../translations';

interface SellResourceFormProps {
  currentLang: LanguageCode;
  currentUser?: FarmerUser | null;
  onBack: () => void;
  onSubmitListing: (listing: Partial<ResourceListing>) => void;
  isDarkMode?: boolean;
}

const PRESET_IMAGES = [
  { label: 'Tractor (45-55 HP)', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80', cat: 'machinery' },
  { label: 'Wheat Straw / Parali Bales', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80', cat: 'biomass' },
  { label: 'Rotavator / Tiller (7ft)', url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80', cat: 'machinery' },
  { label: 'Solar Irrigation Pump', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjPF-z0f0lXDica_zt1dZM74o3iyqZZctiwto2rA_gH2ydIiilkd3eKjzD&s=10', cat: 'irrigation' },
  { label: 'Combine Harvester', url: 'https://images.unsplash.com/photo-1595009552535-be753447727e?w=800&auto=format&fit=crop&q=80', cat: 'machinery' },
  { label: 'Cane Bagasse / Mulch', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80', cat: 'biomass' },
];

const REGIONAL_PROMPT_SAMPLES = [
  { label: 'हिन्दी (Hindi)', text: 'मेरे पास 45 HP का महिंद्रा ट्रैक्टर ट्रॉली सहित 5 दिन के लिए खाली है। बदले में 20 क्विंटल सूखा भूसा या 1200 रु/दिन किराया चाहिए।' },
  { label: 'ਪੰਜਾਬੀ (Punjabi)', text: 'ਸਾਡੇ ਕੋਲ 150 ਕੁਇੰਟਲ ਸੁੱਕੀ ਪਰਾਲੀ ਦੇ ਬੰਡਲ ਹਨ। ਕਣਕ ਦੀ ਬਿਜਾਈ ਲਈ 3 ਦਿਨ ਰੋਟਾਵੇਟਰ ਜਾਂ ਸੁਪਰ ਸੀਡਰ ਚਾਹੀਦਾ ਹੈ।' },
  { label: 'मराठी (Marathi)', text: 'माझ्याकडे शक्तिमान ७ फूट रोटाव्हेटर आहे. ५०० रु एकर भाडे किंवा सेंद्रिय खताच्या बदल्यात देवाणघेवाण हवी आहे.' },
  { label: 'తెలుగు (Telugu)', text: 'నా వద్ద 5 HP సోలార్ సబ్మెర్సిబుల్ పంపు ఉంది. 1 రోజు కాటన్ స్ప్రేయింగ్ డ్రోన్ కావాలి.' },
];

export const SellResourceForm: React.FC<SellResourceFormProps> = ({
  currentLang,
  currentUser,
  onBack,
  onSubmitListing,
  isDarkMode = false,
}) => {
  const t = translations[currentLang] || translations.en;

  // Form States
  const [rawText, setRawText] = useState('');
  const [exchangeDesire, setExchangeDesire] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('machinery');
  const [subCategory, setSubCategory] = useState('Tractor / Implement');
  
  // Location States
  const [village, setVillage] = useState(currentUser?.village || 'Kisanpur');
  const [district, setDistrict] = useState(currentUser?.district || 'Patiala');
  const [state, setState] = useState(currentUser?.state || 'Punjab');
  const [pincode, setPincode] = useState('147001');

  // Selected Image
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUploading, setCustomImageUploading] = useState(false);

  // Voice Recording Simulation / Web Speech API
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  // AI Enrichment State
  const [isEnriching, setIsEnriching] = useState(false);
  const [aiResult, setAiResult] = useState<AIListingEnrichmentResponse | null>(null);
  const [enrichmentError, setEnrichmentError] = useState<string | null>(null);

  // Final editable fields
  const [finalTitle, setFinalTitle] = useState('');
  const [finalTitleHi, setFinalTitleHi] = useState('');
  const [finalDescription, setFinalDescription] = useState('');
  const [finalPrice, setFinalPrice] = useState(1000);
  const [finalPriceUnit, setFinalPriceUnit] = useState('per day');
  const [finalBarterTerms, setFinalBarterTerms] = useState('');

  // Additional Creative State: Quality Badge & Broadcast Radius
  const [conditionGrade, setConditionGrade] = useState<'Pristine' | 'Field-Ready' | 'Inspected'>('Field-Ready');
  const [broadcastRadiusKm, setBroadcastRadiusKm] = useState<number>(15);

  const QUICK_BARTER_PRESETS = [
    { label: '🌾 20 Qtl Parali/Straw', val: '20 Quintal dry parali straw bales' },
    { label: '🚜 2 Days Rotavator', val: '2 Days Rotavator / Super Seeder operation' },
    { label: '🌱 Organic Compost', val: '15 bags vermicompost / neem cake' },
    { label: '⚡ Solar Pump Hours', val: '10 hours solar submersible pump access' },
    { label: '🚁 Drone Spraying', val: '1 day nano-urea drone spraying slot' }
  ];

  // Speech Recognition hook
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setVoiceSeconds(s => s + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      // Check if browser SpeechRecognition is available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'pa' ? 'pa-Guru-IN' : currentLang === 'mr' ? 'mr-IN' : 'en-IN';
          recognition.interimResults = true;
          recognition.continuous = false;

          recognition.onstart = () => setIsRecording(true);
          recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((r: any) => r[0].transcript)
              .join('');
            setRawText(transcript);
          };
          recognition.onerror = () => {
            setIsRecording(false);
          };
          recognition.onend = () => {
            setIsRecording(false);
          };
          recognition.start();
        } catch (e) {
          // Fallback simulation
          simulateVoice();
        }
      } else {
        simulateVoice();
      }
    } else {
      setIsRecording(false);
    }
  };

  const simulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setRawText('Mere paas 45 HP Mahindra tractor aur hydraulic trolley hai 5 din ke liye. Mujhe 20 quintal parali ke bunde ya 1200 rupaye pratidin chahiye.');
      setExchangeDesire('20 Quintals dry parali bales or harvester usage for 2 days');
      setIsRecording(false);
    }, 3500);
  };

  // Call Server-Side Gemini API to Enrich and Translate
  const handleAiEnrich = async () => {
    if (!rawText.trim()) {
      setEnrichmentError('Please enter or speak what you have available first.');
      return;
    }

    setIsEnriching(true);
    setEnrichmentError(null);

    try {
      const response = await fetch('/api/ai/enrich-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          exchangeDesire,
          categoryHint: category,
          villageName: village,
          district,
          state,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        const res: AIListingEnrichmentResponse = data.data;
        setAiResult(res);
        setFinalTitle(res.title_en);
        setFinalTitleHi(res.title_hi);
        setFinalDescription(res.enhanced_description_en);
        setFinalPrice(res.suggested_price || 1000);
        setFinalPriceUnit(res.suggested_unit || 'per day');
        setFinalBarterTerms(res.suggested_barter_terms || exchangeDesire);
      } else {
        throw new Error('AI translation failed');
      }
    } catch (err: any) {
      console.error(err);
      setEnrichmentError('AI service is temporarily using offline heuristic values.');
      // Offline fallback
      setFinalTitle(`Verified ${category.toUpperCase()} - ${rawText.slice(0, 30)}`);
      setFinalTitleHi(`सत्यापित कृषि संसाधन - ${rawText.slice(0, 25)}`);
      setFinalDescription(`Well-maintained ${rawText} available for local rental or circular barter exchange.`);
      setFinalPrice(1200);
      setFinalPriceUnit('per day');
      setFinalBarterTerms(exchangeDesire || 'Open to fair swap');
    } finally {
      setIsEnriching(false);
    }
  };

  // Custom Image Upload Handler
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCustomImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Publish Listing
  const handlePublish = () => {
    const titleToUse = finalTitle || rawText || 'Verified Agricultural Resource';
    const descToUse = finalDescription || rawText || 'Available for rent or barter exchange';

    const newListing: Partial<ResourceListing> = {
      title: titleToUse,
      title_hi: finalTitleHi || titleToUse,
      title_original: rawText,
      originalLanguage: currentLang,
      category,
      subCategory: aiResult?.subCategory || subCategory,
      description: descToUse,
      description_hi: aiResult?.enhanced_description_hi || descToUse,
      description_original: rawText,
      images: [selectedImage],
      sellerId: currentUser?.id || 'current-user',
      sellerName: currentUser ? `${currentUser.name} (You)` : 'Local Kisan (You)',
      sellerBadge: 'Verified Kisan',
      sellerTrustScore: currentUser?.trustScore || 4.9,
      totalSwaps: currentUser?.totalSwaps || 1,
      location: {
        village,
        district,
        state,
        pincode,
        lat: 30.3398,
        lng: 76.3869,
      },
      listingType: 'barter',
      price: finalPrice,
      priceUnit: finalPriceUnit,
      barterExchangeNeeded: finalBarterTerms || exchangeDesire || 'Open for fair swap',
      barterFairScore: 94,
      condition: 'Excellent',
      specs: aiResult?.detected_specs || { 'Condition': 'Inspected & Working' },
      stubblePreventedTons: aiResult?.stubble_co2_offset_estimate?.stubbleTons || (category === 'biomass' ? 12 : undefined),
      co2PreventedTons: aiResult?.stubble_co2_offset_estimate?.co2SavedTons || (category === 'biomass' ? 18 : undefined),
      isAvailable: true,
      source: 'web',
    };

    // Trigger celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onSubmitListing(newListing);
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-200 ${
      isDarkMode ? 'text-white' : 'text-[#1c241c]'
    }`}>
      
      {/* Top Header & Back Button */}
      <div className={`flex items-center justify-between border-b pb-4 ${
        isDarkMode ? 'border-[#1b2f21]' : 'border-[#e5dcce]'
      }`}>
        <button
          id="btn-back-to-home"
          onClick={onBack}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-[#15251a] text-[#b4c9bb] hover:text-white hover:bg-[#1d3324]' 
              : 'bg-[#f2ebdc] text-[#5a5445] hover:text-[#1c261c] hover:bg-[#e7decb]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
            isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>AI Voice & Regional Intake</span>
          </div>
        </div>
      </div>

      {/* Main Title Block */}
      <div className="space-y-2 text-center sm:text-left">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          isDarkMode ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60' : 'bg-emerald-100 text-emerald-900'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Multilingual AI Natural Language Intake</span>
        </div>
        <h2 className={`text-2xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1a2d1d]'}`}>
          {t.sellHeroTitle}
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-[#9ab09e]' : 'text-[#666052]'}`}>
          Speak or type in your native regional language (Hindi, Punjabi, Marathi, Telugu, etc.). Our AI will translate it into a structured, high-value listing.
        </p>
      </div>

      {/* STEP 1: REGIONAL VOICE OR TEXT INPUT */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-colors ${
        isDarkMode ? 'bg-[#112016] border-[#223d2b]' : 'bg-white border-[#dcd1bc]'
      }`}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#1c291d]'}`}>
            <span>1. {t.whatToSell}</span>
            <span className={`text-xs font-normal ${isDarkMode ? 'text-[#8da593]' : 'text-[#756f60]'}`}>(Speak or Type)</span>
          </label>

          {/* Voice Input Button */}
          <button
            id="btn-voice-input"
            onClick={toggleVoiceRecording}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>{t.stopVoice} ({voiceSeconds}s)</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>{t.startVoice} ({t.speakInRegional?.split('(')[0] || 'Voice'})</span>
              </>
            )}
          </button>
        </div>

        {/* Input Textarea */}
        <div className="relative">
          <textarea
            id="input-regional-description"
            rows={3}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="उदा. मेरे पास 45 HP ट्रैक्टर ट्रॉली सहित 5 दिन के लिए उपलब्ध है। या 100 क्विंटल गेहूं का सूखा भूसा/पराली रखी है..."
            className={`w-full p-4 rounded-2xl border text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all ${
              isDarkMode 
                ? 'bg-[#0b170f] border-[#203625] text-white placeholder-[#5a7260]' 
                : 'bg-[#faf7f0] border-[#d8cdb4] text-[#1c261c] placeholder-[#8f8877]'
            }`}
          />
          {isRecording && (
            <div className="absolute bottom-3 right-3 text-xs text-rose-500 font-semibold flex items-center gap-1 bg-rose-950/80 px-2 py-1 rounded-md border border-rose-800">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>{t.listening}</span>
            </div>
          )}
        </div>

        {/* Sample Quick Prompts in Indian Regional Languages */}
        <div className="space-y-1.5">
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#8da593]' : 'text-[#736d5c]'}`}>
            Quick Examples / उदाहरण पर टैप करें:
          </span>
          <div className="flex flex-wrap gap-2">
            {REGIONAL_PROMPT_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                id={`btn-sample-prompt-${idx}`}
                type="button"
                onClick={() => {
                  setRawText(sample.text);
                  setExchangeDesire('Fair equipment hours or organic fertilizer');
                }}
                className={`px-2.5 py-1 text-xs rounded-xl border transition-colors cursor-pointer text-left ${
                  isDarkMode 
                    ? 'bg-[#15271a] hover:bg-[#1d3826] text-[#c2d6c6] border-[#26442e]' 
                    : 'bg-[#f0ebd9] hover:bg-[#e4ddc5] text-[#3d3728] border-[#dcd1bc]'
                }`}
              >
                <span className="font-bold text-emerald-400">{sample.label}:</span>{' '}
                <span className="truncate max-w-[200px] inline-block align-bottom">{sample.text.slice(0, 35)}...</span>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2: WHAT DO YOU NEED IN RETURN (BARTER OR RENT) */}
        <div className={`space-y-2 pt-2 border-t ${isDarkMode ? 'border-[#1e3423]' : 'border-[#ede7d8]'}`}>
          <label className={`text-sm font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-[#1c291d]'}`}>
            <span>2. {t.whatInExchange}</span>
          </label>
          <input
            id="input-exchange-desire"
            type="text"
            value={exchangeDesire}
            onChange={(e) => setExchangeDesire(e.target.value)}
            placeholder="e.g. Need Combine Harvester for 2 days OR 25 bags Vermicompost OR ₹1200/day"
            className={`w-full p-3.5 rounded-2xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
              isDarkMode 
                ? 'bg-[#0b170f] border-[#203625] text-white placeholder-[#5a7260]' 
                : 'bg-[#faf7f0] border-[#d8cdb4] text-[#1c261c]'
            }`}
          />
          
          {/* Quick Barter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#7d9683]' : 'text-[#7a7465]'}`}>
              Quick Barter Suggestions:
            </span>
            {QUICK_BARTER_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setExchangeDesire(preset.val)}
                className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#14261a] hover:bg-[#1f3d29] border-[#23422a] text-[#b8d0be]' 
                    : 'bg-[#f4efe3] hover:bg-[#eae1cf] border-[#ded5c2] text-[#4d4738]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selector */}
        <div className={`space-y-2 pt-2 border-t ${isDarkMode ? 'border-[#1e3423]' : 'border-[#ede7d8]'}`}>
          <label className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#1c291d]'}`}>
            Resource Category / संसाधन श्रेणी:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'machinery', label: t.machinery, icon: Tractor },
              { id: 'biomass', label: t.biomass, icon: Wheat },
              { id: 'irrigation', label: t.irrigation, icon: SunMedium },
              { id: 'tools', label: t.tools, icon: Wrench },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  id={`cat-select-${cat.id}`}
                  type="button"
                  onClick={() => setCategory(cat.id as ResourceCategory)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    category === cat.id
                      ? (isDarkMode 
                          ? 'bg-[#153420] border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40 font-bold' 
                          : 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-600/30 font-bold')
                      : (isDarkMode 
                          ? 'bg-[#0d1a11] border-[#1e3323] text-[#9ab19f] hover:bg-[#14261a]' 
                          : 'bg-white border-[#d8cdb4] text-[#554f40] hover:bg-[#faf7f0]')
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${category === cat.id ? 'text-emerald-400' : 'text-[#7e7766]'}`} />
                  <span className="text-xs leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality Condition & Broadcast Radius Controls */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t ${isDarkMode ? 'border-[#1e3423]' : 'border-[#ede7d8]'}`}>
          <div>
            <label className={`text-xs font-bold block mb-1.5 ${isDarkMode ? 'text-[#b7ccbc]' : 'text-[#504a3c]'}`}>
              Equipment / Asset Condition:
            </label>
            <div className="flex gap-2">
              {(['Pristine', 'Field-Ready', 'Inspected'] as const).map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setConditionGrade(grade)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                    conditionGrade === grade
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : isDarkMode 
                        ? 'bg-[#0d1a11] border-[#1e3323] text-[#8fa794]' 
                        : 'bg-[#faf7f0] border-[#d8cdb4] text-[#554f40]'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-xs font-bold ${isDarkMode ? 'text-[#b7ccbc]' : 'text-[#504a3c]'}`}>
                Broadcast Radius:
              </label>
              <span className="text-xs font-bold text-emerald-500">{broadcastRadiusKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={broadcastRadiusKm}
              onChange={(e) => setBroadcastRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className={`flex justify-between text-[10px] ${isDarkMode ? 'text-[#708a76]' : 'text-[#877f6e]'}`}>
              <span>5 km (Village)</span>
              <span>25 km (Tehsil)</span>
              <span>50 km (District)</span>
            </div>
          </div>
        </div>

        {/* Location Inputs */}
        <div className={`space-y-2 pt-2 border-t ${isDarkMode ? 'border-[#1e3423]' : 'border-[#ede7d8]'}`}>
          <label className={`text-sm font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-[#1c291d]'}`}>
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>3. {t.locationLabel}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#8aa390]' : 'text-[#787161]'}`}>{t.villageName}</span>
              <input
                id="input-loc-village"
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                  isDarkMode ? 'bg-[#0b170f] border-[#203625] text-white' : 'bg-[#faf7f0] border-[#d8cdb4] text-[#1c261c]'
                }`}
              />
            </div>
            <div>
              <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#8aa390]' : 'text-[#787161]'}`}>{t.districtName}</span>
              <input
                id="input-loc-district"
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                  isDarkMode ? 'bg-[#0b170f] border-[#203625] text-white' : 'bg-[#faf7f0] border-[#d8cdb4] text-[#1c261c]'
                }`}
              />
            </div>
            <div>
              <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#8aa390]' : 'text-[#787161]'}`}>{t.stateName}</span>
              <input
                id="input-loc-state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                  isDarkMode ? 'bg-[#0b170f] border-[#203625] text-white' : 'bg-[#faf7f0] border-[#d8cdb4] text-[#1c261c]'
                }`}
              />
            </div>
            <div>
              <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#8aa390]' : 'text-[#787161]'}`}>Pincode</span>
              <input
                id="input-loc-pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                  isDarkMode ? 'bg-[#0b170f] border-[#203625] text-white' : 'bg-[#faf7f0] border-[#d8cdb4] text-[#1c261c]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Image Selection & Upload */}
        <div className={`space-y-3 pt-2 border-t ${isDarkMode ? 'border-[#1e3423]' : 'border-[#ede7d8]'}`}>
          <div className="flex items-center justify-between">
            <label className={`text-sm font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-[#1c291d]'}`}>
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span>4. Product Image / फोटो चुनें या अपलोड करें</span>
            </label>
            <label className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer flex items-center gap-1 ${
              isDarkMode 
                ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800 hover:bg-emerald-900/60' 
                : 'text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
            }`}>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Preset Images Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_IMAGES.map((img, i) => (
              <div
                key={i}
                id={`img-preset-${i}`}
                onClick={() => setSelectedImage(img.url)}
                className={`relative rounded-xl overflow-hidden aspect-square border-2 cursor-pointer transition-all ${
                  selectedImage === img.url
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105'
                    : isDarkMode 
                      ? 'border-[#223927] opacity-70 hover:opacity-100' 
                      : 'border-[#ded5c2] opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {selectedImage === img.url && (
                  <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 drop-shadow-md" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI MAGIC TRANSLATE & VALUE BUTTON */}
        <div className={`pt-4 border-t ${isDarkMode ? 'border-[#1e3423]' : 'border-[#ede7d8]'}`}>
          <button
            id="btn-trigger-ai-enrich"
            type="button"
            onClick={handleAiEnrich}
            disabled={isEnriching || !rawText.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isEnriching ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{t.aiEnhancing}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{t.aiEnhanceBtn}</span>
              </>
            )}
          </button>
        </div>

        {enrichmentError && (
          <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>{enrichmentError}</span>
          </div>
        )}

      </div>

      {/* STEP 3: AI ENRICHED PREVIEW & PUBLISH CARD */}
      {(aiResult || finalTitle) && (
        <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200 ${
          isDarkMode ? 'bg-[#102316] border-emerald-500/80' : 'bg-[#f4efe4] border-emerald-600/80'
        }`}>
          
          <div className={`flex items-center justify-between border-b pb-4 ${
            isDarkMode ? 'border-[#1e3b26]' : 'border-[#ded5c2]'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#1a2d1d]'}`}>
                  AI Structured & Translated Listing Preview
                </h3>
                <span className="text-xs text-emerald-400 font-semibold">
                  Ready to broadcast across {village} & {district} ({broadcastRadiusKm} km radius)
                </span>
              </div>
            </div>

            <span className={`px-3 py-1 font-bold text-xs rounded-full border ${
              isDarkMode 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              Verified Specs ({conditionGrade})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left: Product Image */}
            <div className={`relative rounded-2xl overflow-hidden aspect-4/3 bg-black/10 border ${
              isDarkMode ? 'border-[#223d2a]' : 'border-[#d8cdb4]'
            }`}>
              <img
                src={selectedImage}
                alt="Listing"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                {category.toUpperCase()}
              </div>
            </div>

            {/* Middle & Right: Listing Details */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-[#8da593]' : 'text-[#706a5a]'}`}>
                  English Title (AI Generated):
                </label>
                <input
                  type="text"
                  value={finalTitle}
                  onChange={(e) => setFinalTitle(e.target.value)}
                  className={`w-full font-bold text-base p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-[#09150d] border-[#223d2a] text-white' : 'bg-white border-[#ded5c2] text-[#1b261b]'
                  }`}
                />
              </div>

              {finalTitleHi && (
                <div>
                  <label className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-[#8da593]' : 'text-[#706a5a]'}`}>
                    Hindi / Regional Translation:
                  </label>
                  <div className={`text-sm font-semibold p-2.5 rounded-xl border ${
                    isDarkMode 
                      ? 'text-emerald-300 bg-[#0d1e13] border-[#213f28]' 
                      : 'text-emerald-900 bg-emerald-50/70 border-emerald-200'
                  }`}>
                    {finalTitleHi}
                  </div>
                </div>
              )}

              <div>
                <label className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-[#8da593]' : 'text-[#706a5a]'}`}>
                  Enhanced Description:
                </label>
                <textarea
                  rows={2}
                  value={finalDescription}
                  onChange={(e) => setFinalDescription(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-[#09150d] border-[#223d2a] text-[#d1dfd4]' : 'bg-white border-[#ded5c2] text-[#413b2c]'
                  }`}
                />
              </div>

              {/* Detected Specs Tags */}
              {aiResult?.detected_specs && (
                <div className={`p-3 rounded-xl border space-y-1.5 ${
                  isDarkMode ? 'bg-[#0c1a11] border-[#203926]' : 'bg-white border-[#ded5c2]'
                }`}>
                  <span className="text-[11px] font-bold text-emerald-400 block">
                    ⚙️ Technical Specs Detected:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(aiResult.detected_specs).map(([key, val]) => (
                      <span key={key} className={`px-2 py-0.5 rounded-md border ${
                        isDarkMode ? 'bg-[#152a1c] text-[#bad0bf] border-[#25462e]' : 'bg-[#f6f2e8] text-[#383222] border-[#e3d8c2]'
                      }`}>
                        <strong>{key}:</strong> {String(val)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Environmental Carbon Metric */}
              {aiResult?.stubble_co2_offset_estimate && (
                <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-medium ${
                  isDarkMode 
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <Leaf className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>
                    <strong>Impact Metric:</strong> Prevents ~{aiResult.stubble_co2_offset_estimate.stubbleTons} tons of stubble burning = ~{aiResult.stubble_co2_offset_estimate.co2SavedTons} tons CO₂ emission reduction.
                  </span>
                </div>
              )}

              {/* Price & Barter Adjustment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-[#8da593]' : 'text-[#706a5a]'}`}>
                    Estimated Fair Rate (₹):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(Number(e.target.value))}
                      className={`w-28 font-bold text-sm p-2 rounded-xl border ${
                        isDarkMode ? 'bg-[#09150d] border-[#223d2a] text-white' : 'bg-white border-[#ded5c2]'
                      }`}
                    />
                    <input
                      type="text"
                      value={finalPriceUnit}
                      onChange={(e) => setFinalPriceUnit(e.target.value)}
                      className={`flex-1 text-xs p-2 rounded-xl border ${
                        isDarkMode ? 'bg-[#09150d] border-[#223d2a] text-white' : 'bg-white border-[#ded5c2]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-[#8da593]' : 'text-[#706a5a]'}`}>
                    Barter Terms:
                  </label>
                  <input
                    type="text"
                    value={finalBarterTerms}
                    onChange={(e) => setFinalBarterTerms(e.target.value)}
                    className={`w-full text-xs font-semibold p-2 rounded-xl border ${
                      isDarkMode ? 'bg-[#09150d] border-[#223d2a] text-white' : 'bg-white border-[#ded5c2] text-[#1c291c]'
                    }`}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Final Publish Button */}
          <div className={`pt-4 border-t ${isDarkMode ? 'border-[#1e3b26]' : 'border-[#ded5c2]'}`}>
            <button
              id="btn-publish-final-listing"
              type="button"
              onClick={handlePublish}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>{t.publishListing}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
