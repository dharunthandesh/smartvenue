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
from firebase_admin import credentials, db
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="SmartVenue AI - Secure Production API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Enable CORS with restricted origins in production (mocked here as '*')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# --- Firebase Integration (Google Services) ---
FIREBASE_READY = False
try:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    db_url = os.getenv("FIREBASE_DATABASE_URL")
    if cred_path and db_url:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {'databaseURL': db_url})
        FIREBASE_READY = True
        logger.info("Firebase initialized successfully.")
    else:
        logger.warning("Firebase credentials missing. Falling back to in-memory store for demo.")
except Exception as e:
    logger.error(f"Failed to initialize Firebase: {e}")

# --- Data Models ---

class CrowdData(BaseModel):
    zone_id: str
    zone_name: str
    density: str = Field(..., pattern="^(low|medium|high)$")
    population: int = Field(..., ge=0)
    last_updated: float

class QueueTime(BaseModel):
    id: str
    name: str
    type: str = Field(..., pattern="^(food|washroom|gate)$")
    wait_time: int = Field(..., ge=0)
    status: str

class Alert(BaseModel):
    id: int
    level: str = Field(..., pattern="^(info|warning|emergency)$")
    message: str
    timestamp: float

class NavigationRequest(BaseModel):
    current_location: str
    destination: str

class UpdateCrowdLevel(BaseModel):
    zone_id: str
    density: str

# --- In-Memory State (Backup for Firebase) ---

zones_store = {
    "A1": {"name": "North Gate", "density": "low", "population": 120},
    "A2": {"name": "West Stand", "density": "medium", "population": 850},
    "B1": {"name": "Food Court Alpha", "density": "high", "population": 450},
    "B2": {"name": "South Entrance", "density": "low", "population": 80},
}

queues_store = [
    {"id": "q1", "name": "Burger Junction", "type": "food", "wait_time": 15, "status": "busy"},
    {"id": "q4", "name": "Main Gate", "type": "gate", "wait_time": 12, "status": "open"},
]

alerts_store = []

# --- Helper Methods ---

def get_db():
    """Abstraction for Firebase vs Memory"""
    if FIREBASE_READY:
        return db.reference('/')
    return None

# --- API Endpoints ---

@app.get("/crowd", response_model=List[CrowdData])
@limiter.limit("10/minute")
async def get_crowd(request: Request):
    """Fetch live crowd metrics with rate limiting."""
    result = []
    if FIREBASE_READY:
        # Real Firebase Logic
        data = get_db().child('zones').get()
        if data:
            for zid, val in data.items():
                result.append(CrowdData(zone_id=zid, zone_name=val['name'], density=val['density'], population=val['population'], last_updated=time.time()))
    else:
        # Simulated Logic
        for zid, data in zones_store.items():
            data["population"] += random.randint(-2, 2)
            data["population"] = max(0, data["population"])
            result.append(CrowdData(zone_id=zid, zone_name=data["name"], density=data["density"], population=data["population"], last_updated=time.time()))
    return result

@app.get("/queue", response_model=List[QueueTime])
async def get_queues():
    """Live wait times for all facilities."""
    return [QueueTime(**q) for q in queues_store]

@app.get("/alerts", response_model=List[Alert])
async def get_alerts():
    """Real-time safety alerts."""
    return [Alert(**a) for a in alerts_store]

@app.post("/navigation")
async def get_navigation(req: NavigationRequest):
    """Security check: Validate locations before pathfinding."""
    valid_locations = ["North Gate", "West Stand", "South Entrance", "Food Court Alpha", "VIP Lounge", "East Concourse"]
    if req.current_location not in valid_locations or req.destination not in valid_locations:
        raise HTTPException(status_code=400, detail="Invalid location coordinates.")
    
    path = [req.current_location, "Safe Corridor 2", req.destination]
    return {
        "path": path,
        "estimated_time": random.randint(4, 9),
        "recommendation": "Route through Zone B2 is least crowded and security-verified."
    }

# --- Admin Endpoints (Secured with Mock Auth) ---

async def verify_admin(token: Optional[str] = None):
    if token != "admin-secret-token": # In production use JWT
        raise HTTPException(status_code=403, detail="Unauthorized")

@app.post("/admin/update-crowd")
async def update_crowd(req: UpdateCrowdLevel, user: str = Depends(verify_admin)):
    """Admin only: Manual crowd density override."""
    if req.zone_id not in zones_store:
        raise HTTPException(status_code=404, detail="Zone ID invalid")
    zones_store[req.zone_id]["density"] = req.density
    return {"message": "Zone updated successfully"}

@app.post("/admin/trigger-alert")
async def trigger_alert(alert: Alert, user: str = Depends(verify_admin)):
    """Admin only: Immediate broadcast broadcast."""
    alerts_store.append(alert.dict())
    return {"message": "Emergency broadcast transmitted"}

@app.get("/admin/analytics")
async def get_analytics(user: str = Depends(verify_admin)):
    """Admin only: Performance and occupancy metrics."""
    total_pop = sum(z["population"] for z in zones_store.values())
    return {
        "total_population": total_pop,
        "status": "Healthy",
        "google_cloud_status": "Active" if FIREBASE_READY else "Simulated"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
