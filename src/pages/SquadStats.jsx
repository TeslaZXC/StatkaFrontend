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
        const res = await axios.get(
          `https://restfully-winsome-malamute.cloudpub.ru/api/squad-stat/${name}`
        );
        setSquadData(res.data);

        const playerRequests = res.data.members.map(async (playerName) => {
          const playerRes = await axios.get(
            `https://restfully-winsome-malamute.cloudpub.ru/api/player-stat/${playerName}`
          );
          const p = playerRes.data;
          const frags = p.frags || 0;
          const deaths = p.deaths || 0;
          const kd = deaths === 0 ? frags : (frags / deaths).toFixed(2);

          return {
            fullName: `[${p.squad}] ${p.name}`,
            frags,
            deaths,
            kd,
            rawName: p.name,
          };
        });

        const results = await Promise.all(playerRequests);
        results.sort((a, b) => parseFloat(b.kd) - parseFloat(a.kd));
        setPlayersStats(results);
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
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
