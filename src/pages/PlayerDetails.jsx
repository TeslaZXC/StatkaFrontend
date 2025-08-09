import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import PlayerStatsTable from "../components/PlayerDetails/PlayerStatsTable";
import KillsTable from "../components/PlayerDetails/KillsTable";
import DeathsTable from "../components/PlayerDetails/DeathsTable";

const PlayerDetails = () => {
  const { name } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPlayerData(null);

    axios
      .get(`http://147.45.219.240:8000/api/player-stat/${encodeURIComponent(name)}`)
      .then((res) => {
        setPlayerData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных игрока:", error);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <Loader />;
  if (!playerData) return <div className="p-4 text-red-500">Игрок не найден или произошла ошибка.</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-accent mb-6">👤 Профиль: {name}</h1>
      <PlayerStatsTable playerData={playerData} />
      {Array.isArray(playerData.victims) && <KillsTable kills={playerData.victims} />}
      {Array.isArray(playerData.deaths) && <DeathsTable deaths={playerData.deaths} />}
    </div>
  );
};

export default PlayerDetails;
