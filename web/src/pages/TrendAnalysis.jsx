import React, { useState } from 'react';
import { TrendingUp, Filter, Calendar, Users, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendAnalysis = () => {
  // --- DUMMY DATA ---
  
  // 1. Line Chart Data (Phishing Attempts Over Time)
  const lineData = [
    { name: 'Jun 01', attempts: 5 }, { name: 'Jun 02', attempts: 6 },
    { name: 'Jun 03', attempts: 7 }, { name: 'Jun 04', attempts: 0 },
    { name: 'Jun 05', attempts: 0 }, { name: 'Jun 06', attempts: 11 },
    { name: 'Jun 07', attempts: 2 }, { name: 'Jun 08', attempts: 5 },
    { name: 'Jun 09', attempts: 4 }, { name: 'Jun 10', attempts: 7 },
    { name: 'Jun 11', attempts: 0 }, { name: 'Jun 12', attempts: 0 },
    { name: 'Jun 13', attempts: 12 }, { name: 'Jun 14', attempts: 15 },
    { name: 'Jun 15', attempts: 7 },
  ];

  // 2. Pie Chart Data (Threats by Type) - Matches Prototype Colors
  const pieData = [
    { name: 'Malicious Link', value: 41, color: '#facc15' }, // Yellow (Batman)
    { name: 'Impersonation', value: 19, color: '#3b82f6' }, // Blue (Captain America)
    { name: 'Attachment', value: 27, color: '#f97316' },    // Orange (Iron Man)
    { name: 'Credential Harvest', value: 13, color: '#9ca3af' }, // Gray (Superman)
  ];

  // 3. Bar Chart Data (Top Targeted Departments)
  const barData = [
    { name: 'Sales', Plant1: 15, Plant2: 78, Plant3: 45 },
    { name: 'HR', Plant1: 22, Plant2: 56, Plant3: 32 },
    { name: 'IT', Plant1: 56, Plant2: 32, Plant3: 55 },
    { name: 'Finance', Plant1: 32, Plant2: 32, Plant3: 22 },
    { name: 'Legal', Plant1: 78, Plant2: 22, Plant3: 65 },
    { name: 'Exec', Plant1: 32, Plant2: 15, Plant3: 11 },
    { name: 'Ops', Plant1: 14, Plant2: 14, Plant3: 78 },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Trend Analysis</h1>
        <p className="text-slate-500 mt-1">Visual insights into phishing campaigns and targeted areas</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
          <Calendar className="mr-2 h-4 w-4 text-slate-500" /> Date Range: Last 15 Days
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
          <PieChartIcon className="mr-2 h-4 w-4 text-slate-500" /> Threat Type: All
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
          <Users className="mr-2 h-4 w-4 text-slate-500" /> Department: All
        </button>
      </div>

      {/* Main Line Chart */}
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
        
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Threats by Type</h2>
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

        {/* Bar Chart */}
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