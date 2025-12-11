// web/src/pages/Quarantine.jsx
import React, { useState } from 'react';
import { Search, CheckCircle, Eye, Trash2, AlertTriangle } from 'lucide-react';
import EmailAnalysisModal from '../components/EmailAnalysisModal';

const Quarantine = () => {
  // --- DUMMY DATA ---
  const initialData = [
    { id: 1, sender: "support@paypal.com", subject: "Action Required: Account Danger", date: "2025-10-31", reason: "Impersonation", status: "quarantined" },
    { id: 2, sender: "microsft-security@com", subject: "Unusual Login Activity", date: "2025-10-31", reason: "Suspect Domain", status: "quarantined" },
    { id: 3, sender: "amazon-shipping@delivery.com", subject: "Package Problem", date: "2025-10-30", reason: "Malicious Attachment", status: "quarantined" },
  ];

  const [emails, setEmails] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to control the Modal (Popup)
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Search Logic
  const filteredEmails = emails.filter(email => 
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Quarantine Manager</h1>
        <p className="text-slate-500 mt-1">Review and manage suspicious emails blocked by PhishGuard</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by sender, subject, or reason..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                
                {/* Sender */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{email.sender}</div>
                </td>

                {/* Subject */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600 truncate max-w-xs">{email.subject}</div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {email.date}
                </td>

                {/* Reason Pill */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle size={12} className="mr-1" />
                    {email.reason}
                  </span>
                </td>

                {/* Actions Buttons */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  
                  {/* Release */}
                  <button className="text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors inline-flex items-center">
                    <CheckCircle size={14} className="mr-1.5" /> Release
                  </button>

                  {/* Review (Opens Modal) */}
                  <button 
                    onClick={() => setSelectedEmail(email)}
                    className="text-yellow-700 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md transition-colors inline-flex items-center"
                  >
                    <Eye size={14} className="mr-1.5" /> Review
                  </button>

                  {/* Delete */}
                  <button className="text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors inline-flex items-center">
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing {filteredEmails.length} items</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Render Modal if an email is selected */}
      {selectedEmail && (
        <EmailAnalysisModal 
          email={selectedEmail} 
          onClose={() => setSelectedEmail(null)} 
        />
      )}

    </div>
  );
};

export default Quarantine;