import { useState, useEffect } from "react";

function MissionFilter({ missions, filters, onSearch, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setLocalFilters(filters); 
  }, [filters]);

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
    if (field === "mission_name") setShowSuggestions(true);
  };

  const getUniqueValues = (key) =>
    [...new Set(missions.map((m) => m[key]).filter(Boolean))];

  const filteredMissionNames = getUniqueValues("missionName").filter((name) =>
    name.toLowerCase().includes(localFilters.mission_name.toLowerCase())
  );

  return (
    <div className="mb-10 relative">
      <div className="grid gap-4 md:grid-cols-5 mb-4">
        <select
          value={localFilters.game_type}
          onChange={(e) => handleChange("game_type", e.target.value)}
          className="p-2 rounded-lg bg-brand-gray/80 text-brand-light"
        >
          <option value="">Тип игры</option>
          {getUniqueValues("game_type").map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>

        <select
          value={localFilters.win_side}
          onChange={(e) => handleChange("win_side", e.target.value)}
          className="p-2 rounded-lg bg-brand-gray/80 text-brand-light"
        >
          <option value="">Победившая сторона</option>
          {getUniqueValues("win_side").map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>

        {/* Мир */}
        <select
          value={localFilters.world_name}
          onChange={(e) => handleChange("world_name", e.target.value)}
          className="p-2 rounded-lg bg-brand-gray/80 text-brand-light"
        >
          <option value="">Мир</option>
          {getUniqueValues("worldName").map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            placeholder="Название миссии"
            value={localFilters.mission_name}
            onChange={(e) => handleChange("mission_name", e.target.value)}
            className="p-2 rounded-lg bg-brand-gray/80 text-brand-light w-full placeholder:text-brand-muted"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && filteredMissionNames.length > 0 && (
            <ul className="absolute top-full left-0 min-w-full max-w-screen-md bg-brand-gray/90 max-h-60 overflow-y-auto overflow-x-hidden rounded-lg shadow-lg mt-1 z-20">
              {filteredMissionNames.map((name) => (
                <li
                  key={name}
                  onClick={() => {
                    handleChange("mission_name", name);
                    setShowSuggestions(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-brand-gray/70 text-brand-light"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="date"
          value={localFilters.file_date}
          onChange={(e) => handleChange("file_date", e.target.value)}
          className="p-2 rounded-lg bg-brand-gray/80 text-brand-light"
        />
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => onSearch(localFilters)}
          className="px-4 py-2 bg-brand-red text-brand-light font-heading rounded-lg hover:bg-red-700 transition-colors"
        >
          Поиск
        </button>
        <button
          onClick={() => onReset()}
          className="px-4 py-2 bg-brand-gray text-brand-light font-heading rounded-lg hover:bg-brand-gray/70 transition-colors"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}

export default MissionFilter;
