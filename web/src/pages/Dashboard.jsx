// web/src/pages/Dashboard.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, AlertTriangle, Shield, CheckCircle, ChevronRight, AlertOctagon } from 'lucide-react';

// Dummy Data to match the "Peaks" in your screenshot
const data = [
  { name: 'Jun 01', attempts: 5 }, { name: 'Jun 02', attempts: 6 },
  { name: 'Jun 03', attempts: 7 }, { name: 'Jun 04', attempts: 0 },
  { name: 'Jun 05', attempts: 0 }, { name: 'Jun 06', attempts: 11 },
  { name: 'Jun 07', attempts: 2 }, { name: 'Jun 08', attempts: 5 },
  { name: 'Jun 09', attempts: 4 }, { name: 'Jun 10', attempts: 7 },
  { name: 'Jun 11', attempts: 0 }, { name: 'Jun 12', attempts: 0 },
  { name: 'Jun 13', attempts: 12 }, { name: 'Jun 14', attempts: 15 },
  { name: 'Jun 15', attempts: 7 },
];

const Dashboard = () => {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of system performance and threats (Last 24h)</p>
      </div>
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Emails Scanned" value="5,606" icon={<Mail className="text-blue-500" />} borderColor="border-blue-500" />
        <StatCard title="Threats Detected" value="86" icon={<AlertTriangle className="text-red-500" />} borderColor="border-red-500" />
        <StatCard title="Quarantined" value="5,606" icon={<Shield className="text-orange-500" />} borderColor="border-orange-500" />
        <StatCard title="Status" value="Online" icon={<CheckCircle className="text-green-500" />} borderColor="border-green-500" valueColor="text-green-600" />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Phishing Attempt History (Daily)</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip contentStyle={{backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none'}} itemStyle={{color: '#fff'}} />
              <Line type="monotone" dataKey="attempts" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quarantine List */}
        <Panel title="Recently Quarantined Emails">
          <div className="space-y-4">
            <ListItem 
              title="Pizza Hut" 
              subtitle="NEW $9.99 pizza deals are here! - Two great..." 
              badge="Phishing" badgeColor="bg-red-100 text-red-700"
            />
            <ListItem 
              title="Adobe Acrobat" 
              subtitle="Free PDF tools to save you time and effort..." 
              badge="Suspicious" badgeColor="bg-orange-100 text-orange-700"
            />
            <ListItem 
              title="Target Circle" 
              subtitle="Inside: your weekly Target Circle deals..." 
              badge="Spam" badgeColor="bg-yellow-100 text-yellow-700"
            />
          </div>
        </Panel>
        
        {/* Detection Logs */}
        <Panel title="Recent Detection Logs">
          <div className="space-y-4">
            <LogItem 
              time="10:35 AM" 
              action="THREAT DELETED" 
              target="support@paypal.com"
              type="danger"
            />
            <LogItem 
              time="10:32 AM" 
              action="EMAIL FLAGGED" 
              target="microsft-security@com"
              type="warning"
            />
            <LogItem 
              time="09:15 AM" 
              action="ADMIN LOGIN" 
              target="admin@phishguard.com"
              type="info"
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

// --- Reusable Sub-Components ---

const StatCard = ({ title, value, icon, borderColor, valueColor = "text-slate-900" }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${borderColor} relative overflow-hidden`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</p>
        <h3 className={`text-3xl font-extrabold mt-2 ${valueColor}`}>{value}</h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    </div>
  </div>
);

const Panel = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <button className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center transition-colors">
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
        {title.charAt(0)}
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

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-md border ${colors[type].split(' ')[2]} ${colors[type].split(' ')[1]}`}>
      <span className="font-mono text-xs text-slate-500 mt-0.5">{time}</span>
      <div>
        <span className={`text-xs font-bold block ${colors[type].split(' ')[0]}`}>{action}</span>
        <span className="text-xs text-slate-600 font-mono break-all">{target}</span>
      </div>
    </div>
  );
};

export default Dashboard;