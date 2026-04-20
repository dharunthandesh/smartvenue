# SmartVenue AI 🏟️🤖

SmartVenue AI is a cutting-edge full-stack application designed to improve the physical event experience at large-scale sporting venues. By leveraging real-time data simulation and AI-driven insights, it optimizes crowd movement, reduces waiting times, and ensures safety through coordinated alerts.

## 🚀 Features

- **Live Crowd Monitoring**: Dynamic heatmaps and density visualization across stadium zones.
- **Smart Queue Management**: Real-time wait time estimates for food, washrooms, and gates.
- **Smart Pathfinding**: Navigation logic that suggests the shortest and least crowded routes.
- **Real-Time Alerts**: Instant broadcasts for safety updates and route changes.
- **Admin Command Center**: Operations dashboard for manual overrides, alert triggering, and population analytics.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Python (FastAPI), Pydantic, Uvicorn.
- **Data Simulation**: In-memory state with random fluctuation logic.

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
   The application will be available at `http://localhost:5173`.

### Running Tests
To run backend tests:
```bash
cd backend
pytest
```

## 🎨 Design Philosophy
The UI follows a **Premium Dark Dashboard** aesthetic with glassmorphism effects, vibrant primary accents, and responsive layouts. Micro-animations are used throughout to provide a smooth, high-end feel.
