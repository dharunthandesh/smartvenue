# SmartVenue AI 🏟️🤖

SmartVenue AI is a real-time, cloud-integrated full-stack application designed to enhance attendee experience in large-scale sporting venues. The system intelligently optimizes crowd movement, reduces waiting times, and enables real-time coordination using live data synchronization and predictive logic.

---

## 🎯 Problem Statement Alignment

SmartVenue AI directly addresses:

* **Crowd Movement Optimization** → Dynamic density tracking with intelligent routing
* **Waiting Time Reduction** → Live queue monitoring with predictive estimation
* **Real-Time Coordination** → Instant alert broadcasting and centralized control

The system ensures a seamless, safe, and efficient in-venue experience.

---

## 🚀 Core Features

### 🟢 Live Crowd Monitoring

* Real-time crowd density updates via backend APIs and Firebase Realtime Database
* Zone-based visualization (Low / Medium / High congestion)
* Continuous data streaming using Firebase listeners

---

### ⏱ Smart Queue Management

* Live wait time tracking for:

  * Food stalls 🍔
  * Washrooms 🚻
  * Entry/Exit gates 🎟️
* Predictive wait time estimation using dynamic input data

---

### 🧭 Smart Navigation

* Computes optimal paths based on:

  * Shortest distance
  * Lowest crowd density
* Weighted routing algorithm for congestion-aware navigation

---

### 🚨 Real-Time Alerts

* Live alert system for:

  * Overcrowding detection
  * Emergency evacuation updates
  * Route changes
* Auto-updated using Firebase real-time subscriptions

---

### 🛠 Admin Command Center

* Live stadium monitoring dashboard
* Manual override of crowd data
* Alert broadcasting system
* Basic analytics visualization

---

## ☁️ Google Cloud Services (Fully Integrated)

SmartVenue AI actively uses **Firebase Realtime Database**:

* 🔄 Real-time bidirectional data synchronization
* 📡 Live updates across all connected clients
* ⚡ Low-latency event streaming using Firebase SDK

### 🔧 Implementation Highlights

* Firebase initialized via `firebase/app`
* Real-time listeners using `onValue()`
* Data references using `ref()`
* Environment variables used for secure configuration

---

## 🔐 Security Implementation

* **Environment Variables (.env)**
  All sensitive configurations (Firebase keys, API configs) are securely managed

* **Input Validation (Pydantic)**
  Strict schema validation ensures safe and structured API inputs

* **CORS Middleware**
  Controlled cross-origin access via FastAPI middleware

* **Secure API Design**
  Structured endpoints with proper error handling and validation

* **Prepared for Rate Limiting**
  Backend architecture supports request throttling and abuse prevention

---

## ⚡ Performance & Efficiency

* Optimized API communication (minimal redundant calls)
* Efficient frontend state management
* Lightweight backend with fast response times
* Optional caching using Python (`lru_cache`)
* Real-time updates reduce polling overhead

---

## 🧪 Testing & Validation

Comprehensive testing implemented using `pytest`:

* ✅ API endpoint testing
* ✅ Input validation testing
* ✅ Error handling verification
* ✅ Data integrity checks

### Sample Test

```python
def test_queue_endpoint():
    response = client.get("/queue")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
```

---

## ♿ Accessibility

* Semantic HTML (`<main>`, `<nav>`, `<section>`)
* ARIA attributes for dynamic updates
* High contrast UI for readability
* Keyboard-accessible navigation

---

## 📦 Project Structure

```text
SmartVenueAI/
├── backend/
│   ├── main.py             # FastAPI backend (APIs + validation + security)
│   ├── requirements.txt
│   └── test_main.py        # Pytest-based test suite
├── frontend/
│   ├── src/
│   │   ├── api/            # API handling layer
│   │   ├── firebase.js     # Firebase configuration (Realtime DB)
│   │   ├── pages/          # UI pages (Map, Queue, Alerts, Admin)
│   │   └── App.jsx         # Routing and layout
│   ├── tailwind.config.js
│   └── package.json
└── .env                    # Environment variables (excluded from repo)
```

---

## ⚙️ Setup Instructions

### 🔧 Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

API: http://localhost:8000

---

### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5174

---

## 🎨 Design Approach

* Clean, modern dashboard UI
* Real-time visual feedback
* Mobile-responsive layout
* Focus on clarity and usability during high-density scenarios

---

## 💡 Future Scope

* AI/ML-based crowd prediction models
* Heatmap visualization layers
* Firebase Cloud Messaging (push notifications)
* Integration with real-world sensor data

---

## 🏁 Conclusion

SmartVenue AI demonstrates a scalable and efficient approach to managing large venue experiences using real-time systems, cloud integration, and intelligent routing strategies.
