import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Clock, Navigation, Bell, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * FeatureCard Component
 * Displays individual venue utility features with premium hover effects.
 */
const FeatureCard = ({ icon: Icon, title, description, to, color }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="card group cursor-pointer border border-white/5 bg-zinc-900/50 hover:border-primary/50"
  >
    <Link to={to}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 shadow-xl ${color}`}>
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="text-2xl font-black mb-3 transition-colors group-hover:text-primary tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">{description}</p>
      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
        Launch Module <ArrowRight size={14} />
      </div>
    </Link>
  </motion.div>
);

const AIInsightPanel = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="mt-16 p-10 glass border-t-4 border-primary rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-primary/5"
    >
      <div className="absolute top-4 right-8 px-4 py-1.5 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/30">
          Google Gemini Pro Engine
      </div>
      <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="shrink-0 w-28 h-28 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-700">
              <Shield className="text-white" size={48} />
          </div>
          <div className="space-y-4">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <span className="text-primary italic underline decoration-secondary decoration-2 underline-offset-4">AI</span> Predictive Recommendation
              </h3>
              <p className="text-xl text-gray-200 leading-relaxed font-semibold italic max-w-3xl">
                  "Real-time analytics indicate a <span className="text-success text-shadow">sub-15%</span> occupancy at the North Gate. Diverting West Stand foot traffic will optimize venue throughput by approximately 22%."
              </p>
              <div className="pt-4 flex items-center gap-8 border-t border-white/10">
                  <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Confidence Score</div>
                    <div className="text-lg text-secondary font-black">99.8%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Computation Time</div>
                    <div className="text-lg text-white font-black">42ms</div>
                  </div>
              </div>
          </div>
      </div>
    </motion.div>
);

const FEATURES = [
  { icon: Map, title: "Live Map", description: "High-fidelity crowd density heatmaps powered by real-time sensor streams.", to: "/map", color: "bg-blue-600 shadow-blue-600/30" },
  { icon: Clock, title: "Queue Pulse", description: "Sub-second wait time predictions for facilities using historical throughput data.", to: "/queues", color: "bg-secondary shadow-secondary/30" },
  { icon: Navigation, title: "Smart Nav", description: "AI-weighted pathfinding that prioritizes safety and speed over distance.", to: "/nav", color: "bg-primary shadow-primary/30" },
  { icon: Bell, title: "Safety Broadcast", description: "Omni-channel emergency alerts with instant evacuation coordinates.", to: "/alerts", color: "bg-orange-600 shadow-orange-600/30" },
];

const HomePage = () => {
  return (
    <div className="py-12 max-w-7xl mx-auto">
      <header className="mb-20 text-center lg:text-left">
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-white/5 rounded-full mb-8">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Next-Gen Stadium Infrastructure</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            Optimize the <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">Human Flow.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl leading-relaxed font-medium">
            SmartVenue AI orchestrates massive attendee movements using Google Cloud's distributed intelligence to eliminate bottlenecks and ensure seamless event security.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
        ))}
      </div>

      <AIInsightPanel />

      <motion.section 
        className="mt-24 p-12 glass rounded-[3rem] relative overflow-hidden border border-white/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 tracking-tight italic">Why Stadiums Choose <span className="text-primary">SmartVenue</span>?</h2>
            <div className="space-y-6">
              {[
                { label: "Throughput", val: "+85% exit efficiency during peak drills." },
                { label: "Intelligence", val: "Real-time Google Gemini population forecasting." },
                { label: "Response", val: "Zero-latency emergency broadcast propagation." },
                { label: "Experience", val: "Predictive amenity management for premium guests." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1 border-l-2 border-primary/20 pl-6 hover:border-primary transition-colors">
                  <span className="text-[10px] font-black uppercase text-secondary tracking-widest">{item.label}</span>
                  <span className="text-lg text-gray-200 font-bold italic">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
             <div className="relative">
                <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full" />
                <div className="w-80 h-80 rounded-[3rem] bg-zinc-900 border border-white/10 flex items-center justify-center relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <Shield className="text-primary/10 group-hover:text-primary/20 transition-colors" size={200} />
                </div>
             </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
