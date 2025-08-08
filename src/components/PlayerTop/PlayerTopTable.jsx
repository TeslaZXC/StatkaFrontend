import React from "react";
import PlayerTopHeader from "./PlayerTopHeader";
import PlayerTopRow from "./PlayerTopRow";

const PlayerTopTable = ({ data, onSort, onPlayerClick }) => (
  <table className="min-w-full text-sm text-left border border-zinc-700">
    <PlayerTopHeader onSort={onSort} />
    <tbody>
      {data.map((player, index) => (
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

export default PlayerTopTable;
