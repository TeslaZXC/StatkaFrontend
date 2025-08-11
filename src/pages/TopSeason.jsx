import React, { useState, useEffect } from "react";
import axios from "axios";
import SeasonSelect from "../components/SeasonSelect";
import Loader from "../components/Loader";

const placeStyles = {
  1: {
    container: "order-2",
    card:
      "bg-yellow-400/20 hover:bg-yellow-400/50 shadow-yellow-400 text-yellow-100",
  },
  2: {
    container: "order-3",
    card: "bg-gray-300/20 hover:bg-gray-300/50 shadow-gray-300 text-gray-200",
  },
  3: {
    container: "order-1",
    card:
      "bg-amber-700/20 hover:bg-amber-700/50 shadow-amber-700 text-amber-100",
  },
};

const TopSeason = () => {
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileName) return;

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8000/api/top-season?file_name=${fileName}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки данных топа сезона");
        setLoading(false);
      });
  }, [fileName]);

  const renderTop = (items, type = "player") => {
    return (
      <div className="flex justify-center items-end gap-16 max-w-5xl mx-auto px-2">
        {[3, 1, 2].map((pos) => {
          const item = items[pos - 1];
          if (!item) return null;

          const { container, card } = placeStyles[pos];
          const nameOrTag = type === "player" ? item.name : item.tag;
          const stats = item.stats;
          const kd = item.kd;

          return (
            <div
              key={nameOrTag}
              className={`flex flex-col items-center rounded-lg p-8 shadow-lg cursor-pointer transition-all duration-300 ${container} ${card}`}
              style={{
                width: type === "player" ? "300px" : "220px",
                height: "320px",
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              <h4
                className="text-3xl font-bold mb-6 select-none text-center break-words max-w-full"
                style={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                #{pos} {nameOrTag}
              </h4>
              <div
                className="text-lg flex flex-col gap-2 w-full"
                style={{
                  maxHeight: type === "player" ? "none" : "170px",
                  overflowY: type === "player" ? "visible" : "auto",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                <p style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                  Фраги: {stats.frags}
                </p>
                <p style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                  Тимкиллы: {stats.teamkills}
                </p>
                <p style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                  Смерти: {type === "player" ? stats.deaths_count : stats.deaths}
                </p>
                {type === "player" && (
                  <>
                    <p style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                      Отряд: {stats.group}
                    </p>
                    <p style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                      Сторона: {stats.side}
                    </p>
                  </>
                )}
                <p
                  className="mt-4 font-semibold text-xl"
                  style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                >
                  K/D: {kd.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center text-white">
      <h2 className="text-4xl font-bold mb-6 text-accent animate-fade-in-up text-center">
        Топ за сезон
      </h2>

      <SeasonSelect onSelect={setFileName} />

      {loading && <Loader />}

      {error && (
        <p className="text-red-500 mt-4 font-semibold animate-fade-in text-center">
          {error}
        </p>
      )}

      {data && (
        <div className="w-full max-w-5xl space-y-20 mt-8 px-2">
          {/* ТОП ОТРЯДОВ */}
          <section>
            <h3 className="text-3xl font-semibold mb-8 border-b border-accent pb-3 text-center">
              Топ 3 отряда
            </h3>
            {renderTop(data.top_squads, "squad")}
          </section>

          {/* ТОП ИГРОКОВ */}
          <section>
            <h3 className="text-3xl font-semibold mb-8 border-b border-accent pb-3 text-center">
              Топ 3 игрока
            </h3>
            {renderTop(data.top_players, "player")}
          </section>
        </div>
      )}
    </div>
  );
};

export default TopSeason;
