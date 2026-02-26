// src/components/Student/BookCard.jsx
const BookCard = ({ book }) => {
  return (
    <div className="modern-card p-4 flex flex-col gap-4 group transition-all hover:-translate-y-1">
      {/* Book Image Wrapper */}
      <div className="h-40 bg-brand-secondary rounded-xl overflow-hidden relative">
        <img src={book.image} alt={book.title} className="w-full h-full object-contain p-2" />
        <span className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold">
          ₹{book.price}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-[#1B2559] truncate">{book.title}</h3>
        <p className="text-xs text-brand-accent italic">By {book.author}</p>
      </div>

      <div className="flex gap-2 mt-2">
        <button className="flex-1 bg-brand-primary text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 active:scale-95 transition">
          Issue Book
        </button>
        <button className="px-3 border border-gray-100 rounded-xl text-brand-accent hover:bg-gray-50 transition">
          Details
        </button>
      </div>
    </div>
  );
};