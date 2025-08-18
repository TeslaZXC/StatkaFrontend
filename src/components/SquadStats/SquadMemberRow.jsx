import React from "react";

const SquadMemberRow = ({ player, fileName }) => {
  const playerUrl = `/player/${encodeURIComponent(fileName)}/${encodeURIComponent(player.fullName)}`;

  return (
    <tr className="border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer">
      <td className="p-2 text-accent font-medium">
        <a
          href={playerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {player.fullName}
        </a>
      </td>
      <td className="p-2">{player.frags}</td>
      <td className="p-2">{player.deaths}</td>
      <td className="p-2">{player.kd}</td>
    </tr>
  );
};

export default SquadMemberRow;
