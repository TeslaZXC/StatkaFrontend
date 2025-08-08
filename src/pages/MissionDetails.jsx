import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Loader from "../components/Loader";
import OcapViewer from "../components/MissionDetails/OcapViewer";
import SquadTable from "../components/MissionDetails/SquadTable";
import PlayerTable from "../components/MissionDetails/PlayerTable";
import SearchInput from "../components/MissionDetails/SearchInput";

const sortData = (array, field, order) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => {
    const result = a[field] > b[field] ? 1 : -1;
    return order === "asc" ? result : -result;
  });
};

const MissionDetails = () => {
  const { id } = useParams();
  const [squads, setSquads] = useState([]);
  const [players, setPlayers] = useState([]);
  const [missionName, setMissionName] = useState("");
  const [loading, setLoading] = useState(true);

  const [squadSortField, setSquadSortField] = useState("frags");
  const [squadSortOrder, setSquadSortOrder] = useState("desc");

  const [playerSortField, setPlayerSortField] = useState("frags");
  const [playerSortOrder, setPlayerSortOrder] = useState("desc");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [squadsRes, playersRes, missionRes] = await Promise.all([
          axios.get(`https://restfully-winsome-malamute.cloudpub.ru/api/squad-mission-stat?id=${id}`),
          axios.get(`https://restfully-winsome-malamute.cloudpub.ru/api/player-mission-stats?mission_id=${id}`),
          axios.get(`https://restfully-winsome-malamute.cloudpub.ru/api/mission-name/${id}`),
        ]);

        setSquads(squadsRes.data.squads || []);
        setPlayers(playersRes.data.players || []);
        setMissionName(missionRes.data?.mission_name?.mission_name || "");
        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loader />;

  const sortedSquads = sortData(squads, squadSortField, squadSortOrder);
  const sortedPlayers = sortData(players, playerSortField, playerSortOrder);

  const presentSides = ["EAST", "WEST", "GUER"].filter(side =>
    sortedSquads.some(s => s.side === side)
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">📊 Статистика миссии - {missionName || `#${id}`}</h2>

      <div className={`grid gap-6 ${presentSides.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {presentSides.map((side) => (
          <SquadTable
            key={side}
            title={`${side} Side`}
            side={side}
            data={sortedSquads}
            sortField={squadSortField}
            sortOrder={squadSortOrder}
            setSortField={setSquadSortField}
            setSortOrder={setSquadSortOrder}
          />
        ))}
      </div>

      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-4">
        <div className="max-w-6xl mx-auto">
          <OcapViewer missionId={id} />
        </div>
      </div>

      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <PlayerTable
        players={sortedPlayers}
        searchTerm={searchTerm}
        sortField={playerSortField}
        sortOrder={playerSortOrder}
        setSortField={setPlayerSortField}
        setSortOrder={setPlayerSortOrder}
      />
    </div>
  );
};

export default MissionDetails;
