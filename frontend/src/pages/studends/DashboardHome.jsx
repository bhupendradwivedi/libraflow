import React, { useEffect, useState } from 'react';
import BookCard from '../../components/students/BookCard';
import bookService from '../../services/bookServices';
import { toast } from 'react-hot-toast';
import { Search, Library, Hash, LayoutGrid } from 'lucide-react';
import issueService from '../../services/IssueServices';
import Loader from '../../components/common/Loader';

const DashboardHome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null); // Track which book is being requested
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      if (data.success) setBooks(data.books);
    } catch (err) {
      toast.error("Records sync failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllBooks(); }, []);

  const handleIssueRequest = async (bookId) => {
    try {
      setRequestingId(bookId); // Start loading for this specific card
      const data = await issueService.requestIssue(bookId);
      if (data.success) {
        toast.success("REQUEST LOGGED: Waiting for Admin approval.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      
      // Clean error handling based on your backend ErrorHandlers
      if (msg.toLowerCase().includes("not approved")) {
        toast.error("ACCESS DENIED: Identity not verified by Admin.");
      } else if (msg.toLowerCase().includes("already")) {
        toast.error("DUPLICATE: Active request already exists.");
      } else if (msg.toLowerCase().includes("limit")) {
        toast.error("LIMIT REACHED: Return existing assets first.");
      } else {
        toast.error(msg);
      }
    } finally {
      setRequestingId(null); // Stop loading
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen={true} message="Accessing SVPC Catalog..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 font-sans px-4 pb-20 mt-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 border-b-2 border-slate-100 pb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none font-heading">
            Catalog
          </h1>
          <p className="text-[#14D3BC] text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center justify-center lg:justify-start gap-2">
            <LayoutGrid size={12} strokeWidth={3} /> SVPC Central Inventory System
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Titles Count */}
          <div className="hidden sm:flex bg-slate-900 px-6 py-4 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(20,211,188,1)] items-center gap-4">
             <Library size={18} className="text-[#14D3BC]" />
             <span className="text-[11px] font-black text-white uppercase tracking-widest font-mono">
               {books.length} REGISTERED TITLES
             </span>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH BY TITLE OR AUTHOR..." 
              className="w-full pl-11 pr-4 py-4 border-2 border-slate-100 focus:border-[#14D3BC] outline-none font-bold text-[10px] uppercase tracking-[0.2em] transition-all bg-slate-50 focus:bg-white rounded-none shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CENTERED GRID */}
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16 justify-items-center w-full">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book._id} className="animate-in zoom-in-95 duration-500 w-full flex justify-center">
                 <BookCard 
                  book={book} 
                  onIssue={handleIssueRequest} 
                  isLoading={requestingId === book._id} // Pass loading state to card
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-200 w-full flex flex-col items-center justify-center">
              <Hash className="text-slate-200 mb-6" size={64} strokeWidth={1} />
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Inventory Reference Not Found</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-6 text-[#14D3BC] text-[10px] font-black uppercase underline tracking-widest"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;