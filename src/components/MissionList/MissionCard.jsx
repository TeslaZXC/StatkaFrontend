import React from "react";

const MissionCard = ({ mission }) => (
  <div
    className="bg-zinc-800 border border-zinc-700 rounded p-4 hover:shadow-md"
    onClick={() => window.location.href = `/mission/${mission.id}`}
  >
    <h3 className="text-lg font-bold text-accent hover:underline cursor-pointer">
      {mission.mission_name}
    </h3>
    <p className="text-sm text-light mt-1">🗺️ Карта: {mission.map}</p>
    <p className="text-sm text-light">👥 Игроков: {mission.total_players}</p>
    <p className="text-sm text-light">🕒 Длительность: {mission.duration}</p>
    <p className="text-sm text-light">📅 Дата: {mission.date}</p>
  </div>
);

export default MissionCard;
