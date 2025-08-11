import React, { useState } from "react";
import axios from "axios";
import SquadPlayersTable from "./SquadPlayersTable";

const BASE_URL = "http://localhost:8000";

const SquadTable = ({
  title,
  side,
  data,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  filterField,
  setFilterField,
  missionId
}) => {
  const [expandedSquads, setExpandedSquads] = useState([]);
  const [playersBySquad, setPlayersBySquad] = useState({});

  const squads = data.filter((s) => s.side.toLowerCase() === side.toLowerCase());

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleFilter = (field) => {
    if (filterField === field) {
      setFilterField(null);
    } else {
      setFilterField(field);
    }
  };

  const toggleSquad = async (squadTag) => {
    if (expandedSquads.includes(squadTag)) {
      setExpandedSquads(expandedSquads.filter((tag) => tag !== squadTag));
    } else {
      if (!playersBySquad[squadTag]) {
        try {
          const res = await axios.get(`${BASE_URL}/api/mission_squad_player_stat`, {
            params: { mission_id: missionId, squad_tag: squadTag }
          });
          setPlayersBySquad((prev) => ({
            ...prev,
            [squadTag]: res.data || []
          }));
        } catch (err) {
          console.error("Ошибка загрузки игроков отряда:", err);
        }
      }
      setExpandedSquads((prev) => [...prev, squadTag]);
    }
  };

  const sideTextColors = {
    west: "text-blue-400",
    east: "text-red-400",
    guer: "text-green-400",
  };

  const textColorClass = sideTextColors[side.toLowerCase()] || "text-white";

  return (
    <div className="mt-8 rounded-lg shadow-lg bg-zinc-900/50 p-4 overflow-x-auto text-white">
      <h3 className={`text-xl font-bold mb-3 ${textColorClass}`}>{title}</h3>
      <table className="min-w-full border border-zinc-700 text-sm">
        <thead className="bg-zinc-800 text-white select-none">
          <tr>
            {["squadName", "frags", "deaths", "teamkills"].map((field) => {
              let label =
                field === "squadName"
                  ? "Отряд"
                  : field === "frags"
                  ? "Фраги"
                  : field === "deaths"
                  ? "Смерти"
                  : "Тимкиллы";

              return (
                <th
                  key={field}
                  className="cursor-pointer px-3 py-2 border-b border-zinc-700 hover:text-accent"
                  onClick={() => {
                    handleSort(field);
                    if (field === "squadName") handleFilter(null);
                    else handleFilter(field);
                  }}
                >
                  {label}{" "}
                  {sortField === field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {squads.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 font-semibold text-accent">
                Нет данных
              </td>
            </tr>
          ) : (
            squads.map(({ squadName, frags, deaths, teamkills, side: squadSide }) => {
              const squadColor = sideTextColors[squadSide.toLowerCase()] || "text-white";
              const isExpanded = expandedSquads.includes(squadName);
              return (
                <React.Fragment key={squadName}>
                  <tr
                    className={`border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer ${squadColor}`}
                    onClick={() => toggleSquad(squadName)}
                  >
                    <td className="px-3 py-2">{squadName}</td>
                    <td className="px-3 py-2">{frags}</td>
                    <td className="px-3 py-2">{deaths}</td>
                    <td className="px-3 py-2">{teamkills}</td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan="4" className="bg-zinc-900/80 p-2">
                        <SquadPlayersTable players={playersBySquad[squadName] || []} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>

      {filterField && (
        <div className="mt-2 text-sm text-accent">
          Фильтр по полю: <b>{filterField}</b> (кликните по заголовку чтобы сбросить)
        </div>
      )}
    </div>
  );
};

export default SquadTable;
