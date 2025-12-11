import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 

// We make a wrapper component to conditionally hide the Sidebar
const Layout = ({ children }) => {
  const location = useLocation();
  // Don't show sidebar on the login page
  const showSidebar = location.pathname !== '/login';

  return (
    <div className="flex bg-gray-100 min-h-screen font-sans">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} /> {/* <--- New Route */}
          {/* Placeholders for your next tasks */}
          <Route path="/quarantine" element={<div className="p-8">Quarantine Page (TODO)</div>} />
          <Route path="/logs" element={<div className="p-8">Logs Page (TODO)</div>} />
          <Route path="/trends" element={<div className="p-8">Trends Page (TODO)</div>} />
          <Route path="/settings" element={<div className="p-8">Settings Page (TODO)</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;