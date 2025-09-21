import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ читаем из .env

export default function PlayerMissions({ missions }) {
  const [sortKey, setSortKey] = useState("file_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const missionsPerPage = 10;

  if (!missions || missions.length === 0) {
    return <p className="text-center text-brand-muted">Нет сыгранных миссий</p>;
  }

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sortedMissions = [...missions].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (sortKey === "file_date") {
      valA = new Date(a.file_date);
      valB = new Date(b.file_date);
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedMissions.length / missionsPerPage);
  const startIndex = (currentPage - 1) * missionsPerPage;
  const currentMissions = sortedMissions.slice(startIndex, startIndex + missionsPerPage);

  const renderSortArrow = (key) => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  const handleMissionClick = async (mission) => {
    try {
      const url = `${API_BASE_URL}/api/find-mission?file=${encodeURIComponent(
        mission.file
      )}&file_date=${encodeURIComponent(mission.file_date)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Ошибка при запросе миссии");
      const data = await res.json();

      if (data.id) {
        window.open(`/mission/${data.id}`, "_blank");
      }
    } catch (err) {
      console.error("Не удалось получить ID миссии:", err);
      alert("Ошибка: не удалось открыть миссию");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="missions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full text-brand-light"
      >
        <h3 className="text-xl font-bold mb-4 text-center">Сыгранные миссии</h3>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-gray/70 text-brand-muted">
                <th className="px-2 py-1 text-left cursor-pointer" onClick={() => handleSort("file")}>
                  Миссия{renderSortArrow("file")}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort("file_date")}>
                  Дата{renderSortArrow("file_date")}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort("frags")}>
                  Фраги{renderSortArrow("frags")}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort("frags_veh")}>
                  Техника{renderSortArrow("frags_veh")}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort("frags_inf")}>
                  Пехота{renderSortArrow("frags_inf")}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort("tk")}>
                  ТК{renderSortArrow("tk")}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort("death")}>
                  Смерти{renderSortArrow("death")}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort("destroyed_veh")}>
                  Унич. тех{renderSortArrow("destroyed_veh")}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort("squad")}>
                  Сквад{renderSortArrow("squad")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentMissions.map((mission, idx) => (
                <tr
                  key={mission.file + idx}
                  className="hover:bg-brand-gray/40 border-b border-brand-gray/30 cursor-pointer"
                  onClick={() => handleMissionClick(mission)}
                >
                  <td className="px-2 py-1 font-medium">
                    {mission.file.replace(".json", "")}
                  </td>
                  <td className="px-2 py-1 text-center">{mission.file_date}</td>
                  <td className="px-2 py-1 text-center">{mission.frags}</td>
                  <td className="px-2 py-1 text-center">{mission.frags_veh}</td>
                  <td className="px-2 py-1 text-center">{mission.frags_inf}</td>
                  <td className="px-2 py-1 text-center">{mission.tk}</td>
                  <td className="px-2 py-1 text-center">{mission.death}</td>
                  <td className="px-2 py-1 text-center">{mission.destroyed_veh}</td>
                  <td className="px-2 py-1 text-center">
                    {mission.squad ? mission.squad.toUpperCase() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Навигация */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-brand-gray/40 text-gray-500 cursor-not-allowed"
                : "bg-brand-gray hover:bg-brand-gray/70"
            }`}
          >
            ⬅ Назад
          </button>

          <span className="text-sm">
            Стр. {currentPage} из {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-brand-gray/40 text-gray-500 cursor-not-allowed"
                : "bg-brand-gray hover:bg-brand-gray/70"
            }`}
          >
            Вперёд ➡
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
