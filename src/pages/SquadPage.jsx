import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Panel from "../components/ui/Panel";
import SquadInfo from "../components/SquadPage/SquadInfo";
import SquadMissions from "../components/SquadPage/SquadMissions";
import SquadPlayersTable from "../components/SquadPage/SquadPlayersTable";

export default function SquadPage({ squad: squadProp }) {
  const { tag } = useParams();
  const [squadData, setSquadData] = useState(squadProp || null);
  const [loading, setLoading] = useState(!squadProp);
  const [period, setPeriod] = useState("all");

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
    if (squadProp) return;

    window.scrollTo(0, 0);

    const fetchData = async () => {
      setLoading(true);
      try {
        const { startDate, endDate } = getDates();
        const url = `${API_BASE_URL}/api/squad-stat?squad_tag=${encodeURIComponent(
          tag
        )}&start_date=${startDate}&end_date=${endDate}`;

        const res = await fetch(url);
        const json = await res.json();
        setSquadData(json);
      } catch (err) {
        console.error("Ошибка загрузки отряда:", err);
        setSquadData(null);
      } finally {
        setLoading(false);
      }
    };

    if (tag) fetchData();
  }, [API_BASE_URL, tag, period, squadProp]);

  if (loading) return <Loader text={`Загрузка отряда ${tag}...`} />;
  if (!squadData)
    return <p className="text-center text-red-500">Отряд не найден</p>;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 px-6 py-10 w-full max-w-full space-y-10">
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
            title="Информация об отряде"
            color="border-blue-500"
            defaultOpen={true}
            fixedWidth="900px"
          >
            <SquadInfo squad={squadData} />
          </Panel>
        </div>

        {/* Панель миссий */}
        <div className="flex justify-center">
          <Panel
            title="Миссии отряда"
            color="border-yellow-500"
            defaultOpen={true}
            fixedWidth="900px"
          >
            <SquadMissions missions={squadData.missions || []} />
          </Panel>
        </div>

        {/* Панель игроков */}
        <div className="flex justify-center">
          <Panel
            title="Игроки отряда"
            color="border-green-500"
            defaultOpen={true}
            fixedWidth="1200px"
          >
            <SquadPlayersTable players={squadData.players_squad || []} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
