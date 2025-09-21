import React from "react";
import { cleanPlayerName } from "../../cleanPlayerName";

export default function PlayerDetail({ player, missionFile, onVictimClick }) {
  if (!player) return null;

  const handleVictimClick = (entity) => {
    if (onVictimClick) onVictimClick(entity);
  };

  const openPlayerPage = (nick) => {
    const cleanName = cleanPlayerName(nick);
    if (cleanName) {
      window.open(`/player/${encodeURIComponent(cleanName)}`, "_blank");
    }
  };

  const capitalize = (str) =>
    str
      ? str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "";

  const formatPlayerName = (name, tag = "") => {
    const formattedTag = tag ? `[${tag.toUpperCase()}] ` : "";
    return (
      <span className="font-semibold">
        {formattedTag}
        {capitalize(name)}
      </span>
    );
  };

  return (
    <div className="p-4 bg-brand-black/40 rounded-lg space-y-4">
      <h3 className="text-lg font-bold text-brand-light mb-2">
        <span
          className="cursor-pointer hover:underline text-brand-blue"
          onClick={() => openPlayerPage(player.name)}
        >
          {formatPlayerName(player.name, player.squad)}
        </span>{" "}
        — детали
      </h3>

      {player.victims_players?.length > 0 && (
        <table className="w-full text-xs text-brand-light border-collapse">
          <thead>
            <tr className="border-b border-brand-gray text-left">
              <th className="px-2 py-1">Имя</th>
              <th className="px-2 py-1">Оружие</th>
              <th className="px-2 py-1">Дистанция</th>
              <th className="px-2 py-1">Тип</th>
              <th className="px-2 py-1">Время</th>
            </tr>
          </thead>
          <tbody>
            {player.victims_players.map((v, i) => (
              <tr
                key={i}
                className="cursor-pointer border-b border-brand-gray/50 hover:bg-brand-gray/70"
                onClick={() => handleVictimClick(v)}
              >
                <td
                  className="px-2 py-1 font-semibold text-brand-blue hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPlayerPage(v.name);
                  }}
                >
                  {v.tag ? `[${v.tag.toUpperCase()}] ` : ""}
                  {capitalize(v.name)}
                </td>
                <td className="px-2 py-1">{capitalize(v.weapon)}</td>
                <td className="px-2 py-1">{v.distance} м</td>
                <td className="px-2 py-1">{capitalize(v.kill_type)}</td>
                <td className="px-2 py-1">{Number(v.time).toFixed(2)} мин</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {player.destroyed_vehicles?.length > 0 && (
        <table className="w-full text-xs text-brand-light border-collapse">
          <thead>
            <tr className="border-b border-brand-gray text-left">
              <th className="px-2 py-1">Название</th>
              <th className="px-2 py-1">Тип</th>
              <th className="px-2 py-1">Оружие</th>
              <th className="px-2 py-1">Дистанция</th>
              <th className="px-2 py-1">Время</th>
            </tr>
          </thead>
          <tbody>
            {player.destroyed_vehicles.map((veh, i) => (
              <tr
                key={i}
                className="cursor-pointer border-b border-brand-gray/50 hover:bg-brand-gray/70"
                onClick={() => handleVictimClick(veh)}
              >
                <td className="px-2 py-1">{capitalize(veh.name)}</td>
                <td className="px-2 py-1">{capitalize(veh.veh_type)}</td>
                <td className="px-2 py-1">{capitalize(veh.weapon)}</td>
                <td className="px-2 py-1">{veh.distance} м</td>
                <td className="px-2 py-1">{Number(veh.time).toFixed(2)} мин</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
