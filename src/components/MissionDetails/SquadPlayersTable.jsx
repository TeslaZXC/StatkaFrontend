import React from "react";
import Loader from "../Loader";

const SquadPlayersTable = ({ players, loading }) => {
  const sortedPlayers = players ? [...players].sort((a, b) => b.frags - a.frags) : [];

  return (
    <table className="min-w-full border border-zinc-700 text-sm mt-2">
      <thead className="bg-zinc-800 text-white">
        <tr>
          <th className="px-3 py-2 border-b border-zinc-700">Игрок</th>
          <th className="px-3 py-2 border-b border-zinc-700">Фраги</th>
          <th className="px-3 py-2 border-b border-zinc-700">Тимкиллы</th>
          <th className="px-3 py-2 border-b border-zinc-700">Смерти</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="4" className="py-6">
              <Loader />
            </td>
          </tr>
        ) : sortedPlayers.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center py-2 text-accent">
              Нет данных
            </td>
          </tr>
        ) : (
          sortedPlayers.map(({ player_name, frags, teamkills, deaths }) => (
            <tr key={player_name} className="border-t border-zinc-700">
              <td className="px-3 py-2">{player_name}</td>
              <td className="px-3 py-2">{frags}</td>
              <td className="px-3 py-2">{teamkills}</td>
              <td className="px-3 py-2">{deaths}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default SquadPlayersTable;
