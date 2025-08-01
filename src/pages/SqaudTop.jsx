import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const SquadTop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedSquads, setExpandedSquads] = useState({});
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

  const toggleMembers = (name) => {
    setExpandedSquads((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full text-sm text-left border border-zinc-700">
        <thead className="bg-zinc-800 text-light">
          <tr>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("name")}>Отряд</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("frags")}>Frags</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("deaths")}>Deaths</th>
            <th className="p-2">Members</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("missions")}>Missions</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("score")}>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((squad) => (
            <React.Fragment key={`squad-${squad.name}`}>
              <tr className="border-t border-zinc-700">
                <td className="p-2 font-bold text-accent">{squad.name}</td>
                <td className="p-2">{squad.frags}</td>
                <td className="p-2">{squad.deaths}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 text-xs rounded bg-zinc-700 hover:bg-zinc-600"
                    onClick={() => toggleMembers(squad.name)}
                  >
                    {expandedSquads[squad.name] ? "Скрыть" : "Показать"}
                  </button>
                </td>
                <td className="p-2">{squad.missions}</td>
                <td className="p-2 font-semibold">{squad.score.toFixed(4)}</td>
              </tr>
              {expandedSquads[squad.name] && (
                <tr className="border-t border-zinc-700">
                  <td colSpan={6} className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {squad.members.filter(Boolean).map((member) => (
                        <button
                          key={`player-${squad.name}-${member}`}
                          className="px-3 py-1 bg-zinc-800 text-light text-xs rounded hover:bg-zinc-700"
                          onClick={() => navigate(`/player/${encodeURIComponent(member)}`)}
                        >
                          {member}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SquadTop;
