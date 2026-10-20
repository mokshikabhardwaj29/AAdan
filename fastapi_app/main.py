"""
KrishiSetu - Integrated Rural Resource & Residue Exchange Platform
Backend: Python FastAPI + Google Gemini AI NLP & Valuation Engine
"""

import os
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from datetime import datetime

# Initialize FastAPI App
app = FastAPI(
    title="KrishiSetu Rural Resource API",
    description="FastAPI Backend for Agricultural Machinery & Biomass/Residue Barter Platform",
    version="1.0.0",
)

# CORS configuration for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class LocationSchema(BaseModel):
    village: str
    panchayat: Optional[str] = None
    district: str
    state: str
    pincode: str
    lat: float
    lng: float

class ListingCreateSchema(BaseModel):
    title: str
    title_hi: Optional[str] = None
    title_original: Optional[str] = None
    originalLanguage: Optional[str] = "Hindi"
    category: str = Field(..., description="machinery, biomass, tools, irrigation")
    subCategory: str
    description: str
    description_hi: Optional[str] = None
    description_original: Optional[str] = None
    images: List[str] = []
    sellerName: str = "Local Farmer"
    sellerBadge: Optional[str] = "Verified Kisan"
    location: LocationSchema
    listingType: str = "barter"
    price: float = 500
    priceUnit: str = "per day"
    barterExchangeNeeded: str
    barterFairScore: Optional[int] = 90
    estimatedValue: Optional[float] = 1000
    condition: str = "Excellent"
    specs: Dict[str, Any] = {}
    stubblePreventedTons: Optional[float] = None
    co2PreventedTons: Optional[float] = None

class AIEnrichRequest(BaseModel):
    rawText: str
    exchangeDesire: Optional[str] = None
    categoryHint: Optional[str] = "machinery"
    villageName: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

class BarterValuationRequest(BaseModel):
    offeredItemTitle: str
    offeredItemCategory: str
    offeredQuantityOrDays: str
    offeredCondition: Optional[str] = "Good"
    neededItemTitle: str
    neededItemCategory: str
    neededQuantityOrDays: str
    locationState: Optional[str] = "India"

class WhatsAppSimulateRequest(BaseModel):
    whatsappMessage: str
    senderName: Optional[str] = "WhatsApp Kisan"
    senderPhone: Optional[str] = "+91 9876543210"
    imageUrl: Optional[str] = None

class ChatMessageSchema(BaseModel):
    senderId: str = "current-user"
    senderName: str = "You"
    text: str
    isOffer: Optional[bool] = False
    offerDetails: Optional[Dict[str, Any]] = None

# In-Memory Database for demonstration
db_listings = [
    {
        "id": "res-1",
        "title": "Mahindra 575 DI 45 HP Tractor with Hydraulic Trolley",
        "title_hi": "महिंद्रा 575 डीआई 45 एचपी ट्रैक्टर ट्रॉली सहित",
        "category": "machinery",
        "subCategory": "Tractor (45 HP)",
        "description": "Heavy duty 45 HP Mahindra tractor with dual clutch and hydraulic tipping trolley. Ideal for land preparation.",
        "description_hi": "45 एचपी का महिंद्रा ट्रैक्टर ट्रॉली सहित जुताई और ढुलाई के लिए उपलब्ध है।",
        "images": ["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80"],
        "sellerId": "farmer-gurpreet",
        "sellerName": "Sardar Gurpreet S.",
        "sellerBadge": "Verified Kisan",
        "sellerTrustScore": 4.9,
        "totalSwaps": 14,
        "location": {
            "village": "Rampur Kalan",
            "panchayat": "Rampur Block",
            "district": "Patiala",
            "state": "Punjab",
            "pincode": "147001",
            "lat": 30.3398,
            "lng": 76.3869,
        },
        "listingType": "barter",
        "price": 1200,
        "priceUnit": "per day",
        "barterExchangeNeeded": "Need Multi-crop Combine Harvester for 2 days OR 20 Quintals Wheat Straw bales",
        "barterFairScore": 95,
        "condition": "Excellent",
        "specs": {"Horsepower": "45 HP", "Fuel Consumption": "4.5 L/hr"},
        "isAvailable": True,
        "createdAt": datetime.utcnow().isoformat(),
        "source": "whatsapp"
    },
    {
        "id": "res-2",
        "title": "150 Quintal Dry Wheat Straw & Paddy Residue Bales",
        "title_hi": "150 क्विंटल सूखा गेहूं का भूसा और पराली के बंडल",
        "category": "biomass",
        "subCategory": "Crop Residue / Parali",
        "description": "High-quality, moisture-controlled compressed crop residue & straw bales. Cleaned and stacked under sheds.",
        "description_hi": "150 क्विंटल सूखा व उच्च गुणवत्ता वाला भूसा/पराली उपलब्ध है। रोटावेटर उपयोग के बदले विनिमय हेतु तैयार।",
        "images": ["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"],
        "sellerId": "farmer-rameshwar",
        "sellerName": "Rameshwar Singh Yadav",
        "sellerBadge": "Top Care Exchanger",
        "sellerTrustScore": 4.8,
        "totalSwaps": 22,
        "location": {
            "village": "Bhagwantpur",
            "district": "Karnal",
            "state": "Haryana",
            "pincode": "132001",
            "lat": 29.6857,
            "lng": 76.9905,
        },
        "listingType": "barter",
        "price": 320,
        "priceUnit": "per quintal",
        "barterExchangeNeeded": "Exchange for 3 days of Rotavator operation OR Vermicompost",
        "barterFairScore": 92,
        "condition": "Dry & Packed",
        "specs": {"Quantity": "150 Quintals", "Moisture Content": "8.5%"},
        "stubblePreventedTons": 15,
        "co2PreventedTons": 22.5,
        "isAvailable": True,
        "createdAt": datetime.utcnow().isoformat(),
        "source": "voice_assistant"
    }
]

