import React, { useEffect, useState } from 'react';
import { 
  Check, User, BookOpen, AlertCircle, IndianRupee, 
  Hash, GraduationCap, Calendar, History, ShieldAlert,
  Barcode, Info, ExternalLink, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; // SweetAlert2 Import
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

 // --- Inside handleApproveReturn function ---
const handleApproveReturn = async (id, name, fine) => {
  // 1. Status and Color logic pehle hi define karein
  const statusColor = fine > 0 ? 'text-rose-500' : 'text-emerald-500';
  const statusText = fine > 0 ? 'Payment Required' : 'Cleared Asset';
  const fineColorClass = fine > 0 ? 'text-rose-600' : 'text-emerald-700';
  const boxBgClass = fine > 0 ? 'bg-rose-50 border-2 border-rose-100' : 'bg-emerald-50 border-2 border-emerald-100';

  Swal.fire({
    title: 'Settlement Verification',
    html: `
      <div class="text-left font-sans">
        <p class="text-xs text-slate-500 uppercase font-black tracking-widest mb-4">Confirming return for <span class="text-slate-900">${name}</span></p>
        <div class="p-5 rounded-3xl ${boxBgClass} flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Fine Amount</p>
            <p class="text-3xl font-black ${fineColorClass}">₹${fine}</p>
          </div>
          <div class="text-right">
             <p class="text-[9px] font-bold text-slate-400 uppercase leading-tight">Status</p>
             <p class="text-[10px] font-black uppercase ${statusColor}">${statusText}</p>
          </div>
        </div>
        <p class="mt-4 text-[10px] font-bold text-slate-400 uppercase text-center leading-relaxed">
          Inventory will be updated and asset will be marked as available.
        </p>
      </div>
    `,
    icon: fine > 0 ? 'warning' : 'info',
    showCancelButton: true,
    confirmButtonColor: '#14D3BC',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Yes, Restore Asset',
    cancelButtonText: 'Cancel',
    borderRadius: '2rem',
  }).then(async (result) => {
    // ... rest of your code ...
    if (result.isConfirmed) {
      const loadingToast = toast.loading("Restoring asset...");
      try {
        const res = await issueService.approveReturnRequest(id);
        if (res.success) {
          toast.success("Success!", { id: loadingToast });
          fetchReturns();
        }
      } catch (err) {
        toast.error("Error", { id: loadingToast });
      }
    }
  });
};

  const filteredRequests = requests.filter(req => 
    req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.user?.rollNumber?.includes(searchTerm)
  );

  if (loading) return <Loader fullScreen={true} message="Syncing Return Desk..." />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 px-4 sm:px-6 page-reveal">
      
      {/* 1. HEADER & SEARCH SECTION */}
      <header className="max-w-7xl mx-auto pt-10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 mb-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic font-heading">
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
              placeholder="SEARCH STUDENT OR BOOK..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-2 border-transparent focus:border-[#14D3BC] focus:bg-white outline-none rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden sm:flex bg-slate-900 text-white px-6 py-3.5 rounded-2xl items-center gap-3 shadow-lg shadow-slate-200">
             <span className="text-[10px] font-black uppercase tracking-widest text-[#14D3BC]">Pending</span>
             <div className="h-4 w-px bg-white/20"></div>
             <span className="text-sm font-black font-mono">{requests.length}</span>
          </div>
        </div>
      </header>

      {/* 2. REQUESTS GRID */}
      <main className="max-w-7xl mx-auto space-y-8">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => {
            const fine = req.currentFine || 0;
            
            return (
              <div key={req._id} className="group bg-white rounded-[3rem] border-2 border-slate-50 hover:border-[#14D3BC]/30 transition-all duration-500 overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-2xl">
                
                {/* LEFT: STUDENT IDENTITY */}
                <div className="p-8 lg:w-80 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-[#14D3BC] font-black text-2xl shadow-xl shadow-slate-200 font-heading">
                        {req.user?.name?.[0]}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-slate-900 uppercase text-sm leading-tight truncate italic">{req.user?.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 font-mono tracking-tighter">RN: {req.user?.rollNumber}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-tight">
                        <GraduationCap size={14} className="text-[#14D3BC]"/> {req.user?.branch}
                      </div>
                      <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                        Sem {req.user?.semester} <span className="text-slate-200">|</span> Year {req.user?.year}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 opacity-40">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Protocol ID</p>
                      <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">#{req._id.slice(-8)}</p>
                  </div>
                </div>

                {/* CENTER: BOOK VERIFICATION */}
                <div className="p-8 lg:flex-1 bg-white flex flex-col sm:flex-row gap-8 items-center relative">
                  <div className="w-32 h-44 shrink-0 relative group/img">
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
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-5">
                    <div>
                      <span className="bg-[#14D3BC]/10 text-[#14D3BC] text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] mb-3 inline-block">Asset Verification</span>
                      <h4 className="text-2xl font-black text-slate-800 uppercase leading-none tracking-tighter italic font-heading">
                        {req.book?.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Written by {req.book?.author || 'Unknown Author'}</p>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                      <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3">
                         <Barcode size={18} className="text-slate-400" />
                         <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-400 uppercase">ISBN REF</span>
                            <span className="text-[10px] font-bold text-slate-700 font-mono tracking-tighter">{req.book?.isbn || 'N/A-REQUIRED'}</span>
                         </div>
                      </div>
                      <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3">
                         <Calendar size={18} className="text-rose-400" />
                         <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-400 uppercase">Return Due</span>
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">{new Date(req.dueDate).toLocaleDateString('en-GB')}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: SETTLEMENT & ACTION */}
                <div className="p-8 lg:w-80 bg-[#07090D] flex flex-col items-center justify-center gap-6">
                  <div className="w-full text-center">
                    <div className={`mx-auto w-fit px-4 py-1 rounded-full text-[9px] font-black uppercase mb-3 tracking-[0.2em] shadow-lg ${fine > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#14D3BC] text-slate-900'}`}>
                      {fine > 0 ? 'Settlement Required' : 'Asset Cleared'}
                    </div>
                    <div className={`text-5xl font-black font-mono flex items-center justify-center tracking-tighter ${fine > 0 ? 'text-rose-400' : 'text-white'}`}>
                      <IndianRupee size={32} strokeWidth={3} /> {fine}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApproveReturn(req._id, req.user?.name, fine)}
                    className="w-full group bg-[#14D3BC] text-slate-900 py-4.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-black/20 active:scale-95"
                  >
                    <Check size={18} strokeWidth={4} />
                    Approve Return
                  </button>
                </div>
              </div>
            );
          })
        ) : (
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
      <footer className="max-w-7xl mx-auto mt-12 flex justify-center opacity-20">
          <p className="text-[9px] font-black uppercase tracking-widest italic">Registry Protocol v2.6.4</p>
      </footer>
    </div>
  );
};

export default ReturnRequests;