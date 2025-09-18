import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Background from "../components/Background";
import Loader from "../components/Loader";
import MissionFilter from "../components/MissionList/MissionFilter";

function MissionList() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    game_type: "",
    win_side: "",
    world_name: "",
    mission_name: "",
    file_date: "",
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchMissions = (pageNum = 1, perPageNum = 10, appliedFilters = filters) => {
    const query = Object.entries(appliedFilters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `${API_BASE_URL}/api/mission-list?page=${pageNum}&per_page=${perPageNum}${query ? `&${query}` : ""}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMissions(data.missions || []);
        setPage(data.page);
        setPerPage(data.per_page);
        setTotalPages(data.total_pages);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMissions(1, perPage, filters);
  }, [API_BASE_URL]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchMissions(1, perPage, newFilters); // при поиске всегда с первой страницы
  };

  const handleReset = () => {
    const resetFilters = {
      game_type: "",
      win_side: "",
      world_name: "",
      mission_name: "",
      file_date: "",
    };
    setFilters(resetFilters);
    fetchMissions(1, perPage, resetFilters);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchMissions(page - 1, perPage, filters);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchMissions(page + 1, perPage, filters);
    }
  };

  if (loading) return <Loader text="Загрузка миссий..." />;

  return (
    <div className="relative min-h-screen">
      <Background enableCursorEffect={true} />
      <div className="relative z-10 px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-brand-red mb-6 text-center">
          Список миссий
        </h2>
        <MissionFilter
          missions={missions}
          filters={filters}
          onSearch={handleSearch}
          onReset={handleReset}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => {
            const totalMinutes = Math.floor(mission.duration_time);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return (
              <Link
                key={mission.id}
                to={`/mission/${mission.id}`} 
                className="bg-brand-gray/90 rounded-xl shadow-lg p-6 hover:bg-brand-gray/80 transition-colors duration-200 flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "220px", maxHeight: "220px" }}
              >
                <h3 className="text-xl md:text-2xl font-heading text-brand-light mb-2 truncate">
                  {mission.missionName}
                </h3>
                <p className="text-brand-muted text-sm mb-1 truncate">
                  <span className="font-bold">Мир:</span> {mission.worldName}
                </p>
                <p className="text-brand-muted text-sm mb-1 truncate">
                  <span className="font-bold">Тип игры:</span> {mission.game_type}
                </p>
                <p className="text-brand-muted text-sm mb-1 truncate">
                  <span className="font-bold">Длительность миссии:</span>{" "}
                  {hours > 0 ? `${hours} ч ` : ""}{minutes} мин
                </p>
                <p className="text-brand-muted text-sm truncate">
                  <span className="font-bold">Победившая сторона:</span> {mission.win_side}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Пагинация */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-brand-gray/80 rounded-lg disabled:opacity-50 hover:bg-brand-gray/60 transition"
          >
            ⬅ Предыдущая
          </button>
          <span className="text-brand-light">
            Страница {page} из {totalPages} (Всего: {total})
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-brand-gray/80 rounded-lg disabled:opacity-50 hover:bg-brand-gray/60 transition"
          >
            Следующая ➡
          </button>
        </div>
      </div>
    </div>
  );
}

export default MissionList;
