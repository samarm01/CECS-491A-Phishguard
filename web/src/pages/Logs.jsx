import React, { useEffect, useState } from 'react';
import { Filter, Calendar, User, ArrowUpDown, ShieldAlert, CheckCircle, LogIn } from 'lucide-react';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('ALL');

  // --- FETCH REAL LOGS ---
  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:5000/api/data/logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (err) {
        console.error("Logs fetch error:", err);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    filterType === 'ALL' || log.type === filterType
  );

  const getEventBadge = (type) => {
    switch (type) {
      case 'SYS_FLAGGED': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800"><ShieldAlert size={12} className="mr-1"/> Flagged</span>;
      case 'ADMIN_RELEASE': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1"/> Released</span>;
      case 'USER_LOGIN': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"><LogIn size={12} className="mr-1"/> Login</span>;
      default: return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">{type}</span>;
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Detection Logs</h1>
        <p className="text-slate-500 mt-1">Audit trail of all system activities and user actions</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select 
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none bg-white hover:bg-gray-50 cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Events</option>
              <option value="SYS_FLAGGED">Threat Detected</option>
              <option value="ADMIN_RELEASE">Admin Actions</option>
              <option value="USER_LOGIN">User Logins</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          Showing <strong>{filteredLogs.length}</strong> events
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Event Type</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{log.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getEventBadge(log.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-slate-900">{log.user}</div></td>
                <td className="px-6 py-4 text-sm text-slate-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;