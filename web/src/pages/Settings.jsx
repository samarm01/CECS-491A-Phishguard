import React, { useEffect, useState } from 'react';
import { Server, Users, RefreshCw, Power, Edit2, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [users, setUsers] = useState([]);
  
  // --- FETCH REAL USERS ---
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        // Note: Using the /api/admin/users endpoint from admin.py
        const response = await fetch('http://127.0.0.1:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage system configurations and user access</p>
      </div>

      {/* Server Status (Visual Only for now) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
          <Server className="h-5 w-5 text-slate-500 mr-2" />
          <h2 className="text-lg font-bold text-slate-800">Email Server Integration</h2>
        </div>
        <div className="p-6">
           <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-green-600 font-bold">Connected (Neon DB)</span>
           </div>
        </div>
      </div>

      {/* User Management (REAL DATA) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-slate-500 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">User Management</h2>
          </div>
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
                    user.role === 'admin' 
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
      </div>
    </div>
  );
};

export default Settings;