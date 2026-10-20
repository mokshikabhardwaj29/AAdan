# KrishiSetu - Python FastAPI Backend Guide

This directory contains the standalone **Python FastAPI** backend for the **KrishiSetu Rural Resource & Residue Exchange Platform** (designed for Smart India Hackathon / SIH & Rural Innovation).

---

## 🌾 Features Implemented in FastAPI:
1. **Resource Marketplace Endpoints** (`GET /api/listings`, `POST /api/listings`, `GET /api/listings/{id}`)
2. **AI NLP & Regional Language Translation Engine** (`POST /api/ai/enrich-listing`)
   - Translates Hindi, Punjabi, Marathi, Telugu, etc.
   - Generates bilingual, attractive descriptions & technical specs.
   - Computes Stubble Burning Prevention & CO₂ Offset.
3. **AI Smart Barter / Exchange Valuation Engine** (`POST /api/ai/barter-valuation`)
   - Evaluates machine-for-stubble or machine-for-machine swaps.
   - Generates Fair Value Score (0-100%) and suggested cash balance adjustment.
4. **WhatsApp Webhook Simulator** (`POST /api/ai/whatsapp-simulate`)
   - Ingests incoming farmer WhatsApp messages/voice transcripts + images.
5. **In-App Secure Chat Engine** (`GET /api/chats/{id}`, `POST /api/chats/{id}`)
   - Complete privacy shielding with zero personal phone number leakage.

---

## 🚀 How to Run the FastAPI Backend:

### Step 1: Create a Python Virtual Environment
```bash
cd fastapi_app
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Set Your Gemini API Key
```bash
export GEMINI_API_KEY="your_gemini_api_key_here"
# On Windows PowerShell:
# $env:GEMINI_API_KEY="your_gemini_api_key_here"
```

### Step 4: Run the Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Test via Swagger UI
Open your browser and navigate to:
**`http://localhost:8000/docs`**
Interactive Swagger documentation will allow you to test all endpoints!
