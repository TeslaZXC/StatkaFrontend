import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeathsTable = ({ deaths }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const onRowClick = (missionId) => {
    navigate(`/mission/${missionId}`);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShow(!show)}
        className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded text-sm mb-2"
      >
        {show ? "Скрыть смерти" : "Показать смерти"}
      </button>
      {show && (
        <table className="min-w-full text-xs border border-zinc-700 mt-2">
          <thead className="bg-zinc-800 text-light">
            <tr>
              <th className="p-2">📅 Дата миссии</th>
              <th className="p-2">⏱ Время</th>
              <th className="p-2">⚔ Убийца</th>
              <th className="p-2">📏 Дистанция</th>
              <th className="p-2">🔫 Оружие</th>
              <th className="p-2">Тип смерти</th>
            </tr>
          </thead>
          <tbody>
            {deaths.map((death, idx) => (
              <tr
                key={idx}
                className="border-t border-zinc-700 hover:bg-zinc-700 cursor-pointer"
                onClick={() => onRowClick(death.mission_id)}
                title={`Перейти к миссии ${death.mission_id}`}
              >
                <td className="p-2">{death.mission_date}</td>
                <td className="p-2">{death.time}</td>
                <td className="p-2">{death.victim_name}</td>
                <td className="p-2">{death.distance}</td>
                <td className="p-2">{death.weapon}</td>
                <td className="p-2">{death.frag_type || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeathsTable;