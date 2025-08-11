import React, { useEffect, useState } from "react";
import axios from "axios";

import Loader from "../components/Loader";
import MissionFilters from "../components/MissionList/MissionFilters";
import MissionCard from "../components/MissionList/MissionCard";

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
      .get("http://localhost:8000/api/mission-list")
      .then((res) => {
        setMissions(res.data);
        setFilteredMissions(res.data);

        const uniqueMaps = [...new Set(res.data.map((m) => m.map))].sort();
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
      filtered = filtered.filter((m) => {
        const playersNum = parseInt(m.players) || 0; // пустая строка станет 0
        return playersNum >= parseInt(minPlayers);
      });
    }

    if (dateFilter.trim()) {
      filtered = filtered.filter((m) => m.date === dateFilter);
    }

    if (minDurationMinutes.trim()) {
      filtered = filtered.filter(
        (m) => parseDurationToMinutes(m.duration) >= parseInt(minDurationMinutes)
      );
    }

    setFilteredMissions(filtered);
  }, [searchTerm, mapFilter, minPlayers, dateFilter, minDurationMinutes, missions]);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">📅 Список миссий</h2>

      <MissionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        mapFilter={mapFilter}
        setMapFilter={setMapFilter}
        mapOptions={mapOptions}
        minPlayers={minPlayers}
        setMinPlayers={setMinPlayers}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        minDurationMinutes={minDurationMinutes}
        setMinDurationMinutes={setMinDurationMinutes}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
};

export default MissionList;
