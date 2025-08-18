import React from "react";

const SquadTopHeader = ({ onSort }) => (
  <thead className="bg-zinc-800 text-light">
    <tr>
      <th className="p-2">#</th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("name")}>Отряд</th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("frags")}>Frags</th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("deaths")}>Deaths</th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("teamkills")}>Teamkills</th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("kd")}>K/D</th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("score")}>Score</th>
    </tr>
  </thead>
);

export default SquadTopHeader;
