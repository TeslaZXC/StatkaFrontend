import React from "react";

const PlayerDetails = ({ player }) => (
  <tr className="bg-zinc-900 border-t border-zinc-700">
    <td colSpan="7" className="p-4">
      <div>
        <h4 className="font-bold text-light mb-2">📌 Kills Detailed:</h4>
        {player.kills_detailed.length === 0 ? (
          <p>Нет убийств</p>
        ) : (
          <ul className="list-disc pl-6">
            {player.kills_detailed.map((k, i) => (
              <li key={i}>{k.time} — {k.target} ({k.distance}) [{k.weapon}]</li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4">
        <h4 className="font-bold text-light">💀 Смерть:</h4>
        {player.death_detailed ? (
          <p>{player.death_detailed.time} — убит {player.death_detailed.target} ({player.death_detailed.distance}) [{player.death_detailed.weapon}]</p>
        ) : (
          <p>Игрок не умер</p>
        )}
      </div>
    </td>
  </tr>
);

export default PlayerDetails;
