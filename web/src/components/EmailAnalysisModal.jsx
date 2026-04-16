import React, { useState, useRef } from 'react';
import { AlertTriangle, ShieldCheck, Loader2, Download } from 'lucide-react'; 
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

// --- Task 16.2: Score Visualizer UI (Embedded Component) ---
const RiskGauge = ({ score }) => {
  let level = 'Low';
  let strokeColor = '#22c55e'; // green-500
  let textColor = 'text-green-600';
  let bgColor = 'bg-green-50';

  if (score >= 70) {
    level = 'High';
    strokeColor = '#ef4444'; // red-500
    textColor = 'text-red-600';
    bgColor = 'bg-red-50';
  } else if (score >= 40) {
    level = 'Medium';
    strokeColor = '#eab308'; // yellow-500
    textColor = 'text-yellow-600';
    bgColor = 'bg-yellow-50';
  }

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${bgColor} border-opacity-50 min-w-[140px]`}>
      <h3 className="text-xs font-semibold text-slate-700 mb-1">Threat Score</h3>
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Background Track */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-200"
          />
          {/* Active Progress */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={strokeColor}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-xl font-bold ${textColor}`}>{score}</span>
        </div>
      </div>
      <span className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white shadow-sm ${textColor}`}>
        {level} Risk
      </span>
    </div>
  );
};

// --- Main Modal Component ---
export default function EmailAnalysisModal({ analysisData, isOpen, onClose }) {
  const [isRetraining, setIsRetraining] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const modalRef = useRef(null);

  // --- FIX: Safely extract backend data variables ---
  const confidenceScore = Math.round(analysisData?.analysis?.confidence || 0);
  const isPhishing = confidenceScore >= 50;
  
  // The backend sends 'reason' (singular), which could be an array or a string.
  // We format it into a guaranteed array for mapping.
  const reasonsList = analysisData?.reason 
    ? (Array.isArray(analysisData.reason) ? analysisData.reason : [analysisData.reason]) 
    : [];

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

  return (
    <AnimatePresence>
      {isOpen && analysisData && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            ref={modalRef} 
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
          >
            
            {/* Header Section */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Threat Analysis Report</h2>
              {/* FIX: Use calculated isPhishing variable */}
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${isPhishing ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {isPhishing ? 'Phishing Detected' : 'Clean'}
              </div>
            </div>

            {/* Top Section: Metadata & Visualizer */}
            <div className="flex gap-4 mb-6">
              {/* Email Metadata */}
              <div className="flex-1 text-sm text-gray-600 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                <p className="mb-2"><span className="font-semibold text-gray-700">From:</span> {analysisData.sender || "Unknown Sender"}</p>
                <p className="mb-2"><span className="font-semibold text-gray-700">Subject:</span> {analysisData.subject || "No Subject"}</p>
                <p><span className="font-semibold text-gray-700">Date:</span> {analysisData.date || new Date().toLocaleDateString()}</p>
              </div>

              {/* Score Visualizer UI */}
              {/* FIX: Use the directly parsed confidence score */}
              <RiskGauge score={confidenceScore} />
            </div>

            {/* Explainability Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Detection Reasoning
              </h3>
              <ul className="space-y-3">
                {/* FIX: Map over reasonsList properly */}
                {reasonsList.length > 0 ? (
                  reasonsList.map((reason, index) => (
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
                <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600 font-mono overflow-x-auto max-h-32">
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