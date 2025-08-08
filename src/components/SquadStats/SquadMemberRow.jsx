import React from "react";
import { Link } from "react-router-dom";

const SquadMemberRow = ({ player }) => (
  <tr className="border-t border-zinc-700 hover:bg-zinc-800">
    <td className="p-2 text-accent font-medium">
      <Link to={`/player/${player.rawName}`}>{player.fullName}</Link>
    </td>
    <td className="p-2">{player.frags}</td>
    <td className="p-2">{player.deaths}</td>
    <td className="p-2">{player.kd}</td>
  </tr>
);

export default SquadMemberRow;
