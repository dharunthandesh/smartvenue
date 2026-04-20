import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Map as MapIcon, Users, Bell, Navigation as NavIcon, Shield } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
        active ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10' : 'text-gray-400'
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold tracking-tight">{label}</span>
      {active && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
    </motion.div>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-72 glass border-r border-white/5 z-50 p-6 hidden lg:flex flex-col">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/50">
          <LayoutDashboard className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-white">SmartVenue <span className="text-primary italic">AI</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarLink to="/" icon={LayoutDashboard} label="Overview" active={location.pathname === '/'} />
        <SidebarLink to="/map" icon={MapIcon} label="Live Map" active={location.pathname === '/map'} />
        <SidebarLink to="/queues" icon={Users} label="Queue Status" active={location.pathname === '/queues'} />
        <SidebarLink to="/nav" icon={NavIcon} label="Navigation" active={location.pathname === '/nav'} />
        <SidebarLink to="/alerts" icon={Bell} label="Alerts" active={location.pathname === '/alerts'} />
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-4">
        <div className="px-4">
          <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">Select Language</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-primary">
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español (GCP)</option>
            <option value="fr">🇫🇷 Français (GCP)</option>
            <option value="hi">🇮🇳 हिन्दी (GCP)</option>
          </select>
        </div>
        <SidebarLink to="/admin" icon={Shield} label="Admin Panel" active={location.pathname === '/admin'} />
      </div>
    </aside>
  );
};

export default Sidebar;
