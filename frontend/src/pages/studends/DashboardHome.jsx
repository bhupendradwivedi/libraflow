import React, { useEffect, useState } from 'react';
import BookCard from '../../components/students/BookCard';
import bookService from '../../services/bookServices';
import { toast } from 'react-hot-toast';
import { Search, Library, Hash, Bell } from 'lucide-react';
import issueService from '../../services/IssueServices';
import Loader from '../../components/common/Loader';

const DashboardHome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      if (data.success) setBooks(data.books);
    } catch (err) {
      toast.error("Sync failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllBooks(); }, []);

  const handleIssueRequest = async (bookId) => {
    try {
      setRequestingId(bookId);
      const data = await issueService.requestIssue(bookId);
      if (data.success) toast.success("REQUESTED");
    } catch (err) {
      toast.error("Failed Or You Not Verifed By Admin.");
    } finally {
      setRequestingId(null);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen={true} message="Loading..." />;

  return (
    /* --- FIXED WRAPPER --- */
    <div className="h-[100dvh] w-full bg-[#F8FAFC] flex flex-col overflow-hidden fixed inset-0 font-sans">
      
      {/* 1. HEADER (Fixed) */}
      <header className="shrink-0 bg-white border-b border-slate-100 px-5 py-3 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-[#14D3BC] shadow-sm">
            <Library size={16} strokeWidth={2.5} />
          </div>
          <h1 className="text-[12px] font-black tracking-tighter uppercase text-slate-800">
            Catalog.<span className="text-teal-500">Hub</span>
          </h1>
        </div>
        <button className="p-2 text-slate-300 active:text-slate-900 transition-colors">
          <Bell size={18} />
        </button>
      </header>

      {/* 2. SEARCH BOX (Fixed) */}
      <div className="shrink-0 px-5 py-3 bg-white border-b border-slate-100 shadow-sm">
        <div className="relative max-w-xl mx-auto group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="SEARCH BY TITLE OR AUTHOR..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none outline-none text-[10px] font-black uppercase tracking-wider text-slate-700 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/5 transition-all placeholder:text-slate-300 shadow-inner"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. SCROLLABLE AREA */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-10 bg-[#F8FAFC] scroll-smooth">
        
        <div className="max-w-7xl mx-auto mb-6 px-2">
           <p className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase border-l-2 border-teal-500 pl-2">
             Inventory Collection
           </p>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredBooks.map((book) => (
              <div key={book._id} className="w-full flex justify-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <BookCard 
                  book={book} 
                  onIssue={handleIssueRequest} 
                  isLoading={requestingId === book._id} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center opacity-50">
            <Hash size={24} className="text-slate-300 mb-2" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No matching assets found</p>
            <button onClick={() => setSearchTerm("")} className="mt-4 text-[10px] text-teal-500 font-bold uppercase underline">Reset</button>
          </div>
        )}
      </main>

    </div>
  );
};

export default DashboardHome;