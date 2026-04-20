import React, { useState, useEffect } from 'react';
import { getAlerts } from '../api';
import { Bell, Info, AlertCircle, ShieldAlert, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getAlertStyles = (level) => {
  switch (level) {
    case 'emergency': return {
      icon: <ShieldAlert className="text-white" />,
      bg: 'bg-danger',
      border: 'border-danger/30',
      text: 'text-white',
      muted: 'text-white/70'
    };
    case 'warning': return {
      icon: <AlertCircle className="text-warning" />,
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      text: 'text-white',
      muted: 'text-gray-400'
    };
    default: return {
      icon: <Info className="text-primary" />,
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      text: 'text-white',
      muted: 'text-gray-400'
    };
  }
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await getAlerts();
      // Reverse to show latest first
      setAlerts([...data].reverse());
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

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Venue Broadcasts</h1>
          <p className="text-gray-400">Official safety updates and stadium alerts.</p>
        </div>
        <div className="relative">
          <Bell className="text-gray-600" size={32} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold">
            {alerts.length}
          </span>
        </div>
      </header>

      {loading && alerts.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {alerts.map((alert) => {
              const styles = getAlertStyles(alert.level);
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`${styles.bg} ${styles.border} border p-6 rounded-2xl flex gap-6 relative overflow-hidden`}
                >
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center glass shadow-xl`}>
                    {styles.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-black uppercase tracking-widest ${styles.text}`}>
                        {alert.level}
                      </span>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${styles.muted}`}>
                        <Clock size={12} />
                        {new Date(alert.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <p className={`text-lg font-medium leading-relaxed ${styles.text}`}>
                      {alert.message}
                    </p>
                  </div>
                  
                  {/* Decorative background pulse for emergency */}
                  {alert.level === 'emergency' && (
                    <motion.div 
                        className="absolute inset-0 bg-white/10"
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {alerts.length === 0 && (
            <div className="text-center py-20 text-gray-500 italic border-2 border-dashed border-white/5 rounded-3xl">
                No active alerts at this time.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
