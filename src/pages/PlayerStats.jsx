import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlayerStats = () => {
  const [playerName, setPlayerName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (playerName.trim()) {
      navigate(`/player/${encodeURIComponent(playerName.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (name) => {
    navigate(`/player/${encodeURIComponent(name)}`);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (playerName.length > 1) {
        axios
          .get(`https://restfully-winsome-malamute.cloudpub.ru/api/player-search/${encodeURIComponent(playerName)}`)
          .then((res) => {
            setSuggestions(res.data.slice(0, 5)); // не больше 5
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce: 300ms

    return () => clearTimeout(delayDebounce);
  }, [playerName]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 relative">
      <h2 className="text-2xl font-bold text-accent mb-4">🔍 Поиск игрока</h2>
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md relative">
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Введите имя игрока"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-light border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-zinc-800 border border-zinc-600 rounded mt-1 max-h-40 overflow-y-auto">
              {suggestions.map((name, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(name)}
                  className="px-4 py-2 cursor-pointer hover:bg-zinc-700 text-light text-sm"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded bg-accent text-white hover:bg-opacity-90"
        >
          Поиск
        </button>
      </div>
    </div>
  );
};

export default PlayerStats;
