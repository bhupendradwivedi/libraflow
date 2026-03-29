import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  User, Mail, Lock, GraduationCap, ArrowRight, 
  Library, Calendar, Layers, RefreshCw, Hash 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '', 
    email: '', 
    password: '', 
    branch: '', 
    semester: '', 
    year: '', 
    rollNumber: '' 
  });

  const { register, isActionLoading } = useContext(AuthContext); 
  const navigate = useNavigate();

const handleRegister = async (e) => {
    e.preventDefault();
    if (isActionLoading) return; 
    try {
        const data = await register(userData);
        if (data?.success) {
            toast.success("OTP sent! Check your mail.");
            navigate('/verify-otp', { state: { email: userData.email } });
        }
    } catch (error) {
      
        const errMsg = error.response?.data?.message || "Server Busy. Try again.";
        toast.error(errMsg);
    }
};

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center font-sans p-4 md:p-8">
      
      <div className="bg-white w-full max-w-[720px] h-auto p-6 md:p-12 md:border md:border-slate-100 flex flex-col justify-center animate-in fade-in zoom-in duration-500 rounded-none transition-all shadow-sm">
        
        {/* Branding Header */}
        <div className="text-center mb-10 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[#14D3BC] rounded-full mb-6 mx-auto">
            <Library size={30} className="text-[#14D3BC]" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">Sign Up Now</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Initialize Your Library Account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
                <input
                  type="text" placeholder="Bhupendra Dwivedi" required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 outline-none focus:border-[#14D3BC] text-sm font-medium text-slate-800 placeholder:text-slate-300 transition-all rounded-none"
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Roll Number */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Roll Number</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
                <input
                  type="text" placeholder="SVPC/CS/2026/01" required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 outline-none focus:border-[#14D3BC] text-sm font-medium text-slate-800 placeholder:text-slate-300 transition-all uppercase rounded-none"
                  onChange={(e) => setUserData({ ...userData, rollNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
                <input
                  type="email" placeholder="name@svpc.com" required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 outline-none focus:border-[#14D3BC] text-sm font-medium text-slate-800 placeholder:text-slate-300 transition-all rounded-none"
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Branch */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
              <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
                <select
                  required 
                  defaultValue=""
                  className="w-full pl-11 pr-8 py-3.5 bg-white border border-slate-200 outline-none focus:border-[#14D3BC] text-sm font-medium text-slate-800 transition-all rounded-none appearance-none cursor-pointer"
                  onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
                >
                  <option value="" disabled>Select Branch</option>
                  <option value="CS">Computer Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                </select>
                <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Academic Year - Diploma (3 Years) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
                <select
                  required 
                  defaultValue=""
                  className="w-full pl-11 pr-8 py-3.5 bg-white border border-slate-200 outline-none focus:border-[#14D3BC] text-sm font-medium text-slate-800 transition-all rounded-none appearance-none cursor-pointer"
                  onChange={(e) => setUserData({ ...userData, year: parseInt(e.target.value) })}
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                </select>
                <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Semester - Diploma (6 Semesters) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Semester</label>
              <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
                <select
                  required 
                  defaultValue=""
                  className="w-full pl-11 pr-8 py-3.5 bg-white border border-slate-200 outline-none focus:border-[#14D3BC] text-sm font-medium text-slate-800 transition-all rounded-none appearance-none cursor-pointer"
                  onChange={(e) => setUserData({ ...userData, semester: parseInt(e.target.value) })}
                >
                  <option value="" disabled>Select Sem</option>
                  {[1, 2, 3, 4, 5, 6].map(sem => (
                    <option key={sem} value={sem}>{sem}th Semester</option>
                  ))}
                </select>
                <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Passcode</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
                <input
                  type="password" placeholder="Min. 6 characters" required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 outline-none focus:border-[#14D3BC] text-sm font-medium text-slate-800 placeholder:text-slate-300 transition-all rounded-none"
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={isActionLoading}
            className="w-full mt-4 py-4 bg-[#14D3BC] hover:bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-50 active:scale-[0.98] transition-all rounded-none flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isActionLoading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <>Initialize Account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Already have an account? 
            <Link to="/login" className="text-[#14D3BC] ml-2 font-black hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;