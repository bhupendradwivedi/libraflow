import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  ArrowRight, Library, Sparkles, ShieldCheck, 
  Zap, BookOpen, GraduationCap, Globe, Mail, Phone 
} from "lucide-react";
import Footer from "../../components/common/Footer"; 

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleExplore = () => {
    if (!user) navigate("/login");
    else navigate(user.role === 'admin' ? "/admin/dashboard" : "/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans overflow-x-hidden">
      
      {/* --- TOP NAVIGATION (SHARP) --- */}
      <nav className="absolute top-0 w-full z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-12 h-12 bg-black flex items-center justify-center text-[#14D3BC] shadow-2xl group-hover:bg-[#14D3BC] group-hover:text-white transition-all duration-500">
              <Library size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase">SVPC</span>
              <span className="text-[10px] font-black text-[#14D3BC] uppercase tracking-[0.4em]">Digital Library</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            {!user ? (
              <button 
                onClick={() => navigate("/login")} 
                className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#14D3BC] transition-all shadow-xl"
              >
                Access Portal
              </button>
            ) : (
              <button 
                onClick={handleExplore} 
                className="px-8 py-3 bg-[#14D3BC] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        {/* Background Sharp Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-screen bg-slate-50 -z-10 border-l border-slate-100 hidden lg:block"></div>
        
        <div className="flex items-center gap-3 mb-10 px-6 py-2 border-2 border-[#14D3BC] animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles size={16} className="text-[#14D3BC]" />
          <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Optimized Learning Environment</span>
        </div>

        <h1 className="text-6xl md:text-[8.5rem] font-black text-slate-900 leading-[0.85] tracking-tighter mb-12">
          REDEFINE <br /> 
          <span className="text-[#14D3BC] italic">KNOWLEDGE.</span>
        </h1>
        
        <p className="max-w-3xl text-slate-400 font-bold mb-16 text-lg md:text-xl leading-relaxed uppercase tracking-tight">
          S.V. Polytechnic College's high-performance digital asset manager. 
          Streamlining academic resources for the next generation of engineers.
        </p>

        <div className="flex flex-col items-center gap-10">
          <button 
            onClick={handleExplore}
            className="px-16 py-8 bg-slate-900 text-white font-black text-xl hover:bg-[#14D3BC] transition-all shadow-[20px_20px_0px_0px_rgba(20,211,188,0.2)] flex items-center gap-6 group relative"
          >
            {user ? "ENTER REPOSITORY" : "INITIALIZE ACCESS"} 
            <ArrowRight size={28} className="group-hover:translate-x-4 transition-transform text-[#14D3BC]" />
          </button>
          
          <div className="flex items-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
            <span>Secured Node</span>
            <div className="w-2 h-2 bg-[#14D3BC] animate-pulse"></div>
            <span>v3.4 Stable</span>
          </div>
        </div>
      </section>

      {/* --- DATA STRIP (Teal Bar) --- */}
      <section className="py-24 bg-[#14D3BC] text-slate-900 border-y-8 border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Archived Titles", val: "15,000+" },
            { label: "Verified Users", val: "2,500+" },
            { label: "Real-time Traffic", val: "High" },
            { label: "System Uptime", val: "99.9%" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2 border-l-2 border-slate-900/10 first:border-none">
              <h4 className="text-5xl md:text-7xl font-black tracking-tighter italic">{stat.val}</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES (SHARP CARDS) --- */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-32">
            <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">System <br/> Capabilities</h2>
            <div className="h-2 w-32 bg-[#14D3BC] mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <ShieldCheck size={44}/>, title: "Identity Vault", desc: "Military-grade student authentication for secure book transactions." },
              { icon: <BookOpen size={44}/>, title: "Asset Grid", desc: "High-speed browsing of digital and physical books across all departments." },
              { icon: <Zap size={44}/>, title: "Instant Sync", desc: "Automated issue/return queue with real-time admin declassification." }
            ].map((step, i) => (
              <div key={i} className="p-12 border-2 border-slate-50 hover:border-[#14D3BC] transition-all duration-500 group bg-slate-50/30">
                <div className="text-slate-900 group-hover:text-[#14D3BC] transition-colors mb-10">
                  {step.icon}
                </div>
                <h3 className="text-3xl font-black uppercase mb-6 tracking-tight italic">{step.title}</h3>
                <p className="text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEPARTMENTS SECTION --- */}
      <section className="py-40 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-24 border-b border-white/10 pb-10">
            <div>
              <GraduationCap size={48} className="text-[#14D3BC] mb-6" />
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Resource <br/> Departments</h2>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] hidden md:block">Categorized Inventory Access</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/10">
            {["Computer Science", "Mechanical", "Electrical", "Civil", "Electronics", "Applied Science"].map((branch, idx) => (
              <div 
                key={idx} 
                onClick={handleExplore}
                className="p-12 border border-white/5 hover:bg-[#14D3BC] hover:text-slate-900 transition-all cursor-pointer group flex justify-between items-center"
              >
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">{branch}</h3>
                  <p className="text-[9px] font-bold text-slate-500 group-hover:text-slate-800 uppercase mt-2 tracking-widest">Catalog [v1.0]</p>
                </div>
                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER ATTACHED --- */}
      <Footer />
      
    </div>
  );
};

export default Home;