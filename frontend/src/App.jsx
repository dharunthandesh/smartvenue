import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Pages
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import QueuePage from './pages/QueuePage';
import NavPage from './pages/NavPage';
import AlertsPage from './pages/AlertsPage';
import AdminPanel from './pages/AdminPanel';

/**
 * Main Application Shell
 * Implements Google-grade routing and layout structure.
 */
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
        {/* Modular Sidebar Component */}
        <Sidebar />

        {/* Global Content Header / Mobile Nav (Simplified for 2.0) */}
        <div className="lg:pl-72 min-h-screen">
          <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">
              Stadium Control <span className="text-primary">v2.0.4</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-success/10 text-success text-[10px] font-bold px-3 py-1 rounded-full border border-success/20">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live: Firebase Connected
              </div>
            </div>
          </header>

          <main className="p-8 pb-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/queues" element={<QueuePage />} />
              <Route path="/nav" element={<NavPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
