import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Loader from "../components/Loader";
import SquadTable from "../components/MissionDetails/SquadTable";
import PlayerTable from "../components/MissionDetails/PlayerTable";
import OcapViewer from "../components/MissionDetails/OcapViewer";  // импортируем твой компонент

const BASE_URL = "http://localhost:8000";

const sortData = (array, field, order) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal === bVal) return 0;
    const result = aVal > bVal ? 1 : -1;
    return order === "asc" ? result : -result;
  });
};

const MissionDetails= () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [missionName, setMissionName] = useState("");

  const [squads, setSquads] = useState([]);
  const [players, setPlayers] = useState([]);

  const [squadSortField, setSquadSortField] = useState("frags");
  const [squadSortOrder, setSquadSortOrder] = useState("desc");
  const [squadFilterField, setSquadFilterField] = useState(null);

  const [playerSortField, setPlayerSortField] = useState("frags");
  const [playerSortOrder, setPlayerSortOrder] = useState("desc");
  const [playerFilterField, setPlayerFilterField] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [squadsRes, playersRes, missionRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/squad-mission-stat`, { params: { id } }),
          axios.get(`${BASE_URL}/api/player-mission-stats`, { params: { mission_id: id } }),
          axios.get(`${BASE_URL}/api/mission-name/${id}`),
        ]);

        const squadsArray = Object.entries(squadsRes.data).map(([name, data]) => ({
          squadName: name,
          ...data,
        }));

        setSquads(squadsArray);
        setPlayers(playersRes.data || []);
        setMissionName(missionRes.data?.mission_name?.mission_name || "");
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader />;

  let filteredSquads = squads;
  if (squadFilterField) {
    filteredSquads = filteredSquads.filter(s => s[squadFilterField] !== undefined);
  }
  const sortedSquads = sortData(filteredSquads, squadSortField, squadSortOrder);

  let filteredPlayers = players;
  if (playerFilterField) {
    filteredPlayers = filteredPlayers.filter(p => p[playerFilterField] !== undefined && p[playerFilterField] !== null);
  }
  const sortedPlayers = sortData(filteredPlayers, playerSortField, playerSortOrder);

  const presentSides = ["EAST", "WEST", "GUER"].filter(side =>
    sortedSquads.some(squad => squad.side === side)
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        📊 Статистика миссии - {missionName || `#${id}`}
      </h2>

      <div className={`grid gap-6 ${presentSides.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {presentSides.map(side => (
        <SquadTable
          key={side}
          title={`${side} Side`}
          side={side}
          data={sortedSquads}
          sortField={squadSortField}
          sortOrder={squadSortOrder}
          setSortField={setSquadSortField}
          setSortOrder={setSquadSortOrder}
          filterField={squadFilterField}
          setFilterField={setSquadFilterField}
          missionId={id} // <-- добавляем
        />
        ))}
      </div>

      {/* --- Вот сюда вставляем компонент просмотра реплея --- */}
      <div className="my-8">
        <OcapViewer missionId={id} />
      </div>

      <PlayerTable
        players={sortedPlayers}
        sortField={playerSortField}
        sortOrder={playerSortOrder}
        setSortField={setPlayerSortField}
        setSortOrder={setPlayerSortOrder}
        filterField={playerFilterField}
        setFilterField={setPlayerFilterField}
      />
    </div>
  );
};

export default MissionDetails;
