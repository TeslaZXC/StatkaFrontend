import React from "react";

const SearchInput = ({ searchTerm, setSearchTerm }) => (
  <div className="mb-4">
    <input
      type="text"
      placeholder="🔍 Поиск по имени..."
      className="p-2 bg-zinc-800 border border-zinc-600 rounded w-full text-white"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);

export default SearchInput;
