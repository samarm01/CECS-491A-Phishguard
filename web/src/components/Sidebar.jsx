// web/src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, FileText, TrendingUp, Settings, Activity } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation(); // Hook to check active page

  return (
    <div className="h-screen w-64 bg-[#164e63] text-white flex flex-col fixed left-0 top-0 shadow-xl z-50">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1f6078] flex items-center space-x-2">
        <ShieldAlert className="text-cyan-400" size={28} />
        <span className="text-2xl font-bold tracking-wide">PhishGuard</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === "/"} />
        <NavItem to="/quarantine" icon={<ShieldAlert size={20} />} label="Quarantine" active={location.pathname === "/quarantine"} />
        <NavItem to="/logs" icon={<FileText size={20} />} label="Detection Logs" active={location.pathname === "/logs"} />
        <NavItem to="/trends" icon={<TrendingUp size={20} />} label="Trend Analysis" active={location.pathname === "/trends"} />
        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" active={location.pathname === "/settings"} />
      </nav>
      
      {/* System Status Footer */}
      <div className="p-6 border-t border-[#1f6078] bg-[#0e3a4d]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-cyan-200 uppercase tracking-wider">System Status</span>
          <Activity size={16} className="text-green-400" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-lg font-bold text-white">Online</span>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 
      ${active 
        ? 'bg-cyan-600 text-white shadow-md font-medium' 
        : 'text-cyan-100 hover:bg-[#1f6078] hover:text-white'
      }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Sidebar;