import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import SquadDetail from "./SquadDetail";

export default function SquadTable({ squads, onVictimClick }) {
  const [expandedSquad, setExpandedSquad] = useState(null);
  const [sortColumn, setSortColumn] = useState("frags");
  const [sortOrder, setSortOrder] = useState("desc");

  // текущий путь (чтобы подсветка сохранялась даже после обновления)
  const location = useLocation();
  const activeSquadTag = location.pathname.startsWith("/squad/")
    ? location.pathname.split("/").pop()
    : null;

  const handleSort = (column) => {
    if (!["frags", "death", "tk"].includes(column)) return;
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const resetSort = () => {
    setSortColumn("frags");
    setSortOrder("desc");
  };

  const sortedSquads = [...squads].sort((a, b) => {
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (valA === valB) return 0;
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  // выбор цвета по стороне
  const getSquadColor = (side) => {
    switch (side) {
      case "WEST":
        return "text-blue-400";
      case "EAST":
        return "text-red-400";
      case "GUER":
        return "text-green-400";
      default:
        return "text-brand-red";
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* кнопка сброса */}
      <button
        className="self-end w-6 h-6 flex items-center justify-center bg-brand-red text-brand-light rounded-full text-xs font-bold hover:bg-red-700 transition-colors mb-2"
        onClick={resetSort}
        title="Сбросить сортировку"
      >
        ×
      </button>

      {/* контейнер: таблица слева, детали справа */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* таблица */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-brand-light border-collapse capitalize">
            <thead>
              <tr className="text-left text-brand-muted border-b border-brand-gray">
                <th className="px-3 py-2">Отряд</th>
                <th
                  className="px-3 py-2 cursor-pointer hover:underline"
                  onClick={() => handleSort("frags")}
                >
                  Frags {sortColumn === "frags" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-3 py-2 cursor-pointer hover:underline"
                  onClick={() => handleSort("death")}
                >
                  Death {sortColumn === "death" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-3 py-2 cursor-pointer hover:underline"
                  onClick={() => handleSort("tk")}
                >
                  TK {sortColumn === "tk" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSquads.map((squad, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-brand-gray hover:bg-brand-gray/70 cursor-pointer transition-colors ${
                    expandedSquad?.squad_tag === squad.squad_tag ? "bg-brand-gray/50" : ""
                  }`}
                  onClick={() =>
                    setExpandedSquad(
                      expandedSquad?.squad_tag === squad.squad_tag ? null : squad
                    )
                  }
                >
                  <td className="px-3 py-2 font-semibold">
                    <a
                      href={`/squad/${squad.squad_tag}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${getSquadColor(squad.side)} hover:underline ${
                        activeSquadTag === squad.squad_tag ? "font-bold underline" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()} // чтобы не срабатывал expand
                    >
                      {squad.squad_tag.toUpperCase()}
                    </a>
                  </td>
                  <td className="px-3 py-2">{squad.frags}</td>
                  <td className="px-3 py-2">{squad.death}</td>
                  <td className="px-3 py-2">{squad.tk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* детали справа */}
        <AnimatePresence>
          {expandedSquad && (
            <motion.div
              key="squad-detail"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-brand-black/50 rounded-xl p-4 border border-brand-muted"
            >
              <SquadDetail squad={expandedSquad} onVictimClick={onVictimClick} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
