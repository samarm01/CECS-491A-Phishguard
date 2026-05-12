import React from 'react';
import { X, ShieldAlert, FileText } from 'lucide-react';

const SafeViewModal = ({ isOpen, onClose, emailData }) => {
  if (!isOpen || !emailData) return null;

  // --- FIX: Safely extract the raw body from the nested analysis object ---
  const rawPayload = emailData.analysis?.preview || "No payload data available.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Safe-View Mode</h2>
              <p className="text-xs text-slate-500">HTML rendering disabled for security.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Metadata */}
        <div className="p-5 border-b border-slate-100 bg-white grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-semibold text-slate-600">Sender:</span> {emailData.sender || "Unknown"}</div>
          {/* FIX: Removed 'Recipient' as the backend doesn't supply it, added Date instead */}
          <div><span className="font-semibold text-slate-600">Date:</span> {emailData.date || "Unknown"}</div>
          <div className="col-span-2"><span className="font-semibold text-slate-600">Subject:</span> {emailData.subject || "No Subject"}</div>
        </div>

        {/* Raw Content Viewer */}
        <div className="p-5 overflow-auto flex-1 bg-slate-50">
          <div className="flex items-center gap-2 mb-3 text-slate-600 font-medium text-sm">
            <FileText size={16} />
            Raw Payload (Text-Only)
          </div>
          <pre className="whitespace-pre-wrap break-words p-4 rounded-lg bg-slate-900 text-green-400 font-mono text-xs overflow-x-auto shadow-inner">
            <code>
              {/* React automatically escapes raw strings, preventing inner HTML injection here */}
              {rawPayload}
            </code>
          </pre>
        </div>

      </div>
    </div>
  );
};

export default SafeViewModal;