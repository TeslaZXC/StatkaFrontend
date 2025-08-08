import React, { useState } from "react";
import PlayerRow from "./PlayerRow";

const PlayerTable = ({ players, searchTerm, sortField, sortOrder, setSortField, setSortOrder }) => {
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePlayerDetails = (name) => {
    setExpandedPlayer(expandedPlayer === name ? null : name);
  };

  return (
    <table className="min-w-full text-sm text-left border border-zinc-700">
      <thead className="bg-zinc-800">
        <tr>
          <th className="p-2 cursor-pointer" onClick={() => {
            setSortField("name");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}>Name</th>
          <th className="p-2">Squad</th>
          <th className="p-2">Side</th>
          <th className="p-2 cursor-pointer" onClick={() => {
            setSortField("frags");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}>Frags</th>
          <th className="p-2">Teamkills</th>
          <th className="p-2">Vehicle Kills</th>
          <th className="p-2">Kills Detailed</th>
        </tr>
      </thead>
      <tbody>
        {filteredPlayers.map((p, idx) => (
          <PlayerRow
            key={idx}
            player={p}
            expanded={expandedPlayer === p.name}
            onToggle={() => togglePlayerDetails(p.name)}
          />
        ))}
      </tbody>
    </table>
  );
};

export default PlayerTable;
