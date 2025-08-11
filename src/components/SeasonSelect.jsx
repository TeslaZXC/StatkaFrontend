import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";

const SeasonSelect = ({ onSelect }) => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/season")
      .then((res) => {
        setSeasons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки сезонов:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="mb-4 flex flex-col gap-2">
      <label className="font-bold text-accent">Выберите сезон:</label>
      <select
        className="border border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-900 text-white p-2 rounded-lg
                   focus:outline-none focus:ring-0 focus:border-transparent
                   hover:from-zinc-700 hover:to-zinc-800 transition-colors duration-200 w-[350px]"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          -- Выберите --
        </option>
        {seasons.map((season) => (
          <option
            key={season.season_number}
            value={season.file_name}
            className="bg-zinc-800 text-white"
          >
            Сезон {season.season_number} ({season.start_date} - {season.end_date})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeasonSelect;
