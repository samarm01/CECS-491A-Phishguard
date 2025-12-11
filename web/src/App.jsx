import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Quarantine from './pages/Quarantine';
import Login from './pages/Login'; 
import Logs from './pages/Logs'; 
import TrendAnalysis from './pages/TrendAnalysis'; 
import Settings from './pages/Settings'; 


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
          <Route path="/login" element={<Login />} />
          {/* Placeholders for your next tasks */}
          <Route path="/quarantine" element={<Quarantine />} />          
          <Route path="/logs" element={<Logs />} />
          <Route path="/trends" element={<TrendAnalysis />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;