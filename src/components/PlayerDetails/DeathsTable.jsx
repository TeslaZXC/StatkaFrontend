import { Link } from "react-router-dom";
import React, { useState } from "react";

const extractName = (fullName) => {
  const match = fullName.match(/(?:[\]\. ]+)([^ ]+)$/);
  return match ? match[1] : fullName;
};

const DeathsTable = ({ deaths }) => {
  const [show, setShow] = useState(false);

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
              <th className="p-2">⏱ Время</th>
              <th className="p-2">⚔ Убийца</th>
              <th className="p-2">📏 Дистанция</th>
              <th className="p-2">🔫 Оружие</th>
            </tr>
          </thead>
          <tbody>
            {deaths.map((death, idx) => (
              <tr key={idx} className="border-t border-zinc-700">
                <td className="p-2">{death.time}</td>
                <td className="p-2">
                  <Link
                    to={`/player/${extractName(death.target)}`}
                    className="hover:underline"
                  >
                    {death.target}
                  </Link>
                </td>
                <td className="p-2">{death.distance}</td>
                <td className="p-2">{death.weapon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeathsTable;