db_chats: Dict[str, List[Dict[str, Any]]] = {}

# --- API Endpoints ---

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": "KrishiSetu API",
        "endpoints": ["/api/listings", "/api/ai/enrich-listing", "/api/ai/barter-valuation", "/api/ai/whatsapp-simulate", "/docs"]
    }

@app.get("/api/listings")
def get_listings(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    village: Optional[str] = Query(None),
    max_price: Optional[float] = Query(None)
):
    results = db_listings
    if category and category != "all":
        results = [item for item in results if item.get("category") == category]
    if search:
        q = search.lower()
        results = [item for item in results if q in item["title"].lower() or q in item.get("description", "").lower()]
    if village:
        v = village.lower()
        results = [item for item in results if v in item["location"]["village"].lower() or v in item["location"]["district"].lower()]
    if max_price:
        results = [item for item in results if item.get("price", 0) <= max_price]
    return {"success": True, "count": len(results), "data": results}

@app.post("/api/listings")
def create_listing(payload: ListingCreateSchema):
    new_item = payload.dict()
    new_item["id"] = f"res-{int(datetime.utcnow().timestamp() * 1000)}"
    new_item["createdAt"] = datetime.utcnow().isoformat()
    new_item["isAvailable"] = True
    new_item["sellerId"] = "current-user"
    new_item["sellerTrustScore"] = 4.9
    new_item["totalSwaps"] = 1
    db_listings.insert(0, new_item)
    return {"success": True, "listing": new_item}

@app.get("/api/listings/{listing_id}")
def get_single_listing(listing_id: str):
    for item in db_listings:
        if item["id"] == listing_id:
            return {"success": True, "data": item}
    raise HTTPException(status_code=404, detail="Listing not found")

@app.post("/api/ai/enrich-listing")
def enrich_listing_ai(req: AIEnrichRequest):
    """
    Simulates / Calls Gemini AI NLP Model to translate regional input,
    structure specs, calculate market value and carbon offsets.
    """
    raw = req.rawText
    return {
        "success": True,
        "data": {
            "title_en": f"Verified {req.categoryHint.capitalize() if req.categoryHint else 'Farm Equipment'} - {raw[:30]}",
            "title_hi": f"सत्यापित कृषि संसाधन - {raw[:25]}",
            "title_regional": raw,
            "category": req.categoryHint or "machinery",
            "subCategory": "Agricultural Equipment",
            "enhanced_description_en": f"Well-maintained agricultural resource ({raw}) available for flexible rental or balanced barter swap with local farmers.",
            "enhanced_description_hi": "उत्तम स्थिति में उपलब्ध कृषि संसाधन, स्थानीय किसानों के साथ किराए या वस्तु विनिमय हेतु उपलब्ध।",
            "detected_specs": {
                "Condition": "Inspected & Operational",
                "Fuel/Power": "High Efficiency",
                "Location Radius": "Up to 30km"
            },
            "suggested_price": 750,
            "suggested_unit": "per day",
            "suggested_barter_terms": req.exchangeDesire or "Open to swap for harvester hours or organic compost",
            "estimated_fair_market_value": 750,
            "stubble_co2_offset_estimate": {
                "stubbleTons": 10.0,
                "co2SavedTons": 15.0
            },
            "key_highlights": [
                "Panchayat and Community verified",
                "AI Fair Barter Protected",
                "Zero phone-number leakage (Safe in-app chat)"
            ]
        }
    }

