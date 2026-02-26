// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/students/Sidebar';
import bookService from '../../services/bookServices'; // API calls ke liye service
import { Search, Bell, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentDashboard = () => {
  const [books, setBooks] = useState([]); // Database se aane wali books
  const [loading, setLoading] = useState(true);

  // Database se books fetch karne ka function
  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      if (data.success) {
        setBooks(data.books);
      }
    } catch (err) {
      toast.error("Books load nahi ho paayi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Book Issue karne ka logic
  const handleIssueRequest = async (bookId) => {
    try {
      const data = await bookService.issueBook(bookId);
      if (data.success) {
        toast.success("Issue request sent to admin!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex bg-brand-bg min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search your favourite books" 
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white outline-none shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-gray-400" />
            <div className="flex items-center gap-2 bg-white p-2 pr-4 rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition">
              <img src="https://ui-avatars.com/api/?name=Balogun" className="w-8 h-8 rounded-full" alt="profile" />
              <span className="font-bold text-sm text-brand-navy">Balogun</span>
            </div>
          </div>
        </header>

        {/* Recommended Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-brand-navy">Recommended</h2>
            <button className="text-brand-blue font-bold text-sm hover:underline">See All &gt;</button>
          </div>
          
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-brand-blue" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book._id} className="bg-white p-4 rounded-modern shadow-sm hover:shadow-md transition group">
                  <div className="bg-gray-100 h-64 rounded-xl mb-4 overflow-hidden relative">
                    <img 
                      src={book.image || `https://placehold.co/200x300?text=${book.title}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      alt={book.title}
                    />
                  </div>
                  <h3 className="font-bold text-brand-navy truncate">{book.title}</h3>
                  <p className="text-gray-400 text-xs mb-4">By {book.author}</p>
                  
                  {/* Black Rounded Button Logic */}
                  <button 
                    onClick={() => handleIssueRequest(book._id)}
                    className="w-full bg-black text-white py-3 rounded-full font-bold text-sm active:scale-95 transition-all shadow-lg hover:bg-gray-800"
                  >
                    Issue Book
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Categories</h2>
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {['All', 'Sci-Fi', 'Fantasy', 'Drama', 'Finance', 'Self-Help'].map((cat) => (
              <button 
                key={cat} 
                className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  cat === 'All' 
                    ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' 
                    : 'bg-white text-gray-400 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;