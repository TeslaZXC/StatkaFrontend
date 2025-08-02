import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const SquadStats = () => {
  const { name } = useParams();
  const [squadData, setSquadData] = useState(null);
  const [playersStats, setPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSquadStats = async () => {
      try {
        const res = await axios.get(`https://restfully-winsome-malamute.cloudpub.ru/api/squad-stat/${name}`);
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
            rawName: p.name
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
      <h1 className="text-3xl font-bold mb-4 text-accent">📘 Статистика отряда: {squadData.name}</h1>

      <div className="mb-6 space-y-2">
        <p><strong>Фраги:</strong> {squadData.frags}</p>
        <p><strong>Смерти:</strong> {squadData.deaths}</p>
        <p><strong>K/D:</strong> {squadData.score}</p>
        <p><strong>Средняя посещаемость:</strong> {squadData.average_attendance}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">👥 Участники:</h2>

      <table className="min-w-full text-sm border border-zinc-700">
        <thead className="bg-zinc-800">
          <tr>
            <th className="p-2">Игрок</th>
            <th className="p-2">Фраги</th>
            <th className="p-2">Смерти</th>
            <th className="p-2">K/D</th>
          </tr>
        </thead>
        <tbody>
          {playersStats.map((p, idx) => (
            <tr key={idx} className="border-t border-zinc-700 hover:bg-zinc-800">
              <td className="p-2 text-accent font-medium">
                <Link to={`/player/${p.rawName}`}>{p.fullName}</Link>
              </td>
              <td className="p-2">{p.frags}</td>
              <td className="p-2">{p.deaths}</td>
              <td className="p-2">{p.kd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SquadStats;
