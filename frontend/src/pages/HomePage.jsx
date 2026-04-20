import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Clock, Navigation, Bell, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, to, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="card group cursor-pointer"
  >
    <Link to={to}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-primary">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-2 text-primary font-semibold text-sm">
        Explore <ArrowRight size={16} />
      </div>
    </Link>
  </motion.div>
);

const HomePage = () => {
  return (
    <div className="py-10">
      <header className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block italic">
            Revolutionizing Event Experience
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Seamlessly Navigate the <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Crowded Venues.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            SmartVenue AI uses real-time computer vision and IoT data to optimize crowd flow, 
            reduce wait times, and keep attendees safe.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon={Map} 
          title="Live Map" 
          description="View real-time crowd density across the entire stadium to find quieter zones."
          to="/map"
          color="bg-blue-500 shadow-blue-500/20"
        />
        <FeatureCard 
          icon={Clock} 
          title="Queue Status" 
          description="Live wait time estimates for food stalls, washrooms, and entry gates."
          to="/queues"
          color="bg-secondary shadow-secondary/20"
        />
        <FeatureCard 
          icon={Navigation} 
          title="Smart Path" 
          description="Get dynamic route recommendations based on current venue occupancy."
          to="/navigation"
          color="bg-primary shadow-primary/20"
        />
        <FeatureCard 
          icon={Bell} 
          title="Safety Alerts" 
          description="Stay informed with real-time safety updates and emergency broadcasts."
          to="/alerts"
          color="bg-orange-500 shadow-orange-500/20"
        />
      </div>

      <motion.section 
        className="mt-20 p-8 glass rounded-3xl relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 italic">Why SmartVenue AI?</h2>
            <ul className="space-y-4">
              {[
                "85% reduction in exit congestion",
                "Real-time AI crowd heatmaps",
                "Integrated emergency response system",
                "Predictive analytics for stall owners"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block">
             <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-white/5 flex items-center justify-center">
                <Shield className="text-white/20" size={100} />
             </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
