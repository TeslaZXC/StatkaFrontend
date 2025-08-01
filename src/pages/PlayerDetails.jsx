import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const PlayerDetails = () => {
  const { name } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMissions, setShowMissions] = useState(false);
  const [showKills, setShowKills] = useState(false);
  const [showDeaths, setShowDeaths] = useState(false);

  useEffect(() => {
    axios
      .get(`https://restfully-winsome-malamute.cloudpub.ru/api/player-stat/${name}`)
      .then((res) => {
        setPlayerData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных игрока:", error);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <Loader />;
  if (!playerData) return <div className="p-4 text-red-500">Игрок не найден или произошла ошибка.</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-accent mb-6">👤 Профиль: {playerData.name}</h1>

      <table className="min-w-full max-w-xl text-sm text-left border border-zinc-700 mb-6">
        <tbody>
          <tr className="border-b border-zinc-700"><td className="p-2 font-semibold">Фраги:</td><td className="p-2">{playerData.frags}</td></tr>
          <tr className="border-b border-zinc-700"><td className="p-2 font-semibold">Смерти:</td><td className="p-2">{playerData.deaths}</td></tr>
          <tr className="border-b border-zinc-700">
        <td className="p-2 font-semibold">K/D:</td>
        <td className="p-2">
            {playerData.deaths > 0
            ? (playerData.frags / playerData.deaths).toFixed(4)
            : "∞"}
        </td>
        </tr>
          <tr className="border-b border-zinc-700"><td className="p-2 font-semibold">Отряд:</td>
          <td className="p-2">
            {playerData.squad ? (
              <Link
                to={`/squad-stat/${encodeURIComponent(playerData.squad)}`}
                className="text-inherit hover:underline"
              >
                {playerData.squad}
              </Link>
            ) : (
              "-"
            )}
          </td>
          </tr>
        </tbody>
      </table>

    {Array.isArray(playerData.missions) && (
    <div className="mb-6">
        <button
        onClick={() => setShowMissions(!showMissions)}
        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm mb-2"
        >
        {showMissions ? "Скрыть миссии" : "Показать миссии"}
        </button>
        {showMissions && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {playerData.missions.map((mission, idx) => {
            const filename = decodeURIComponent(
                mission.split("?filename=")[1].split("&")[0]
            );
            return (
                <button
                key={idx}
                onClick={() => (window.location.href = `/mission/${filename}`)}
                className="bg-zinc-800 hover:bg-zinc-700 text-light text-xs px-3 py-2 rounded text-left break-words"
                >
                {filename}
                </button>
            );
            })}
        </div>
        )}
    </div>
    )}

      {Array.isArray(playerData.kills_detailed) && (
        <div className="mb-6">
          <button
            onClick={() => setShowKills(!showKills)}
            className="bg-green-800 hover:bg-green-700 px-4 py-2 rounded text-sm mb-2"
          >
            {showKills ? "Скрыть убийства" : "Показать убийства"}
          </button>
          {showKills && (
            <table className="min-w-full text-xs border border-zinc-700 mt-2">
              <thead className="bg-zinc-800 text-light">
                <tr>
                  <th className="p-2">⏱ Время</th>
                  <th className="p-2">🎯 Цель</th>
                  <th className="p-2">📏 Дистанция</th>
                  <th className="p-2">🔫 Оружие</th>
                </tr>
              </thead>
              <tbody>
                {playerData.kills_detailed.map((kill, idx) => (
                  <tr key={idx} className="border-t border-zinc-700">
                    <td className="p-2">{kill.time}</td>
                    <td className="p-2">{kill.target}</td>
                    <td className="p-2">{kill.distance}</td>
                    <td className="p-2">{kill.weapon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {Array.isArray(playerData.death_detailed) && (
        <div className="mb-6">
          <button
            onClick={() => setShowDeaths(!showDeaths)}
            className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded text-sm mb-2"
          >
            {showDeaths ? "Скрыть смерти" : "Показать смерти"}
          </button>
          {showDeaths && (
            <table className="min-w-full text-xs border border-zinc-700 mt-2">
              <thead className="bg-zinc-800 text-light">
                <tr>
                  <th className="p-2">⏱ Время</th>
                  <th className="p-2">⚔ Убийца</th>
                  <th className="p-2">📏 Дистанция</th>
                  <th className="p-2">🔫 Оружие</th>
                </tr>
              </thead>
              <tbody>
                {playerData.death_detailed.map((death, idx) => (
                  <tr key={idx} className="border-t border-zinc-700">
                    <td className="p-2">{death.time}</td>
                    <td className="p-2">{death.target}</td>
                    <td className="p-2">{death.distance}</td>
                    <td className="p-2">{death.weapon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerDetails;
