import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PlayerKillsDeathsChart = ({ playerData }) => {
  const data = useMemo(() => {
    if (!playerData) return [];

    const killsCount = {};
    (playerData.victims || []).forEach(({ mission_date }) => {
      killsCount[mission_date] = (killsCount[mission_date] || 0) + 1;
    });

    const deathsCount = {};
    (playerData.deaths || []).forEach(({ mission_date }) => {
      deathsCount[mission_date] = (deathsCount[mission_date] || 0) + 1;
    });

    const allDatesSet = new Set([
      ...Object.keys(killsCount),
      ...Object.keys(deathsCount),
    ]);

    return Array.from(allDatesSet)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((date) => ({
        date,
        kills: killsCount[date] || 0,
        deaths: deathsCount[date] || 0,
      }));
  }, [playerData]);

  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart data={data} margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#ddd" tick={{ fill: "#ddd" }} tickFormatter={(date) => date.slice(5)} />
        <YAxis stroke="#ddd" tick={{ fill: "#ddd" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#18181b", borderRadius: 8, border: "none" }}
          labelStyle={{ color: "#eee" }}
          itemStyle={{ color: "#eee" }}
        />
        <Legend
          wrapperStyle={{ color: "#ccc", fontWeight: "bold", textAlign: "center" }}
          verticalAlign="top"
          align="center"
          height={36}
        />
        <Line type="monotone" dataKey="kills" stroke="#22c55e" strokeWidth={3} activeDot={{ r: 6 }} name="Убийства" />
        <Line type="monotone" dataKey="deaths" stroke="#f87171" strokeWidth={3} activeDot={{ r: 6 }} name="Смерти" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PlayerKillsDeathsChart;
