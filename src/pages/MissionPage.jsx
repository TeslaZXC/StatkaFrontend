import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Background from "../components/Background";
import Loader from "../components/Loader";
import Panel from "../components/ui/Panel"; 
import SquadTable from "../components/MissionPage/SquadTable";
import SquadDetail from "../components/MissionPage/SquadDetail";
import OcapViewer from "../components/MissionPage/OcapViewer";
import KillsChartSquad from "../components/MissionPage/KillsChartSquad";
import SquadChart from "../components/MissionPage/SquadChart";

export default function MissionPage() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [ocapLink, setOcapLink] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await fetch(`${API_BASE_URL}/api/squad-mission-stat?id=${id}`);
        const jsonData = await resData.json();
        setData(jsonData);

        const resMission = await fetch(`${API_BASE_URL}/api/mission-name/${id}`);
        const jsonMission = await resMission.json();
        const file = jsonMission.mission_name.file;
        setOcapLink(`http://ocap.red-bear.ru/?file=${file}&frame=0&zoom=1.9&x=-128.077&y=128.077`);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, id]);

  const grouped = useMemo(() => {
    return data.reduce((acc, squad) => {
      if (!acc[squad.side]) acc[squad.side] = [];
      acc[squad.side].push(squad);
      return acc;
    }, {});
  }, [data]);

  const sideColors = {
    WEST: "border-blue-500",
    EAST: "border-brand-red",
    GUER: "border-green-600",
  };

  const handleVictimClick = (victim) => {
    if (!victim || !ocapLink) return;
    const frame = victim.frame || 0;
    const x = victim.position?.x || 0;
    const y = victim.position?.y || 0;
    const baseFile = new URL(ocapLink).searchParams.get("file");
    const newLink = `http://ocap.red-bear.ru/?file=${baseFile}&frame=${frame}&zoom=8&x=${x}&y=${y}`;
    setOcapLink(newLink);
  };

  const killsChartData = useMemo(() => {
    const kills = [];
    data.forEach(squad => {
      const side = squad.side;
      (squad.victims_players ?? []).forEach(victim => {
        kills.push({ time: victim.time, side });
      });
    });

    const groupedByTime = {};
    kills.forEach(kill => {
      const t = kill.time;
      if (!groupedByTime[t]) groupedByTime[t] = { time: t, WEST: 0, EAST: 0, GUER: 0 };
      if (kill.side === "WEST") groupedByTime[t].WEST += 1;
      if (kill.side === "EAST") groupedByTime[t].EAST += 1;
      if (kill.side === "GUER") groupedByTime[t].GUER += 1;
    });

    return Object.values(groupedByTime).sort((a, b) => a.time - b.time);
  }, [data]);

  if (loading || !ocapLink) return <Loader text="Загрузка статистики..." />;

  return (
    <div className="relative min-h-screen">
      <Background enableCursorEffect={true} />

      <div className="relative z-10 px-6 py-10 w-full max-w-full space-y-10">
        <h2 className="text-3xl md:text-4xl font-heading text-brand-red text-center">
          Статистика миссии #{id}
        </h2>

        {/* Колонки с отрядами */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {["WEST", "GUER"].map(side => (
              grouped[side] ? (
                <Panel key={side} title={side} color={sideColors[side]} defaultOpen={true}>
                  <SquadTable
                    squads={grouped[side]}
                    onSelectSquad={setSelectedSquad}
                    onVictimClick={handleVictimClick}
                  />
                </Panel>
              ) : null
            ))}
          </div>

          <div className="flex-1 space-y-6">
            {["EAST"].map(side => (
              grouped[side] ? (
                <Panel key={side} title={side} color={sideColors[side]} defaultOpen={true}>
                  <SquadTable
                    squads={grouped[side]}
                    onSelectSquad={setSelectedSquad}
                    onVictimClick={handleVictimClick}
                  />
                </Panel>
              ) : null
            ))}

            {selectedSquad && (
              <Panel title={`Детали отряда: ${selectedSquad.squad_tag}`} color={sideColors[selectedSquad.side]}>
                <SquadDetail squad={selectedSquad} onVictimClick={handleVictimClick} />
              </Panel>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center w-full space-y-8">
            {ocapLink && (
            <div className="w-full max-w-[1900px]">
              <OcapViewer link={ocapLink} />
            </div>
          )}

          {killsChartData.length > 0 && (
            <div className="w-full max-w-[1900px]">
              <KillsChartSquad data={killsChartData} />
            </div>
          )}

          {data.length > 0 && (
            <div className="w-full max-w-[1900px]">
              <SquadChart data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
