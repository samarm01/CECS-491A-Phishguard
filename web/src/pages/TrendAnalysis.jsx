// web/src/pages/TrendAnalysis.jsx
import React, { useEffect, useState } from 'react';
import { TrendingUp, Filter, Calendar, Users, PieChart as PieChartIcon, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion'; // <-- NEW IMPORT

const TrendAnalysis = () => {
  const [chartData, setChartData] = useState({
    lineData: [],
    pieData: [],
    barData: []
  });

  useEffect(() => {
    const fetchTrends = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:5000/api/data/trends', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        }
      } catch (err) {
        console.error("Trends fetch error:", err);
      }
    };
    fetchTrends();
  }, []);

  const { lineData, pieData, barData } = chartData;

  const customTooltipStyle = {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontSize: '12px'
  };

  // --- Week 7: Export Stats (CSV) ---
  const handleExportCSV = () => {
    if (!lineData || lineData.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = ['Date', 'Phishing Attempts'];
    const csvRows = lineData.map(row => `${row.name},${row.attempts}`);
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'phishguard_trend_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Week 7: Animation Variants ---
  // The container controls the staggering of the children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 // Time between each child animating in
      }
    }
  };

  // The item defines what the animation actually looks like (fade up)
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  return (
    // Replace the outer div with motion.div and attach the container variants
    <motion.div 
      className="p-8 bg-slate-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Trend Analysis</h1>
        <p className="text-slate-500 mt-1">Visual insights into phishing campaigns and targeted areas</p>
      </motion.div>

      {/* Controls & Export */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
          <Calendar className="mr-2 h-4 w-4 text-slate-500" /> Date Range: All Time
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
          <PieChartIcon className="mr-2 h-4 w-4 text-slate-500" /> Threat Type: All
        </button>
        
        <button 
          onClick={handleExportCSV}
          // We can also add motion to buttons directly for a hover "squish" effect!
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 shadow-sm ml-auto transition-colors"
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </button>
      </motion.div>

      {/* Main Line Chart */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Phishing Attempts Over Time</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip contentStyle={customTooltipStyle} itemStyle={{color: '#fff'}} cursor={{stroke: '#cbd5e1', strokeWidth: 1}} />
              <Line type="monotone" dataKey="attempts" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom Grid for Pie and Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pie Chart */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Threats by Status</h2>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} itemStyle={{color: '#fff'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Top Targeted Departments</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={customTooltipStyle} itemStyle={{color: '#fff'}} />
                <Bar dataKey="attempts" name="Total Attempts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default TrendAnalysis;