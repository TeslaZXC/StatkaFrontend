import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function SquadMissions({ missions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const missionsPerPage = 10;
  const [selectedMission, setSelectedMission] = useState(null);
  const [loadingMissionFile, setLoadingMissionFile] = useState(null);

  // сортировка для выбранной таблицы
  const [playersSort, setPlayersSort] = useState({ key: null, direction: "asc" });
  const [victimsSort, setVictimsSort] = useState({ key: null, direction: "asc" });

  if (!missions || missions.length === 0) {
    return <p className="text-center text-white">Нет сыгранных миссий</p>;
  }

  const totalPages = Math.ceil(missions.length / missionsPerPage);
  const startIndex = (currentPage - 1) * missionsPerPage;
  const currentMissions = missions.slice(startIndex, startIndex + missionsPerPage);

  const handleOpenMission = async (mission) => {
    setLoadingMissionFile(mission.file);
    try {
      const url = `${API_BASE_URL}/api/find-mission?file=${encodeURIComponent(
        mission.file
      )}&file_date=${encodeURIComponent(mission.file_date)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Ошибка при запросе миссии");
      const data = await res.json();
      if (data.id) {
        window.open(`/mission/${data.id}`, "_blank");
      } else {
        alert("Не удалось получить ID миссии");
      }
    } catch (err) {
      console.error("Ошибка при открытии миссии:", err);
      alert("Ошибка при открытии миссии");
    } finally {
      setLoadingMissionFile(null);
    }
  };

  const handleMissionRowClick = (mission) => {
    setSelectedMission(selectedMission === mission ? null : mission);
    setPlayersSort({ key: null, direction: "asc" });
    setVictimsSort({ key: null, direction: "asc" });
  };

  const sortData = (data, sortConfig) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }
      if (typeof valA === "string" && typeof valB === "string") {
        return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });
  };

  const toggleSort = (key, sortState, setSortState) => {
    setSortState(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getArrow = (key, sortState) => {
    if (sortState.key !== key) return "⇅";
    return sortState.direction === "asc" ? "▲" : "▼";
  };

  return (
    <AnimatePresence>
      <motion.div
        key="squad-missions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full text-white"
      >
        <h3 className="text-xl font-bold mb-4 text-center">Сыгранные миссии</h3>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-700/70">
                <th className="px-2 py-1 text-left">Миссия</th>
                <th className="px-2 py-1 text-center">Дата</th>
                <th className="px-2 py-1 text-center">Фраги</th>
                <th className="px-2 py-1 text-center">Смерти</th>
                <th className="px-2 py-1 text-center">ТК</th>
                <th className="px-2 py-1 text-center">Игроков</th>
                <th className="px-2 py-1 text-center">Действие</th>
              </tr>
            </thead>
            <tbody>
              {currentMissions.map((mission, idx) => (
                <tr
                  key={mission.file + idx}
                  className="hover:bg-gray-600/50 border-b border-gray-500 cursor-pointer"
                  onClick={() => handleMissionRowClick(mission)}
                >
                  <td className="px-2 py-1 font-medium">{mission.file.replace(".json", "")}</td>
                  <td className="px-2 py-1 text-center">{mission.file_date}</td>
                  <td className="px-2 py-1 text-center">{mission.frags}</td>
                  <td className="px-2 py-1 text-center">{mission.death}</td>
                  <td className="px-2 py-1 text-center">{mission.tk}</td>
                  <td className="px-2 py-1 text-center">{mission.total_players}</td>
                  <td className="px-2 py-1 text-center">
                    <button
                      className={`px-3 py-1 rounded ${
                        loadingMissionFile === mission.file
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-500"
                      } text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!loadingMissionFile) handleOpenMission(mission);
                      }}
                    >
                      {loadingMissionFile === mission.file ? "Загрузка..." : "Открыть"}
                    </button>
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
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-600"
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
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Вперёд ➡
          </button>
        </div>

        {/* Детали выбранной миссии */}
        {selectedMission && (
          <div className="mt-6 space-y-6">
            <h4 className="text-lg font-bold mb-2 text-center">
              Детали миссии {selectedMission.file.replace(".json", "")}
            </h4>

            {/* Игроки отряда */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-700/70">
                    {["name", "frags", "tk"].map((key) => (
                      <th
                        key={key}
                        className="px-2 py-1 cursor-pointer"
                        onClick={() => toggleSort(key, playersSort, setPlayersSort)}
                      >
                        <div className="flex items-center gap-1">
                          {key === "name" ? "Игрок" : key === "frags" ? "Фраги" : "ТК"}
                          <span className="text-xs">{getArrow(key, playersSort)}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortData(selectedMission.squad_players, playersSort).map((player) => (
                    <tr key={player.name} className="border-b border-gray-500">
                      <td className="px-2 py-1">{player.name}</td>
                      <td className="px-2 py-1 text-center">{player.frags}</td>
                      <td className="px-2 py-1 text-center">{player.tk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Victims Players */}
            <div className="overflow-x-auto">
              <h5 className="text-md font-semibold mb-2 text-center">Жертвы отряда</h5>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-700/70">
                    {["name","weapon","killer_name","kill_type","distance","time"].map((key) => (
                      <th
                        key={key}
                        className="px-2 py-1 cursor-pointer"
                        onClick={() => toggleSort(key, victimsSort, setVictimsSort)}
                      >
                        <div className="flex items-center gap-1">
                          {key === "name" ? "Имя" : key === "weapon" ? "Оружие/Тип" : key === "killer_name" ? "Киллер" : key === "kill_type" ? "Тип убийства" : key === "distance" ? "Дистанция" : "Время"}
                          <span className="text-xs">{getArrow(key, victimsSort)}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortData(selectedMission.victims_players || [], victimsSort).map((v, i) => (
                    <tr key={i} className="border-b border-gray-500">
                      <td className="px-2 py-1">{v.name}</td>
                      <td className="px-2 py-1 text-center">{v.weapon}</td>
                      <td className="px-2 py-1 text-center">{v.killer_name}</td>
                      <td className="px-2 py-1 text-center">{v.kill_type}</td>
                      <td className="px-2 py-1 text-center">{v.distance}</td>
                      <td className="px-2 py-1 text-center">{v.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
