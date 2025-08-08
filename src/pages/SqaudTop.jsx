import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import SquadTopTable from "../components/SquadTop/SquadTopTable";
import { useNavigate } from "react-router-dom";

const SquadTop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://restfully-winsome-malamute.cloudpub.ru/api/squad_top")
      .then((res) => {
        const squads = Object.entries(res.data).map(([name, values]) => ({
          name,
          ...values,
        }));
        setData(squads);
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

  const handleRowClick = (squadName) => {
    navigate(`/squad-stat/${encodeURIComponent(squadName)}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🎖️ Топ отрядов</h2>
      <SquadTopTable data={sortedData} onSort={handleSort} onRowClick={handleRowClick} />
    </div>
  );
};

export default SquadTop;
