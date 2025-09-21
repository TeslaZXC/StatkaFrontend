import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Panel from "../components/ui/Panel"; 
import SquadTable from "../components/MissionPage/SquadTable";
import SquadDetail from "../components/MissionPage/SquadDetail";
import OcapViewer from "../components/MissionPage/OcapViewer";
import KillsChartSquad from "../components/MissionPage/SideChart.jsx";
import SquadComparison from "../components/MissionPage/SquadComparison";
import SquadChart from "../components/MissionPage/SquadChart";
import PlayerTable from "../components/MissionPage/PlayerTable.jsx";
import WeaponKillsChart from "../components/MissionPage/WeaponKillsChart.jsx";

export default function MissionPage() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [ocapLink, setOcapLink] = useState(null);
  const [missionFile, setMissionFile] = useState(null);
  const [missionName, setMissionName] = useState("");

  const [token, setToken] = useState({
    urlOcap: null,
    missionName: "",
    killName: "",
    killerName: "",
    timeKill: "",
    weapon: "",
    distance: "",
    idMission: null,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const resData = await fetch(`${API_BASE_URL}/api/squad-mission-stat?id=${id}`);
        const jsonData = await resData.json();
        setData(jsonData);

        const resMission = await fetch(`${API_BASE_URL}/api/mission-name/${id}`);
        const jsonMission = await resMission.json();
        const file = jsonMission.mission_name.file;
        setMissionFile(file);

        const nameWithoutExt = file.replace(".json", "");
        setMissionName(nameWithoutExt);

        setOcapLink(
          `https://ocap.red-bear.ru/?file=${file}&frame=0&zoom=1.9&x=-128.077&y=128.077&t=${Date.now()}`
        );

        setToken((prev) => ({
          ...prev,
          missionName: nameWithoutExt, 
          urlOcap: `https://ocap.red-bear.ru/?file=${file}&frame=0&zoom=1.9&x=-128.077&y=128.077&t=${Date.now()}`,
        }));

      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, id]);

  useEffect(() => {
    console.log("Token изменился:", token);
  }, [token]);


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

  const handleVictimClick = (payload) => {
    if (!missionFile) return;

    let newLink = "";
    if (typeof payload === "string") {
      newLink = payload.includes("http")
        ? `${payload}${payload.includes("?") ? "&" : "?"}t=${Date.now()}`
        : "";
    } else if (payload) {
      const frame = payload.frame ?? 0;
      const x = payload.position?.x ?? payload.killer_position?.x ?? 0;
      const y = payload.position?.y ?? payload.killer_position?.y ?? 0;

      newLink = `https://ocap.red-bear.ru/?file=${missionFile}&frame=${frame}&zoom=8&x=${x}&y=${y}&t=${Date.now()}`;

      // ✅ обновляем token
      setToken((prev) => ({
        ...prev,
        urlOcap: newLink,
        missionName: missionName, // уже без .json
        killName: payload.name ?? "", // имя жертвы
        killerName: payload.killer_name ?? "", // имя убийцы
        timeKill: payload.time ?? "", // время
        weapon: payload.weapon ?? "", // оружие
        distance: payload.distance ?? "", // дистанция
        idMission: id, // id миссии из useParams()
      }));
    }

    if (!newLink) return;

    console.log("!!!!!!!!!!", JSON.stringify(payload, null, 2));

    setOcapLink(newLink);

    requestAnimationFrame(() => {
      const ocapElement = document.getElementById("ocap-viewer");
      if (ocapElement) {
        ocapElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };


  const killsChartData = useMemo(() => {
    const kills = [];
    data.forEach((squad) => {
      const side = squad.side;
      (squad.victims_players ?? []).forEach((victim) => {
        kills.push({ time: victim.time, side });
      });
    });

    const groupedByTime = {};
    kills.forEach((kill) => {
      const t = kill.time;
      if (!groupedByTime[t]) groupedByTime[t] = { time: t, WEST: 0, EAST: 0, GUER: 0 };
      if (kill.side === "WEST") groupedByTime[t].WEST += 1;
      if (kill.side === "EAST") groupedByTime[t].EAST += 1;
      if (kill.side === "GUER") groupedByTime[t].GUER += 1;
    });

    return Object.values(groupedByTime).sort((a, b) => a.time - b.time);
  }, [data]);

  if (loading || !ocapLink || !missionFile) return <Loader text="Загрузка статистики..." />;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 px-6 py-10 w-full max-w-full space-y-10">
        <h2 className="text-3xl md:text-4xl font-heading text-brand-red text-center">
          Статистика миссии – "{missionName}"
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {["WEST", "GUER", "EAST"].map((side) =>
            grouped[side] ? (
              <div key={side} className="flex-1 min-w-[400px]">
                <Panel title={side} color={sideColors[side]} defaultOpen={true}>
                  <SquadTable
                    squads={grouped[side]}
                    onSelectSquad={setSelectedSquad}
                    onVictimClick={handleVictimClick}
                  />
                </Panel>
              </div>
            ) : null
          )}
        </div>

        <div className="flex justify-center">
          <Panel title="Статистика игроков" color="border-yellow-500" defaultOpen={true} fixedWidth="1200px">
            <PlayerTable onVictimClick={handleVictimClick} missionFile={missionFile} />
          </Panel>
        </div>

        <div className="flex justify-center">
          <Panel title="Просмотр окап" color="border-blue-500" defaultOpen={true} fixedWidth="1200px">
            <div className="flex flex-col items-center w-full space-y-8">
              {ocapLink && (
                <div id="ocap-viewer" className="w-full max-w-[1900px] h-[800px]">
                  <OcapViewer link={ocapLink} />
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="flex justify-center w-full my-6">
          <Panel title="Статистика убийств оружием" color="border-purple-500" defaultOpen={true} fixedWidth="1600px">
            <div className="w-full">
              <WeaponKillsChart data={data} />
            </div>
          </Panel>
        </div>

        {killsChartData.length > 0 && (
          <div className="flex justify-center w-full my-6">
            <Panel title="Статистика убийств по времени" color="border-orange-500" defaultOpen={true} fixedWidth="1600px">
              <div className="w-full">
                <KillsChartSquad data={killsChartData} />
              </div>
            </Panel>
          </div>
        )}

        {data.length > 0 && (
          <>
            <div className="flex justify-center w-full my-6">
              <Panel title="Статистика отрядов" color="border-orange-500" defaultOpen={true} fixedWidth="1600px">
                <div className="w-full">
                  <SquadChart data={data} />
                </div>
              </Panel>
            </div>

            <div className="flex justify-center w-full my-6">
              <Panel title="Сравнение отрядов" color="border-pink-500" defaultOpen={true} fixedWidth="1600px">
                <div className="w-full">
                  <SquadComparison squads={data} />
                </div>
              </Panel>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
