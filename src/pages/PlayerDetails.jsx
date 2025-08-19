import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import PlayerStatsTable from "../components/PlayerDetails/PlayerStatsTable";
import KillsTable from "../components/PlayerDetails/KillsTable";
import DeathsTable from "../components/PlayerDetails/DeathsTable";
import PlayerKillsDeathsChart from "../components/PlayerDetails/PlayerKillsDeathsChart";
import API_BASE_URL from "../api";

const PlayerDetails = () => {
  const { id, name } = useParams(); 
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !name) {
      setPlayerData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setPlayerData(null);

    axios
      .get(`${API_BASE_URL}/api/player-stat`, {
        params: {
          id: id,
          player_name: name,
        },
      })
      .then((res) => {
        setPlayerData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных игрока:", error);
        setLoading(false);
      });
  }, [id, name]);

  if (loading) return <Loader />;
  if (!playerData)
    return (
      <div className="p-4 text-red-500">
        Игрок не найден или произошла ошибка.
      </div>
    );

  return (
    <div className="p-4" style={{ overflowX: "auto" }}>
      <h1 className="text-3xl font-bold text-accent mb-6">
        👤 Профиль: {name}
      </h1>

      <PlayerStatsTable playerData={playerData} />

      <div style={{ minWidth: 900, width: "100%" }}>
        <PlayerKillsDeathsChart playerData={playerData} height={450} width="100%" />
      </div>

      <KillsTable kills={playerData?.victims ?? []} />
      <DeathsTable deaths={playerData?.deaths ?? []} />
    </div>
  );
};

export default PlayerDetails;
