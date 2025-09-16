import { useMemo } from "react";
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
  const totalMinutes = Math.floor(t);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

const aggregateData = (data, step = 10) => {
  const result = {};
  data.forEach((d) => {
    const bucket = Math.floor(d.time / step) * step;
    if (!result[bucket]) result[bucket] = { time: bucket };
    Object.keys(d).forEach((k) => {
      if (k !== "time") result[bucket][k] = (result[bucket][k] || 0) + d[k];
    });
  });
  return Object.values(result).sort((a, b) => a.time - b.time);
};

export default function SideChart({ data = [] }) {
  const aggregatedData = useMemo(() => aggregateData(data, 10), [data]);

  if (!aggregatedData || aggregatedData.length === 0) return null;

  const sides = Object.keys(aggregatedData[0]).filter(
    (k) => k !== "time" && aggregatedData.some((d) => d[k] > 0)
  );
  const sideColors = { WEST: "#3B82F6", EAST: "#EF4444", GUER: "#10B981" };

  const renderChart = (chartData) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={formatTime} />
        <YAxis />
        <Tooltip formatter={(v) => v} labelFormatter={formatTime} />
        <Legend verticalAlign="top" height={36} />
        {sides.map((s) => (
          <Line
            key={s}
            type="monotone"
            dataKey={s}
            stroke={sideColors[s]}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="flex justify-center my-6">
      <div className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1800px]">
        <div className="flex justify-between items-center p-4">
        </div>
        <div className="overflow-hidden flex flex-col w-full p-4 h-[500px]">
          {renderChart(aggregatedData)}
        </div>
      </div>
    </div>
  );
}
