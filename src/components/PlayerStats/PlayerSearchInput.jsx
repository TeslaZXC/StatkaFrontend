import React from "react";

const PlayerSearchInput = ({ playerName, setPlayerName, handleKeyDown }) => {
  return (
    <input
      type="text"
      placeholder="Введите имя игрока"
      value={playerName}
      onChange={(e) => setPlayerName(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full px-4 py-2 rounded bg-zinc-800 text-light border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent"
    />
  );
};

export default PlayerSearchInput;
