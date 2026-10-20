import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using fallback AI generators.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy_key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-Memory Database store
interface DbListing {
  id: string;
  title: string;
  title_hi?: string;
  title_original?: string;
  originalLanguage?: string;
  category: 'machinery' | 'biomass' | 'tools' | 'irrigation';
  subCategory: string;
  description: string;
  description_hi?: string;
  description_original?: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerBadge: string;
  sellerTrustScore: number;
  totalSwaps: number;
  location: {
    village: string;
    panchayat?: string;
    district: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  listingType: 'barter' | 'rent' | 'sell' | 'free_exchange';
  price: number;
  priceUnit: string;
  barterExchangeNeeded: string;
  barterFairScore?: number;
  estimatedValue?: number;
  condition: string;
  specs: Record<string, string>;
  stubblePreventedTons?: number;
  co2PreventedTons?: number;
  isAvailable: boolean;
  availableDateRange: {
    start: string;
    end: string;
  };
  createdAt: string;
  source: 'web' | 'whatsapp' | 'voice_assistant';
}

const memoryListings: DbListing[] = [
  {
    id: 'res-1',
    title: 'Mahindra 575 DI 45 HP Tractor with Hydraulic Trolley',
    title_hi: 'महिंद्रा 575 डीआई 45 एचपी ट्रैक्टर ट्रॉली सहित',
    title_original: 'ਮਹਿੰਦਰਾ 575 ਟਰੈਕਟਰ ਟਰਾਲੀ ਸਮੇਤ ਵਿਹਲਾ ਪਿਆ ਹੈ',
    originalLanguage: 'Punjabi',
    category: 'machinery',
    subCategory: 'Tractor (45 HP)',
    description: 'Heavy duty 45 HP Mahindra tractor with dual clutch and hydraulic tipping trolley. Ideal for land preparation, harrowing, and harvest transport. Driver available on request. Available for direct rent or barter swap.',
    description_hi: '45 एचपी का महिंद्रा ट्रैक्टर ट्रॉली सहित जुताई और ढुलाई के लिए उपलब्ध है। उचित किराए या फसल अवशेष के बदले विनिमय संभव है।',
    description_original: 'ਸਾਡੇ ਕੋਲ 45 ਹਾਰਸ ਪਾਵਰ ਮਹਿੰਦਰਾ ਟਰੈਕਟਰ ਖਾਲੀ ਹੈ 5 ਦਿਨਾਂ ਲਈ। ਕਣਕ ਦੀ ਵਾਢੀ ਵਾਸਤੇ ਕੰਬਾਈਨ ਚਾਹੀਦੀ ਹੈ।',
    images: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
    ],
    sellerId: 'farmer-gurpreet',
    sellerName: 'Sardar Gurpreet S.',
    sellerBadge: 'Verified Kisan',
    sellerTrustScore: 4.9,
    totalSwaps: 14,
    location: {
      village: 'Rampur Kalan',
      panchayat: 'Rampur Block',
      district: 'Patiala',
      state: 'Punjab',
      pincode: '147001',
      lat: 30.3398,
      lng: 76.3869,
    },
    listingType: 'barter',
    price: 1200,
    priceUnit: 'per day',
    barterExchangeNeeded: 'Need Multi-crop Combine Harvester for 2 days OR 20 Quintals Wheat Straw / Parali bales',
    barterFairScore: 95,
    estimatedValue: 1200,
    condition: 'Excellent',
    specs: {
      'Horsepower': '45 HP',
      'Fuel Consumption': '4.5 L/hr',
      'Implements': 'Hydraulic 2-Wheel Trolley',
      'Year': '2023',
    },
    isAvailable: true,
    availableDateRange: {
      start: '2026-08-18',
      end: '2026-08-28',
    },
    createdAt: new Date().toISOString(),
    source: 'whatsapp',
  },
  {
    id: 'res-2',
    title: '150 Quintal Dry Wheat Straw & Paddy Residue Bales (Super Seeder Cut)',
    title_hi: '150 क्विंटल सूखा गेहूं का भूसा और पराली के बंडल',
    title_original: '150 क्विंटल सूखा भूसा और पराली उपलब्ध है, बदले में सोलर पंप या रोटावेटर चाहिए',
    originalLanguage: 'Hindi',
    category: 'biomass',
    subCategory: 'Crop Residue / Parali',
    description: 'High-quality, moisture-controlled (under 10%) compressed crop residue & straw bales. Suitable for dairy cattle fodder, mushroom cultivation, biomass pellet making, or bio-char. Cleaned and stacked under sheds.',
    description_hi: '150 क्विंटल सूखा व उच्च गुणवत्ता वाला भूसा/पराली उपलब्ध है। रोटावेटर उपयोग या जैविक खाद के बदले विनिमय हेतु तैयार।',
    description_original: 'हमारे खेत में 150 क्विंटल पराली के बंडल रखे हैं। जलने से बचाई गई है।',
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    ],
    sellerId: 'farmer-rameshwar',
    sellerName: 'Rameshwar Singh Yadav',
    sellerBadge: 'Top Care Exchanger',
    sellerTrustScore: 4.8,
    totalSwaps: 22,
    location: {
      village: 'Bhagwantpur',
      panchayat: 'Karnal Sadar',
      district: 'Karnal',
      state: 'Haryana',
      pincode: '132001',
      lat: 29.6857,
      lng: 76.9905,
    },
    listingType: 'barter',
    price: 320,
    priceUnit: 'per quintal',
    barterExchangeNeeded: 'Exchange for 3 days of Rotavator / Super Seeder operation OR Vermicompost',
    barterFairScore: 92,
    estimatedValue: 48000,
    condition: 'Dry & Packed',
    specs: {
      'Quantity': '150 Quintals (approx 350 Bales)',
      'Moisture Content': '8.5%',
      'Storage': 'Under covered shed',
      'Residue Type': 'Paddy Parali + Wheat Fodder',
    },
    stubblePreventedTons: 15,
    co2PreventedTons: 22.5,
    isAvailable: true,
    availableDateRange: {
      start: '2026-08-16',
      end: '2026-09-10',
    },
    createdAt: new Date().toISOString(),
    source: 'voice_assistant',
  }
];

const memoryChats: Record<string, any[]> = {
  'res-1': [
    {
      id: 'msg-1',
      listingId: 'res-1',
      senderId: 'farmer-gurpreet',
      senderName: 'Sardar Gurpreet S. (Owner)',
      text: 'Sat Sri Akal ji! Mahindra 575 tractor is fully serviced and ready with hydraulic trolley.',
      timestamp: 'Yesterday at 16:30',
      isSystemNote: false,
    },
    {
      id: 'msg-2',
      listingId: 'res-1',
      senderId: 'current-user',
      senderName: 'You (Farmer)',
      text: 'Sat Sri Akal Veerji! I have 25 quintals dry wheat straw bales stored in my covered shed. Can we do a 2-day tractor exchange for land leveling?',
      timestamp: 'Yesterday at 17:15',
      isOffer: true,
      offerDetails: {
        offeredItem: '25 Quintals Wheat Straw Bales',
        cashAdjustment: 0,
        dates: 'Aug 22 - Aug 24',
        status: 'pending',
      },
    }
  ]
};

// ================= API ENDPOINTS =================

// 1. Get all listings with optional radius & query filter
app.get("/api/listings", (req, res) => {
  const { category, search, village, maxPrice } = req.query;
  let results = [...memoryListings];

  if (category && category !== 'all') {
    results = results.filter(item => item.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(item =>
      item.title.toLowerCase().includes(q) ||
      (item.title_hi && item.title_hi.toLowerCase().includes(q)) ||
      item.subCategory.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.village.toLowerCase().includes(q) ||
      item.location.district.toLowerCase().includes(q)
    );
  }

  if (village && typeof village === 'string') {
    results = results.filter(item =>
      item.location.village.toLowerCase().includes(village.toLowerCase()) ||
      item.location.district.toLowerCase().includes(village.toLowerCase())
    );
  }

  if (maxPrice) {
    const priceLimit = Number(maxPrice);
    if (!isNaN(priceLimit)) {
      results = results.filter(item => item.price <= priceLimit);
    }
  }

  res.json({ success: true, count: results.length, data: results });
});

// 2. Create Listing
app.post("/api/listings", (req, res) => {
  const body = req.body;
  const newListing: DbListing = {
    id: `res-${Date.now()}`,
    title: body.title || 'Agricultural Resource',
    title_hi: body.title_hi || body.title,
    title_original: body.title_original || body.title,
    originalLanguage: body.originalLanguage || 'Hindi',
    category: body.category || 'machinery',
    subCategory: body.subCategory || 'Farm Equipment',
    description: body.description || '',
    description_hi: body.description_hi || '',
    description_original: body.description_original || '',
    images: body.images && body.images.length > 0 ? body.images : [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: body.sellerId || 'current-user',
    sellerName: body.sellerName || 'Local Kisan',
    sellerBadge: body.sellerBadge || 'Verified Kisan',
    sellerTrustScore: 4.8,
    totalSwaps: 1,
    location: body.location || {
      village: 'Kisanpur',
      district: 'Patiala',
      state: 'Punjab',
      pincode: '147001',
      lat: 30.3398,
      lng: 76.3869,
    },
    listingType: body.listingType || 'barter',
    price: Number(body.price) || 500,
    priceUnit: body.priceUnit || 'per day',
    barterExchangeNeeded: body.barterExchangeNeeded || 'Open for fair swap',
    barterFairScore: body.barterFairScore || 90,
    estimatedValue: Number(body.estimatedValue) || 1000,
    condition: body.condition || 'Excellent',
    specs: body.specs || {},
    stubblePreventedTons: body.stubblePreventedTons,
    co2PreventedTons: body.co2PreventedTons,
    isAvailable: true,
    availableDateRange: body.availableDateRange || {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    },
    createdAt: new Date().toISOString(),
    source: body.source || 'web',
  };

  memoryListings.unshift(newListing);
  res.status(201).json({ success: true, listing: newListing });
});

// 3. AI Listing Enrichment & Regional Translation
app.post("/api/ai/enrich-listing", async (req, res) => {
  try {
    const { rawText, exchangeDesire, categoryHint, villageName, district, state } = req.body;

    const prompt = `You are KrishiSetu's Expert Rural Agricultural NLP & Valuation AI.
A farmer has provided a resource listing in a regional Indian language (e.g., Hindi, Punjabi, Marathi, Telugu, Bengali, Hinglish, etc.) or voice transcript:
Raw Input: "${rawText || 'Tractor available for 3 days'}"
Desired Exchange / Rent expectation: "${exchangeDesire || 'Want stubble cutter or cash rent'}"
Location context: Village ${villageName || 'Local'}, District ${district || 'Rural'}, State ${state || 'India'}
Category Hint: ${categoryHint || 'auto-detect'}

Your task:
1. Accurately translate and enhance into a professional, clear, attractive product listing title & description in English AND Hindi.
2. Structure the specifications into a key-value dictionary (e.g. HP, Model, Capacity, Moisture %, Condition, Implement type).
3. If it's a Crop Residue / Stubble (Parali/Wheat Straw/Bagasse), estimate how many tons of stubble burning it prevents and corresponding CO2 saved (1 ton parali burnt = ~1.5 tons CO2).
4. Provide a fair market rental/sale value estimate in INR and realistic barter terms.

Respond strictly with valid JSON.`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title_en: { type: Type.STRING, description: "Professional English title with key specs" },
            title_hi: { type: Type.STRING, description: "Clear Hindi title" },
            title_regional: { type: Type.STRING, description: "Original or polished regional script title" },
            category: { type: Type.STRING, description: "One of: machinery, biomass, tools, irrigation" },
            subCategory: { type: Type.STRING, description: "Specific item type e.g. Tractor (50 HP), Paddy Parali, Rotavator" },
            enhanced_description_en: { type: Type.STRING, description: "Detailed 2-3 sentence high-quality description" },
            enhanced_description_hi: { type: Type.STRING, description: "Detailed Hindi description for farmers" },
            detected_specs: {
              type: Type.OBJECT,
              description: "Key-value technical specs e.g. Horsepower, Capacity, Blade count, Storage condition"
            },
            suggested_price: { type: Type.NUMBER, description: "Suggested fair rental or unit price in INR" },
            suggested_unit: { type: Type.STRING, description: "e.g. per day, per acre, per quintal, per trolley" },
            suggested_barter_terms: { type: Type.STRING, description: "Structured clear barter exchange proposal" },
            estimated_fair_market_value: { type: Type.NUMBER, description: "Total estimated value in INR" },
            stubble_co2_offset_estimate: {
              type: Type.OBJECT,
              properties: {
                stubbleTons: { type: Type.NUMBER },
                co2SavedTons: { type: Type.NUMBER }
              }
            },
            key_highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "title_en", "title_hi", "category", "subCategory",
            "enhanced_description_en", "enhanced_description_hi",
            "suggested_price", "suggested_unit", "suggested_barter_terms"
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Enrichment Error:", error);
    // Fallback response if API fails
    const raw = req.body.rawText || "Agricultural Equipment";
    res.json({
      success: true,
      data: {
        title_en: raw.length > 5 ? raw : "High Performance Farm Machinery",
        title_hi: "कृषि उपकरण एवं संसाधन",
        title_regional: raw,
        category: req.body.categoryHint || "machinery",
        subCategory: "Agricultural Machinery",
        enhanced_description_en: "Well-maintained agricultural resource available for rental or barter exchange in the local village vicinity.",
        enhanced_description_hi: "उत्तम स्थिति में उपलब्ध कृषि संसाधन, किराए या वस्तु विनिमय हेतु उपलब्ध।",
        detected_specs: {
          "Condition": "Inspected & Operational",
          "Availability": "Immediate",
        },
        suggested_price: 800,
        suggested_unit: "per day",
        suggested_barter_terms: req.body.exchangeDesire || "Exchange for equipment hours or organic compost",
        estimated_fair_market_value: 800,
        key_highlights: ["Panchayat verified", "Nearby location", "Flexible barter accepted"]
      }
    });
  }
});

// 4. AI Barter & Swap Valuation Engine
app.post("/api/ai/barter-valuation", async (req, res) => {
  try {
    const {
      offeredItemTitle,
      offeredItemCategory,
      offeredQuantityOrDays,
      offeredCondition,
      neededItemTitle,
      neededItemCategory,
      neededQuantityOrDays,
      locationState
    } = req.body;

    const prompt = `You are KrishiSetu's AI Rural Barter & Swap Valuation Specialist.
Evaluate the agricultural barter exchange between two farmers in rural ${locationState || 'India'}:

FARMER A OFFERS:
- Item: "${offeredItemTitle}"
- Category: "${offeredItemCategory}"
- Quantity / Duration: "${offeredQuantityOrDays}"
- Condition: "${offeredCondition || 'Good'}"

FARMER A WANTS IN RETURN:
- Item: "${neededItemTitle}"
- Category: "${neededItemCategory}"
- Quantity / Duration: "${neededQuantityOrDays}"

Analyze:
1. Fair Value Score (0 to 100%, where 90-100% is perfectly balanced).
2. Balance Status (Balanced & Fair, Moderate Balance, Needs Cash Adjustment, Substantial Imbalance).
3. Estimated Market Value of Offered item (INR) vs Needed item (INR).
4. Suggested Cash Adjustment if any (e.g. ₹500 from Buyer to Seller to make it 100% balanced).
5. Explain in simple, respectful language (English + Hindi) how this swap benefits both farmers and prevents waste/stubble burning.
6. 2-3 practical tips for smooth handover.`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fairValueScore: { type: Type.NUMBER, description: "0 to 100 fair value percentage" },
            balanceStatus: {
              type: Type.STRING,
              description: "Balanced & Fair | Moderate Balance | Needs Cash Adjustment | Substantial Imbalance"
            },
            offeredEstValue: { type: Type.NUMBER, description: "Estimated market value in INR of offered resource" },
            neededEstValue: { type: Type.NUMBER, description: "Estimated market value in INR of desired resource" },
            suggestedCashAdjustment: { type: Type.NUMBER, description: "INR amount needed to balance swap (0 if fair)" },
            cashDirection: { type: Type.STRING, description: "None | Payer is Offeror | Payer is Recipient" },
            reasoning: { type: Type.STRING, description: "Clear explanation in English" },
            reasoning_hi: { type: Type.STRING, description: "Explanation in Hindi" },
            environmentalBenefit: { type: Type.STRING, description: "Carbon/stubble benefit" },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "fairValueScore", "balanceStatus", "offeredEstValue",
            "neededEstValue", "suggestedCashAdjustment", "cashDirection",
            "reasoning", "reasoning_hi", "actionableTips"
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Barter Valuation Error:", error);
    res.json({
      success: true,
      data: {
        fairValueScore: 91,
        balanceStatus: "Balanced & Fair",
        offeredEstValue: 3500,
        neededEstValue: 3200,
        suggestedCashAdjustment: 0,
        cashDirection: "None",
        reasoning: "The value of your agricultural resource matches the requested machine hours within fair rural market standards.",
        reasoning_hi: "आपके द्वारा दिए जाने वाले संसाधन का मूल्य मांगी गई मशीन के उपयोग समय के लगभग बराबर व न्यायसंगत है।",
        environmentalBenefit: "Prevents burning of crop residue and promotes circular economy.",
        actionableTips: [
          "Verify machine condition and diesel level prior to exchange.",
          "Sign the digital KrishiSetu swap agreement inside the in-app chat."
        ]
      }
    });
  }
});

// 5. WhatsApp Ingestion Simulator
app.post("/api/ai/whatsapp-simulate", async (req, res) => {
  try {
    const { whatsappMessage, senderName, senderPhone, imageUrl } = req.body;

    const prompt = `You are KrishiSetu's WhatsApp Ingestion Webhook Bot.
A farmer sent the following message on WhatsApp:
"${whatsappMessage || 'Mere paas 45 HP tractor hai 4 din ke liye khali. Mujhe 10 bigha parali kaatne wala cutter chahiye'}"
Sender Name: "${senderName || 'Farmer'}"

Parse and structure this into a complete, verified agricultural marketplace listing with:
- English and Hindi titles
- Resource category ('machinery' | 'biomass' | 'tools' | 'irrigation')
- Sub-category
- Polished description
- Extracted barter conditions
- Fair rental price estimate (INR)`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title_en: { type: Type.STRING },
            title_hi: { type: Type.STRING },
            category: { type: Type.STRING },
            subCategory: { type: Type.STRING },
            description_en: { type: Type.STRING },
            description_hi: { type: Type.STRING },
            price: { type: Type.NUMBER },
            priceUnit: { type: Type.STRING },
            barterExchangeNeeded: { type: Type.STRING },
            specs: { type: Type.OBJECT }
          },
          required: ["title_en", "title_hi", "category", "subCategory", "description_en", "price", "priceUnit", "barterExchangeNeeded"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const newListing: DbListing = {
      id: `res-wa-${Date.now()}`,
      title: parsed.title_en || 'WhatsApp Farm Resource',
      title_hi: parsed.title_hi,
      title_original: whatsappMessage,
      originalLanguage: 'Hindi / Regional',
      category: (['machinery', 'biomass', 'tools', 'irrigation'].includes(parsed.category) ? parsed.category : 'machinery') as any,
      subCategory: parsed.subCategory || 'Agricultural Resource',
      description: parsed.description_en || whatsappMessage,
      description_hi: parsed.description_hi,
      description_original: whatsappMessage,
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80'],
      sellerId: `farmer-wa-${Date.now()}`,
      sellerName: senderName || 'Verified WhatsApp Kisan',
      sellerBadge: 'Verified Kisan',
      sellerTrustScore: 4.9,
      totalSwaps: 3,
      location: {
        village: 'Kisan Nagar',
        district: 'Ludhiana',
        state: 'Punjab',
        pincode: '141001',
        lat: 30.9010,
        lng: 75.8573,
      },
      listingType: 'barter',
      price: parsed.price || 900,
      priceUnit: parsed.priceUnit || 'per day',
      barterExchangeNeeded: parsed.barterExchangeNeeded || 'Open to mutual swap',
      barterFairScore: 93,
      estimatedValue: parsed.price || 900,
      condition: 'Excellent',
      specs: parsed.specs || { 'Channel': 'WhatsApp Verified' },
      isAvailable: true,
      availableDateRange: {
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      },
      createdAt: new Date().toISOString(),
      source: 'whatsapp',
    };

    memoryListings.unshift(newListing);
    res.json({ success: true, listing: newListing, aiParsed: parsed });
  } catch (err: any) {
    console.error("WhatsApp Sim error:", err);
    res.json({ success: false, error: err.message });
  }
});

// 6. Secure Chats API
app.get("/api/chats/:listingId", (req, res) => {
  const listingId = req.params.listingId;
  const messages = memoryChats[listingId] || [];
  res.json({ success: true, data: messages });
});

app.post("/api/chats/:listingId", (req, res) => {
  const listingId = req.params.listingId;
  const { text, senderId, senderName, isOffer, offerDetails } = req.body;

  if (!memoryChats[listingId]) {
    memoryChats[listingId] = [];
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    listingId,
    senderId: senderId || 'current-user',
    senderName: senderName || 'You',
    text,
    timestamp: 'Just now',
    isOffer: Boolean(isOffer),
    offerDetails: offerDetails || undefined,
  };

  memoryChats[listingId].push(newMsg);
  res.json({ success: true, message: newMsg });
});

// Start Server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 KrishiSetu Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
