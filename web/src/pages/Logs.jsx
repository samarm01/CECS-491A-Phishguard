import React, { useEffect, useState } from 'react';
import { Filter, ArrowUpDown, ShieldAlert, CheckCircle, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  
  // --- Task 20.2 FIX: Add Sorting State ---
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

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

  // --- Task 20.2 FIX: Add Sorting Logic ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // --- Apply both Filtering AND Sorting ---
  const processedLogs = [...logs]
    .filter(log => filterType === 'ALL' || log.type === filterType)
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const getEventBadge = (type) => {
    switch (type) {
      case 'SYS_FLAGGED': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800"><ShieldAlert size={12} className="mr-1"/> Flagged</span>;
      case 'ADMIN_RELEASE': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1"/> Released</span>;
      case 'USER_LOGIN': return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"><LogIn size={12} className="mr-1"/> Login</span>;
      default: return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">{type}</span>;
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="p-8 bg-slate-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Detection Logs</h1>
        <p className="text-slate-500 mt-1">Audit trail of all system activities and user actions</p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
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
          Showing <strong>{processedLogs.length}</strong> events
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {/* --- Task 20.2 FIX: Clickable Sortable Headers --- */}
              <th onClick={() => handleSort('timestamp')} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center">Timestamp <ArrowUpDown size={14} className="ml-1" /></div>
              </th>
              <th onClick={() => handleSort('type')} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center">Event Type <ArrowUpDown size={14} className="ml-1" /></div>
              </th>
              <th onClick={() => handleSort('user')} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center">User <ArrowUpDown size={14} className="ml-1" /></div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {processedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{log.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getEventBadge(log.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-slate-900">{log.user}</div></td>
                <td className="px-6 py-4 text-sm text-slate-600">{log.details}</td>
              </tr>
            ))}
            {processedLogs.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No logs match your filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default Logs;