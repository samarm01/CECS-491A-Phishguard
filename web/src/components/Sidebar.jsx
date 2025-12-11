import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, FileText, TrendingUp, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-slate-800 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        PhishGuard
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {/* Navigation items based on User Manual [cite: 261-274] */}
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem to="/quarantine" icon={<ShieldAlert size={20} />} label="Quarantine" />
        <NavItem to="/logs" icon={<FileText size={20} />} label="Detection Logs" />
        <NavItem to="/trends" icon={<TrendingUp size={20} />} label="Trend Analysis" />
        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
      
      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        System Status: <span className="text-green-400 font-bold">Online</span>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center space-x-3 p-3 hover:bg-slate-700 rounded-lg transition-colors">
    {icon}
    <span>{label}</span>
  </Link>
);

export default Sidebar;