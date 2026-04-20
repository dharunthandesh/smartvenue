import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Map as MapIcon, Clock, Navigation, Bell, Shield, Menu, X } from 'lucide-react';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import QueuePage from './pages/QueuePage';
import NavPage from './pages/NavPage';
import AlertsPage from './pages/AlertsPage';
import AdminPanel from './pages/AdminPanel';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass border-r border-white/5 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
              <Shield className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SmartVenue <span className="text-primary">AI</span></h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink to="/" icon={Home} label="Home" active={location.pathname === '/'} />
            <SidebarLink to="/map" icon={MapIcon} label="Live Map" active={location.pathname === '/map'} />
            <SidebarLink to="/queues" icon={Clock} label="Queue Status" active={location.pathname === '/queues'} />
            <SidebarLink to="/navigation" icon={Navigation} label="Navigation" active={location.pathname === '/navigation'} />
            <SidebarLink to="/alerts" icon={Bell} label="Alerts" active={location.pathname === '/alerts'} />
          </nav>

          <div className="pt-6 border-t border-white/5">
            <SidebarLink to="/admin" icon={Shield} label="Admin Panel" active={location.pathname === '/admin'} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/queues" element={<QueuePage />} />
          <Route path="/navigation" element={<NavPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
