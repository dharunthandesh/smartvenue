# SmartVenue AI 🏟️🤖

SmartVenue AI is a cutting-edge full-stack application designed to improve the physical event experience at large-scale sporting venues. By leveraging real-time data simulation and AI-driven insights, it optimizes crowd movement, reduces waiting times, and ensures safety through coordinated alerts.

---

## 🏗️ Project Overview

### 🎯 Chosen Vertical: Large-Scale Sports & Entertainment Venues
Large stadiums face massive challenges in logistical efficiency, specifically regarding "bottleneck" congestion at food stalls, washrooms, and exit gates. SmartVenue AI is designed for venue operators and attendees to turn a chaotic physical environment into a data-driven, manageable experience.

### 🧠 Approach & Logic
The solution is built on the principle of **Proactive Infrastructure Management**:
1.  **Distributed Monitoring**: The system divides the venue into logical "Zones" (e.g., North Gate, West Stand, Food Court).
2.  **Density Evaluation**: Each zone is assigned a density level (Low, Medium, High) based on real-time population counts.
3.  **Heuristic Queue Logic**: Wait times are not just static values; they are calculated based on current active users in the queue proximity and historical stall capacity.
4.  **Optimized Pathfinding**: The navigation logic uses a weight-based graph simulation. Instead of just "shortest distance," it calculates a "cost" for each route where high-density zones add significant time penalties, effectively rerouting users to "quieter" paths.

### ⚙️ How the Solution Works
1.  **Data Fetching**: The frontend polls the FastAPI backend every 5 seconds (simulating real-time IoT/Sensor data streams).
2.  **Live Updates**:
    *   **Map**: Updates based on `/crowd` endpoint, showing color-coded heatmaps.
    *   **Queues**: Updates via `/queue`, showing minutes of wait time with dynamic progress bars.
3.  **Advisory Logic**: The system identifies trends (e.g., "Taco Shack wait times are trending UP") and pushes an "AI Recommendation" to the user's dashboard to encourage movement before the peak.
4.  **Admin Control**: Operators can manually override zone density (in case of mechanical sensor failure) and trigger "Emergency Broadcasts" that appear instantly on all attendee devices.

### 📝 Assumptions Made
*   **Connectivity**: We assume high-density Wi-Fi or 5G coverage is available across the venue for real-time polling.
*   **Sensor Input**: The simulation assumes data is sourced from existing overhead computer vision cameras or BLE beacon trilateration.
*   **User Compliance**: Navigation logic assumes that a significant percentage of users will follow the "quieter route" suggestion to balance the load.

### 🔐 Security+ & Efficiency
*   **Rate Limiting**: Implemented `slowapi` to prevent DDoS and brute-force attacks on sensitive endpoints.
*   **Input Validation**: Strict Pydantic schemas for all API payloads (Navigation, Admin Updates).
*   **Mock Authentication**: JWT-ready token verification logic for the Admin Panel.
*   **Optimized State**: API client with automatic token injection and local caching for sub-second response times.

### ☁️ Google Cloud Services
*   **Firebase Realtime DB**: The backend is now fully architected to use Google Firebase as the primary source of truth.
*   **Environment Agnostic**: Seamlessly falls back to simulated data if service account credentials are not present, ensuring 100% uptime for demo purposes.

### ♿ Accessibility (WCAG 2.1)
*   **Semantic HTML**: Proper use of `<header>`, `<main>`, and `<aside>`.
*   **ARIA Suite**: Comprehensive implementation of `aria-live`, `aria-label`, and `role="status"` for real-time dashboard updates, making the app usable via screen readers.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Python (FastAPI), Pydantic, Uvicorn, SlowAPI, Firebase-Admin.
- **Data Persistence**: Google Firebase (Realtime Database).

## 📦 Project Structure

```text
SmartVenueAI/
├── backend/
│   ├── main.py         # FastAPI application
│   ├── requirements.txt
│   └── test_main.py    # Unit tests
└── frontend/
    ├── src/
    │   ├── api/        # Axios client
    │   ├── pages/      # React pages
    │   ├── components/ # UI components
    │   └── App.jsx     # Main routing
    ├── tailwind.config.js
    └── package.json
```

## ⚙️ Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5174`.

To run backend tests:
```bash
cd backend
pytest
```

## 🎨 Design Philosophy
The UI follows a **Premium Dark Dashboard** aesthetic with glassmorphism effects, vibrant primary accents, and responsive layouts. Micro-animations are used throughout to provide a smooth, high-end feel.
