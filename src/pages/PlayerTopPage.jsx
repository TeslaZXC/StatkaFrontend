import { useEffect, useState } from "react";
import Background from "../components/Background";
import Loader from "../components/Loader";

function PlayerTopPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statType, setStatType] = useState("all"); // all | inf | veh
  const [dateRange, setDateRange] = useState("all"); // all | 3m | 1m

  // сортировка
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";

  const getDateRange = () => {
    const now = new Date();
    if (dateRange === "all") {
      return { start: "2020_01_01", end: "2099_01_01" };
    }
    if (dateRange === "3m") {
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return {
        start: start.toISOString().slice(0, 10).replace(/-/g, "_"),
        end: now.toISOString().slice(0, 10).replace(/-/g, "_"),
      };
    }
    if (dateRange === "1m") {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return {
        start: start.toISOString().slice(0, 10).replace(/-/g, "_"),
        end: now.toISOString().slice(0, 10).replace(/-/g, "_"),
      };
    }
    return { start: "2020_01_01", end: "2099_01_01" };
  };

  const fetchPlayers = async () => {
    setLoading(true);
    const { start, end } = getDateRange();

    let endpoint = "/player-top";
    if (statType === "inf") endpoint = "/player-top-inf";
    if (statType === "veh") endpoint = "/player-top-veh";

    try {
      const res = await fetch(
        `${API_BASE_URL}${endpoint}?start_date=${start}&end_date=${end}`
      );
      const data = await res.json();
      setPlayers(data || []);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setPlayers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
  }, [statType, dateRange]);

  if (loading) return <Loader text="Загрузка топа игроков..." />;

  // подсветка 1-3 мест
  const getRowClass = (idx) => {
    if (idx === 0) return "bg-yellow-600/60";
    if (idx === 1) return "bg-gray-400/60";
    if (idx === 2) return "bg-orange-600/60";
    return "";
  };

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (!sortConfig.key) return 0;
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

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <Background enableCursorEffect={true} />
      <div className="relative z-10 px-6 py-10 w-full max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-heading text-brand-red mb-6 text-center">
          Топ игроков
        </h2>

        {/* Кнопки периода */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setDateRange("all")}
            className={`px-4 py-2 rounded-lg ${
              dateRange === "all" ? "bg-brand-red text-white" : "bg-brand-gray/80 text-white"
            }`}
          >
            Всё время
          </button>
          <button
            onClick={() => setDateRange("3m")}
            className={`px-4 py-2 rounded-lg ${
              dateRange === "3m" ? "bg-brand-red text-white" : "bg-brand-gray/80 text-white"
            }`}
          >
            За 3 месяца
          </button>
          <button
            onClick={() => setDateRange("1m")}
            className={`px-4 py-2 rounded-lg ${
              dateRange === "1m" ? "bg-brand-red text-white" : "bg-brand-gray/80 text-white"
            }`}
          >
            За месяц
          </button>
        </div>

        {/* Кнопки типа статистики */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setStatType("all")}
            className={`px-4 py-2 rounded-lg ${
              statType === "all" ? "bg-brand-red text-white" : "bg-brand-gray/80 text-white"
            }`}
          >
            Общая статистика
          </button>
          <button
            onClick={() => setStatType("inf")}
            className={`px-4 py-2 rounded-lg ${
              statType === "inf" ? "bg-brand-red text-white" : "bg-brand-gray/80 text-white"
            }`}
          >
            Пехота
          </button>
          <button
            onClick={() => setStatType("veh")}
            className={`px-4 py-2 rounded-lg ${
              statType === "veh" ? "bg-brand-red text-white" : "bg-brand-gray/80 text-white"
            }`}
          >
            Техника
          </button>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto flex justify-center">
          <table className="w-full max-w-5xl rounded-xl shadow-lg bg-brand-gray/90 text-white border border-brand-gray">
            <thead className="sticky top-0 bg-brand-gray/95 z-10">
              <tr>
                {[
                  { key: "rank", label: "#" },
                  { key: "name", label: "Игрок" },
                  { key: "frags", label: "Фраги" },
                  { key: "deaths", label: "Смерти" },
                  { key: "kd", label: "КД" },
                  { key: "score", label: "Счёт" },
                  { key: "missions_played", label: "Миссий сыграно" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2 text-left cursor-pointer select-none"
                    onClick={() => toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label} <span className="text-xs">{getArrow(col.key)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, idx) => (
                <tr
                  key={`${player.name}-${idx}`}
                  onClick={() =>
                    window.open(`/player/${encodeURIComponent(player.name)}`, "_blank")
                  }
                  className={`cursor-pointer hover:bg-brand-gray/70 transition border-t border-brand-gray ${getRowClass(
                    idx
                  )}`}
                >
                  <td className="px-4 py-2 font-bold">{idx + 1}</td>
                  <td className="px-4 py-2">
                    [{player.squad.toUpperCase()}] {player.name}
                  </td>
                  <td className="px-4 py-2">{player.frags}</td>
                  <td className="px-4 py-2">{player.deaths}</td>
                  <td className="px-4 py-2">{player.kd}</td>
                  <td className="px-4 py-2">{player.score.toFixed(2)}</td>
                  <td className="px-4 py-2">{player.missions_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PlayerTopPage;
