import random
import time
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SmartVenue AI API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---

class CrowdData(BaseModel):
    zone_id: str
    zone_name: str
    density: str  # "low", "medium", "high"
    population: int
    last_updated: float

class QueueTime(BaseModel):
    id: str
    name: str
    type: str  # "food", "washroom", "gate"
    wait_time: int  # in minutes
    status: str  # "open", "closed", "busy"

class Alert(BaseModel):
    id: int
    level: str  # "info", "warning", "emergency"
    message: str
    timestamp: float

class NavigationRequest(BaseModel):
    current_location: str
    destination: str

class UpdateCrowdLevel(BaseModel):
    zone_id: str
    density: str

# --- In-Memory State ---

zones = {
    "A1": {"name": "North Gate", "density": "low", "population": 120},
    "A2": {"name": "West Stand", "density": "medium", "population": 850},
    "B1": {"name": "Food Court Alpha", "density": "high", "population": 450},
    "B2": {"name": "South Entrance", "density": "low", "population": 80},
    "C1": {"name": "East Concourse", "density": "medium", "population": 600},
    "C2": {"name": "VIP Lounge", "density": "low", "population": 45},
}

queues = [
    {"id": "q1", "name": "Burger Junction", "type": "food", "wait_time": 15, "status": "busy"},
    {"id": "q2", "name": "Taco Shack", "type": "food", "wait_time": 5, "status": "open"},
    {"id": "q3", "name": "North Washrooms", "type": "washroom", "wait_time": 8, "status": "busy"},
    {"id": "q4", "name": "Main Gate", "type": "gate", "wait_time": 12, "status": "open"},
]

alerts = [
    {"id": 1, "level": "info", "message": "The match starts in 20 minutes. Please take your seats.", "timestamp": time.time()},
]

# --- API Endpoints ---

@app.get("/crowd", response_model=List[CrowdData])
async def get_crowd():
    # Simulate some fluctuation
    result = []
    for zid, data in zones.items():
        # Randomly fluctuate population slightly
        data["population"] += random.randint(-5, 5)
        data["population"] = max(0, data["population"])
        
        # Determine density based on population (simplified)
        if data["population"] > 800:
            data["density"] = "high"
        elif data["population"] > 300:
            data["density"] = "medium"
        else:
            data["density"] = "low"

        result.append(CrowdData(
            zone_id=zid,
            zone_name=data["name"],
            density=data["density"],
            population=data["population"],
            last_updated=time.time()
        ))
    return result

@app.get("/queue", response_model=List[QueueTime])
async def get_queues():
    # Simulate wait time fluctuations
    for q in queues:
        if q["status"] != "closed":
            q["wait_time"] += random.randint(-2, 2)
            q["wait_time"] = max(1, q["wait_time"])
    return [QueueTime(**q) for q in queues]

@app.get("/alerts", response_model=List[Alert])
async def get_alerts():
    return [Alert(**a) for a in alerts]

@app.post("/navigation")
async def get_navigation(req: NavigationRequest):
    # Mock navigation logic
    # In a real app, this would use a graph algorithm based on crowd data
    path = [req.current_location, "Corridor 4", "Zone B2", req.destination]
    estimated_time = random.randint(3, 10)
    return {
        "path": path,
        "estimated_time": estimated_time,
        "recommendation": "Route through Zone B2 is currently least crowded."
    }

# --- Admin Endpoints ---

@app.post("/admin/update-crowd")
async def update_crowd(req: UpdateCrowdLevel):
    if req.zone_id not in zones:
        raise HTTPException(status_code=404, detail="Zone not found")
    zones[req.zone_id]["density"] = req.density
    # Manually setting population to match density for consistency
    if req.density == "high": zones[req.zone_id]["population"] = 1000
    elif req.density == "medium": zones[req.zone_id]["population"] = 500
    else: zones[req.zone_id]["population"] = 100
    return {"message": f"Zone {req.zone_id} updated to {req.density}"}

@app.post("/admin/trigger-alert")
async def trigger_alert(alert: Alert):
    alerts.append(alert.dict())
    if len(alerts) > 10:  # Keep last 10 alerts
        alerts.pop(0)
    return {"message": "Alert triggered"}

@app.get("/admin/analytics")
async def get_analytics():
    # Mock analytics data
    total_population = sum(z["population"] for z in zones.values())
    avg_wait_time = sum(q["wait_time"] for q in queues) / len(queues)
    return {
        "total_population": total_population,
        "avg_wait_time": round(avg_wait_time, 1),
        "peak_zone": max(zones, key=lambda x: zones[x]["population"]),
        "density_distribution": {
            "low": len([z for z in zones.values() if z["density"] == "low"]),
            "medium": len([z for z in zones.values() if z["density"] == "medium"]),
            "high": len([z for z in zones.values() if z["density"] == "high"]),
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
