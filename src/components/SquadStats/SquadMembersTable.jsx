import React from "react";
import SquadMemberRow from "./SquadMemberRow";

const SquadMembersTable = ({ players, fileName }) => (
  <table className="min-w-full text-sm border border-zinc-700">
    <thead className="bg-zinc-800">
      <tr>
        <th className="p-2">Игрок</th>
        <th className="p-2">Фраги</th>
        <th className="p-2">Смерти</th>
        <th className="p-2">K/D</th>
      </tr>
    </thead>
    <tbody>
      {players.map((player, idx) => (
        <SquadMemberRow key={idx} player={player} fileName={fileName} />
      ))}
    </tbody>
  </table>
);

export default SquadMembersTable;
