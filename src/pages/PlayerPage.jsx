import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Panel from "../components/ui/Panel";
import PlayerInfo from "../components/PlayerPage/PlayerInfo";
import PlayerMissions from "../components/PlayerPage/PlayerMissions";
import WeaponKillsChart from "../components/PlayerPage/WeaponKillsChart";
import VehicleKillsChart from "../components/PlayerPage/VehicleKillsChart";
import KilledPlayersChart from "../components/PlayerPage/KilledPlayersChart"; 
import PlayerWeeklyStats from "../components/PlayerPage/PlayerWeeklyStats"; // 👈 новый импорт

export default function PlayerPage() {
  const { name } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [selectedSquad, setSelectedSquad] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getDates = () => {
    const now = new Date();
    let startDate = "2020_01_01";
    let endDate = "2099_01_01";

    if (period === "3months") {
      const past = new Date();
      past.setMonth(now.getMonth() - 3);
      startDate = past.toISOString().slice(0, 10).replace(/-/g, "_");
      endDate = now.toISOString().slice(0, 10).replace(/-/g, "_");
    }

    if (period === "1month") {
      const past = new Date();
      past.setMonth(now.getMonth() - 1);
      startDate = past.toISOString().slice(0, 10).replace(/-/g, "_");
      endDate = now.toISOString().slice(0, 10).replace(/-/g, "_");
    }

    return { startDate, endDate };
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setLoading(true);
      try {
        const { startDate, endDate } = getDates();
        let url = `${API_BASE_URL}/api/player-stat?player_name=${encodeURIComponent(
          name
        )}&start_date=${startDate}&end_date=${endDate}`;

        if (selectedSquad) {
          url += `&squad=${encodeURIComponent(selectedSquad)}`;
        }

        const res = await fetch(url);
        const json = await res.json();
        setPlayerData(json);
      } catch (err) {
        console.error("Ошибка загрузки игрока:", err);
        setPlayerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, name, period, selectedSquad]);

  if (loading) return <Loader text={`Загрузка игрока ${name}...`} />;
  if (!playerData) return <p className="text-center text-red-500">Игрок не найден</p>;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 px-6 py-10 w-full max-w-full space-y-10">
        <h2 className="text-3xl md:text-4xl font-heading text-brand-red text-center">
          Статистика игрока – "{name}"
        </h2>

        {/* Переключатель периодов */}
        <div className="flex justify-center">
          <div className="inline-flex border border-brand-red rounded-none overflow-hidden">
            <button
              onClick={() => setPeriod("all")}
              className={`px-4 py-2 text-sm font-semibold ${
                period === "all"
                  ? "bg-brand-red text-white"
                  : "bg-brand-gray text-brand-light hover:bg-brand-gray/80"
              }`}
            >
              Всё время
            </button>
            <button
              onClick={() => setPeriod("3months")}
              className={`px-4 py-2 text-sm font-semibold ${
                period === "3months"
                  ? "bg-brand-red text-white"
                  : "bg-brand-gray text-brand-light hover:bg-brand-gray/80"
              }`}
            >
              Последние 3 мес
            </button>
            <button
              onClick={() => setPeriod("1month")}
              className={`px-4 py-2 text-sm font-semibold ${
                period === "1month"
                  ? "bg-brand-red text-white"
                  : "bg-brand-gray text-brand-light hover:bg-brand-gray/80"
              }`}
            >
              За месяц
            </button>
          </div>
        </div>

        {/* Панель общей статистики */}
        <div className="flex justify-center">
          <Panel
            title="Информация об игроке"
            color="border-blue-500"
            defaultOpen={true}
            fixedWidth="900px"
          >
            <PlayerInfo
              player={playerData}
              selectedSquad={selectedSquad}
              onSquadSelect={(squad) =>
                setSelectedSquad(selectedSquad === squad ? null : squad)
              }
            />
          </Panel>
        </div>

        {/* Панель недельной статистики */}
        <div className="flex justify-center">
          <Panel
            title="Недельная статистика"
            color="border-teal-500"
            defaultOpen={false}
            fixedWidth="1200px"
          >
            <PlayerWeeklyStats weekly={playerData.weekly} />
          </Panel>
        </div>

        {/* Панель сыгранных миссий */}
        <div className="flex justify-center">
          <Panel
            title="Сыгранные миссии"
            color="border-green-500"
            defaultOpen={false}
            fixedWidth="1200px"
          >
            <PlayerMissions missions={playerData.missions} />
          </Panel>
        </div>

        {/* Панель киллов по оружию */}
        <div className="flex justify-center">
          <Panel
            title="Киллы по оружию"
            color="border-yellow-500"
            defaultOpen={true}
            fixedWidth="1200px"
          >
            <div style={{ width: "100%", height: "600px" }}>
              <WeaponKillsChart
                key={Object.keys(playerData.weapons || {}).length}
                weapons={playerData.weapons}
              />
            </div>
          </Panel>
        </div>

        {/* Панель килов с техники */}
        <div className="flex justify-center">
          <Panel
            title="Убийства с техники"
            color="border-orange-500"
            defaultOpen={true}
            fixedWidth="1200px"
          >
            <div style={{ width: "100%", height: "600px" }}>
              <VehicleKillsChart
                key={Object.keys(playerData.vehicles || {}).length}
                vehicles={playerData.vehicles}
              />
            </div>
          </Panel>
        </div>

        {/* Панель убитых игроков */}
        <div className="flex justify-center">
          <Panel
            title="Убитые игроки"
            color="border-purple-500"
            defaultOpen={true}
            fixedWidth="1200px"
          >
            <div style={{ width: "100%", height: "600px" }}>
              <KilledPlayersChart
                key={Object.keys(playerData.killed_players || {}).length}
                killedPlayers={playerData.killed_players}
              />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
