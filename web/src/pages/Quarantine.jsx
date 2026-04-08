import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import EmailAnalysisModal from '../components/EmailAnalysisModal';

const Quarantine = () => {
  const [emails, setEmails] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:5000/api/data/emails', {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEmails(data); 
        }
      } catch (err) {
        console.error("Failed to fetch emails:", err);
      }
    };

    fetchEmails();
  }, []);
  
  const filteredEmails = emails.filter(email => 
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-slate-900">Quarantine Manager</h1>
        <p className="text-slate-500 mt-1">Review and manage suspicious emails blocked by PhishGuard</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by sender, subject, or reason..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sender</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredEmails.map((email) => (
              <tr key={email.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{email.sender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600 truncate max-w-xs">{email.subject}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {email.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle size={12} className="mr-1" />
                    {Array.isArray(email.reason) ? email.reason : email.reason}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors inline-flex items-center">
                    <CheckCircle size={14} className="mr-1.5" /> Release
                  </button>
                  <button 
                    onClick={() => setSelectedEmail(email)}
                    className="text-yellow-700 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md transition-colors inline-flex items-center"
                  >
                    <Eye size={14} className="mr-1.5" /> Review
                  </button>
                  <button className="text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors inline-flex items-center">
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing {filteredEmails.length} items</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </motion.div>

      {/* Passed the correctly updated props to the Modal! */}
      <EmailAnalysisModal
        analysisData={selectedEmail} 
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
      />

    </motion.div>
  );
};

export default Quarantine;