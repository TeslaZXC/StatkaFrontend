import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import OcapViewer from "../components/OcapViewer";
import Loader from "../components/Loader";
import API_BASE_URL from "../api";

const sortData = (array, field, order) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => {
    const result = a[field] > b[field] ? 1 : -1;
    return order === "asc" ? result : -result;
  });
};

const MissionPage = () => {
  const { id } = useParams();
  const [squads, setSquads] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missionName, setMissionName] = useState("");

  const [squadSortField, setSquadSortField] = useState("frags");
  const [squadSortOrder, setSquadSortOrder] = useState("desc");

  const [playerSortField, setPlayerSortField] = useState("frags");
  const [playerSortOrder, setPlayerSortOrder] = useState("desc");

  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const extractName = (fullName) => {
    const match = fullName.match(/(?:[\]\. ]+)([^ ]+)$/);
    return match ? match[1] : fullName;
  };

  const getSideColor = (side) => {
    switch (side) {
      case "EAST":
        return "text-blue-400";
      case "WEST":
        return "text-red-400";
      case "GUER":
        return "text-green-400";
      default:
        return "text-white";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [squadsRes, playersRes, missionRes] = await Promise.all([
          axios.get(`https://restfully-winsome-malamute.cloudpub.ru/api/squad-mission-stat?id=${id}`),
          axios.get(`https://restfully-winsome-malamute.cloudpub.ru/api/player-mission-stats?mission_id=${id}`),
          axios.get(`https://restfully-winsome-malamute.cloudpub.ru/api/mission-name/${id}`),
        ]);

        setSquads(squadsRes.data.squads || []);
        setPlayers(playersRes.data.players || []);
        setMissionName(missionRes.data?.mission_name?.mission_name || "");
        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loader />;

  const sortedSquads = sortData(squads, squadSortField, squadSortOrder);
  const sortedPlayers = sortData(players, playerSortField, playerSortOrder);

  const presentSides = ["EAST", "WEST", "GUER"].filter(side =>
    sortedSquads.some(s => s.side === side)
  );

  const togglePlayerDetails = (name) => {
    setExpandedPlayer(expandedPlayer === name ? null : name);
  };

  const SquadTable = ({ title, side }) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-accent mb-2">{title}</h3>
      <table className="min-w-full text-sm text-left border border-zinc-700">
        <thead className="bg-zinc-800">
          <tr>
            <th className="p-2 cursor-pointer" onClick={() => {
              setSquadSortField("squad");
              setSquadSortOrder(squadSortOrder === "asc" ? "desc" : "asc");
            }}>Squad</th>
            <th className="p-2 cursor-pointer" onClick={() => {
              setSquadSortField("frags");
              setSquadSortOrder(squadSortOrder === "asc" ? "desc" : "asc");
            }}>Frags</th>
            <th className="p-2 cursor-pointer" onClick={() => {
              setSquadSortField("deaths");
              setSquadSortOrder(squadSortOrder === "asc" ? "desc" : "asc");
            }}>Deaths</th>
            <th className="p-2 cursor-pointer" onClick={() => {
              setSquadSortField("players");
              setSquadSortOrder(squadSortOrder === "asc" ? "desc" : "asc");
            }}>Players</th>
          </tr>
        </thead>
        <tbody>
          {sortedSquads.filter(s => s.side === side).map((s, idx) => (
            <tr key={`squad-${idx}`} className="border-t border-zinc-700">
              <td className={`p-2 font-bold ${getSideColor(s.side)}`}>
                <Link to={`/squad-stat/${encodeURIComponent(s.squad)}`} className="hover:underline">
                  {s.squad}
                </Link>
              </td>
              <td className="p-2">{s.frags}</td>
              <td className="p-2">{s.deaths}</td>
              <td className="p-2">{s.players}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">📊 Статистика миссии - {missionName || `#${id}`}</h2>

      <div className={`grid gap-6 ${
        presentSides.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      }`}>
        {presentSides.map((side) => (
          <SquadTable key={side} title={`${side} Side`} side={side} />
        ))}
      </div>

      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-4">
        <div className="max-w-6xl mx-auto">
          <OcapViewer missionId={id} />
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Поиск по имени..."
          className="p-2 bg-zinc-800 border border-zinc-600 rounded w-full text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h3 className="text-xl font-bold text-accent mt-8 mb-2">Игроки</h3>
      <table className="min-w-full text-sm text-left border border-zinc-700">
        <thead className="bg-zinc-800">
          <tr>
            <th className="p-2 cursor-pointer" onClick={() => {
              setPlayerSortField("name");
              setPlayerSortOrder(playerSortOrder === "asc" ? "desc" : "asc");
            }}>Name</th>
            <th className="p-2">Squad</th>
            <th className="p-2">Side</th>
            <th className="p-2 cursor-pointer" onClick={() => {
              setPlayerSortField("frags");
              setPlayerSortOrder(playerSortOrder === "asc" ? "desc" : "asc");
            }}>Frags</th>
            <th className="p-2">Teamkills</th>
            <th className="p-2">Vehicle Kills</th>
            <th className="p-2">Kills Detailed</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers
            .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((p, idx) => (
              <React.Fragment key={`player-${idx}`}>
                <tr className="border-t border-zinc-700">
                  <td className={`p-2 font-bold ${getSideColor(p.side)}`}>
                    <Link to={`/player/${extractName(p.name)}`}>{p.name}</Link>
                  </td>
                  <td className="p-2">
                    {p.squad ? (
                      <Link
                        to={`/squad-stat/${encodeURIComponent(p.squad)}`}
                        className="hover:underline"
                      >
                        {p.squad}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className={`p-2 font-semibold ${getSideColor(p.side)}`}>{p.side}</td>
                  <td className="p-2">{p.frags}</td>
                  <td className="p-2">{p.teamkills}</td>
                  <td className="p-2">{p.vehicle_kills}</td>
                  <td className="p-2">
                    <button
                      className="text-blue-400 underline"
                      onClick={() => togglePlayerDetails(p.name)}
                    >
                      {expandedPlayer === p.name ? "Скрыть" : "Показать"}
                    </button>
                  </td>
                </tr>
                {expandedPlayer === p.name && (
                  <tr className="bg-zinc-900 border-t border-zinc-700">
                    <td colSpan="7" className="p-4">
                      <div>
                        <h4 className="font-bold text-light mb-2">📌 Kills Detailed:</h4>
                        {p.kills_detailed.length === 0 ? (
                          <p>Нет убийств</p>
                        ) : (
                          <ul className="list-disc pl-6">
                            {p.kills_detailed.map((k, i) => (
                              <li key={i}>{k.time} — {k.target} ({k.distance}) [{k.weapon}]</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="mt-4">
                        <h4 className="font-bold text-light">💀 Смерть:</h4>
                        {p.death_detailed ? (
                          <p>{p.death_detailed.time} — убит {p.death_detailed.target} ({p.death_detailed.distance}) [{p.death_detailed.weapon}]</p>
                        ) : (
                          <p>Игрок не умер</p>
                        )}
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

export default MissionPage;
