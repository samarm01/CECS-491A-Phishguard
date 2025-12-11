// web/src/pages/Logs.jsx
import React, { useState } from 'react';
import { FileText, Filter, Calendar, User, ArrowUpDown, ShieldAlert, CheckCircle, LogIn } from 'lucide-react';

const Logs = () => {
  // --- DUMMY DATA: Matches "Detection Logs" from User Manual Page 6 ---
  const initialLogs = [
    { id: 1, timestamp: "2025-10-31 10:14 AM", type: "SYS_FLAGGED", user: "System", details: 'Flagged email from "support@paypal.com" for Impersonation' },
    { id: 2, timestamp: "2025-10-31 09:49 AM", type: "ADMIN_RELEASE", user: "admin@phishguard.com", details: 'Released email (ID: 45B-109) as False Positive' },
    { id: 3, timestamp: "2025-10-31 09:48 AM", type: "SYS_FLAGGED", user: "System", details: 'Flagged email (ID: 45B-109) for Suspect Domain' },
    { id: 4, timestamp: "2025-10-30 05:12 PM", type: "USER_LOGIN", user: "admin@phishguard.com", details: 'User successfully logged in' },
    { id: 5, timestamp: "2025-10-30 02:22 PM", type: "SYS_QUARANTINE", user: "System", details: 'Auto-quarantined malicious attachment from delivery.com' },
  ];

  const [logs, setLogs] = useState(initialLogs);
  const [filterType, setFilterType] = useState('ALL');

  // Simple Filter Logic
  const filteredLogs = logs.filter(log => 
    filterType === 'ALL' || log.type === filterType
  );

  // Helper to color-code event types
  const getEventBadge = (type) => {
    switch (type) {
      case 'SYS_FLAGGED': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800"><ShieldAlert size={12} className="mr-1"/> Flagged</span>;
      case 'ADMIN_RELEASE': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1"/> Released</span>;
      case 'USER_LOGIN': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"><LogIn size={12} className="mr-1"/> Login</span>;
      default: return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">System</span>;
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Detection Logs</h1>
        <p className="text-slate-500 mt-1">Audit trail of all system activities and user actions</p>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
        
        <div className="flex space-x-4">
          {/* Event Type Filter */}
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

          {/* Date Range (Visual Only for Demo) */}
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>Last 30 Days</span>
          </button>

          {/* User Filter (Visual Only for Demo) */}
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span>All Users</span>
          </button>
        </div>

        <div className="text-sm text-slate-500">
          Showing <strong>{filteredLogs.length}</strong> events
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 group">
                <div className="flex items-center">
                  Timestamp
                  <ArrowUpDown className="ml-1 h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Event Type</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                {/* Timestamp */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                  {log.timestamp}
                </td>

                {/* Event Type */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEventBadge(log.type)}
                </td>

                {/* User */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{log.user}</div>
                </td>

                {/* Details */}
                <td className="px-6 py-4 text-sm text-slate-600">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Page 1 of 1</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-slate-300 rounded-md text-sm text-gray-400 cursor-not-allowed" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded-md text-sm text-gray-400 cursor-not-allowed" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;