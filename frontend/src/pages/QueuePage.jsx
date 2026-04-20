import React, { useState, useEffect } from 'react';
import { getQueueTimes } from '../api';
import { Utensils, DoorOpen, Bath, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getIcon = (type) => {
  switch (type) {
    case 'food': return <Utensils size={20} />;
    case 'washroom': return <Bath size={20} />;
    case 'gate': return <DoorOpen size={20} />;
    default: return <Clock size={20} />;
  }
};

const QueueCard = ({ queue }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    role="status"
    aria-label={`${queue.name} wait time is ${queue.wait_time} minutes`}
    className="card flex items-center justify-between group overflow-hidden relative"
  >
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {getIcon(queue.type)}
      </div>
      <div>
        <h3 className="font-bold text-lg">{queue.name}</h3>
        <p className="text-gray-400 text-sm capitalize">{queue.type}</p>
      </div>
    </div>

    <div className="text-right">
      <div className={`text-2xl font-black ${queue.wait_time > 10 ? 'text-danger' : queue.wait_time > 5 ? 'text-warning' : 'text-success'}`}>
        {queue.wait_time}m
      </div>
      <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Est. Wait</div>
    </div>
    
    {/* Progress bar background */}
    <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
      <motion.div 
        className={`h-full ${queue.wait_time > 10 ? 'bg-danger' : queue.wait_time > 5 ? 'bg-warning' : 'bg-success'}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, queue.wait_time * 5)}%` }}
      />
    </div>
  </motion.div>
);

const QueuePage = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    try {
      const { data } = await getQueueTimes();
      setQueues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredQueues = filter === 'all' ? queues : queues.filter(q => q.type === filter);

  return (
    <div className="py-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Smart Queue Management</h1>
        <p className="text-gray-400">Live wait times powered by real-time sensor data.</p>
      </header>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['all', 'food', 'washroom', 'gate'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all capitalize border ${
              filter === f ? 'bg-primary border-primary text-white' : 'bg-surface border-white/10 text-gray-400 hover:border-primary/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && queues.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 italic">
          <Loader2 className="animate-spin mb-4" size={32} />
          Fetching live data...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredQueues.map((queue) => (
              <QueueCard key={queue.id} queue={queue} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* AI Recommendation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 p-8 glass rounded-3xl border-l-8 border-primary"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Clock size={20} />
          </div>
          <h2 className="text-xl font-bold italic">AI Fast-Track Recommend</h2>
        </div>
        <p className="text-gray-300 leading-relaxed max-w-3xl">
          Based on current stadium patterns, wait times for <strong>Taco Shack</strong> are expected to increase by 150% in the next 10 minutes as the first quarter ends. 
          <span className="text-primary font-bold"> Move now to save 12 minutes.</span>
        </p>
      </motion.div>
    </div>
  );
};

export default QueuePage;
