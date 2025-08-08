import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import PlayerTopTable from "../components/PlayerTop/PlayerTopTable"

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
