import React from "react";

const PlayerStatsTable = ({ playerData }) => {
  const deaths = playerData.deaths_count || 0;
  const frags = playerData.frags || 0;
  const fragInf = playerData.frag_inf || 0;
  const fragVeh = playerData.frag_veh || 0;
  const destroyedVeh = playerData.destroyed_vehicles || 0;
  const missions = playerData.missions_played || 1;

  const kdTotal = deaths > 0 ? (frags / deaths).toFixed(4) : "∞";
  const kdInf = deaths > 0 ? (fragInf / deaths).toFixed(4) : "∞";
  const kdVeh = deaths > 0 ? (fragVeh / deaths).toFixed(4) : "∞";
  const score = (frags / missions).toFixed(2);

  return (
    <table className="min-w-full max-w-xl text-sm text-left border border-zinc-700 mb-6">
      <tbody>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">Фраги:</td>
          <td className="p-2">{frags}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">Фраги пехота:</td>
          <td className="p-2">{fragInf}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">Фраги техника:</td>
          <td className="p-2">{fragVeh}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">Уничтожено техники:</td>
          <td className="p-2">{destroyedVeh}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">Смерти:</td>
          <td className="p-2">{deaths}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">K/D общий:</td>
          <td className="p-2">{kdTotal}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">K/D пехота:</td>
          <td className="p-2">{kdInf}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">K/D техника:</td>
          <td className="p-2">{kdVeh}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">Миссий сыграно:</td>
          <td className="p-2">{missions}</td>
        </tr>
        <tr className="border-b border-zinc-700">
          <td className="p-2 font-semibold">Счёт:</td>
          <td className="p-2">{score}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PlayerStatsTable;
