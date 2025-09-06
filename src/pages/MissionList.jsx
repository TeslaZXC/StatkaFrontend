import { useEffect, useState } from "react";
import Background from "../components/Background";
import Loader from "../components/Loader";
import MissionFilter from "../components/MissionList/MissionFilter";

function MissionList() {
  const [missions, setMissions] = useState([]);
  const [displayMissions, setDisplayMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    game_type: "",
    win_side: "",
    world_name: "",
    mission_name: "",
    file_date: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/mission-list`)
      .then((res) => res.json())
      .then((data) => {
        setMissions(data);
        setDisplayMissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);

    const query = Object.entries(newFilters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `${API_BASE_URL}/api/mission-list${query ? `?${query}` : ""}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDisplayMissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleReset = () => {
    setFilters({
      game_type: "",
      win_side: "",
      world_name: "",
      mission_name: "",
      file_date: "",
    });
    setDisplayMissions(missions);
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
          {displayMissions.map((mission) => {
            const totalMinutes = Math.floor(mission.duration_time);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return (
              <div
                key={mission.id}
                className="bg-brand-gray/90 rounded-xl shadow-lg p-6 hover:bg-brand-gray/80 transition-colors duration-200 flex flex-col justify-between"
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MissionList;
