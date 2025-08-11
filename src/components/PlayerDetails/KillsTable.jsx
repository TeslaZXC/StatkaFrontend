import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const extractName = (fullName) => {
  return fullName.replace(/^\[[^\]]+\]\s*/, "");
};

const KillsTable = ({ kills }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const onRowClick = (missionId) => {
    navigate(`/mission/${missionId}`);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShow(!show)}
        className="bg-green-800 hover:bg-green-700 px-4 py-2 rounded text-sm mb-2"
      >
        {show ? "Скрыть убийства" : "Показать убийства"}
      </button>
      {show && (
        <table className="min-w-full text-xs border border-zinc-700 mt-2">
          <thead className="bg-zinc-800 text-light">
            <tr>
              <th className="p-2">📅 Дата миссии</th>
              <th className="p-2">🎯 Цель</th>
              <th className="p-2">📏 Дистанция</th>
              <th className="p-2">🔫 Оружие</th>
            </tr>
          </thead>
          <tbody>
            {kills.map((kill, idx) => (
              <tr
                key={idx}
                className="border-t border-zinc-700 hover:bg-zinc-700 cursor-pointer"
                onClick={() => onRowClick(kill.mission_id)}
                title={`Перейти к миссии ${kill.mission_id}`}
              >
                <td className="p-2">{kill.mission_date}</td>
                <td className="p-2">{kill.victim_name}</td>
                <td className="p-2">{kill.distance}</td>
                <td className="p-2">{kill.weapon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KillsTable;
