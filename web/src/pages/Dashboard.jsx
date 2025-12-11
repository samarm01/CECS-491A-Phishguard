import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Dashboard</h1>
      
      {/* Top Stats Row - Matches User Manual [cite: 308] */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total emails scanned (24h)" value="5,606" />
        <StatCard title="Total threats detected (24h)" value="86" />
        <StatCard title="Items in Quarantine" value="5,606" />
        <StatCard title="System Status" value="Online" color="text-green-600" />
      </div>

      {/* Phishing Attempt History Graph Placeholder [cite: 309] */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Phishing Attempt History (Daily)</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded">
          <span className="text-gray-500">Line Chart Component Goes Here</span>
        </div>
      </div>

      {/* Bottom Panels Row [cite: 310] */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title="Recently Quarantined Emails">
          <ul className="space-y-3">
            <ListItem label="Pizza Hut" desc="NEW $9.99 pizza deals..." />
            <ListItem label="Adobe Acrobat" desc="Free PDF tools to save..." />
          </ul>
        </Panel>
        
        <Panel title="Recent Detection Logs">
          <ul className="space-y-3 font-mono text-sm">
            <li className="text-red-600">[10:35 AM] THREAT DELETED: support@paypal.com</li>
            <li className="text-orange-600">[10:32 AM] EMAIL FLAGGED: microsft-security@com</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, color = "text-slate-900" }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const Panel = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <a href="#" className="text-blue-600 text-sm hover:underline">View all...</a>
    </div>
    {children}
  </div>
);

const ListItem = ({ label, desc }) => (
  <li className="border-b border-gray-100 pb-2 last:border-0">
    <span className="font-bold block text-slate-700">{label}</span>
    <span className="text-sm text-gray-500 truncate block">{desc}</span>
  </li>
);

export default Dashboard;