import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, Search, User, Layers, Hash, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import bookService from '../../services/bookServices';
import Loader from '../../components/common/Loader';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      if (data.success) setBooks(data.books);
    } catch (error) {
      toast.error("Database sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`CONFIRM PURGE: Remove "${title.toUpperCase()}" from SVPC Registry?`)) return;
    try {
      const data = await bookService.deleteBook(id);
      if (data.success) {
        toast.success("Asset Purged Successfully");
        setBooks(books.filter(book => book._id !== id));
      }
    } catch (error) {
      toast.error("Declassification Failed");
    }
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen={true} message="Accessing SVPC Asset Registry..." />;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-sans sm:px-4">
      
      {/* --- REFINED HEADER SECTION --- */}
      <div className="px-4 sm:px-0 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b-2 border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none font-heading">
            Inventory
          </h1>
          <p className="text-[#14D3BC] text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <Layers size={14} /> Master Asset Registry • Active Catalog
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto px-0">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14D3BC] transition-colors" size={16} />
            <input
              type="text"
              placeholder="SEARCH BY TITLE, AUTHOR, ISBN..."
              className="w-full pl-11 pr-4 py-4 sm:py-3 border-2 border-slate-100 focus:border-[#14D3BC] outline-none font-bold text-[10px] uppercase tracking-widest transition-all bg-slate-50 focus:bg-white sm:rounded-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Asset Button */}
          <button
            onClick={() => navigate('/admin/add-book')}
            className="mx-4 sm:mx-0 px-6 py-4 sm:py-3 bg-slate-900 text-[#14D3BC] border-2 border-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-[#14D3BC] hover:text-white transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(20,211,188,1)] active:shadow-none"
          >
            <Plus size={16} strokeWidth={3} /> Register Asset
          </button>
        </div>
      </div>

      {/* --- TABLE CONTAINER: Full Screen on Mobile --- */}
      <div className="bg-white sm:border-2 border-slate-900 overflow-hidden sm:shadow-[12px_12px_0px_0px_rgba(15,23,42,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-4 sm:px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Asset Details</th>
                <th className="px-4 sm:px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Identifiers</th>
                <th className="px-4 sm:px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-center whitespace-nowrap">Price</th>
                <th className="px-4 sm:px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-center whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-center whitespace-nowrap">Record</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-sans">
              {filteredBooks.length > 0 ? filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-slate-50 transition-all group">
                  
                  {/* Book & Author - Normal Color (No Grayscale) */}
                  <td className="px-4 sm:px-6 py-6 min-w-[280px] sm:min-w-[320px]">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-12 h-16 sm:w-14 sm:h-20 bg-slate-100 shrink-0 border-2 border-slate-900 overflow-hidden relative">
                        <img
                          src={book.image?.url || 'https://placehold.co/300x450?text=NO+IMAGE'}
                          className="w-full h-full object-cover transition-all duration-500" // Grayscale class removed
                          alt={book.title}
                        />
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <p className="font-black text-slate-900 uppercase tracking-tighter text-xs sm:text-sm leading-tight group-hover:text-[#14D3BC] transition-colors font-heading truncate">
                          {book.title}
                        </p>
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 truncate">
                          <User size={10} className="text-[#14D3BC]"/> {book.author}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ISBN & System Data */}
                  <td className="px-4 sm:px-6 py-6 min-w-[150px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase font-mono">
                        <Hash size={12} className="text-[#14D3BC]" /> {book.isbn || 'NO-ISBN'}
                      </div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 w-fit px-1">
                        CAT: {book.category}
                      </p>
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="px-4 sm:px-6 py-6 text-center">
                    <span className="font-black text-slate-900 text-xs font-mono tracking-tighter">₹{book.price}</span>
                  </td>

                  {/* Quantity Badge */}
                  <td className="px-4 sm:px-6 py-6 text-center min-w-[120px]">
                    <div className={`inline-flex items-center px-2 py-1 font-black text-[8px] sm:text-[9px] uppercase tracking-widest border-2 ${
                      book.quantity > 0 
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30' 
                      : 'border-rose-500 text-rose-600 bg-rose-50/30'
                    }`}>
                      {book.quantity > 0 ? `${book.quantity} IN STOCK` : 'OUT OF STOCK'}
                    </div>
                  </td>

                  {/* CRUD Actions */}
                  <td className="px-4 sm:px-6 py-6">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/edit-Book/${book._id}`)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-900 hover:text-[#14D3BC] transition-all"
                        title="Modify Asset"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(book._id, book.title)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border-2 border-rose-600 bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                        title="Purge Asset"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-32 text-center">
                    <Package size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Inventory Module Empty</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;