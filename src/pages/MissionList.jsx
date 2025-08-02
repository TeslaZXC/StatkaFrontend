import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

const MissionList = () => {
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [mapFilter, setMapFilter] = useState("");
  const [mapOptions, setMapOptions] = useState([]);
  const [minPlayers, setMinPlayers] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [minDurationMinutes, setMinDurationMinutes] = useState("");

  useEffect(() => {
    axios
      .get("https://restfully-winsome-malamute.cloudpub.ru/api/mission-list")
      .then((res) => {
        setMissions(res.data);
        setFilteredMissions(res.data);

        const uniqueMaps = [
          ...new Set(res.data.map((mission) => mission.map)),
        ].sort();
        setMapOptions(uniqueMaps);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке миссий:", err);
        setLoading(false);
      });
  }, []);

  const parseDurationToMinutes = (durationStr) => {
    const [h, m, s] = durationStr.split(":").map(Number);
    return h * 60 + m + s / 60;
  };

  useEffect(() => {
    let filtered = missions;

    if (searchTerm.trim()) {
      filtered = filtered.filter((m) =>
        m.mission_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (mapFilter) {
      filtered = filtered.filter((m) => m.map === mapFilter);
    }

    if (minPlayers.trim()) {
      filtered = filtered.filter(
        (m) => parseInt(m.total_players) >= parseInt(minPlayers)
      );
    }

    if (dateFilter.trim()) {
      filtered = filtered.filter((m) => m.date === dateFilter);
    }

    if (minDurationMinutes.trim()) {
      filtered = filtered.filter(
        (m) =>
          parseDurationToMinutes(m.duration) >= parseInt(minDurationMinutes)
      );
    }

    setFilteredMissions(filtered);
  }, [searchTerm, mapFilter, minPlayers, dateFilter, minDurationMinutes, missions]);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">📅 Список миссий</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Поиск по имени миссии"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 text-light border border-zinc-600"
        />
        <select
          value={mapFilter}
          onChange={(e) => setMapFilter(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 text-light border border-zinc-600"
        >
          <option value="">🗺️ Все карты</option>
          {mapOptions.map((map) => (
            <option key={map} value={map}>
              {map}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="👥 Мин. игроков"
          value={minPlayers}
          onChange={(e) => setMinPlayers(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 text-light border border-zinc-600"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 text-light border border-zinc-600"
        />
        <input
          type="number"
          placeholder="⏱️ Мин. время (мин)"
          value={minDurationMinutes}
          onChange={(e) => setMinDurationMinutes(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 text-light border border-zinc-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMissions.map((mission) => (
          <div
            key={mission.id}
            className="bg-zinc-800 border border-zinc-700 rounded p-4 hover:shadow-md"
          >
            <h3
              className="text-lg font-bold text-accent hover:underline cursor-pointer"
              onClick={() => window.location.href = `/mission/${mission.id}`}
            >
              {mission.mission_name}
            </h3>
            <p className="text-sm text-light mt-1">🗺️ Карта: {mission.map}</p>
            <p className="text-sm text-light">👥 Игроков: {mission.total_players}</p>
            <p className="text-sm text-light">🕒 Длительность: {mission.duration}</p>
            <p className="text-sm text-light">📅 Дата: {mission.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionList;
