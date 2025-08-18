import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import SquadTopTable from "../components/SquadTop/SquadTopTable";
import SeasonSelect from "../components/SeasonSelect";

const SquadTop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);

    axios
      .get(`http://147.45.219.240:8000/api/squad_top?id=${encodeURIComponent(selectedId)}`)
      .then((res) => {
        const squads = Object.entries(res.data).map(([name, stats]) => {
          return {
            name,
            frags: stats.frags,
            deaths: stats.deaths,
            teamkills: stats.teamkills,
            score: stats.score,
            kd: stats.deaths > 0 ? stats.frags / stats.deaths : stats.frags,
          };
        });
        setData(squads);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных:", err);
        setLoading(false);
      });
  }, [selectedId]);

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

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🏆 Топ отрядов</h2>

      <SeasonSelect onSelect={(id) => setSelectedId(id)} />

      {!selectedId ? (
        <p className="mt-4 text-center text-gray-400">
          Пожалуйста, выберите период для отображения таблицы.
        </p>
      ) : loading ? (
        <Loader />
      ) : (
      <SquadTopTable
        data={sortedData}
        onSort={handleSort}
        onRowClick={(name) => {
          const url = `/squad-stat/${encodeURIComponent(selectedId)}/${encodeURIComponent(name)}`;
          window.open(url, "_blank", "noopener,noreferrer");
        }}
      />
      )}
    </div>
  );
};

export default SquadTop;
