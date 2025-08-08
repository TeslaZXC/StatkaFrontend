import { Link } from "react-router-dom";
import React, { useState } from "react";

const PlayerStatsTable = ({ playerData }) => (
  <table className="min-w-full max-w-xl text-sm text-left border border-zinc-700 mb-6">
    <tbody>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">Фраги:</td>
        <td className="p-2">{playerData.frags}</td>
      </tr>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">Смерти:</td>
        <td className="p-2">{playerData.deaths}</td>
      </tr>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">K/D:</td>
        <td className="p-2">
          {playerData.deaths > 0
            ? (playerData.frags / playerData.deaths).toFixed(4)
            : "∞"}
        </td>
      </tr>
      <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">Отряд:</td>
        <td className="p-2">
          {playerData.squad ? (
            <Link
              to={`/squad-stat/${encodeURIComponent(playerData.squad)}`}
              className="text-inherit hover:underline"
            >
              {playerData.squad}
            </Link>
          ) : "-"}
        </td>
      </tr>
    </tbody>
  </table>
);

export default PlayerStatsTable;
