import React, { useState } from "react";

const MissionsList = ({ missions }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setShow(!show)}
        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm mb-2"
      >
        {show ? "Скрыть миссии" : "Показать миссии"}
      </button>
      {show && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {missions.map((mission, idx) => {
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
  );
};

export default MissionsList;
