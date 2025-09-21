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

// генерация цвета по названию оружия
const stringToBrightColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

export default function WeaponKillsChart({ weapons = {} }) {
  const chartData = useMemo(() => {
    if (!weapons || Object.keys(weapons).length === 0) return [];

    return Object.entries(weapons)
      .map(([weapon, kills]) => ({
        weapon,
        kills: Number(kills) || 0,
        color: stringToBrightColor(weapon),
      }))
      .sort((a, b) => b.kills - a.kills);
  }, [weapons]);

  if (chartData.length === 0)
    return <p className="text-center text-brand-muted">Нет данных по оружию</p>;

  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="weapon"
          hide={true} // 🔥 убрали подписи снизу
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="kills">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList
            dataKey="kills"
            position="top"
            style={{ fontSize: 12, fill: "#fff" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
