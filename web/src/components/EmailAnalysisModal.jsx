// web/src/components/EmailAnalysisModal.jsx
import React from 'react';
import { X, ShieldAlert, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';

const EmailAnalysisModal = ({ email, onClose }) => {
  if (!email) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="text-orange-600" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Email Analysis Report</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-slate-500 font-medium">Sender:</span>
              <span className="block text-slate-900 font-mono">{email.sender}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium">Date Received:</span>
              <span className="block text-slate-900">{email.date}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-slate-500 font-medium">Subject:</span>
              <span className="block text-slate-900 font-bold">{email.subject}</span>
            </div>
          </div>

          {/* Risk Score Banner */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="text-red-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-900 font-bold text-sm">High Risk Detected (95% Confidence)</h3>
              <p className="text-red-700 text-sm mt-1">
                Reason: <span className="font-semibold">{email.reason}</span>
              </p>
            </div>
          </div>

          {/* Analysis Details (The "Explainability" Part) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Analysis Details</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
              This email was flagged because the sender's domain (paypaI.com) uses a capital 'I' instead of a lowercase 'l' to impersonate the legitimate paypal.com domain.
            </p>
          </div>

          {/* Safe Preview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Safe Preview (Plain Text)</h3>
            <div className="bg-gray-100 p-4 rounded border border-gray-200 font-mono text-xs text-gray-700 whitespace-pre-wrap h-32 overflow-y-auto">
{`Dear Valued Customer,

We noticed unusual activity on your account. Please click here to verify your information:
http://evil.link.totallystealyourdata.ru

Please act fast or your account will be deleted within 14 days.

[paypal_logo.png]
Paypal Inc.`}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">
            Close
          </button>
          <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium flex items-center transition-colors shadow-sm">
            <CheckCircle size={16} className="mr-2" /> Release
          </button>
          <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium flex items-center transition-colors shadow-sm">
            <Trash2 size={16} className="mr-2" /> Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailAnalysisModal;