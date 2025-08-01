import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const PlayerTop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("kd");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://restfully-winsome-malamute.cloudpub.ru/api/player-top")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      });
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const result = a[sortField] > b[sortField] ? 1 : -1;
    return sortOrder === "asc" ? result : -result;
  });

  const handlePlayerClick = (playerName) => {
    navigate(`/player/${playerName}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🏆 Топ игроков</h2>
      <table className="min-w-full text-sm text-left border border-zinc-700">
        <thead className="bg-zinc-800 text-light">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("name")}>Игрок</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("frags")}>Frags</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("deaths")}>Deaths</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("missions")}>Missions</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("kd")}>K/D</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((player, index) => (
            <tr
              key={`player-${index}`}
              className="border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer"
              onClick={() => handlePlayerClick(player.name)}
            >
              <td className="p-2 text-zinc-400">{index + 1}</td>
              <td className="p-2 font-bold text-accent">{player.name}</td>
              <td className="p-2">{player.frags}</td>
              <td className="p-2">{player.deaths}</td>
              <td className="p-2">{player.missions}</td>
              <td className="p-2 font-semibold">
                {typeof player.kd === "number" ? player.kd.toFixed(4) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTop;
