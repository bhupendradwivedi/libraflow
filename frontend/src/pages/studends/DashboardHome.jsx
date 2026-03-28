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
      const data = await issueService.requestIssue(bookId);
      if (data.success) toast.success("Request sent to ledger!");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      if (msg.toLowerCase().includes("not approved")) {
        toast.error("ACCESS DENIED: Account pending approval.");
      } else if (msg.toLowerCase().includes("already")) {
        toast.error("DUPLICATE: Request already exists.");
      } else if (msg.toLowerCase().includes("limit")) {
        toast.error("LIMIT: Max 6 books allowed.");
      } else {
        toast.error(msg);
      }
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen={true} message="Accessing SVPC Catalog..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 font-sans px-4 pb-20">
      
      {/* --- REFINED HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 border-b-2 border-slate-100 pb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none font-heading">
            Catalog
          </h1>
          <p className="text-[#14D3BC] text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center justify-center lg:justify-start gap-2">
            <LayoutGrid size={12} /> Explore Library Inventory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Inventory Count Badge */}
          <div className="hidden sm:flex bg-slate-900 px-4 py-3 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(20,211,188,1)] items-center gap-3">
             <Library size={16} className="text-[#14D3BC]" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">
               {books.length} TITLES
             </span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH TITLES / AUTHORS..." 
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-100 focus:border-[#14D3BC] outline-none font-bold text-[10px] uppercase tracking-widest transition-all bg-slate-50 focus:bg-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- CENTERED GRID LAYOUT --- */}
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center w-full">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book._id} className="animate-in zoom-in-95 duration-500 w-full flex justify-center">
                 <BookCard 
                  book={book} 
                  onIssue={handleIssueRequest} 
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-100 rounded-lg w-full">
              <Hash className="mx-auto text-slate-100 mb-4" size={48} />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No matching records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;