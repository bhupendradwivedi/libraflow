import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Calendar, AlertCircle, 
  Clock, RotateCcw, Library, IndianRupee, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import issueService from '../../services/IssueServices';
import Loader from '../../components/common/Loader'; 

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const res = await issueService.getMyApprovedBookRequests(); 
      if (res.success) {
        const activeIssues = res.requests.filter(req => 
          req.status === 'approved' || req.status === 'return_requested'
        );
        setIssuedBooks(activeIssues);
      }
    } catch (error) {
      toast.error("Shelf sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBooks(); }, []);

  const handleReturnRequest = async (issueId) => {
    try {
      const res = await issueService.requestReturn(issueId);
      if (res.success) {
        toast.success("Return request initiated");
        fetchMyBooks(); 
      }
    } catch (error) {
      toast.error(error.message || "Action failed");
    }
  };

  const totalFine = issuedBooks.reduce((acc, curr) => acc + (curr.currentFine || 0), 0);

  if (loading) return <Loader fullScreen={true} message="Opening your digital shelf..." />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 px-4 sm:px-6">
      
      {/* 1. DYNAMIC HEADER */}
      <header className="max-w-6xl mx-auto pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 mb-8">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            My <span className="text-[#14D3BC]">Shelf.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
             <Library size={12} className="text-[#14D3BC]"/> Active Asset Holdings
          </p>
        </div>
        
        {/* Fine Summary Card */}
        <div className={`w-full md:w-auto px-6 py-4 rounded-[2rem] border-2 flex items-center justify-between gap-8 ${totalFine > 0 ? 'bg-rose-50 border-rose-100 text-rose-600 shadow-lg shadow-rose-100/50' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest">Total Fine Accrued</span>
            <span className="text-2xl font-black font-mono leading-none flex items-center"><IndianRupee size={20} />{totalFine}</span>
          </div>
          {totalFine > 0 && <AlertCircle className="animate-pulse" size={24} />}
        </div>
      </header>

      {/* 2. ASSET GRID */}
      <main className="max-w-6xl mx-auto">
        {issuedBooks.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                <Library size={40} className="text-slate-200" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Your shelf is currently empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {issuedBooks.map((item) => {
              const fine = item.currentFine || 0;
              const isOverdue = fine > 0;
              const isReturnPending = item.status === 'return_requested';

              return (
                <div 
                  key={item._id} 
                  className={`group relative bg-white border-2 rounded-[2.5rem] p-5 transition-all duration-300 ${isReturnPending ? 'border-amber-200 bg-amber-50/20' : isOverdue ? 'border-rose-100 hover:border-rose-300' : 'border-slate-50 hover:border-[#14D3BC] shadow-xl shadow-slate-200/40 hover:shadow-[#14D3BC]/10'}`}
                >
                  <div className="flex gap-5">
                    {/* Book Cover Container */}
                    <div className="w-24 sm:w-28 h-36 sm:h-40 shrink-0 relative">
                        <div className={`absolute inset-0 rounded-3xl rotate-3 translate-x-1 translate-y-1 -z-10 transition-transform group-hover:rotate-6 ${isOverdue ? 'bg-rose-100' : 'bg-[#14D3BC]/20'}`} />
                        <img 
                            src={item.book?.image?.url || 'https://placehold.co/300x450?text=BOOK'} 
                            alt="cover" 
                            className="h-full w-full object-cover rounded-3xl shadow-md border border-white" 
                        />
                    </div>

                    {/* Book Content */}
                    <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[9px] font-black text-slate-300 uppercase font-mono tracking-tighter">REF: {item._id.slice(-6).toUpperCase()}</span>
                           {isReturnPending && (
                             <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-2 py-1 rounded-full uppercase animate-bounce">Pending Admin Approval</span>
                           )}
                        </div>
                        <h3 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tighter leading-[1.1] mb-1 line-clamp-2">
                          {item.book?.title}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">By {item.book?.author}</p>
                      </div>

                      {/* Dates & Action Row */}
                      <div className="flex items-end justify-between mt-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 bg-slate-50 w-fit px-2 py-1 rounded-lg">
                            <Calendar size={12} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Issued: {new Date(item.issueDate).toLocaleDateString('en-GB')}</span>
                          </div>
                          <div className={`flex items-center gap-2 w-fit px-2 py-1 rounded-lg ${isOverdue ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Clock size={12} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase">Due: {new Date(item.dueDate).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button 
                          disabled={isReturnPending}
                          onClick={() => handleReturnRequest(item._id)}
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                            isReturnPending 
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'bg-slate-900 text-[#14D3BC] hover:bg-[#14D3BC] hover:text-white active:scale-90 shadow-slate-200'
                          }`}
                        >
                          {isReturnPending ? <Clock size={20} /> : <RotateCcw size={20} strokeWidth={3} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Overdue Penalty Banner */}
                  {isOverdue && !isReturnPending && (
                    <div className="mt-5 p-3 rounded-2xl bg-rose-600 flex justify-between items-center shadow-lg shadow-rose-200">
                        <div className="flex items-center gap-2 text-white">
                          <Info size={14} />
                          <span className="text-[9px] font-black uppercase tracking-[0.1em]">Penalty Settlement Required</span>
                        </div>
                        <div className="flex items-center font-mono font-black text-white text-sm">
                            <IndianRupee size={14} />{fine}
                        </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. QUICK INFO TAB (Floating for Mobile) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-slate-900/90 backdrop-blur-xl text-white px-8 py-3 rounded-full flex items-center gap-4 border border-white/10 shadow-2xl z-40 md:hidden">
         <span className="text-[10px] font-black uppercase tracking-widest text-[#14D3BC]">Shelf Summary</span>
         <div className="h-4 w-px bg-white/20"></div>
         <span className="text-xs font-bold">{issuedBooks.length} Assets</span>
      </div>

    </div>
  );
};

export default IssuedBooks;