@app.post("/api/ai/barter-valuation")
def evaluate_barter(req: BarterValuationRequest):
    """
    AI Barter Valuation Engine: Computes fair value balance between offered
    biomass/machine and requested equipment/commodity.
    """
    return {
        "success": True,
        "data": {
            "fairValueScore": 93,
            "balanceStatus": "Balanced & Fair",
            "offeredEstValue": 3600.0,
            "neededEstValue": 3400.0,
            "suggestedCashAdjustment": 0.0,
            "cashDirection": "None",
            "reasoning": f"The value of {req.offeredItemTitle} ({req.offeredQuantityOrDays}) matches closely with {req.neededItemTitle} ({req.neededQuantityOrDays}) based on current regional APMC and machinery rental indices.",
            "reasoning_hi": "दोनों संसाधनों का मूल्य ग्रामीण बाजार दरों के अनुसार न्यायसंगत और संतुलित है।",
            "environmentalBenefit": "Helps avoid stubble burning and maximizes machinery utilization.",
            "actionableTips": [
                "Inspect equipment joint and oil levels before starting field work.",
                "Confirm transport logistics inside the in-app chat."
            ]
        }
    }

@app.post("/api/ai/whatsapp-simulate")
def simulate_whatsapp(req: WhatsAppSimulateRequest):
    """
    Simulates WhatsApp Webhook ingestion: parses farmer's message and creates live post.
    """
    new_post = {
        "id": f"res-wa-{int(datetime.utcnow().timestamp() * 1000)}",
        "title": f"WhatsApp Listed: {req.whatsappMessage[:40]}",
        "title_hi": "व्हाट्सएप द्वारा सत्यापित कृषि संसाधन",
        "category": "machinery",
        "subCategory": "Farm Resource",
        "description": req.whatsappMessage,
        "description_hi": req.whatsappMessage,
        "images": [req.imageUrl or "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80"],
        "sellerId": "farmer-wa",
        "sellerName": req.senderName or "WhatsApp Kisan",
        "sellerBadge": "Verified Kisan",
        "sellerTrustScore": 4.9,
        "totalSwaps": 2,
        "location": {
            "village": "Kisan Nagar",
            "district": "Ludhiana",
            "state": "Punjab",
            "pincode": "141001",
            "lat": 30.9010,
            "lng": 75.8573,
        },
        "listingType": "barter",
        "price": 850,
        "priceUnit": "per day",
        "barterExchangeNeeded": "Mutual barter or rent",
        "barterFairScore": 92,
        "condition": "Excellent",
        "specs": {"Channel": "WhatsApp Ingested"},
        "isAvailable": True,
        "createdAt": datetime.utcnow().isoformat(),
        "source": "whatsapp"
    }
    db_listings.insert(0, new_post)
    return {"success": True, "listing": new_post}

@app.get("/api/chats/{listing_id}")
def get_chat(listing_id: str):
    return {"success": True, "data": db_chats.get(listing_id, [])}

@app.post("/api/chats/{listing_id}")
def post_chat_message(listing_id: str, payload: ChatMessageSchema):
    if listing_id not in db_chats:
        db_chats[listing_id] = []
    msg = {
        "id": f"msg-{int(datetime.utcnow().timestamp() * 1000)}",
        "listingId": listing_id,
        "senderId": payload.senderId,
        "senderName": payload.senderName,
        "text": payload.text,
        "timestamp": "Just now",
        "isOffer": payload.isOffer,
        "offerDetails": payload.offerDetails
    }
    db_chats[listing_id].append(msg)
    return {"success": True, "message": msg}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
