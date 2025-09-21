import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

// генерация цвета по нику игрока
const stringToBrightColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

export default function KilledPlayersChart({ killedPlayers = {} }) {
  const chartData = useMemo(() => {
    if (!killedPlayers || Object.keys(killedPlayers).length === 0) return [];

    return Object.entries(killedPlayers)
      .map(([player, kills]) => ({
        player,
        kills: Number(kills) || 0,
        color: stringToBrightColor(player),
      }))
      .sort((a, b) => b.kills - a.kills) // сортировка по киллам
      .slice(0, 10); // только топ-10
  }, [killedPlayers]);

  if (chartData.length === 0)
    return <p className="text-center text-brand-muted">Нет данных по убийствам</p>;

  return (
    <div className="flex justify-center my-6">
      <div className="w-full h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="player"
              type="category"
              width={180}
              tick={{ fill: "#ddd", fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="kills" barSize={25}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="kills"
                position="right"
                style={{ fontSize: 12, fill: "#fff" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
