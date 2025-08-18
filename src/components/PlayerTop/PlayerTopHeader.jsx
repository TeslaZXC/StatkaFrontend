import React from "react";

const PlayerTopHeader = ({ onSort }) => (
  <thead className="bg-zinc-800 text-light">
    <tr>
      <th className="p-2">#</th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("name")}>
        Игрок
      </th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("frags")}>
        Frags
      </th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("deaths")}>
        Deaths
      </th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("kd")}>
        K/D
      </th>
      <th className="p-2 cursor-pointer" onClick={() => onSort("score")}>
        Score
      </th>
      <th
        className="p-2 cursor-pointer"
        onClick={() => onSort("destroyed_vehicles")}
      >
        Destroyed Vehicles
      </th>
    </tr>
  </thead>
);

export default PlayerTopHeader;
