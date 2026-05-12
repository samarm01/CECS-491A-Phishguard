import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Eye, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import EmailAnalysisModal from '../components/EmailAnalysisModal';
// --- Task 19.1 FIX: Import the SafeViewModal ---
import SafeViewModal from '../components/SafeViewModal';

const Quarantine = () => {
  const [emails, setEmails] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  
  // --- Task 19.1 FIX: State for Safe View Modal ---
  const [safeViewEmail, setSafeViewEmail] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

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
  
  // Crash-Safe Filtering Logic
  const filteredEmails = emails.filter(email => {
    const sender = email.sender || '';
    const subject = email.subject || '';
    const reasonText = Array.isArray(email.reason) ? email.reason.join(' ') : (email.reason || '');
    
    const search = searchTerm.toLowerCase();

    return (
      sender.toLowerCase().includes(search) ||
      subject.toLowerCase().includes(search) ||
      reasonText.toLowerCase().includes(search)
    );
  });

  // Reset to page 1 whenever the user types in the search box
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination Math
  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmails = filteredEmails.slice(startIndex, startIndex + itemsPerPage);

  // Animation Variants
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
            {currentEmails.map((email) => (
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
                    {Array.isArray(email.reason) ? email.reason.join(', ') : email.reason}
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
                  {/* --- Task 19.1 FIX: Added the Safe-View Trigger Button --- */}
                  <button 
                    onClick={() => setSafeViewEmail(email)}
                    className="text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors inline-flex items-center"
                  >
                    <ShieldAlert size={14} className="mr-1.5" /> Safe-View
                  </button>
                  <button className="text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors inline-flex items-center">
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentEmails.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  No quarantined emails found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Working Pagination Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing {filteredEmails.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredEmails.length)} of {filteredEmails.length} items
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || filteredEmails.length === 0}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || filteredEmails.length === 0}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Existing ML Analysis Modal */}
      <EmailAnalysisModal
        analysisData={selectedEmail} 
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
      />

      {/* --- Task 19.1 FIX: Render the Safe-View Modal --- */}
      <SafeViewModal
        emailData={safeViewEmail}
        isOpen={!!safeViewEmail}
        onClose={() => setSafeViewEmail(null)}
      />

    </motion.div>
  );
};

export default Quarantine;