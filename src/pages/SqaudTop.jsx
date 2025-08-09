import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import PlayerTopTable from "../components/PlayerTop/PlayerTopTable";

const PlayerTop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("kd");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://147.45.219.240:8000/api/player-top")
      .then((res) => {
        // фильтруем игроков с deaths > 0 и считаем kd
        const players = res.data
          .filter(player => player.stats.deaths_count > 0)
          .map(player => {
            const frags = player.stats.frags;
            const deaths = player.stats.deaths_count;
            const missions = player.stats.missions || 0;
            const kd = frags / deaths;
            return {
              name: player.name,
              frags,
              deaths,
              missions,
              kd,
            };
          });
        setData(players);
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
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    return 0;
  });

  const handlePlayerClick = (name) => {
    navigate(`/player/${name}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🏆 Топ игроков</h2>
      <PlayerTopTable
        data={sortedData}
        onSort={handleSort}
        onPlayerClick={handlePlayerClick}
      />
    </div>
  );
};

export default PlayerTop;
