import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard'); 
    } catch (err) { /* Toast is handled in Context */ }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-[30px] shadow-sm">
        <h2 className="text-3xl font-bold text-[#1B2559] mb-2 text-center">Sign in</h2>
        <p className="text-[#A3AED0] text-center mb-8">Enter your details to access your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-sm font-bold text-[#1B2559] mb-2 block ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0] group-focus-within:text-[#5D5FEF]" size={18} />
              <input 
                type="email" placeholder="Johndoe@gmail.com" required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F4F7FE] outline-none border-2 border-transparent focus:border-[#5D5FEF] transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-bold text-[#1B2559] mb-2 block ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0] group-focus-within:text-[#5D5FEF]" size={18} />
              <input 
                type="password" placeholder="••••••" required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F4F7FE] outline-none border-2 border-transparent focus:border-[#5D5FEF] transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm px-1">
            <label className="flex items-center gap-2 text-[#A3AED0] cursor-pointer">
              <input type="checkbox" className="accent-[#5D5FEF] w-4 h-4" /> Remember me
            </label>
            <Link to="/forgot-password" size="xs" className="text-[#5D5FEF] font-bold">Forgot Password?</Link>
          </div>

          <button className="w-full py-4 bg-black hover:bg-[#1B2559] text-white rounded  font-bold shadow-xl shadow-indigo-100 active:scale-95 transition-all">
            Sign in
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-[#A3AED0]">
          Don't have an account? <Link to="/register" className="text-[#5D5FEF] font-bold ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;