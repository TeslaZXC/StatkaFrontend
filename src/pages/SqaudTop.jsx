import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
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

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">🎖️ Топ отрядов</h2>
      <table className="min-w-full text-sm text-left border border-zinc-700">
        <thead className="bg-zinc-800 text-light">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("name")}>Отряд</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("frags")}>Frags</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("deaths")}>Deaths</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("missions")}>Missions</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("score")}>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((squad, index) => (
            <tr key={`squad-${squad.name}`} className="border-t border-zinc-700 hover:bg-zinc-800">
              <td className="p-2 text-zinc-400">{index + 1}</td>
              <td
                className="p-2 font-bold text-accent cursor-pointer"
                onClick={() => navigate(`/squad-stat/${encodeURIComponent(squad.name)}`)}
              >
                {squad.name}
              </td>
              <td className="p-2">{squad.frags}</td>
              <td className="p-2">{squad.deaths}</td>
              <td className="p-2">{squad.missions}</td>
              <td className="p-2 font-semibold">{squad.score.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SquadTop;
