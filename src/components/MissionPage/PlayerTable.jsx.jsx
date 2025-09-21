import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PlayerDetail from "./PlayerDetail";
import { cleanPlayerName } from "../../cleanPlayerName";

export default function PlayerTable({ onVictimClick, missionFile, fixedWidth = "1000px" }) {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sortColumn, setSortColumn] = useState("frags");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const detailRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/player-mission-stats?id=${id}`);
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("Ошибка загрузки игроков:", err);
      }
    };
    fetchPlayers();
  }, [API_BASE_URL, id]);

  const capitalize = (str) =>
    str
      ? str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "";

  const handleSortOrFilter = (column) => {
    if (
      ["frags", "death", "tk", "frags_veh", "frags_inf", "destroyed_veh"].includes(column)
    ) {
      if (sortColumn === column) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortOrder("desc");
      }
    }
    setFilter(filter === column ? "all" : column);
  };

  const resetSort = () => {
    setSortColumn("frags");
    setSortOrder("desc");
    setFilter("all");
    setSearch("");
  };

  const filteredPlayers = players.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "all") return true;
    if (filter === "frags") return p.frags > 0;
    if (filter === "death") return p.death > 0;
    if (filter === "tk") return p.tk > 0;
    if (filter === "frags_inf") return p.frags_inf > 0;
    if (filter === "frags_veh") return p.frags_veh > 0;
    if (filter === "destroyed_veh") return p.destroyed_veh > 0;
    return true;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (valA === valB) return 0;
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const handlePlayerClick = (nick) => {
    const cleanName = cleanPlayerName(nick);
    if (cleanName) {
      window.open(`/player/${encodeURIComponent(cleanName)}`, "_blank");
    }
  };

  return (
    <div className="space-y-4 relative" style={{ width: fixedWidth }}>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-2 py-1 text-sm rounded bg-brand-gray text-brand-light border border-brand-muted w-full"
        />
        <button
          className="px-2 py-1 bg-brand-red text-brand-light rounded text-xs font-bold hover:bg-red-700 transition-colors"
          onClick={resetSort}
          title="Сбросить"
        >
          ×
        </button>
      </div>

      <div className="rounded-lg border border-brand-gray h-[400px] overflow-x-auto w-full">
        <table className="min-w-[900px] w-full text-sm text-brand-light border-collapse">
          <thead className="sticky top-0 bg-brand-gray z-10">
            <tr className="text-left text-brand-muted border-b border-brand-gray">
              <th className="px-2 py-1">Игрок</th>
              <th className="px-2 py-1">Отряд</th>
              <th className="px-2 py-1">Сторона</th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSortOrFilter("frags")}
              >
                Фраги {sortColumn === "frags" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSortOrFilter("frags_inf")}
              >
                Фраги инф {sortColumn === "frags_inf" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSortOrFilter("frags_veh")}
              >
                Фраги тех {sortColumn === "frags_veh" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSortOrFilter("death")}
              >
                Смерти {sortColumn === "death" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSortOrFilter("tk")}
              >
                TK {sortColumn === "tk" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSortOrFilter("destroyed_veh")}
              >
                Ун. тех {sortColumn === "destroyed_veh" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => (
              <tr
                key={player.id}
                className="border-b border-brand-gray hover:bg-brand-gray/70 cursor-pointer"
              >
                <td
                  className="px-2 py-1 font-semibold text-brand-blue hover:underline"
                  onClick={() => handlePlayerClick(player.name)}
                >
                  {capitalize(player.name)}
                </td>
                <td className="px-2 py-1">{capitalize(player.squad)}</td>
                <td className="px-2 py-1">{capitalize(player.side)}</td>
                <td className="px-2 py-1">{player.frags}</td>
                <td className="px-2 py-1">{player.frags_inf}</td>
                <td className="px-2 py-1">{player.frags_veh}</td>
                <td className="px-2 py-1">{player.death}</td>
                <td className="px-2 py-1">{player.tk}</td>
                <td className="px-2 py-1">{player.destroyed_veh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedPlayer && missionFile && (
          <motion.div
            ref={detailRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <PlayerDetail
              player={selectedPlayer}
              missionFile={missionFile}
              onVictimClick={onVictimClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
