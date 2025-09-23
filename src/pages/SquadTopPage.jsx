import { useEffect, useState } from "react";
import Background from "../components/Background";
import Loader from "../components/Loader";

function SquadTopPage() {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all"); // all | 3m | 1m

  // сортировка
  const [sortConfig, setSortConfig] = useState({ key: "score", direction: "desc" });

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

  const fetchSquads = async () => {
    setLoading(true);
    const { start, end } = getDateRange();

    try {
      const res = await fetch(`${API_BASE_URL}/squad_top_period?start_date=${start}&end_date=${end}`);
      const data = await res.json();
      setSquads(data || []);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setSquads([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSquads();
  }, [dateRange]);

  if (loading) return <Loader text="Загрузка топа отрядов..." />;

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

  const sortedSquads = [...squads].sort((a, b) => {
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
          Топ отрядов
        </h2>

        {/* Кнопки периода */}
        <div className="flex justify-center gap-4 mb-6">
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

        {/* Таблица */}
        <div className="overflow-x-auto flex justify-center">
          <table className="w-full max-w-5xl rounded-xl shadow-lg bg-brand-gray/90 text-white border border-brand-gray">
            <thead className="sticky top-0 bg-brand-gray/95 z-10">
              <tr>
                {[
                  { key: "rank", label: "#" },
                  { key: "squad_tag", label: "Отряд" },
                  { key: "frags", label: "Фраги" },
                  { key: "death", label: "Смерти" },
                  { key: "tk", label: "ТК" },
                  { key: "mission_play", label: "Миссий сыграно" },
                  { key: "kd", label: "КД" },
                  { key: "average_presence", label: "Средняя явка" },
                  { key: "score", label: "Счёт" },
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
            {sortedSquads.map((squad, idx) => (
                <tr
                key={`${squad.squad_tag}-${idx}`}
                className={`border-t border-brand-gray cursor-pointer hover:bg-brand-gray/70 transition ${getRowClass(idx)}`}
                onClick={() =>
                    window.open(`/squad/${encodeURIComponent(squad.squad_tag)}`, "_blank")
                }
                >
                <td className="px-4 py-2 font-bold">{idx + 1}</td>
                <td className="px-4 py-2">{squad.squad_tag.toUpperCase()}</td>
                <td className="px-4 py-2">{squad.frags}</td>
                <td className="px-4 py-2">{squad.death}</td>
                <td className="px-4 py-2">{squad.tk}</td>
                <td className="px-4 py-2">{squad.mission_play}</td>
                <td className="px-4 py-2">{squad.kd}</td>
                <td className="px-4 py-2">{squad.average_presence}</td>
                <td className="px-4 py-2">{squad.score.toFixed(3)}</td>
                </tr>
            ))}
            </tbody>
                    </table>
        </div>
      </div>
    </div>
  );
}

export default SquadTopPage;
