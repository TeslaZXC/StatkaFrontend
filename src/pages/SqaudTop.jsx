import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import SquadTopTable from "../components/SquadTop/SquadTopTable";

const SquadTop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("kd");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    axios
      .get("http://147.45.219.240:8000/api/squad_top")
      .then((res) => {
        // Преобразуем объект в массив и добавляем kd
        const squads = Object.entries(res.data).map(([name, stats]) => {
          const frags = stats.frags;
          const deaths = stats.deaths;
          const teamkills = stats.teamkills;
          const kd = deaths > 0 ? frags / deaths : frags;
          return { name, frags, deaths, teamkills, kd };
        });
        setData(squads);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных:", err);
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

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🏆 Топ отрядов</h2>
      <SquadTopTable
        data={sortedData}
        onSort={handleSort}
        onRowClick={(name) => console.log(`Нажали на отряд: ${name}`)}
      />
    </div>
  );
};

export default SquadTop;
