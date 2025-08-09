import React, { useState } from "react";
import { Link } from "react-router-dom";

const getSquadFromName = (name) => {
  if (!name) return "";

  const tagMatch = name.match(/^\[([^\]]+)\]/);
  if (tagMatch) return tagMatch[1];

  const prefixMatch = name.match(/^([^\s\.]+)[\s\.]/);
  if (prefixMatch) return prefixMatch[1];

  return "";
};

const extractName = (fullName) => {
  return fullName
    .replace(/^\[[^\]]+\]\s*/, "")    // Убираем тег в квадратных скобках в начале, например [LG]
    .replace(/^[^\s\.]+[.\s]+/, ""); // Убираем тег типа DW. или DW в начале
};

const PlayerTable = ({
  players,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  filterField,
  setFilterField,
}) => {
  const [expandedVictims, setExpandedVictims] = useState({});
  const [expandedDeath, setExpandedDeath] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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

  const toggleVictims = (idx) => {
    setExpandedVictims((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleDeath = (idx) => {
    setExpandedDeath((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredPlayers = players
    .filter((p) =>
      p.player_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) => {
      if (!filterField) return true;
      return p[filterField] !== undefined && p[filterField] !== null;
    });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "death") {
      aVal = aVal ? 1 : 0;
      bVal = bVal ? 1 : 0;
    }

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="mt-8 rounded-lg shadow-lg bg-zinc-900/50 p-4 text-light">
      <h3 className="text-xl font-bold mb-3 text-white">Игроки</h3>

      {/* Поле поиска */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Поиск по нику..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-800 text-light focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Фиксированный контейнер с прокруткой */}
      <div className="max-h-[500px] overflow-y-auto border border-zinc-700 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-800 text-light select-none">
            <tr>
              {[
                { field: "player_name", label: "Имя" },
                { field: "side", label: "Сторона" },
                { field: "frags", label: "Фраги" },
                { field: "deaths", label: "Смерти" },
                { field: "teamkills", label: "Тимкиллы" },
                { field: "vehicle_kills", label: "Убийства техники" },
                { field: "death", label: "Death" },
                { field: "victims", label: "Victims" },
                { field: "squad", label: "Отряд" },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className={`cursor-pointer px-3 py-2 border-b border-zinc-700 hover:text-accent ${
                    field === "victims" || field === "death"
                      ? "cursor-default"
                      : ""
                  }`}
                  onClick={() => {
                    if (field === "victims" || field === "death") return;
                    handleSort(field);
                    if (field === "player_name") handleFilter(null);
                    else handleFilter(field);
                  }}
                >
                  {label}{" "}
                  {sortField === field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-4 font-semibold text-white"
                >
                  Нет данных
                </td>
              </tr>
            ) : (
              sortedPlayers.map((player, idx) => {
                const {
                  player_name,
                  side,
                  frags,
                  death,
                  deaths,
                  teamkills,
                  vehicle_kills,
                  victims,
                } = player;

                const deathsCount = deaths ?? (death ? 1 : 0);
                const squadName = getSquadFromName(player_name);

                return (
                  <React.Fragment key={idx}>
                    <tr className="border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer">
                      <td className="px-3 py-2">
                        <Link
                          to={`/player/${encodeURIComponent(
                            extractName(player_name)
                          )}`}
                          target="_blank"
                          className="hover:underline text-white"
                        >
                          {player_name}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{side}</td>
                      <td className="px-3 py-2">{frags}</td>
                      <td className="px-3 py-2">{deathsCount}</td>
                      <td className="px-3 py-2">{teamkills}</td>
                      <td className="px-3 py-2">{vehicle_kills}</td>

                      <td className="px-3 py-2 text-center">
                        {death ? (
                          <button
                            onClick={() => toggleDeath(idx)}
                            className="text-white hover:text-white/80 underline"
                          >
                            {expandedDeath[idx] ? "Скрыть" : "Показать"}
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-3 py-2 text-center">
                        {victims && victims.length > 0 ? (
                          <button
                            onClick={() => toggleVictims(idx)}
                            className="text-white hover:text-white/80 underline"
                          >
                            {expandedVictims[idx] ? "Скрыть" : "Показать"}
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-3 py-2">
                        <a
                          href={`/squad-stat/${encodeURIComponent(squadName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:underline"
                        >
                          {squadName}
                        </a>
                      </td>
                    </tr>

                    {expandedVictims[idx] && victims && victims.length > 0 && (
                      <tr className="bg-zinc-900/60">
                        <td colSpan="9" className="p-3 border-b border-zinc-700">
                          <table className="w-full border-collapse text-sm text-light">
                            <thead>
                              <tr className="bg-zinc-800">
                                <th className="px-2 py-1 border border-zinc-700">
                                  Время
                                </th>
                                <th className="px-2 py-1 border border-zinc-700">
                                  Жертва
                                </th>
                                <th className="px-2 py-1 border border-zinc-700">
                                  Расстояние
                                </th>
                                <th className="px-2 py-1 border border-zinc-700">
                                  Оружие
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {victims.map((v, i) => {
                                const isTK = v.kill_type === "TK";
                                return (
                                  <tr
                                    key={i}
                                    className={`cursor-default ${
                                      isTK
                                        ? "bg-black text-white"
                                        : "hover:bg-zinc-800"
                                    }`}
                                  >
                                    <td className="px-2 py-1 border border-zinc-700">
                                      {v.time}
                                    </td>
                                    <td className="px-2 py-1 border border-zinc-700">
                                      {v.victim_name}{" "}
                                      {isTK && "(тимкил)"}
                                    </td>
                                    <td className="px-2 py-1 border border-zinc-700">
                                      {v.distance}
                                    </td>
                                    <td className="px-2 py-1 border border-zinc-700">
                                      {v.weapon}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}

                    {expandedDeath[idx] && death && (
                      <tr className="bg-zinc-900/60">
                        <td colSpan="9" className="p-3 border-b border-zinc-700">
                          <div>
                            <b>Время:</b> {death.time} <br />
                            <b>Жертва:</b> {death.victim_name} <br />
                            <b>Расстояние:</b> {death.distance} <br />
                            <b>Оружие:</b> {death.weapon} <br />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerTable;
