import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cleanPlayerName } from "../../cleanPlayerName";

export default function PlayerWeeklyStats({ weekly = {} }) {
  const [currentPage, setCurrentPage] = useState(1);
  const weeksPerPage = 10;
  const [openWeek, setOpenWeek] = useState(null);

  const sortedWeeks = useMemo(() => {
    return Object.entries(weekly)
      .sort(([a], [b]) => {
        const dateA = new Date(a.split(" - ")[0].replace(/_/g, "-"));
        const dateB = new Date(b.split(" - ")[0].replace(/_/g, "-"));
        return dateB - dateA;
      });
  }, [weekly]);

  const totalPages = Math.ceil(sortedWeeks.length / weeksPerPage);
  const startIndex = (currentPage - 1) * weeksPerPage;
  const currentWeeks = sortedWeeks.slice(startIndex, startIndex + weeksPerPage);

  if (sortedWeeks.length === 0)
    return <p className="text-center text-brand-muted">Нет недельной статистики</p>;

  return (
    <div className="w-full text-brand-light">
      <h3 className="text-2xl font-bold mb-4 text-center">Недельная статистика</h3>

      <div className="space-y-4">
        {currentWeeks.map(([weekRange, data]) => {
          const isOpen = openWeek === weekRange;
          return (
            <motion.div
              key={weekRange}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-brand-gray/20 border border-brand-gray rounded-2xl p-4"
            >
              <button
                onClick={() => setOpenWeek(isOpen ? null : weekRange)}
                className="w-full text-left font-semibold text-lg flex justify-between items-center"
              >
                <span>{weekRange}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Основная статистика */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="p-2 bg-brand-red/20 rounded-xl text-center">
                        <p>Матчей</p>
                        <p className="font-bold">{data.matches}</p>
                      </div>
                      <div className="p-2 bg-brand-yellow/20 rounded-xl text-center">
                        <p>Фраги</p>
                        <p className="font-bold">{data.frags}</p>
                      </div>
                      <div className="p-2 bg-brand-blue/20 rounded-xl text-center">
                        <p>Пехота</p>
                        <p className="font-bold">{data.frags_inf}</p>
                      </div>
                      <div className="p-2 bg-brand-orange/20 rounded-xl text-center">
                        <p>Техника</p>
                        <p className="font-bold">{data.frags_veh}</p>
                      </div>
                      <div className="p-2 bg-brand-red/20 rounded-xl text-center">
                        <p>Смерти</p>
                        <p className="font-bold">{data.death}</p>
                      </div>
                      <div className="p-2 bg-brand-purple/20 rounded-xl text-center">
                        <p>Унич. техники</p>
                        <p className="font-bold">{data.destroyed_veh}</p>
                      </div>
                      <div className="p-2 bg-brand-green/20 rounded-xl text-center">
                        <p>KD Общее</p>
                        <p className="font-bold">{data.kd_ratio?.toFixed(2)}</p>
                      </div>
                      <div className="p-2 bg-brand-blue/20 rounded-xl text-center">
                        <p>KD Пехота</p>
                        <p className="font-bold">{data.kd_inf?.toFixed(2)}</p>
                      </div>
                      <div className="p-2 bg-brand-orange/20 rounded-xl text-center">
                        <p>KD Техника</p>
                        <p className="font-bold">{data.kd_veh?.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Детали */}
                    <div className="mt-4 space-y-2 text-sm">
                      {data.killed_players && Object.keys(data.killed_players).length > 0 && (
                        <details className="bg-brand-gray/30 rounded-lg p-2">
                          <summary className="font-medium cursor-pointer">
                            Убитые игроки ({Object.keys(data.killed_players).length})
                          </summary>
                          <ul className="mt-2 list-disc list-inside max-h-60 overflow-y-auto">
                            {Object.entries(data.killed_players).map(([p, k], i) => (
                              <li key={i}>
                                <a
                                  href={`/player/${encodeURIComponent(cleanPlayerName(p))}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-red hover:underline"
                                >
                                  {p}
                                </a>
                                : {k} убийств
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Пагинация */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-brand-gray/40 text-gray-500 cursor-not-allowed"
              : "bg-brand-gray hover:bg-brand-gray/70"
          }`}
        >
          ⬅ Назад
        </button>

        <span className="text-sm">
          Стр. {currentPage} из {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-brand-gray/40 text-gray-500 cursor-not-allowed"
              : "bg-brand-gray hover:bg-brand-gray/70"
          }`}
        >
          Вперёд ➡
        </button>
      </div>
    </div>
  );
}
