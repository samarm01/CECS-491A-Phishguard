import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    authCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual authentication logic here (Jeffrey's task)
    console.log("Logging in with:", formData);
    
    // For demo purposes, redirect to Dashboard
    navigate('/');
  };

  return (
    // Background: Gradient approximation of the "Circuit" image
    //<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-900 via-teal-800 to-green-900 p-4 font-sans">
      <div className="min-h-screen flex items-center justify-center p-4 font-sans login-bg">
        
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative">
        
        {/* Header Section */}
        <div className="text-center pt-10 pb-6">
          <div className="flex items-center justify-center space-x-2 mb-1">
            {/* Logo Icon */}
            <ShieldCheck className="text-[#164e63]" size={32} /> 
            <h1 className="text-4xl font-extrabold text-[#164e63] tracking-tight">
              PhishGuard
            </h1>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-medium">
            Scam Protection With Results
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="px-12 pb-12">
          
          {/* Grid Layout to match the "Label | Input" alignment in your screenshot */}
          <div className="grid grid-cols-[1fr_2fr] gap-y-6 gap-x-4 items-center mb-8">
            
            {/* Row 1: Email */}
            <label className="text-right text-gray-600 text-sm font-medium">
              username/email
            </label>
            <input 
              type="text" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-200 border-none rounded-sm h-8 px-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />

            {/* Row 2: Password */}
            <label className="text-right text-gray-600 text-sm font-medium">
              password
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-200 border-none rounded-sm h-8 px-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />

            {/* Row 3: Auth Code */}
            <label className="text-right text-gray-600 text-sm font-medium">
              authentication code
            </label>
            <input 
              type="text" 
              name="authCode"
              value={formData.authCode}
              onChange={handleChange}
              className="w-full bg-gray-200 border-none rounded-sm h-8 px-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button 
              type="submit"
              className="bg-[#8ecbae] text-black font-bold text-lg py-2 px-12 rounded-lg shadow-md hover:bg-[#7bc0a0] hover:shadow-lg transform active:scale-95 transition-all duration-200 border border-teal-200/50"
            >
              Login
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;