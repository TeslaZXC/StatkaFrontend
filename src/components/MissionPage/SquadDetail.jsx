import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SquadDetail({ squad, onVictimClick }) {
  const [showVictims, setShowVictims] = useState(false);
  const [sortColumn, setSortColumn] = useState("frags");
  const [sortOrder, setSortOrder] = useState("desc");

  const ocapRef = useRef(null);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const formatName = (tag, name) => {
    const formattedTag = `[${tag.toUpperCase()}]`;
    const formattedName = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return `${formattedTag} ${formattedName}`;
  };

  const extractFirstTag = (fullName) => {
    const match = fullName.match(/\[([^\]]+)\]/);
    return match ? `[${match[1]}]` : "";
  };

  const sortedPlayers = [...squad.squad_players].sort((a, b) => {
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (valA === valB) return 0;
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const handleVictimClick = (victim) => {
    if (onVictimClick) onVictimClick(victim);

    if (ocapRef.current) {
      ocapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-heading text-brand-light mb-2 text-sm">Игроки</h4>
        <table className="w-full text-xs text-brand-light border-collapse">
          <thead>
            <tr className="text-left text-brand-muted border-b border-brand-gray">
              <th className="px-2 py-1">Имя</th>
              <th
                className="px-2 py-1 cursor-pointer hover:underline"
                onClick={() => handleSort("frags")}
              >
                Frags {sortColumn === "frags" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-2 py-1 cursor-pointer hover:underline"
                onClick={() => handleSort("tk")}
              >
                TK {sortColumn === "tk" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((p, idx) => (
              <tr key={`player-${idx}`}>
                <td className="px-2 py-1 text-sm md:text-base font-semibold">
                  {formatName(squad.squad_tag, p.name)}
                </td>
                <td className="px-2 py-1">{p.frags}</td>
                <td className="px-2 py-1">{p.tk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="text-xs text-brand-red font-heading hover:underline"
        onClick={() => setShowVictims(!showVictims)}
      >
        {showVictims ? "Скрыть жертв" : "Показать жертв"}
      </button>

      <AnimatePresence>
        {showVictims && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2 mt-2">
              <h4 className="font-heading text-brand-light mb-2 text-sm">Жертвы</h4>
              <table className="w-full text-xs text-brand-light border-collapse">
                <thead>
                  <tr className="text-left text-brand-muted border-b border-brand-gray">
                    <th className="px-2 py-1">Время</th>
                    <th className="px-2 py-1">Игрок</th>
                    <th className="px-2 py-1">Оружие</th>
                    <th className="px-2 py-1">Дистанция</th>
                    <th className="px-2 py-1">Убийца</th>
                    <th className="px-2 py-1">Тип</th>
                  </tr>
                </thead>
                <tbody>
                  {squad.victims_players.map((v, idx) => (
                    <tr
                      key={`victim-${idx}`}
                      className="cursor-pointer hover:bg-brand-gray/70"
                      onClick={() => handleVictimClick(v)}
                    >
                      <td className="px-2 py-1">{v.time}</td>
                      <td className="px-2 py-1 text-sm md:text-base font-semibold">
                        {extractFirstTag(v.name)} {v.name.replace(/\[.*?\]\s*/, "")}
                      </td>
                      <td className="px-2 py-1">
                        {v.weapon
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </td>
                      <td className="px-2 py-1">{v.distance}м</td>
                      <td className="px-2 py-1 text-sm md:text-base font-semibold">
                        {v.killer_name}
                      </td>
                      <td className="px-2 py-1">
                        {v.kill_type.charAt(0).toUpperCase() + v.kill_type.slice(1).toLowerCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={ocapRef}></div>
    </div>
  );
}
