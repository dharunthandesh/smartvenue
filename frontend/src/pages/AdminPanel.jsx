import React, { useState, useEffect } from 'react';
import { getCrowdData, updateCrowdLevel, triggerAlert, getAnalytics } from '../api';
import { Shield, Users, Bell, BarChart3, Edit3, Send, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const [zones, setZones] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertForm, setAlertForm] = useState({ level: 'info', message: '' });

  const fetchData = async () => {
    try {
      const [crowdRes, analyticsRes] = await Promise.all([getCrowdData(), getAnalytics()]);
      setZones(crowdRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateLevel = async (zoneId, density) => {
    try {
      await updateCrowdLevel(zoneId, density);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!alertForm.message) return;
    try {
      await triggerAlert({
        id: Date.now(),
        level: alertForm.level,
        message: alertForm.message,
        timestamp: Date.now() / 1000
      });
      setAlertForm({ level: 'info', message: '' });
      alert("Alert sent successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !analytics) return (
    <div className="flex items-center justify-center h-screen">
      <RefreshCw className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="py-6">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
             <Shield className="text-primary" /> Command Center
          </h1>
          <p className="text-gray-400 font-medium">Manage stadium operations and safety protocols.</p>
        </div>
      </header>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card border-l-4 border-primary">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users size={24} /></div>
             <div>
                <div className="text-2xl font-bold">{analytics?.total_population}</div>
                <div className="text-gray-500 text-sm font-bold uppercase">Live Population</div>
             </div>
          </div>
        </div>
        <div className="card border-l-4 border-accent">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-accent/10 rounded-xl text-accent"><BarChart3 size={24} /></div>
             <div>
                <div className="text-2xl font-bold">{analytics?.avg_wait_time} min</div>
                <div className="text-gray-500 text-sm font-bold uppercase">Avg. Wait Time</div>
             </div>
          </div>
        </div>
        <div className="card border-l-4 border-success">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-success/10 rounded-xl text-success"><Shield size={24} /></div>
             <div>
                <div className="text-2xl font-bold text-success uppercase">A-OK</div>
                <div className="text-gray-500 text-sm font-bold uppercase">Security Status</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Manage Zones */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Edit3 size={20} className="text-primary" /> Manual Override
          </h3>
          <div className="space-y-4">
            {zones.map(zone => (
              <div key={zone.zone_id} className="p-4 bg-background border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold">{zone.zone_name}</div>
                  <div className="text-xs text-gray-500">{zone.population} souls</div>
                </div>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map(d => (
                    <button
                      key={d}
                      onClick={() => handleUpdateLevel(zone.zone_id, d)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                        zone.density === d 
                          ? (d === 'high' ? 'bg-danger text-white' : d === 'medium' ? 'bg-warning text-black' : 'bg-success text-white')
                          : 'bg-surface text-gray-500 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast Alert */}
        <div className="card">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Bell size={20} className="text-secondary" /> Emergency Broadcast
          </h3>
          <form onSubmit={handleSendAlert} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Alert Level</label>
              <div className="flex gap-3">
                {['info', 'warning', 'emergency'].map(l => (
                   <button
                    key={l}
                    type="button"
                    onClick={() => setAlertForm({ ...alertForm, level: l })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold uppercase transition-all ${
                      alertForm.level === l 
                        ? (l === 'emergency' ? 'bg-danger border-danger text-white' : l === 'warning' ? 'bg-warning border-warning text-black' : 'bg-primary border-primary text-white')
                        : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'
                    }`}
                   >
                     {l}
                   </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Broadcast Message</label>
              <textarea 
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-xl p-4 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Type the message to be broadcasted to all attendees..."
                rows={4}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-secondary-light transition-all shadow-lg shadow-secondary/20"
            >
              <Send size={18} />
              Transmit Frequency
            </button>
          </form>
        </div>

        {/* Distribution Chart */}
        <div className="lg:col-span-2 card">
          <h3 className="text-xl font-bold mb-6 italic">Population Density Distribution</h3>
          <div className="h-64 mt-4">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zones}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                   <XAxis dataKey="zone_name" stroke="#606060" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#606060" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip 
                      cursor={{ fill: 'transparent' }} 
                      contentStyle={{ backgroundColor: '#16161a', border: '1px solid #333', borderRadius: '12px' }}
                   />
                   <Bar dataKey="population" radius={[8, 8, 0, 0]}>
                      {zones.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.density === 'high' ? '#ef4444' : entry.density === 'medium' ? '#f59e0b' : '#10b981'} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
