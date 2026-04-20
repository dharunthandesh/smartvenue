import React, { useState } from 'react';
import { getNavigation } from '../api';
import { MapPin, Navigation as NavIcon, ChevronRight, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavPage = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNavigate = async (e) => {
    e.preventDefault();
    if (!start || !end) return;
    
    setLoading(true);
    try {
      const { data } = await getNavigation(start, end);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Smart Pathfinding</h1>
        <p className="text-gray-400">Calculate the shortest path while avoiding dense crowds.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form Container */}
        <div className="card h-fit">
          <form onSubmit={handleNavigate} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Current Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <select 
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="">Select entry point...</option>
                  <option value="North Gate">North Gate (Gate 1)</option>
                  <option value="West Stand">West Stand (Block A)</option>
                  <option value="South Entrance">South Entrance (Gate 4)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center -my-3 relative">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-primary border-primary/20 z-10">
                    <ChevronRight className="rotate-90" size={16} />
                </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Destination</label>
              <div className="relative">
                <NavIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <select 
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="">Select destination...</option>
                  <option value="Food Court Alpha">Food Court Alpha</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="East Concourse">East Concourse</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !start || !end}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed italic"
            >
              {loading ? <Loader2 className="animate-spin" /> : <NavIcon size={20} />}
              Calculate Optimized Route
            </button>
          </form>
        </div>

        {/* Results Container */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-3xl"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-600">
                    <NavIcon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-500 mb-2">Ready to Guide</h3>
                <p className="text-gray-600 text-sm italic">Input your location and destination to see the best route.</p>
              </motion.div>
            )}

            {loading && (
                <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-primary font-bold animate-pulse italic">Rerouting based on live crowd data...</p>
                    </div>
                </div>
            )}

            {result && !loading && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="card bg-primary/5 border-primary/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Optimized Route</h3>
                    <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-black">
                        {result.estimated_time} MINS
                    </div>
                  </div>

                  <div className="space-y-4 relative">
                    {/* Path steps */}
                    {result.path.map((step, i) => (
                      <div key={i} className="flex items-center gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-primary bg-background text-xs font-bold ${i === 0 ? 'bg-primary text-white' : 'text-primary'}`}>
                          {i + 1}
                        </div>
                        <span className={`font-medium ${i === result.path.length - 1 ? 'text-white' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                    {/* Line connecting steps */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-primary/20 -z-0" />
                  </div>
                </div>

                <div className="card flex items-start gap-4">
                    <Info className="text-primary shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-primary mb-1 italic">Why this route?</h4>
                        <p className="text-sm text-gray-400 leading-relaxed italic">
                            {result.recommendation}
                        </p>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NavPage;
