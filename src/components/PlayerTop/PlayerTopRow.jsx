import React from "react";

const PlayerTopRow = ({ player, index, onClick }) => {
  let placeBg = "";
  if (index === 0) placeBg = "bg-yellow-500/20";
  else if (index === 1) placeBg = "bg-gray-400/20";
  else if (index === 2) placeBg = "bg-amber-700/20";

  return (
    <tr
      className={`border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer ${placeBg}`}
      onClick={() => onClick(player.name)}
    >
      <td className="p-2 text-zinc-400">{index + 1}</td>
      <td className="p-2 font-bold text-white">{player.name}</td>
      <td className="p-2 text-white">{player.frags}</td>
      <td className="p-2 text-white">{player.deaths}</td>
      <td className="p-2 font-semibold text-white">{player.kd.toFixed(2)}</td>
      <td className="p-2 font-semibold text-white">{player.score.toFixed(2)}</td>
      <td className="p-2 text-white">{player.destroyed_vehicles}</td>
    </tr>
  );
};

export default PlayerTopRow;
