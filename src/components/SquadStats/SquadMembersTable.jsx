import React from "react";
import SquadMemberRow from "./SquadMemberRow";

const SquadMembersTable = ({ players }) => (
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
      {players.map((p, idx) => (
        <SquadMemberRow key={idx} player={p} />
      ))}
    </tbody>
  </table>
);

export default SquadMembersTable;
