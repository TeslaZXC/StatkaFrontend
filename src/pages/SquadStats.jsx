import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import SquadInfo from "../components/SquadStats/SquadInfo";
import SquadMembersTable from "../components/SquadStats/SquadMembersTable";

const SquadStats = () => {
  const { name } = useParams();
  const [squadData, setSquadData] = useState(null);
  const [playersStats, setPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSquadStats = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://147.45.219.240:8000/api/squad-stat/${encodeURIComponent(name)}`
        );
        setSquadData(res.data);

        const playersRes = await axios.get(
          `http://147.45.219.240:8000/api/team-players?tag=${encodeURIComponent(name)}`
        );

        const players = playersRes.data.map(player => {
          const frags = player.stats.frags;
          const teamkills = player.stats.teamkills;
          const deaths_count = player.stats.deaths_count;
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
        setPlayersStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSquadStats();
  }, [name]);

  if (loading) return <Loader />;
  if (!squadData) return <p>Ошибка загрузки данных отряда</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-accent">
        📘 Статистика отряда: {squadData.name}
      </h1>

      <SquadInfo squad={squadData} />

      <h2 className="text-xl font-semibold mb-2">👥 Участники:</h2>
      <SquadMembersTable players={playersStats} />
    </div>
  );
};

export default SquadStats;
