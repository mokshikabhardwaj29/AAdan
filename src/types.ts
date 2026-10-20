export type ResourceCategory = 'machinery' | 'biomass' | 'tools' | 'irrigation';

export type ListingType = 'barter' | 'rent' | 'sell' | 'free_exchange';

export type LanguageCode = 'en' | 'hi' | 'pa' | 'mr' | 'bn' | 'te' | 'ta' | 'gu' | 'kn';

export interface LocationData {
  village: string;
  panchayat?: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface ResourceListing {
  id: string;
  title: string;
  title_hi?: string;
  title_original?: string;
  originalLanguage?: string;
  category: ResourceCategory;
  subCategory: string;
  description: string;
  description_hi?: string;
  description_original?: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerBadge: 'Verified Kisan' | 'Panchayat Verified' | 'Top Care Exchanger' | 'Community Elder';
  sellerTrustScore: number; // 0 to 5.0
  totalSwaps: number;
  location: LocationData;
  listingType: ListingType;
  price: number; // in INR
  priceUnit: string; // 'per day' | 'per acre' | 'per quintal' | 'per trolley' | 'total swap'
  barterExchangeNeeded: string;
  barterFairScore?: number; // 0 to 100
  estimatedValue?: number; // in INR
  condition: 'Brand New' | 'Excellent' | 'Good' | 'Well Maintained' | 'Dry & Packed';
  specs: Record<string, string>; // e.g. HP, Model Year, Fuel Type, Moisture %
  stubblePreventedTons?: number;
  co2PreventedTons?: number;
  isAvailable: boolean;
  availableDateRange?: {
    start: string;
    end: string;
  };
  createdAt?: string;
  source?: 'web' | 'whatsapp' | 'voice_assistant';
}

export interface ChatMessage {
  id: string;
  listingId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerDetails?: {
    offeredItem: string;
    cashAdjustment?: number;
    dates?: string;
    status: 'pending' | 'accepted' | 'declined';
  };
  isSystemNote?: boolean;
}

export interface AppNotification {
  id: string;
  listingId?: string;
  senderName?: string;
  title: string;
  message: string;
  timeAgo?: string;
  timestamp?: string;
  read?: boolean;
  isRead?: boolean;
  type: 'inquiry' | 'match' | 'swap_accept' | 'system' | 'chat' | 'barter' | 'stubble_saved' | 'interest';
}

export interface BarterValuationRequest {
  offeredItemTitle: string;
  offeredItemCategory: string;
  offeredQuantityOrDays: string;
  offeredCondition: string;
  neededItemTitle: string;
  neededItemCategory: string;
  neededQuantityOrDays: string;
  locationState?: string;
}

export interface BarterValuationResponse {
  fairValueScore: number; // 0-100
  balanceStatus: 'Balanced & Fair' | 'Moderate Balance' | 'Needs Cash Adjustment' | 'Substantial Imbalance';
  offeredEstValue: number;
  neededEstValue: number;
  suggestedCashAdjustment: number;
  cashDirection: 'None' | 'Payer is Offeror' | 'Payer is Recipient';
  reasoning: string;
  reasoning_hi: string;
  environmentalBenefit?: string;
  actionableTips: string[];
}

export interface AIListingEnrichmentRequest {
  rawText: string;
  audioVoiceNote?: string;
  languageDetected?: string;
  categoryHint?: string;
  exchangeDesire?: string;
  villageName?: string;
  district?: string;
  state?: string;
}

export interface FarmerUser {
  id: string;
  name: string;
  name_hi?: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  avatarText: string;
  isVerified: boolean;
  trustScore: number;
  totalSwaps: number;
  joinedDate: string;
}

export interface AIListingEnrichmentResponse {
  title_en: string;
  title_hi: string;
  title_regional: string;
  category: ResourceCategory;
  subCategory: string;
  enhanced_description_en: string;
  enhanced_description_hi: string;
  detected_specs: Record<string, string>;
  suggested_price: number;
  suggested_unit: string;
  suggested_barter_terms: string;
  estimated_fair_market_value: number;
  stubble_co2_offset_estimate?: {
    stubbleTons: number;
    co2SavedTons: number;
  };
  key_highlights: string[];
}

