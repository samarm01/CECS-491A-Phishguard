import React, { useEffect, useState } from 'react';
import { TrendingUp, Filter, Calendar, Users, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendAnalysis = () => {
  // 1. Setup State for the 3 Charts
  const [chartData, setChartData] = useState({
    lineData: [],
    pieData: [],
    barData: []
  });

  // 2. Fetch Data from Backend
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

  // Deconstruct for easier usage below
  const { lineData, pieData, barData } = chartData;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Trend Analysis</h1>
        <p className="text-slate-500 mt-1">Visual insights into phishing campaigns and targeted areas</p>
      </div>

      {/* Filter Bar (Visual Only) */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
          <Calendar className="mr-2 h-4 w-4 text-slate-500" /> Date Range: All Time
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
          <PieChartIcon className="mr-2 h-4 w-4 text-slate-500" /> Threat Type: All
        </button>
      </div>

      {/* 1. Main Line Chart (Connected) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Phishing Attempts Over Time</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none'}} 
                itemStyle={{color: '#fff'}}
                cursor={{stroke: '#cbd5e1', strokeWidth: 1}}
              />
              <Line type="monotone" dataKey="attempts" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Split Row: Pie Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Pie Chart (Connected) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Threats by Status</h2>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Bar Chart (Mock Data from API) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Top Targeted Departments</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px'}} />
                <Bar dataKey="Plant1" name="Plant 1" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Plant2" name="Plant 2" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Plant3" name="Plant 3" fill="#84cc16" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrendAnalysis;