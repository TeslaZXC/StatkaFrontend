import React from "react";
import Loader from "../Loader";

const SuggestionList = ({ suggestions, loading, onSelect }) => {
  if (!loading && suggestions.length === 0) return null;

  return (
    <div className="w-full mt-1 bg-zinc-800 border border-zinc-600 rounded max-h-40 overflow-y-auto">
      {loading && (
        <div className="flex items-center justify-center p-2">
          <Loader />
        </div>
      )}
      {!loading && suggestions.map((name, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(name)}
          className="px-4 py-2 cursor-pointer hover:bg-zinc-700 text-light text-sm"
        >
          {name}
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;
