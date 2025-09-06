import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Формат времени в ч:м:с
const formatTime = (t) => {
  const totalSeconds = Math.floor(t * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// Генератор яркого уникального цвета по строке (HSL)
const stringToBrightColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360; // Hue от 0 до 359
  const saturation = 75; // насыщенность 75% для яркости
  const lightness = 50;  // средняя яркость
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function SquadChart({ defaultOpen = true, data = [] }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!data || data.length === 0) return null;

  const squads = data.map((s) => s.squad_tag);

  // Все уникальные времена
  const timesSet = new Set();
  data.forEach((squad) => {
    (squad.victims_players ?? []).forEach((v) => timesSet.add(v.time));
  });
  const times = Array.from(timesSet).sort((a, b) => a - b);

  // Формируем график с 0 для отсутствующих данных
  const chartData = times.map((time) => {
    const point = { time };
    data.forEach((squad) => {
      const killsAtTime = (squad.victims_players ?? []).filter((v) => v.time === time).length;
      point[squad.squad_tag] = killsAtTime;
    });
    return point;
  });

  // Создаем объект цветов для каждого отряда
  const squadColors = {};
  squads.forEach((s) => {
    squadColors[s] = stringToBrightColor(s);
  });

  return (
    <>
      {/* Fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1900px] h-full"
            >
              <div className="flex justify-between items-center p-4 bg-brand-gray/90">
                <h3 className="font-heading text-lg text-brand-light">График отрядов</h3>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-2 py-1 bg-brand-red text-white rounded hover:bg-red-700 text-xs"
                >
                  ✕ Закрыть
                </button>
              </div>
              <div className="flex-1 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={formatTime}
                      label={{ value: "Time", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Kills", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(v) => v} labelFormatter={formatTime} />
                    <Legend verticalAlign="top" height={36} />
                    {squads.map((tag) => (
                      <Line
                        key={tag}
                        type="monotone"
                        dataKey={tag}
                        stroke={squadColors[tag]}
                        strokeWidth={2}
                        name={tag}
                        connectNulls={true}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Window */}
      <div className="flex justify-center my-6">
        <div className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1900px]">
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-brand-gray/80"
            onClick={() => setExpanded(!expanded)}
          >
            <h3 className="font-heading text-lg text-brand-light">График отрядов</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(true);
              }}
              className="px-2 py-1 bg-brand-gray text-brand-light rounded hover:bg-brand-gray/70 text-xs"
            >
              ⛶ Во весь экран
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 500, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden flex flex-col w-full p-4"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={formatTime}
                      label={{ value: "Time", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Kills", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(v) => v} labelFormatter={formatTime} />
                    <Legend verticalAlign="top" height={36} />
                    {squads.map((tag) => (
                      <Line
                        key={tag}
                        type="monotone"
                        dataKey={tag}
                        stroke={squadColors[tag]}
                        strokeWidth={2}
                        name={tag}
                        connectNulls={true}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
