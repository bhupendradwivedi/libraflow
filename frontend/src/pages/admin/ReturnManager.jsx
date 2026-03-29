import React, { useEffect, useState } from 'react';
import { 
  Check, User, BookOpen, AlertCircle, IndianRupee, 
  Hash, GraduationCap, Calendar, History, ShieldAlert,
  Barcode, Info, ExternalLink, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import issueService from '../../services/IssueServices';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader';

const ReturnRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await userService.getAdminReturnRequests();
      if (res.success) setRequests(res.requests);
    } catch (err) {
      toast.error("Queue sync failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchReturns(); }, []);

  const handleApproveReturn = async (id, name, fine) => {
    const confirmMsg = `Confirm return for ${name}?\nFine: ₹${fine}\nInventory will be updated.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await issueService.approveReturnRequest(id);
      if (res.success) {
        toast.success("Asset restored successfully!");
        fetchReturns();
      }
    } catch (err) {
      toast.error("Process failed");
    }
  };

  const filteredRequests = requests.filter(req => 
    req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.user?.rollNumber?.includes(searchTerm)
  );

  if (loading) return <Loader fullScreen={true} message="Syncing Return Desk..." />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 px-4 sm:px-6">
      
      {/* 1. HEADER & SEARCH SECTION */}
      <header className="max-w-7xl mx-auto pt-10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 mb-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Return <span className="text-[#14D3BC]">Desk.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
             <History size={14} className="text-[#14D3BC]"/> Verification & Settlement Console
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Student or Book..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-2 border-transparent focus:border-[#14D3BC] focus:bg-white outline-none rounded-2xl text-xs font-bold transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden sm:flex bg-slate-900 text-white px-6 py-3.5 rounded-2xl items-center gap-3 shadow-lg shadow-slate-200">
             <span className="text-[10px] font-black uppercase tracking-widest text-[#14D3BC]">Pending</span>
             <div className="h-4 w-px bg-white/20"></div>
             <span className="text-sm font-black">{requests.length}</span>
          </div>
        </div>
      </header>

      {/* 2. REQUESTS GRID */}
      <main className="max-w-7xl mx-auto space-y-8">
        {filteredRequests.length > 0 ? filteredRequests.map((req) => {
          const fine = req.currentFine || 0;
          
          return (
            <div key={req._id} className="group bg-white rounded-[3rem] border-2 border-slate-50 hover:border-[#14D3BC] transition-all duration-500 overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-2xl hover:shadow-[#14D3BC]/10">
              
              {/* LEFT: STUDENT IDENTITY */}
              <div className="p-8 lg:w-80 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-[#14D3BC] font-black text-2xl shadow-xl shadow-slate-200">
                      {req.user?.name?.[0]}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-black text-slate-900 uppercase text-base leading-tight truncate">{req.user?.name}</h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 font-mono tracking-tighter">RN: {req.user?.rollNumber}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-tight">
                      <GraduationCap size={14} className="text-[#14D3BC]"/> {req.user?.branch}
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                      Sem {req.user?.semester} <span className="text-slate-200">|</span> Year {req.user?.year}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 opacity-60">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Database Reference</p>
                    <p className="text-[10px] font-mono font-bold text-slate-400">ID: {req._id.slice(-12).toUpperCase()}</p>
                </div>
              </div>

              {/* CENTER: BOOK VERIFICATION (With Image Fix) */}
              <div className="p-8 lg:flex-1 bg-white flex flex-col sm:flex-row gap-8 items-center relative">
                {/* Book Cover Image */}
                <div className="w-32 h-48 shrink-0 relative group/img">
                   <div className="absolute inset-0 bg-slate-100 rounded-3xl rotate-3 -z-10 group-hover/img:rotate-6 transition-transform duration-500" />
                   <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-50 flex items-center justify-center">
                      {req.book?.image?.url ? (
                        <img 
                          src={req.book.image.url} 
                          alt="cover" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" 
                          onError={(e) => { e.target.src = 'https://placehold.co/400x600?text=No+Cover' }}
                        />
                      ) : (
                        <BookOpen size={32} className="text-slate-200" />
                      )}
                   </div>
                   <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-[#14D3BC] opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <ExternalLink size={14} />
                   </button>
                </div>

                {/* Book Details */}
                <div className="flex-1 text-center sm:text-left space-y-5">
                  <div>
                    <span className="bg-[#14D3BC]/10 text-[#14D3BC] text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest mb-3 inline-block">Asset Verification</span>
                    <h4 className="text-2xl font-black text-slate-800 uppercase leading-tight tracking-tighter">
                      {req.book?.title}
                    </h4>
                    <p className="text-xs font-bold text-slate-400 mt-1 italic italic">Written by {req.book?.author || 'Unknown Author'}</p>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3">
                       <Barcode size={18} className="text-slate-400" />
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase">ISBN Reference</span>
                          <span className="text-xs font-bold text-slate-700 font-mono tracking-tighter">{req.book?.isbn || 'N/A-REQUIRED'}</span>
                       </div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3">
                       <Calendar size={18} className="text-rose-400" />
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase">Return Due Date</span>
                          <span className="text-xs font-bold text-slate-700">{new Date(req.dueDate).toLocaleDateString('en-GB')}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: SETTLEMENT & ACTION */}
              <div className="p-8 lg:w-80 bg-slate-900 flex flex-col items-center justify-center gap-6">
                <div className="w-full text-center">
                  <div className={`mx-auto w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase mb-3 tracking-widest ${fine > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#14D3BC] text-slate-900'}`}>
                    {fine > 0 ? 'Pending Fine' : 'Clear Asset'}
                  </div>
                  <div className={`text-5xl font-black font-mono flex items-center justify-center tracking-tighter ${fine > 0 ? 'text-rose-400' : 'text-white'}`}>
                    <IndianRupee size={32} strokeWidth={3} /> {fine}
                  </div>
                </div>

                <button 
                  onClick={() => handleApproveReturn(req._id, req.user?.name, fine)}
                  className="w-full group bg-[#14D3BC] text-slate-900 py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:scale-105 transition-all shadow-xl shadow-black/20 active:scale-95"
                >
                  <Check size={20} strokeWidth={4} className="group-hover:rotate-12 transition-transform" />
                  Approve Return
                </button>
              </div>

            </div>
          );
        }) : (
          <div className="py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 text-center flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <ShieldAlert size={48} className="text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-300 uppercase tracking-[0.4em]">Vault Balanced</h2>
            <p className="text-xs font-bold text-slate-300 mt-2">Zero pending return requests in the queue.</p>
          </div>
        )}
      </main>

      {/* FOOTER INFO */}
      <footer className="max-w-7xl mx-auto mt-12 flex justify-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-widest">Library Identity Protocol v2.6</p>
      </footer>
    </div>
  );
};

export default ReturnRequests;