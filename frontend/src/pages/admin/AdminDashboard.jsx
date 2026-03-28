import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService.js';
import { 
  Users, Clock, AlertCircle, Plus, 
  UserPlus, ArrowUpRight, ShieldCheck, TrendingUp,
  ArrowRight, Activity, Zap, Layers
} from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    totalFine: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await userService.getDashboardStats();
        if (res.success) setStats(res.stats);
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    { title: "Total Students", value: stats.totalStudents, icon: <Users size={20}/>, color: "text-[#14D3BC]" },
    { title: "Active Loans", value: stats.activeUsers, icon: <Activity size={20}/>, color: "text-slate-900" },
    { title: "Pending Task", value: stats.pendingVerifications, icon: <AlertCircle size={20}/>, color: "text-orange-500" },
    { title: "Fine Revenue", value: `₹${stats.totalFine}`, icon: <TrendingUp size={20}/>, color: "text-[#14D3BC]" },
  ];

  if (loading) return <Loader fullScreen={true} message="Syncing SVPC Command Center..." />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-in fade-in duration-700 font-sans">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-12">
        
        {/* --- REFINED HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-slate-200 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#14D3BC] font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="h-2 w-2 bg-[#14D3BC] rounded-full animate-pulse" /> System Operational
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none font-heading">
              Console.<span className="text-[#14D3BC]">Core</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-slate-900" /> Administrative Intelligence Unit
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="text-right border-r-2 border-slate-100 pr-4">
                <p className="text-[9px] font-black text-slate-300 uppercase italic">Status</p>
                <p className="text-[11px] font-black text-[#14D3BC] uppercase">Optimized</p>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-300 uppercase italic">Session</p>
                <p className="text-[11px] font-black text-slate-900 uppercase">Active</p>
             </div>
          </div>
        </div>

        {/* --- STATS GRID: CLEAN & PRO --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((item, idx) => (
            <div key={idx} className="bg-white border-2 border-slate-900 p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default group">
              <div className="flex justify-between items-start mb-6">
                <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <Layers size={14} className="text-slate-100 group-hover:text-slate-900" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1 font-mono">{item.value}</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
            </div>
          ))}
        </div>

        {/* --- OPERATIONS: POWER PANEL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Action Hub */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter font-heading border-l-4 border-[#14D3BC] pl-4">
              Asset <span className="text-[#14D3BC]">Control</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => navigate('/admin/add-book')}
                className="p-8 bg-slate-900 border-2 border-slate-900 hover:bg-[#14D3BC] hover:border-[#14D3BC] text-white transition-all group flex flex-col gap-10 shadow-[8px_8px_0px_0px_rgba(20,211,188,0.2)]"
              >
                <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform text-[#14D3BC] group-hover:text-white" />
                <div className="text-left">
                  <span className="block font-black uppercase text-xl tracking-tighter font-heading">Register Book</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-white font-black uppercase tracking-widest">Inventory Expansion</span>
                </div>
              </button>

              <button 
                onClick={() => navigate('/admin/students-list')}
                className="p-8 bg-white border-2 border-slate-900 hover:bg-slate-900 text-slate-900 hover:text-white transition-all group flex flex-col gap-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)]"
              >
                <UserPlus size={28} strokeWidth={3} className="text-[#14D3BC]" />
                <div className="text-left">
                  <span className="block font-black uppercase text-xl tracking-tighter font-heading">Identity Audit</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-slate-400 font-black uppercase tracking-widest">User Verification</span>
                </div>
              </button>
            </div>
          </div>

          {/* Issue Queue Quick Access */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter font-heading border-l-4 border-slate-900 pl-4 mb-6">
              Live <span className="text-[#14D3BC]">Queue</span>
            </h2>
            <button 
              onClick={() => navigate('/admin/request-manager')}
              className="flex-1 bg-[#14D3BC] p-10 text-white flex flex-col justify-between border-2 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group min-h-[300px]"
            >
              <div className="flex justify-between items-start">
                <Clock size={48} strokeWidth={2.5} />
                <div className="bg-slate-900 p-2 rounded-full group-hover:rotate-45 transition-transform">
                  <ArrowUpRight size={20} className="text-[#14D3BC]" />
                </div>
              </div>
              <div className="text-left">
                <p className="text-5xl font-black tracking-tighter uppercase leading-[0.8] font-heading">Manage<br/>Requests</p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-6 text-slate-900">Process Pending Approvals</p>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;