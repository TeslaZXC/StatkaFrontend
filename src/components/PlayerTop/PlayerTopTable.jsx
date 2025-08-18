import React, { useState, useEffect } from "react";
import PlayerTopHeader from "./PlayerTopHeader";
import PlayerTopRow from "./PlayerTopRow";

const PlayerTopTable = ({ data, onSort, onPlayerClick }) => {
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    // Сортировка по score от большего к меньшему по умолчанию
    setSortedData([...data].sort((a, b) => b.score - a.score));
  }, [data]);

  return (
    <table className="min-w-full text-sm text-left border border-zinc-700">
      <PlayerTopHeader
        onSort={(field) => {
          const sorted = [...sortedData].sort((a, b) => {
            if (field === "name") return a.name.localeCompare(b.name);
            return b[field] - a[field]; // сортировка по числовым полям
          });
          setSortedData(sorted);
          if (onSort) onSort(field);
        }}
      />
      <tbody>
        {sortedData.map((player, index) => (
          <PlayerTopRow
            key={`player-${index}`}
            player={player}
            index={index}
            onClick={onPlayerClick}
          />
        ))}
      </tbody>
    </table>
  );
};

export default PlayerTopTable;
