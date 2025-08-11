import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PlayerSearchInput from "../components/PlayerStats/PlayerSearchInput";
import SuggestionList from "../components/PlayerStats/SuggestionList";
import SeasonSelect from "../components/SeasonSelect";

const PlayerStats = () => {
  const [playerName, setPlayerName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSeasonFile, setSelectedSeasonFile] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (playerName.trim() && selectedSeasonFile) {
      const seasonQuery = `?file_name=${encodeURIComponent(selectedSeasonFile)}`;
      navigate(`/player/${encodeURIComponent(playerName.trim())}${seasonQuery}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && selectedSeasonFile) {
      handleSearch();
    }
  };

  const handleSuggestionClick = (name) => {
    if (!selectedSeasonFile) return; // защита на всякий случай
    const seasonQuery = `?file_name=${encodeURIComponent(selectedSeasonFile)}`;
    navigate(`/player/${encodeURIComponent(name)}${seasonQuery}`);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (playerName.length > 1 && selectedSeasonFile) {
        let url = `http://147.45.219.240:8000/api/player-search/${encodeURIComponent(playerName)}`;
        url += `?file_name=${encodeURIComponent(selectedSeasonFile)}`;

        axios
          .get(url)
          .then((res) => {
            setSuggestions(res.data.slice(0, 5));
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [playerName, selectedSeasonFile]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 relative">
      <h2 className="text-2xl font-bold text-accent mb-4">🔍 Поиск игрока</h2>

      <SeasonSelect onSelect={setSelectedSeasonFile} />

      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md relative mt-4">
        <div className="w-full relative">
          <PlayerSearchInput
            playerName={playerName}
            setPlayerName={setPlayerName}
            handleKeyDown={handleKeyDown}
            disabled={!selectedSeasonFile}  // Заблокировать если сезон не выбран
          />
          <SuggestionList
            suggestions={suggestions}
            onSelect={handleSuggestionClick}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!selectedSeasonFile}  // Заблокировать кнопку если сезон не выбран
          className={`px-4 py-2 rounded bg-accent text-white hover:bg-opacity-90 ${
            !selectedSeasonFile ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Поиск
        </button>
      </div>
    </div>
  );
};

export default PlayerStats;
