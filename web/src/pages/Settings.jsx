import React, { useEffect, useState } from 'react';
import { Server, Users, RefreshCw, Edit2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
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

  // --- FIXED: Handle Role Toggle (Use Case #4: RBAC) ---
  const handleRoleToggle = async (userId, currentRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role?`)) return;

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        // Instantly update the UI without reloading the page
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        alert("Failed to update role. Are you sure you have admin privileges?");
      }
    } catch (err) {
      console.error("Role update error:", err);
      alert("Error connecting to server.");
    }
  };

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
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage system configurations and user access</p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
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
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                  <button 
                    onClick={() => handleRoleToggle(user.id, user.role)}
                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors inline-flex items-center"
                  >
                    <RefreshCw size={14} className="mr-1.5" /> Toggle Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default Settings;