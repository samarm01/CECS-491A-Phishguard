import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="flex bg-gray-100 min-h-screen">
        {/* Persistent Sidebar  */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quarantine" element={<div className="p-8">Quarantine Page (TODO)</div>} />
            <Route path="/logs" element={<div className="p-8">Logs Page (TODO)</div>} />
            <Route path="/trends" element={<div className="p-8">Trends Page (TODO)</div>} />
            <Route path="/settings" element={<div className="p-8">Settings Page (TODO)</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;