import React, { useState } from 'react';
import { Settings as SettingsIcon, Server, Users, RefreshCw, Power, Edit2, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
  // --- DUMMY DATA ---
  const [serverStatus, setServerStatus] = useState('Connected');
  const [users, setUsers] = useState([
    { id: 1, email: 'admin@phishguard.com', role: 'Admin' },
    { id: 2, email: 'sec_analyst@phishguard.com', role: 'Admin' },
    { id: 3, email: 'regular_user@company.com', role: 'User' },
    { id: 4, email: 'underpaid_intern@company.com', role: 'User' },
  ]);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage system configurations and user access</p>
      </div>

      {/* SECTION 1: Email Server Integration */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
          <Server className="h-5 w-5 text-slate-500 mr-2" />
          <h2 className="text-lg font-bold text-slate-800">Email Server Integration</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Server Type */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Server Type</label>
              <div className="text-slate-900 font-medium text-lg">Microsoft 365 (Office)</div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Connection Status</label>
              <div className="flex items-center space-x-2">
                {serverStatus === 'Connected' ? (
                  <>
                    <CheckCircle size={20} className="text-green-500" />
                    <span className="text-green-600 font-bold">Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} className="text-red-500" />
                    <span className="text-red-600 font-bold">Disconnected</span>
                  </>
                )}
              </div>
            </div>

            {/* Last Sync */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Last Sync</label>
              <div className="flex items-center text-slate-900">
                <RefreshCw size={16} className="text-slate-400 mr-2" />
                11/01/2025 09:07:10 PM
              </div>
            </div>

            {/* Service Account */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Service Account</label>
              <div className="text-slate-900 font-mono text-sm bg-slate-100 px-2 py-1 rounded inline-block">
                phishguard_service@yourcompany.com
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100">
            <button className="flex items-center px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm">
              <Power size={16} className="mr-2" />
              Disconnect Server
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: User Management (RBAC) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-slate-500 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">User Management</h2>
          </div>
          <button className="text-sm text-cyan-700 hover:text-cyan-900 font-medium">
            + Add New User
          </button>
        </div>

        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.role === 'Admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-md transition-colors inline-flex items-center">
                    <Edit2 size={14} className="mr-1.5" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Page 1 of 5</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-slate-300 rounded-md text-sm text-gray-400 cursor-not-allowed" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-white hover:text-slate-700 text-slate-500">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;