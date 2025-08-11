import React from "react";

const SquadTopRow = ({ squad, index }) => {
  const handleClick = () => {
    const url = `/squad-stat/${encodeURIComponent(squad.name)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  let placeBg = "";
  if (index === 0) placeBg = "bg-yellow-500/20"; // золото
  else if (index === 1) placeBg = "bg-gray-400/20"; // серебро
  else if (index === 2) placeBg = "bg-amber-700/20"; // бронза

  return (
    <tr className={`border-t border-zinc-700 hover:bg-zinc-800 ${placeBg}`}>
      <td className="p-2 text-zinc-400">{index + 1}</td>
      <td
        className="p-2 font-bold text-accent cursor-pointer"
        onClick={handleClick}
      >
        {squad.name}
      </td>
      <td className="p-2 text-white">{squad.frags}</td>
      <td className="p-2 text-white">{squad.deaths}</td>
      <td className="p-2 text-white">{squad.teamkills}</td>
      <td className="p-2 font-semibold text-white">{squad.kd.toFixed(2)}</td>
    </tr>
  );
};

export default SquadTopRow;
