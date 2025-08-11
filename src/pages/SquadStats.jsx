import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import SquadInfo from "../components/SquadStats/SquadInfo";
import SquadMembersTable from "../components/SquadStats/SquadMembersTable";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SquadStats = () => {
  const query = useQuery();
  const file_name = query.get("file_name");
  const tag = query.get("tag");

  const [squadData, setSquadData] = useState(null);
  const [playersStats, setPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSquadStats = async () => {
      if (!file_name || !tag) {
        setSquadData(null);
        setPlayersStats([]);
        setLoading(false);
        setError("Отсутствуют необходимые параметры file_name или tag");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get("http://localhost:8000/api/squad-stat", {
          params: { file_name, tag },
        });

        if (!res.data) {
          throw new Error("Данные отряда не найдены");
        }

        setSquadData(res.data);

        const playersRes = await axios.get("http://localhost:8000/api/team-players", {
          params: { file_name, tag },
        });

        const players = playersRes.data.map((player) => {
          const frags = player.stats.frags || 0;
          const teamkills = player.stats.teamkills || 0;
          const deaths_count = player.stats.deaths_count || 0;
          const kd = deaths_count === 0 ? frags : (frags / deaths_count).toFixed(2);

          return {
            rawName: player.name,
            fullName: player.name,
            frags,
            teamkills,
            deaths: deaths_count,
            kd,
          };
        });

        setPlayersStats(players);
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
        setSquadData(null);
        setPlayersStats([]);
        setError(err.message || "Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchSquadStats();
  }, [file_name, tag]);

  if (loading) return <Loader />;

  if (error) return <p className="text-red-500">Ошибка: {error}</p>;

  if (!squadData) return <p>Ошибка загрузки данных отряда</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-accent">
        📘 Статистика отряда: {squadData.name}
      </h1>

      <SquadInfo squad={squadData} />

      <h2 className="text-xl font-semibold mb-2">👥 Участники:</h2>
      <SquadMembersTable players={playersStats} fileName={file_name} />
    </div>
  );
};

export default SquadStats;
