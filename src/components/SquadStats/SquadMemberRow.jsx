import React from "react";
import { useNavigate } from "react-router-dom";

const SquadMemberRow = ({ player, fileName }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (!fileName) return;
    navigate(
      `/player/${encodeURIComponent(player.fullName)}?file_name=${encodeURIComponent(fileName)}`
    );
  };

  return (
    <tr
      className="border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer"
      onClick={handleClick}
    >
      <td className="p-2 text-accent font-medium">
        <span className="hover:underline">{player.fullName}</span>
      </td>
      <td className="p-2">{player.frags}</td>
      <td className="p-2">{player.deaths}</td>
      <td className="p-2">{player.kd}</td>
    </tr>
  );
};

export default SquadMemberRow;
