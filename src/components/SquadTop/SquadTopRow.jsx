import React from "react";

const SquadTopRow = ({ squad, index, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(squad.name);
    }
  };

  let placeBg = "";
  if (index === 0) placeBg = "bg-yellow-500/20";
  else if (index === 1) placeBg = "bg-gray-400/20";
  else if (index === 2) placeBg = "bg-amber-700/20";

  return (
    <tr className={`border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer ${placeBg}`}>
      <td className="p-2 text-zinc-400">{index + 1}</td>
      <td className="p-2 font-bold text-accent" onClick={handleClick}>
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

