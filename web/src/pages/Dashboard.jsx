import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, AlertTriangle, Shield, CheckCircle, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // Initial State matches the structure sent by data.py
  const [stats, setStats] = useState({
    scanned: 0,
    threats: 0,
    quarantined: 0,
    status: "Offline",
    chart: [],
    recent_quarantine: [], // List for the left panel
    recent_logs: []        // List for the right panel
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:5000/api/data/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of system performance and threats</p>
      </div>
      
      {/* Clickable Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Emails Scanned" 
          value={stats.scanned} 
          icon={<Mail className="text-blue-500" />} 
          borderColor="border-blue-500" 
          onClick={() => navigate('/logs')}
        />
        <StatCard 
          title="Threats Detected" 
          value={stats.threats} 
          icon={<AlertTriangle className="text-red-500" />} 
          borderColor="border-red-500" 
          onClick={() => navigate('/logs')}
        />
        <StatCard 
          title="Quarantined" 
          value={stats.quarantined} 
          icon={<Shield className="text-orange-500" />} 
          borderColor="border-orange-500" 
          onClick={() => navigate('/quarantine')}
        />
        <StatCard 
          title="Status" 
          value={stats.status} 
          icon={<CheckCircle className={stats.status === "Online" ? "text-green-500" : "text-gray-400"} />} 
          borderColor={stats.status === "Online" ? "border-green-500" : "border-gray-400"}
          valueColor={stats.status === "Online" ? "text-green-600" : "text-gray-600"}
          onClick={() => navigate('/settings')}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Phishing Attempt History</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip contentStyle={{backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none'}} itemStyle={{color: '#fff'}} />
              <Line type="monotone" dataKey="attempts" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RESTORED BOTTOM PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel 1: Recently Quarantined */}
        <Panel title="Recently Quarantined Emails" onMore={() => navigate('/quarantine')}>
          <div className="space-y-4">
            {stats.recent_quarantine.length > 0 ? (
              stats.recent_quarantine.map((item, index) => (
                <ListItem 
                  key={index}
                  title={item.title} 
                  subtitle={item.subtitle} 
                  badge={item.badge}
                  badgeColor="bg-red-100 text-red-700"
                />
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">No recent threats found.</div>
            )}
          </div>
        </Panel>
        
        {/* Panel 2: Recent Detection Logs */}
        <Panel title="Recent Detection Logs" onMore={() => navigate('/logs')}>
          <div className="space-y-4">
            {stats.recent_logs.length > 0 ? (
              stats.recent_logs.map((log, index) => (
                <LogItem 
                  key={index}
                  time={log.time} 
                  action={log.action} 
                  target={log.target}
                  type={log.type}
                />
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">No recent activity.</div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const StatCard = ({ title, value, icon, borderColor, valueColor = "text-slate-900", onClick }) => (
  <div 
    onClick={onClick} 
    className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${borderColor} relative overflow-hidden cursor-pointer hover:shadow-lg hover:translate-y-[-2px] transition-all duration-200`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</p>
        <h3 className={`text-3xl font-extrabold mt-2 ${valueColor}`}>{value}</h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    </div>
  </div>
);

const Panel = ({ title, children, onMore }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <button 
        onClick={onMore}
        className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center transition-colors"
      >
        View all <ChevronRight size={16} />
      </button>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const ListItem = ({ title, subtitle, badge, badgeColor }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
    <div className="flex items-center space-x-3 overflow-hidden">
      <div className="h-10 w-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 font-bold">
        {title.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      </div>
    </div>
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
      {badge}
    </span>
  </div>
);

const LogItem = ({ time, action, target, type }) => {
  const colors = {
    danger: "text-red-600 bg-red-50 border-red-100",
    warning: "text-orange-600 bg-orange-50 border-orange-100",
    info: "text-blue-600 bg-blue-50 border-blue-100"
  };

  const activeColor = colors[type] || colors.info;

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-md border ${activeColor.split(' ')[2]} ${activeColor.split(' ')[1]}`}>
      <span className="font-mono text-xs text-slate-500 mt-0.5">{time}</span>
      <div>
        <span className={`text-xs font-bold block ${activeColor.split(' ')[0]}`}>{action}</span>
        <span className="text-xs text-slate-600 font-mono break-all">{target}</span>
      </div>
    </div>
  );
};

export default Dashboard;