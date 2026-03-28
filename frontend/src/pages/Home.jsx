import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  ArrowRight, Library, Sparkles, ShieldCheck, 
  Zap, BookOpen, GraduationCap 
} from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleExplore = () => {
    if (!user) navigate("/login");
    else navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans overflow-x-hidden">
      
      {/* --- TOP NAVIGATION --- */}
      <nav className="absolute top-0 w-full z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Library size={20} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase">SVPC</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">BookHub</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            {!user ? (
              <button onClick={() => navigate("/login")} className="text-xs font-black text-slate-500 hover:text-black transition-colors uppercase tracking-widest">Sign In</button>
            ) : (
              <button onClick={() => navigate("/student/dashboard")} className="px-6 py-3 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg">Dashboard</button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION: Fixed Spacing for Desktop --- */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-32 md:pb-48">
        
        {/* Badge */}
        <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles size={14} className="text-yellow-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Next Gen Library System</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-[7.5rem] font-black text-slate-900 leading-[0.9] md:leading-[0.85] tracking-tighter mb-10">
          Unlock Knowledge <br /> 
          <span className="text-gray-400 italic font-medium">Anytime, Anywhere.</span>
        </h1>
        
        {/* Subtext */}
        <p className="max-w-2xl text-gray-500 font-medium mb-16 text-base md:text-xl leading-relaxed">
          S.V. Polytechnic College's centralized digital hub. Manage your issued books, 
          track due dates, and explore titles with a single click.
        </p>

        {/* CTA BUTTON Section: Added margin-bottom to avoid touching black bar */}
        <div className="flex flex-col items-center gap-8 mb-10">
          <button 
            onClick={handleExplore}
            className="px-10 md:px-14 py-5 md:py-6 bg-black text-white rounded-full font-black text-lg md:text-xl hover:scale-105 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex items-center gap-4 active:scale-95 uppercase tracking-widest group"
          >
            {user ? "Enter Library" : "Get Started Now"} 
            <ArrowRight size={26} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="flex items-center gap-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">
            <span>Knowledge is Power</span>
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
            <span>Free Access</span>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (Black Bar) --- */}
      <section className="relative z-10 py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Total Books", val: "15,000+" },
            { label: "Active Students", val: "2,500+" },
            { label: "Daily Issues", val: "120+" },
            { label: "Departments", val: "06" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-4xl md:text-6xl font-black tracking-tighter">{stat.val}</h4>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Seamless Experience</h2>
            <div className="h-2 w-24 bg-black mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { icon: <ShieldCheck size={40}/>, title: "Secure Login", desc: "Access your personalized dashboard with secure student credentials." },
              { icon: <BookOpen size={40}/>, title: "Browse & Request", desc: "Search for books across all departments and request issues instantly." },
              { icon: <Zap size={40}/>, title: "Quick Approval", desc: "Admin approves your request and notifies you for pick-up." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{step.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BRANCHES SECTION --- */}
      <section className="py-32 bg-[#F6F6F6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <GraduationCap size={32} className="text-slate-900" />
            <h2 className="text-4xl font-black uppercase tracking-tighter">Academic Departments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Computer Science", "Mechanical", "Electrical", "Civil", "Electronics", "General Science"].map((branch, idx) => (
              <div 
                key={idx} 
                onClick={handleExplore}
                className="bg-white p-10 rounded-[3rem] border border-transparent hover:border-black transition-all cursor-pointer group flex justify-between items-center shadow-sm hover:shadow-xl"
              >
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight group-hover:translate-x-2 transition-transform">{branch}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Explore Collection</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-gray-100 text-center bg-white">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] px-4">
          SVPC BookHub • Digital Management System • © 2026
        </p>
      </footer>
    </div>
  );
};

export default Home;