import React from "react";

const SquadTopRow = ({ squad, index, onClick }) => {
  const handleClick = () => {
    const url = `/squad-stat/${encodeURIComponent(squad.name)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <tr className="border-t border-zinc-700 hover:bg-zinc-800">
      <td className="p-2 text-zinc-400">{index + 1}</td>
      <td
        className="p-2 font-bold text-accent cursor-pointer"
        onClick={handleClick}
      >
        {squad.name}
      </td>
      <td className="p-2">{squad.frags}</td>
      <td className="p-2">{squad.deaths}</td>
      <td className="p-2">{squad.teamkills}</td>
      <td className="p-2 font-semibold">{squad.kd.toFixed(2)}</td>
    </tr>
  );
};

export default SquadTopRow;
