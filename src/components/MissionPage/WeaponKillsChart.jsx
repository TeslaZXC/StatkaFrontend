import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const stringToBrightColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

export default function WeaponKillsChart({ data = [] }) {
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

  return (
    <div className="flex justify-center my-6">
      <div className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1900px] h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="weapon" hide /> 
            <YAxis />
            <Tooltip />
            <Bar dataKey="kills">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="weapon"
                position="top"
                angle={0}
                style={{ fontSize: 12, fill: "#fff" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
