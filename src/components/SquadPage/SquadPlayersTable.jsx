import { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function SquadPlayersTable({ players = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  if (!players || players.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-6">
        В составе пока нет игроков
      </p>
    );
  }

  const headers = [
    { key: "name", label: "Игрок" },
    { key: "matches", label: "Матчи" },
    { key: "frags", label: "Фраги" },
    { key: "frags_inf", label: "Фраги (пех.)" },
    { key: "frags_veh", label: "Фраги (техника)" },
    { key: "tk", label: "Тимкиллы" },
    { key: "death", label: "Смерти" },
    { key: "destroyed_veh", label: "Уничтож. техники" },
    { key: "kd_ratio", label: "K/D" },
    { key: "kd_inf", label: "K/D пех." },
    { key: "kd_veh", label: "K/D тех." },
  ];

  const sortedPlayers = useMemo(() => {
    if (!sortConfig.key) return players;

    return [...players].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      // числовая сортировка
      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }

      // строковая сортировка
      if (typeof valA === "string" && typeof valB === "string") {
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return 0;
    });
  }, [players, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-x-auto mt-8 w-full"
    >
      <table className="min-w-full border border-red-500/30 rounded-lg overflow-hidden text-sm text-white">
        <thead className="bg-red-500/20 text-red-400">
          <tr>
            {headers.map((h) => (
              <th
                key={h.key}
                onClick={() => handleSort(h.key)}
                className="px-4 py-2 text-left font-semibold border-b border-red-500/30 cursor-pointer select-none"
              >
                <div className="flex items-center gap-1">
                  {h.label}
                  <span className="text-xs">{getArrow(h.key)}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, idx) => (
            <tr
              key={player.name}
              className={`${
                idx % 2 === 0 ? "bg-gray-800/40" : "bg-gray-900/40"
              } hover:bg-red-500/10 transition cursor-pointer`}
              onClick={() =>
                window.open(`/player/${encodeURIComponent(player.name)}`, "_blank")
              }
            >
              {headers.map((h) => (
                <td
                  key={h.key}
                  className="px-4 py-2 border-b border-red-500/10 whitespace-nowrap"
                >
                  {typeof player[h.key] === "number"
                    ? player[h.key].toFixed(h.key.includes("kd") ? 2 : 0)
                    : player[h.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
