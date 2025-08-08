import React from "react";
import { Link } from "react-router-dom";

const getSideColor = (side) => {
  switch (side) {
    case "EAST":
      return "text-blue-400";
    case "WEST":
      return "text-red-400";
    case "GUER":
      return "text-green-400";
    default:
      return "text-white";
  }
};

const SquadTable = ({ title = "", side, data, sortField, sortOrder, setSortField, setSortOrder }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-accent mb-2">{title || `${side} Side`}</h3>
      <table className="min-w-full text-sm text-left border border-zinc-700">
        <thead className="bg-zinc-800">
          <tr>
            {["squad", "frags", "deaths", "players"].map((key) => (
              <th
                key={key}
                className="p-2 cursor-pointer"
                onClick={() => {
                  setSortField(key);
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                {key[0].toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.filter(s => s.side === side).map((s, idx) => (
            <tr key={`squad-${idx}`} className="border-t border-zinc-700">
              <td className={`p-2 font-bold ${getSideColor(s.side)}`}>
                <Link to={`/squad-stat/${encodeURIComponent(s.squad)}`} className="hover:underline">
                  {s.squad}
                </Link>
              </td>
              <td className="p-2">{s.frags}</td>
              <td className="p-2">{s.deaths}</td>
              <td className="p-2">{s.players}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SquadTable;
