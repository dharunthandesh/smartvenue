import React, { useState, useEffect } from 'react';
import { getCrowdData } from '../api';
import { Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const DensityBadge = ({ level }) => {
  if (level === 'high') return <span className="badge-high">High Density</span>;
  if (level === 'medium') return <span className="badge-medium">Medium</span>;
  return <span className="badge-low">Low Density</span>;
};

const MapPage = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await getCrowdData();
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Pulse every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Live Crowd Monitoring</h1>
          <p className="text-gray-400">Real-time occupancy metrics for all stadium zones.</p>
        </div>
        <button 
          onClick={fetchData}
          className="btn-secondary flex items-center gap-2 self-start"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading && zones.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Visualization (Simplified) */}
          <div 
            className="lg:col-span-2 card relative min-h-[400px] flex items-center justify-center bg-zinc-900 border-zinc-800"
            role="region"
            aria-label="Stadium interactive crowd map"
          >
             <div className="absolute inset-0 opacity-10 flex items-center justify-center" aria-hidden="true">
                <Users size={300} />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full h-full p-4 relative z-10">
                {zones.map((zone) => (
                  <motion.div
                    key={zone.zone_id}
                    layoutId={zone.zone_id}
                    role="status"
                    aria-live="polite"
                    aria-label={`${zone.zone_name}: ${zone.density} density, ${zone.population} people`}
                    className={`rounded-2xl p-6 border flex flex-col justify-between transition-colors ${
                      zone.density === 'high' ? 'bg-danger/10 border-danger/30' : 
                      zone.density === 'medium' ? 'bg-warning/10 border-warning/30' : 
                      'bg-success/10 border-success/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg">{zone.zone_name}</h3>
                      <DensityBadge level={zone.density} />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white">{zone.population}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Active People</div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* Stats & Legend */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold mb-6">Visual Legend</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded bg-success" />
                  <span className="text-gray-300">0 - 300 (Low)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded bg-warning" />
                  <span className="text-gray-300">301 - 800 (Medium)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded bg-danger" />
                  <span className="text-gray-300">800+ (High / Crowded)</span>
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-danger">
              <div className="flex items-start gap-4">
                <AlertTriangle className="text-danger" size={24} />
                <div>
                  <h4 className="font-bold text-danger mb-1">Overcrowding Alert</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Zone B1 (Food Court Alpha) is currently near capacity. Exit routes are being rerouted to Zone B2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
