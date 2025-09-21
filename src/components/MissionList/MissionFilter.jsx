import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MissionFilter({ filters, onSearch, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [filterOptions, setFilterOptions] = useState({
    game_types: [],
    win_sides: [],
    world_names: [],
    mission_names: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Загружаем варианты фильтров с API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/mission-filter`)
      .then((res) => res.json())
      .then((data) => {
        if (data.mission_name) {
          setFilterOptions({
            game_types: data.mission_name.game_types || [],
            win_sides: data.mission_name.win_sides || [],
            world_names: data.mission_name.world_names || [],
            mission_names: data.mission_name.mission_names || [],
          });
        }
      })
      .catch((err) => console.error("Ошибка загрузки фильтров:", err));
  }, []);

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
    if (field === "mission_name") setShowSuggestions(true);
  };

  const filteredMissionNames = filterOptions.mission_names.filter((name) =>
    name.toLowerCase().includes(localFilters.mission_name.toLowerCase())
  );

  return (
    <div className="mb-10 relative">
      <div className="grid gap-4 md:grid-cols-5 mb-4">
        {/* Тип игры */}
        <select
          value={localFilters.game_type}
          onChange={(e) => handleChange("game_type", e.target.value)}
          className="p-2 rounded-lg bg-brand-gray/80 text-brand-light"
        >
          <option value="">Тип игры</option>
          {filterOptions.game_types.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        {/* Победившая сторона */}
        <select
          value={localFilters.win_side}
          onChange={(e) => handleChange("win_side", e.target.value)}
          className="p-2 rounded-lg bg-brand-gray/80 text-brand-light"
        >
          <option value="">Победившая сторона</option>
          {filterOptions.win_sides.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        {/* Мир */}
        <select
          value={localFilters.world_name}
          onChange={(e) => handleChange("world_name", e.target.value)}
          className="p-2 rounded-lg bg-brand-gray/80 text-brand-light"
        >
          <option value="">Мир</option>
          {filterOptions.world_names.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        {/* Название миссии */}
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

        {/* Дата с календарём */}
        <DatePicker
          selected={localFilters.file_date ? new Date(localFilters.file_date) : null}
          onChange={(date) => {
            if (date) {
              const iso = date.toISOString().split("T")[0];
              handleChange("file_date", iso);
            } else {
              handleChange("file_date", "");
            }
          }}
          placeholderText="Выберите дату"
          dateFormat="dd.MM.yyyy"
          className="p-2 rounded-lg bg-brand-gray/80 text-brand-light w-full"
        />
      </div>

      {/* Кнопки */}
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
