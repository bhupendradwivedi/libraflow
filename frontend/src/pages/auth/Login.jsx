import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Library, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login  } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) { /* Error handled in Context */ }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center font-sans">
      
      {/* Full Screen Mobile View / Sharp Rectangle Desktop */}
      <div className="w-full h-screen md:h-auto md:max-w-[450px] bg-white px-8 md:px-12 flex flex-col justify-center">
        
        {/* Header - Matching Image Branding */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[#14D3BC] rounded-full mb-6">
            <Library size={30} className="text-[#14D3BC]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Log In Now</h1>
          <p className="text-slate-400 text-[11px] mt-2">Please login to continue our app</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field - Sharp Box Style from Image */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 ml-1">
              Email
            </label>
            <div className="relative border border-slate-200 focus-within:border-[#14D3BC] transition-all">
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field - Sharp Box Style */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-medium text-slate-400">
                Password
              </label>
            </div>
            <div className="relative border border-slate-200 focus-within:border-[#14D3BC] transition-all">
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right mt-1">
               <Link to="/forgot-password" size={18} className="text-[11px] font-semibold text-[#14D3BC] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* The Vibrant Action Button - Zero Radius */}
          <button className="w-full py-4 bg-[#14D3BC] hover:bg-[#11bba6] text-white font-bold text-sm tracking-wide shadow-lg shadow-teal-50 active:scale-[0.98] transition-all mt-4">
            Log in
          </button>
        </form>

        {/* Social & Footer - Directly following your image layout */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Don't have an account? 
            <Link to="/register" className="text-[#14D3BC] ml-1 font-bold hover:underline">Sign Up</Link>
          </p>
          
          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] bg-slate-100 flex-grow"></div>
            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-tighter">or connect</span>
            <div className="h-[1px] bg-slate-100 flex-grow"></div>
          </div>

          {/* Social Icons Placeholder (Match Image) */}
          <div className="flex justify-center gap-4">
            {['f', 't', 'G+'].map((social) => (
              <div key={social} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 cursor-pointer hover:bg-white hover:border-[#14D3BC] transition-all">
                {social}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;