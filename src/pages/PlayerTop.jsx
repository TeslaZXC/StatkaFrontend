import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import PlayerTopTable from "../components/PlayerTop/PlayerTopTable";
import SeasonSelect from "../components/SeasonSelect";
import StatTypeSelect from "../components/PlayerTop/StatTypeSelect";
import API_BASE_URL from "../api";

const PlayerTop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("kd");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [statType, setStatType] = useState("all");
  const navigate = useNavigate();

  const fetchPlayerTop = async (fileName) => {
  if (!fileName) return;

  setLoading(true);
  let url = `${API_BASE_URL}/api/player-top`;

  if (statType === "veh") url = `${API_BASE_URL}/api/player-top-veh`;
  if (statType === "inf") url = `${API_BASE_URL}/api/player-top-inf`;
  try {
    const res = await axios.get(url, {
      params: { id: fileName },
    });

    const players = res.data.map((player) => {
      let kills = 0;
      if (statType === "all") kills = player.stats.frags;
      if (statType === "inf") kills = player.stats.frag_inf;
      if (statType === "veh") kills = player.stats.frag_veh;

      const deaths = player.stats.deaths_count || 1;
      const missions = player.stats.missions_played || 1;

      return {
        name: player.name,
        frags: kills,
        deaths,
        kd: kills / deaths,
        score: kills / missions,
        destroyed_vehicles: player.stats.destroyed_vehicles,
      };
    });

    setData(players);
  } catch (err) {
    console.error("Ошибка загрузки данных:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPlayerTop(selectedSeasonId);
  }, [selectedSeasonId, statType]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    return 0;
  });

  const handlePlayerClick = (name) => {
    if (!selectedSeasonId) return;
    navigate(`/player/${selectedSeasonId}/${encodeURIComponent(name)}`);
  };


  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🏆 Топ игроков</h2>

      <SeasonSelect onSelect={setSelectedSeasonId} />
      <StatTypeSelect value={statType} onChange={setStatType} />

      {!selectedSeasonId ? (
        <p>Пожалуйста, выберите период для отображения таблицы.</p>
      ) : loading ? (
        <Loader />
      ) : (
        <PlayerTopTable
          data={sortedData}
          onSort={handleSort}
          onPlayerClick={handlePlayerClick}
        />
      )}
    </div>
  );
};

export default PlayerTop;
