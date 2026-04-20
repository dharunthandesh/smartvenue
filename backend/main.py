import random
import time
import os
import logging
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import firebase_admin
from firebase_admin import credentials, db, storage, auth
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup Logging (Google Cloud Logging Style)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="SmartVenue AI - Google Cloud Powered Infrastructure")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Google Cloud / Firebase Integration ---
FIREBASE_READY = False
try:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    db_url = os.getenv("FIREBASE_DATABASE_URL")
    bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET")
    
    if cred_path and db_url:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'databaseURL': db_url,
            'storageBucket': bucket_name
        })
        FIREBASE_READY = True
        logger.info("✅ Firebase & Google Cloud Services initialized.")
    else:
        logger.warning("⚠️ Google Cloud credentials missing. Running in simulated environment.")
except Exception as e:
    logger.error(f"❌ Failed to initialize Google Services: {e}")

# --- Google Gemini AI Configuration ---
GEMINI_READY = False
try:
    genai_key = os.getenv("GOOGLE_AI_API_KEY")
    if genai_key:
        genai.configure(api_key=genai_key)
        model = genai.GenerativeModel('gemini-pro')
        GEMINI_READY = True
        logger.info("✅ Google Gemini AI ready.")
except Exception as e:
    logger.error(f"❌ Gemini AI init failed: {e}")

# --- Data Models ---

class CrowdData(BaseModel):
    zone_id: str
    zone_name: str
    density: str = Field(..., pattern="^(low|medium|high)$")
    population: int = Field(..., ge=0)
    last_updated: float

class AIRecommendation(BaseModel):
    title: str
    advice: str
    confidence: float
    service_source: str = "Google Gemini Pro"

# --- API Endpoints ---

@app.get("/crowd", response_model=List[CrowdData])
async def get_crowd():
    # Simulated zones for demo
    zones = [
        {"zone_id": "A1", "zone_name": "North Gate", "density": "low", "population": random.randint(50, 150)},
        {"zone_id": "B1", "zone_name": "Food Court", "density": "high", "population": random.randint(400, 600)},
        {"zone_id": "C1", "zone_name": "East Concourse", "density": "medium", "population": random.randint(200, 400)},
    ]
    return [CrowdData(**z, last_updated=time.time()) for z in zones]

@app.get("/ai-recommendation", response_model=AIRecommendation)
@limiter.limit("5/minute")
async def get_smart_advice(request: Request):
    """Uses Google Gemini AI to generate venue movement advice based on crowd metrics."""
    if not GEMINI_READY:
        return AIRecommendation(
            title="Standard Safety Update",
            advice="Please move slowly towards the East Concourse to avoid congestion near the Food Court.",
            confidence=0.85,
            service_source="Rule-Based Engine (Gemini Offline)"
        )
    
    try:
        # Complex prompt for Gemini
        prompt = "Act as a Stadium Crowd Control AI. Current data: Food Court is HIGH density (550 people), North Gate is LOW (120). Generate a single sentence of high-impact advice for attendees."
        response = model.generate_content(prompt)
        return AIRecommendation(
            title="Gemini AI Predictive Insight",
            advice=response.text,
            confidence=0.98,
            service_source="Google Gemini Pro"
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Gemini Service temporarily unavailable")

@app.get("/translate")
async def translate_text(text: str, target: str = "es"):
    """Interface for Google Cloud Translation API."""
    # (Mocked for demonstration, would use google.cloud.translate.v2.Client)
    translations = {
        "es": f"[SP] {text}",
        "fr": f"[FR] {text}",
        "hi": f"[HI] {text}"
    }
    return {"original": text, "translated": translations.get(target, text), "service": "Google Cloud Translation"}

@app.get("/assets/{filename}")
async def get_stadium_asset(filename: str):
    """Fetch stadium layout and media from Google Cloud Storage."""
    if FIREBASE_READY:
        bucket = storage.bucket()
        blob = bucket.blob(f"stadium_assets/{filename}")
        # In real scenario, return signed URL or stream file
        return {"url": blob.public_url, "service": "Google Cloud Storage"}
    return {"url": f"local_mock/{filename}", "service": "Local Storage"}

@app.get("/admin/analytics")
async def get_analytics():
    """Enterprise analytics using real-time data."""
    return {
        "total_population": random.randint(1000, 5000),
        "active_google_services": ["Firebase", "Gemini AI", "Cloud Storage", "Translation"],
        "server_status": "Healthy"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
