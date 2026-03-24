import React, { useState, useRef } from 'react';
import { AlertTriangle, ShieldCheck, Loader2, Download } from 'lucide-react'; 
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion'; // <-- NEW IMPORT

export default function EmailAnalysisModal({ analysisData, isOpen, onClose }) {
  const [isRetraining, setIsRetraining] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const modalRef = useRef(null);

  // --- Week 6: The Retraining Trigger Logic ---
  const handleReportFalsePositive = async () => {
    setIsRetraining(true);
    try {
        await fetch(`/api/data/emails/${analysisData.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'false_positive' })
        });

        const response = await fetch('/api/admin/retrain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            alert("Feedback submitted! The machine learning model has been retrained.");
            onClose(); 
        } else {
            alert("Feedback recorded, but the model failed to retrain.");
        }
    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("Failed to submit feedback. Check server connection.");
    } finally {
        setIsRetraining(false);
    }
  };

  // --- Week 7: Report Generator (PDF Export) ---
  const handleExportPDF = async () => {
    if (!modalRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(modalRef.current, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Threat_Report_${analysisData.id || 'PhishGuard'}.pdf`);
      
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("There was an error generating the PDF report.");
    } finally {
      setIsExporting(false);
    }
  };

  // AnimatePresence requires us to conditionally render the entire component inside it
  return (
    <AnimatePresence>
      {isOpen && analysisData && (
        <motion.div 
          // 1. Animate the dark background fade
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
        >
          <motion.div 
            // 2. Animate the modal scaling up and dropping in
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            ref={modalRef} 
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
          >
            
            {/* Header Section */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Threat Analysis Report</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${analysisData.is_phishing ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                Score: {(analysisData.risk_score * 100).toFixed(1)}%
              </div>
            </div>

            {/* Email Metadata */}
            <div className="mb-4 text-sm text-gray-600 bg-slate-50 p-3 rounded-md border border-slate-100">
              <p><span className="font-semibold text-gray-700">From:</span> {analysisData.sender || "Unknown Sender"}</p>
              <p><span className="font-semibold text-gray-700">Subject:</span> {analysisData.subject || "No Subject"}</p>
              <p><span className="font-semibold text-gray-700">Date:</span> {analysisData.date || new Date().toLocaleDateString()}</p>
            </div>

            {/* Explainability Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Detection Reasoning
              </h3>
              <ul className="space-y-3">
                {analysisData.reasons && analysisData.reasons.length > 0 ? (
                  analysisData.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                    <ShieldCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No specific threat indicators triggered.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Raw Details Fallback */}
            {analysisData.analysis?.details && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Raw Analysis Log</h3>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600 font-mono overflow-x-auto">
                  {analysisData.analysis.details}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div data-html2canvas-ignore="true" className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <button 
                onClick={onClose} 
                disabled={isRetraining || isExporting}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition disabled:opacity-50"
              >
                Close
              </button>
              
              <button 
                onClick={handleExportPDF}
                disabled={isRetraining || isExporting}
                className="flex items-center px-3 py-2 text-sm bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Export PDF
              </button>

              <button 
                onClick={handleReportFalsePositive}
                disabled={isRetraining || isExporting}
                className="flex items-center px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow-sm disabled:bg-indigo-400"
              >
                {isRetraining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Retraining...
                  </>
                ) : (
                  "Report False Positive"
                )}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}