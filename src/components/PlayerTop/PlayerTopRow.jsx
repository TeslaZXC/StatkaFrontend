import React from "react";

const PlayerTopRow = ({ player, index, onClick }) => (
  <tr
    className="border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer"
    onClick={() => onClick(player.name)}
  >
    <td className="p-2 text-zinc-400">{index + 1}</td>
    <td className="p-2 font-bold text-accent">{player.name}</td>
    <td className="p-2">{player.frags}</td>
    <td className="p-2">{player.deaths}</td>
    <td className="p-2 font-semibold">{player.kd.toFixed(4)}</td>
  </tr>
);

export default PlayerTopRow;
