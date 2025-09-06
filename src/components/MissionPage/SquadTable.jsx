import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SquadDetail from "./SquadDetail";

export default function SquadTable({ squads, onVictimClick }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sortColumn, setSortColumn] = useState("frags");
  const [sortOrder, setSortOrder] = useState("desc");

  const toggleRow = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

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
    if (sortOrder === "asc") return valA - valB;
    return valB - valA;
  });

  return (
    <div className="space-y-2 relative">
      <button
        className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center bg-brand-red text-brand-light rounded-full text-xs font-bold hover:bg-red-700 transition-colors"
        onClick={resetSort}
        title="Сбросить сортировку"
      >
        ×
      </button>

      <table className="w-full text-sm text-brand-light border-collapse">
        <thead>
          <tr className="text-left text-brand-muted border-b border-brand-gray">
            <th className="px-2 py-1">Отряд</th>
            <th
              className="px-2 py-1 cursor-pointer hover:underline"
              onClick={() => handleSort("frags")}
            >
              Frags {sortColumn === "frags" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="px-2 py-1 cursor-pointer hover:underline"
              onClick={() => handleSort("death")}
            >
              Death {sortColumn === "death" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
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
          {sortedSquads.map((squad, idx) => (
            <React.Fragment key={idx}>
              <tr
                className="border-b border-brand-gray hover:bg-brand-gray/70 cursor-pointer"
                onClick={() => toggleRow(idx)}
              >
                <td className="px-2 py-1">{squad.squad_tag}</td>
                <td className="px-2 py-1">{squad.frags}</td>
                <td className="px-2 py-1">{squad.death}</td>
                <td className="px-2 py-1">{squad.tk}</td>
              </tr>

              {expandedIndex === idx && (
                <tr>
                  <td colSpan={4} className="p-0">
                    <AnimatePresence>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-brand-black/50 p-4"
                      >
                        <SquadDetail squad={squad} onVictimClick={onVictimClick} />
                      </motion.div>
                    </AnimatePresence>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
