import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit3, Search, PackageOpen } from "lucide-react";
import toast from "react-hot-toast";
import bookService from "../../services/bookServices";
import Loader from "../../components/common/Loader";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      if (data?.success) {
        setBooks(data.books);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Performance Optimization: Only re-filter when books or searchTerm changes
  const filteredBooks = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return books;
    
    return books.filter((b) =>
      b.title?.toLowerCase().includes(term) ||
      b.author?.toLowerCase().includes(term) ||
      b.isbn?.toLowerCase().includes(term)
    );
  }, [books, searchTerm]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    const loadingToast = toast.loading("Deleting book...");
    try {
      const data = await bookService.deleteBook(id);
      if (data.success) {
        toast.success("Book removed from inventory", { id: loadingToast });
        setBooks((prev) => prev.filter((book) => book._id !== id));
      }
    } catch (error) {
      toast.error("Delete failed. Please try again.", { id: loadingToast });
    }
  };

  if (loading) return <Loader fullScreen={true} message="Syncing Inventory..." />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory</h1>
          <p className="text-slate-500 mt-1">Total Books: {books.length}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => navigate("/admin/add-book")}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-sm shadow-teal-200 transition-all active:scale-95"
          >
            <Plus size={20} /> Add New Book
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <PackageOpen size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No books found</h3>
          <p className="text-slate-500">Try adjusting your search or add a new entry.</p>
        </div>
      ) : (
        <>
          {/* MOBILE CARDS (Visible only on small screens) */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {filteredBooks.map((book) => (
              <div key={book._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex gap-4">
                  <img
                    src={book.image?.url || "https://placehold.co/300x450?text=No+Cover"}
                    className="w-20 h-28 object-cover rounded-lg shadow-sm"
                    alt={book.title}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-slate-500">{book.author}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-teal-700">₹{book.price}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                        book.quantity > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                        {book.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => navigate(`/admin/edit-Book/${book._id}`)}
                    className="flex-1 flex justify-center items-center py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(book._id, book.title)}
                    className="flex-1 flex justify-center items-center py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">Book Details</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">ISBN</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider text-center">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider text-center">Inventory</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={book.image?.url || "https://placehold.co/300x450"}
                          className="w-12 h-16 object-cover rounded shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{book.title}</p>
                          <p className="text-xs text-slate-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">
                      {book.isbn || "—"}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-900">
                      ₹{book.price}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        book.quantity > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {book.quantity > 0 ? `${book.quantity} in stock` : "Sold Out"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/edit-Book/${book._id}`)}
                          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                          title="Edit Book"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id, book.title)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Book"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBooks;