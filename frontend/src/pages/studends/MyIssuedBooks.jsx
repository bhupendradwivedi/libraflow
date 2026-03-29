import React, { useEffect, useState } from 'react';
import { 
  Book, Clock, CheckCircle, XCircle, RefreshCw, 
  Calendar, Search, Hash, ChevronRight, 
  AlertCircle, History, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import issueService from '../../services/IssueServices';
import Loader from '../../components/common/Loader';

const MyIssuedBooks = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await issueService.getMyBookRequests();
      if (data.success) setRequests(data.requests);
    } catch (error) {
      toast.error("Records sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyRequests(); }, []);

  const filteredRequests = requests.filter((req) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      req.book?.title?.toLowerCase().includes(searchTerm) ||
      req.book?.author?.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <Loader fullScreen={true} message="Reading Transaction Logs..." />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      
      {/* 1. STICKY DYNAMIC HEADER */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              Request <span className="text-[#14D3BC]">Logs.</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
              <History size={12} className="text-[#14D3BC]"/> Activity Tracking System
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search by title or author..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-transparent focus:border-[#14D3BC] focus:bg-white outline-none rounded-2xl text-xs font-bold transition-all shadow-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden sm:flex bg-slate-900 text-white px-4 py-3 rounded-2xl items-center gap-2">
               <Filter size={14} className="text-[#14D3BC]"/>
               <span className="text-[10px] font-black uppercase">{filteredRequests.length} Logs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FEED */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        {filteredRequests.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
              <Book size={32} className="text-slate-300" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 italic">No historical records found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.map((req) => {
              // Status Styling logic
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';
              const isRejected = req.status === 'rejected';

              return (
                <div 
                  key={req._id} 
                  className="group bg-white border border-slate-100 rounded-[2rem] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Status Side Pillar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPending ? 'bg-amber-400' : isApproved ? 'bg-[#14D3BC]' : 'bg-rose-500'}`} />

                  {/* Book Image */}
                  <div className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-md border border-slate-50 relative">
                     {req.book?.image?.url ? (
                       <img src={req.book.image.url} alt="cover" className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                     ) : (
                       <div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-200"><Book size={24}/></div>
                     )}
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-300 uppercase font-mono tracking-tighter">REF: #{req._id.slice(-8).toUpperCase()}</span>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight mt-1">
                          {req.book?.title}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">By {req.book?.author || 'Unknown Author'}</p>
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        isPending ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {isPending && <RefreshCw size={12} className="animate-spin" />}
                        {isApproved && <CheckCircle size={12} />}
                        {isRejected && <XCircle size={12} />}
                        {req.status}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                         <Calendar size={14} className="text-slate-400" />
                         <div className="flex flex-col leading-none">
                            <span className="text-[8px] font-black text-slate-400 uppercase">Requested On</span>
                            <span className="text-[11px] font-bold text-slate-700">{new Date(req.createdAt).toLocaleDateString('en-GB')}</span>
                         </div>
                      </div>

                      {isApproved && (
                        <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl">
                          <AlertCircle size={14} className="text-rose-500" />
                          <div className="flex flex-col leading-none">
                            <span className="text-[8px] font-black text-rose-400 uppercase">Return Due Date</span>
                            <span className="text-[11px] font-black text-rose-600">{new Date(req.dueDate).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Action Indicator */}
                  <div className="hidden md:flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <ChevronRight size={20} />
                      </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* MOBILE STATS PILL */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-40 sm:hidden flex items-center gap-3">
         <span className="text-[#14D3BC]">Total Logs</span>
         <div className="w-1 h-1 bg-white/30 rounded-full"></div>
         <span>{filteredRequests.length} Entries</span>
      </div>

    </div>
  );
};

export default MyIssuedBooks;