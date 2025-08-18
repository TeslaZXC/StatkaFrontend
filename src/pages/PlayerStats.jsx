import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PlayerSearchInput from "../components/PlayerStats/PlayerSearchInput";
import SuggestionList from "../components/PlayerStats/SuggestionList";
import SeasonSelect from "../components/SeasonSelect";

const PlayerStats = () => {
  const [playerName, setPlayerName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSearch = () => {
  if (playerName.trim() && selectedSeasonId) {
    navigate(`/player/${selectedSeasonId}/${encodeURIComponent(playerName.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && selectedSeasonId) {
      handleSearch();
    }
  };

  const handleSuggestionClick = (name) => {
    if (!selectedSeasonId) return;
    navigate(`/player/${selectedSeasonId}/${encodeURIComponent(name)}`);
  };
  useEffect(() => {
    if (!playerName || playerName.length <= 0 || !selectedSeasonId) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(() => {
      axios
        .get("http://147.45.219.240:8000/api/player-search", {
          params: {
            id: selectedSeasonId,
            player_name: playerName
          }
        })
        .then((res) => {
          setSuggestions(res.data.slice(0, 5));
          setLoading(false);
        })
        .catch(() => {
          setSuggestions([]);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [playerName, selectedSeasonId]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🔍 Поиск игрока</h2>

      <SeasonSelect onSelect={setSelectedSeasonId} />

      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md mt-4">
        <div className="w-full">
          <PlayerSearchInput
            playerName={playerName}
            setPlayerName={setPlayerName}
            handleKeyDown={handleKeyDown}
            disabled={!selectedSeasonId}
          />
          <SuggestionList
            suggestions={suggestions}
            loading={loading}
            onSelect={handleSuggestionClick}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!selectedSeasonId}
          className={`px-4 py-2 rounded bg-accent text-white hover:bg-opacity-90 ${
            !selectedSeasonId ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Поиск
        </button>
      </div>
    </div>
  );
};

export default PlayerStats;
