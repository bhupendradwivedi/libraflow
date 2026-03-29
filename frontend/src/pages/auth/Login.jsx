import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Library, Loader2 } from 'lucide-react'; // Loader2 import kiya

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Context se isActionLoading nikala
  const { login, isActionLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res?.success) navigate('/');
    } catch (err) { /* Error handled in Context */ }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center font-sans">
      <div className="w-full h-screen md:h-auto md:max-w-[450px] bg-white px-8 md:px-12 flex flex-col justify-center">

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[#14D3BC] rounded-full mb-6">
            <Library size={30} className="text-[#14D3BC]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Log In Now</h1>
          <p className="text-slate-400 text-[11px] mt-2">Please login to continue our app</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 ml-1">Email</label>
            <div className="relative border border-slate-200 focus-within:border-[#14D3BC] transition-all">
              <input
                type="email"
                placeholder="Enter your email"
                required
                disabled={isActionLoading}
                className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300 disabled:opacity-50"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 ml-1">Password</label>
            <div className="relative border border-slate-200 focus-within:border-[#14D3BC] transition-all">
              <input
                type="password"
                placeholder="••••••••"
                required
                disabled={isActionLoading}
                className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300 disabled:opacity-50"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right mt-1">
              <Link to="/forgot-password" size={18} className="text-[11px] font-semibold text-[#14D3BC] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Action Button with Spinner */}
          <button
            type="submit"
            disabled={isActionLoading}
            className="w-full py-4 bg-[#14D3BC] hover:bg-[#11bba6] text-white font-bold text-sm tracking-wide shadow-lg shadow-teal-50 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isActionLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Don't have an account?
            <Link to="/register" className="text-[#14D3BC] ml-1 font-bold hover:underline">Sign Up</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;