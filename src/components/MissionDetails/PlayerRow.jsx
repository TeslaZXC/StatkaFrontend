import React from "react";
import { Link } from "react-router-dom";
import PlayerDetails from "./PlayerDetails";

const getSideColor = (side) => {
  switch (side) {
    case "EAST": return "text-blue-400";
    case "WEST": return "text-red-400";
    case "GUER": return "text-green-400";
    default: return "text-white";
  }
};

const extractName = (fullName) => {
  const match = fullName.match(/(?:[\]\. ]+)([^ ]+)$/);
  return match ? match[1] : fullName;
};

const PlayerRow = ({ player, expanded, onToggle }) => (
  <>
    <tr className="border-t border-zinc-700">
      <td className={`p-2 font-bold ${getSideColor(player.side)}`}>
        <Link to={`/player/${extractName(player.name)}`}>{player.name}</Link>
      </td>
      <td className="p-2">
        {player.squad ? (
          <Link to={`/squad-stat/${encodeURIComponent(player.squad)}`} className="hover:underline">
            {player.squad}
          </Link>
        ) : "-"}
      </td>
      <td className={`p-2 font-semibold ${getSideColor(player.side)}`}>{player.side}</td>
      <td className="p-2">{player.frags}</td>
      <td className="p-2">{player.teamkills}</td>
      <td className="p-2">{player.vehicle_kills}</td>
      <td className="p-2">
        <button className="text-blue-400 underline" onClick={onToggle}>
          {expanded ? "Скрыть" : "Показать"}
        </button>
      </td>
    </tr>
    {expanded && <PlayerDetails player={player} />}
  </>
);

export default PlayerRow;
