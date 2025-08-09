import React from "react";

const PlayerStatsTable = ({ playerData }) => (
  <table className="min-w-full max-w-xl text-sm text-left border border-zinc-700 mb-6">
    <tbody>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">Фраги:</td>
        <td className="p-2">{playerData.frags}</td>
      </tr>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">Смерти:</td>
        <td className="p-2">{playerData.deaths_count}</td>
      </tr>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">K/D:</td>
        <td className="p-2">
          {playerData.deaths_count > 0
            ? (playerData.frags / playerData.deaths_count).toFixed(4)
            : "∞"}
        </td>
      </tr>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">Сторона:</td>
        <td className="p-2">{playerData.side || "-"}</td>
      </tr>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">Отряд:</td>
        <td className="p-2">{playerData.group || "-"}</td>
      </tr>
    </tbody>
  </table>
);

export default PlayerStatsTable;
