import React, { useEffect, useState } from 'react';
import { 
  Check, BookOpen, IndianRupee, 
  GraduationCap, Calendar, ShieldAlert,
  Barcode, Search, History
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
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
  };

  useEffect(() => { 
    window.scrollTo(0, 0); // Reset scroll on entry
    fetchReturns(); 
  }, []);

  const handleApproveReturn = async (id, name, fine) => {
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
        </div>
      `,
      icon: fine > 0 ? 'warning' : 'info',
      showCancelButton: true,
      confirmButtonColor: '#14D3BC',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Restore Asset',
      borderRadius: '2rem',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loadingToast = toast.loading("Restoring asset...");
        try {
          const res = await issueService.approveReturnRequest(id);
          if (res.success) {
            toast.success("Asset Restored!", { id: loadingToast });
            fetchReturns();
          }
        } catch (err) {
          toast.error("Operation Failed", { id: loadingToast });
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
    <div className="min-h-screen bg-[#FDFDFD] pb-24 px-3 sm:px-6">
      
      {/* 1. HEADER SECTION */}
      <header className="max-w-7xl mx-auto pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 mb-8">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Return <span className="text-[#14D3BC]">Desk.</span>
          </h1>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
             <History size={14} className="text-[#14D3BC]"/> Admin Verification Console
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH STUDENT/BOOK..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-2 border-transparent focus:border-[#14D3BC] focus:bg-white outline-none rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* 2. REQUESTS GRID */}
      <main className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => {
            const fine = req.currentFine || 0;
            
            return (
              <div key={req._id} className="group bg-white rounded-[2rem] border-2 border-slate-50 hover:border-[#14D3BC]/20 transition-all duration-300 overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-xl">
                
                {/* STUDENT SECTION (Compact on Mobile) */}
                <div className="p-4 sm:p-6 lg:w-72 bg-slate-50/50 flex lg:flex-col justify-between items-center lg:items-start border-b lg:border-b-0 lg:border-r border-slate-100">
                  <div className="flex items-center gap-3 lg:block lg:space-y-3">
                    <div className="h-10 w-10 lg:h-14 lg:w-14 bg-slate-900 rounded-xl flex items-center justify-center text-[#14D3BC] font-black text-lg">
                      {req.user?.name?.[0]}
                    </div>
                    <div className="max-w-[120px] lg:max-w-none">
                      <h3 className="font-black text-slate-900 uppercase text-[10px] lg:text-sm truncate italic leading-none">{req.user?.name}</h3>
                      <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 font-mono mt-1">RN: {req.user?.rollNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex lg:flex-col gap-2">
                    <div className="hidden sm:flex items-center gap-1.5 text-[8px] font-black text-slate-500 uppercase">
                      <GraduationCap size={12} className="text-[#14D3BC]"/> {req.user?.branch}
                    </div>
                    <div className="bg-white border border-slate-200 px-2 py-1 rounded-md text-[8px] font-black text-slate-400 uppercase">
                      S{req.user?.semester} | Y{req.user?.year}
                    </div>
                  </div>
                </div>

                {/* BOOK CONTENT (Side-by-Side Mobile Layout) */}
                <div className="p-4 sm:p-6 lg:flex-1 flex flex-row gap-4 items-center">
                  <div className="w-16 h-24 lg:w-28 lg:h-40 shrink-0 relative">
                     <img 
                        src={req.book?.image?.url || 'https://placehold.co/400x600?text=No+Cover'} 
                        className="w-full h-full object-cover rounded-xl shadow-lg border border-slate-100" 
                        alt="cover"
                      />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[7px] font-black text-[#14D3BC] uppercase tracking-widest block mb-1">Asset Held</span>
                    <h4 className="text-sm lg:text-xl font-black text-slate-800 uppercase leading-tight truncate italic mb-2">
                      {req.book?.title}
                    </h4>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <Barcode size={12} />
                         <span className="text-[9px] font-mono font-bold">{req.book?.isbn || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-500">
                         <Calendar size={12} />
                         <span className="text-[9px] font-black uppercase">Due: {new Date(req.dueDate).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION BAR (Mobile Row Style) */}
                <div className="p-4 lg:p-6 lg:w-64 bg-[#07090D] flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4">
                  <div className="text-left lg:text-center shrink-0">
                    <p className="text-[7px] font-black text-[#14D3BC] uppercase tracking-widest mb-0.5">Penalty</p>
                    <div className={`text-xl lg:text-3xl font-black font-mono flex items-center ${fine > 0 ? 'text-rose-400' : 'text-white'}`}>
                      <IndianRupee size={16} />{fine}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApproveReturn(req._id, req.user?.name, fine)}
                    className="flex-1 lg:w-full bg-[#14D3BC] text-slate-900 py-3 lg:py-4 px-4 rounded-xl lg:rounded-2xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl active:scale-95"
                  >
                    <Check size={14} strokeWidth={4} />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center">
            <ShieldAlert size={40} className="mx-auto text-slate-100 mb-4" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Returns Pending</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReturnRequests;