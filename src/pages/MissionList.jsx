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
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchMissions = (pageNum = 1, perPageNum = 20, appliedFilters = filters) => {
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
    fetchMissions(1, perPage, newFilters);
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

        {/* Таблица миссий */}
        <div className="overflow-x-auto">
          <table className="w-full rounded-xl shadow-lg bg-brand-gray/90 text-white">
            <thead>
              <tr className="bg-brand-gray/80">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Дата файла</th>
                <th className="px-4 py-2 text-left">Название миссии</th>
                <th className="px-4 py-2 text-left">Мир</th>
                <th className="px-4 py-2 text-left">Тип игры</th>
                <th className="px-4 py-2 text-left">Победившая сторона</th>
                <th className="px-4 py-2 text-left">Онлайн</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((mission) => (
                <tr
                  key={mission.id}
                  className="hover:bg-brand-gray/70 transition cursor-pointer"
                >
                  <td className="px-4 py-2">{mission.id}</td>
                  <td className="px-4 py-2">{mission.file_date}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/mission/${mission.id}`}
                      className="text-brand-red hover:underline"
                    >
                      {mission.missionName}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{mission.worldName}</td>
                  <td className="px-4 py-2">{mission.game_type}</td>
                  <td className="px-4 py-2">{mission.win_side}</td>
                  <td className="px-4 py-2">
                    {mission.players_count?.total} (
                    {[
                      mission.players_count?.WEST > 0 && (
                        <span key="west" className="font-bold text-blue-400">
                          {mission.players_count.WEST}
                        </span>
                      ),
                      mission.players_count?.EAST > 0 && (
                        <span key="east" className="font-bold text-red-400">
                          {mission.players_count.EAST}
                        </span>
                      ),
                      mission.players_count?.GUER > 0 && (
                        <span key="guer" className="font-bold text-green-400">
                          {mission.players_count.GUER}
                        </span>
                      ),
                    ]
                      .filter(Boolean)
                      .reduce((acc, el, idx, arr) => [
                        ...acc,
                        el,
                        idx < arr.length - 1 ? <span key={`sep-${idx}`}>/</span> : null,
                      ], [])}
                    )
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
