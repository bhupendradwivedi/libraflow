import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Calendar, AlertCircle, 
  Clock, ArrowRight, RotateCcw 
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
      const res = await issueService.getMyBookRequests(); 
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
        toast.success("Return dispatched");
        fetchMyBooks(); 
      }
    } catch (error) {
      toast.error(error.message || "Failed");
    }
  };

  if (loading) return <Loader fullScreen={true} message="Accessing Shelf..." />;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-700 font-sans px-2 sm:px-6 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-2 border-slate-900 pb-6 sm:pb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none font-heading">
            My Shelf
          </h1>
          <p className="text-[#14D3BC] text-[9px] font-black uppercase tracking-[0.3em] mt-2">
            Active Holdings & Fine Tracking
          </p>
        </div>
        
        {/* Compact Stats */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-white px-4 py-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] text-center">
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Active</p>
            <p className="text-xl font-black text-slate-900 font-mono">{issuedBooks.length}</p>
          </div>
          <div className="flex-1 md:flex-none bg-slate-900 px-4 py-2 shadow-[3px_3px_0px_0px_rgba(20,211,188,1)] text-center border-2 border-slate-900">
            <p className="text-[7px] font-black text-[#14D3BC] uppercase tracking-widest">Fine</p>
            <p className="text-xl font-black text-white font-mono">₹{issuedBooks.reduce((acc, curr) => acc + (curr.currentFine || 0), 0)}</p>
          </div>
        </div>
      </div>

      {/* --- COMPACT BOOKS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {issuedBooks.length > 0 ? (
          issuedBooks.map((item) => {
            const fine = item.currentFine || 0;
            const isOverdue = fine > 0;
            const isReturnPending = item.status === 'return_requested';

            return (
              <div key={item._id} className="bg-white border-2 border-slate-900 p-3 sm:p-4 flex gap-4 group relative shadow-[6px_6px_0px_0px_rgba(15,23,42,0.05)] hover:shadow-none transition-all">
                
                {/* Book Cover: Fixed Smaller Size for PC */}
                <div className="w-24 sm:w-28 h-36 sm:h-40 bg-slate-50 border-2 border-slate-900 overflow-hidden shrink-0 relative">
                  <img 
                    src={item.book?.image?.url || 'https://placehold.co/300x450?text=BOOK'} 
                    alt={item.book?.title}
                    className="w-full h-full object-cover"
                  />
                  {isOverdue && (
                    <div className="absolute top-0 right-0 bg-rose-600 text-white px-1.5 py-0.5 font-black text-[7px] uppercase">
                      Overdue
                    </div>
                  )}
                </div>

                {/* Metadata & Actions */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[7px] font-black text-[#14D3BC] uppercase">ID: {item._id?.slice(-4).toUpperCase()}</span>
                        <div className={`h-1.5 w-1.5 rounded-full ${isReturnPending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tighter leading-tight font-heading truncate">
                      {item.book?.title}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                      {item.book?.author}
                    </p>
                  </div>

                  {/* Dates: Small font for compact feel */}
                  <div className="grid grid-cols-2 gap-2 border-y border-slate-100 py-2 my-2">
                    <div>
                      <p className="text-[7px] font-black text-slate-300 uppercase flex items-center gap-1">
                        <Calendar size={8} /> Issued
                      </p>
                      <p className="text-[9px] font-black text-slate-700 font-mono">
                        {new Date(item.issueDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black text-slate-300 uppercase flex items-center gap-1">
                        <Clock size={8} /> Due
                      </p>
                      <p className={`text-[9px] font-black font-mono ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                        {new Date(item.dueDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className={`text-xs font-black font-mono ${isOverdue ? 'text-rose-600' : 'text-emerald-500'}`}>₹{fine}</p>
                    </div>

                    <button 
                      disabled={isReturnPending}
                      onClick={() => handleReturnRequest(item._id)}
                      className={`px-3 py-1.5 border-2 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all flex-1 justify-center ${
                        isReturnPending 
                        ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                        : 'bg-slate-900 border-slate-900 text-white hover:bg-[#14D3BC] shadow-[2px_2px_0px_0px_rgba(20,211,188,1)] active:shadow-none'
                      }`}
                    >
                      {isReturnPending ? 'Pending' : 'Return'} 
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <BookOpen size={32} className="text-slate-200 mb-4" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Shelf Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuedBooks;