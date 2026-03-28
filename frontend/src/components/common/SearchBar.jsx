import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch, placeholder = "Search by book or author..." }) => {
  const [query, setQuery] = useState("");

  // Debouncing logic: Jab user typing rok dega tabhi search trigger hoga
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      onSearch(query);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400 group-focus-within:text-black transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-all"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;