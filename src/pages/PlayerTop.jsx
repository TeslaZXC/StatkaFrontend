import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import PlayerTopTable from "../components/PlayerTop/PlayerTopTable";
import SeasonSelect from "../components/SeasonSelect";

const PlayerTop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("kd");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedSeasonFile, setSelectedSeasonFile] = useState("");
  const navigate = useNavigate();

  const fetchPlayerTop = (fileName) => {
    if (!fileName) return; // не грузим, если сезон не выбран

    setLoading(true);
    let url = "http://147.45.219.240:8000/api/player-top";
    url += `?file_name=${encodeURIComponent(fileName)}`;

    axios
      .get(url)
      .then((res) => {
        const players = res.data
          .map((player) => {
            const frags = player.stats.frags;
            const deaths = player.stats.deaths_count;
            if (deaths === 0) return null;
            const kd = frags / deaths;
            return {
              name: player.name,
              frags,
              deaths,
              kd,
            };
          })
          .filter(Boolean);

        setData(players);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlayerTop(selectedSeasonFile);
  }, [selectedSeasonFile]);

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
    navigate(
      `/player/${encodeURIComponent(name)}?file_name=${encodeURIComponent(
        selectedSeasonFile
      )}`
    );
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🏆 Топ игроков</h2>

      <SeasonSelect onSelect={setSelectedSeasonFile} />

      {!selectedSeasonFile ? (
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
