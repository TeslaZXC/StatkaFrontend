import React from "react";

const MissionFilters = ({
  searchTerm,
  setSearchTerm,
  mapFilter,
  setMapFilter,
  mapOptions,
  minPlayers,
  setMinPlayers,
  dateFilter,
  setDateFilter,
  minDurationMinutes,
  setMinDurationMinutes,
}) => {
  return (
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
  );
};

export default MissionFilters;
