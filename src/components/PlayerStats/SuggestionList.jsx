import React from "react";

const SuggestionList = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <ul className="absolute z-10 w-full bg-zinc-800 border border-zinc-600 rounded mt-1 max-h-40 overflow-y-auto">
      {suggestions.map((name, idx) => (
        <li
          key={idx}
          onClick={() => onSelect(name)}
          className="px-4 py-2 cursor-pointer hover:bg-zinc-700 text-light text-sm"
        >
          {name}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
