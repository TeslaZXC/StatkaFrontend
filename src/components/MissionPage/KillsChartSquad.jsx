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

const formatTime = (t) => {
  const totalSeconds = Math.floor(t * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default function KillsChartSquad({ defaultOpen = true, data = [] }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!data || data.length === 0) return null;

  const sides = Object.keys(data[0]).filter((k) => k !== "time" && data.some((d) => d[k] > 0));
  const sideColors = { WEST: "#3B82F6", EAST: "#EF4444", GUER: "#10B981" };

  return (
    <>
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
              className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1800px] h-full"
            >
              <div className="flex justify-between items-center p-4 bg-brand-gray/90">
                <h3 className="font-heading text-lg text-brand-light">График сторон</h3>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-2 py-1 bg-brand-red text-white rounded hover:bg-red-700 text-xs"
                >
                  ✕ Закрыть
                </button>
              </div>
              <div className="flex-1 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(v) => v} labelFormatter={formatTime} />
                    <Legend verticalAlign="top" height={36} />
                    {sides.map((s) => (
                      <Line key={s} type="monotone" dataKey={s} stroke={sideColors[s]} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center my-6">
        <div className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1800px]">
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-brand-gray/80"
            onClick={() => setExpanded(!expanded)}
          >
            <h3 className="font-heading text-lg text-brand-light">График сторон</h3>
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
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip formatter={(v) => v} labelFormatter={formatTime} />
                    <Legend verticalAlign="top" height={36} />
                    {sides.map((s) => (
                      <Line key={s} type="monotone" dataKey={s} stroke={sideColors[s]} strokeWidth={2} />
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
