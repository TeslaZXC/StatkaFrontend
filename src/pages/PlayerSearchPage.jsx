import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayerSearchPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchSuggestions = async (name) => {
    if (!name) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/player-search?player_name=${encodeURIComponent(
          name
        )}&start_date=2020_01_01&end_date=2099_01_01`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Ошибка поиска игроков:", err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(query), 300); 
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearch = (name) => {
    if (!name) return;
    navigate(`/player/${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-20 px-4">
      <h2 className="text-3xl font-bold mb-6 text-brand-red">Поиск игрока</h2>

      <div className="w-full max-w-md relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите ник игрока..."
          className="w-full px-4 py-2 rounded-lg bg-brand-gray/80 text-brand-light border border-brand-muted focus:ring-2 focus:ring-brand-red placeholder:text-brand-muted transition-colors"
        />

        <button
          onClick={() => handleSearch(query)}
          className="mt-2 w-full bg-brand-red text-brand-light py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Найти
        </button>

        {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 min-w-full bg-brand-gray/90 border border-brand-muted rounded-lg mt-1 max-h-60 overflow-y-auto z-20">
            {suggestions.map((playerName) => (
            <li
                key={playerName}
                onClick={() => handleSearch(playerName)}
                className="px-4 py-2 cursor-pointer hover:bg-brand-gray/70 text-brand-light font-medium"
            >
                {playerName}
            </li>
            ))}
        </ul>
        )}

      </div>
    </div>
  );
}
