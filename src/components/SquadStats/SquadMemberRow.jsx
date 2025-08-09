import React from "react";

const SquadMemberRow = ({ player }) => (
  <tr className="border-t border-zinc-700 hover:bg-zinc-800">
    <td className="p-2 text-accent font-medium">
      <a
        href={`/player/${player.rawName}`}
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

export default SquadMemberRow;
