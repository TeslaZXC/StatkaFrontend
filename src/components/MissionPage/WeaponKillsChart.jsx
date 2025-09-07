import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell, 
} from "recharts";

const stringToBrightColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

export default function WeaponKillsChart({ defaultOpen = true, data = [] }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chartData = useMemo(() => {
    const counts = {};

    data.forEach((player) => {
      (player.victims_players ?? []).forEach((v) => {
        counts[v.weapon] = (counts[v.weapon] || 0) + 1;
      });
      (player.destroyed_vehicles ?? []).forEach((v) => {
        counts[v.weapon] = (counts[v.weapon] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([weapon, count]) => ({
        weapon,
        kills: count,
        color: stringToBrightColor(weapon),
      }))
      .sort((a, b) => b.kills - a.kills);
  }, [data]);

  if (chartData.length === 0) return null;

  const renderChart = (height = "100%") => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="weapon" angle={-30} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="kills">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

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
              className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1900px] h-full"
            >
              <div className="flex justify-between items-center p-4 bg-brand-gray/90">
                <h3 className="font-heading text-lg text-brand-light">
                  Киллы по оружию
                </h3>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-2 py-1 bg-brand-red text-white rounded hover:bg-red-700 text-xs"
                >
                  ✕ Закрыть
                </button>
              </div>
              <div className="flex-1 p-4">{renderChart("100%")}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center my-6">
        <div className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1900px]">
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-brand-gray/80"
            onClick={() => setExpanded(!expanded)}
          >
            <h3 className="font-heading text-lg text-brand-light">
              Киллы по оружию
            </h3>
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
                {renderChart(500)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
