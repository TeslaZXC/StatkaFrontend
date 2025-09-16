import { useState, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const stringToBrightColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 75%, 50%)`;
};

export default function SquadComparison({ squads = [] }) {
  const [squadA, setSquadA] = useState(null);
  const [squadB, setSquadB] = useState(null);

  const availableSquads = useMemo(() => squads.map((s) => s.squad_tag.toUpperCase()), [squads]);

  const chartData = useMemo(() => {
    if (!squadA || !squadB) return [];

    const squadDataA = squads.find((s) => s.squad_tag.toUpperCase() === squadA);
    const squadDataB = squads.find((s) => s.squad_tag.toUpperCase() === squadB);

    const calcKD = (frags, deaths) => (deaths === 0 ? frags : (frags / deaths).toFixed(2));
    const calcTKPercent = (tk, frags) => (frags === 0 ? 0 : ((tk / frags) * 100).toFixed(1));

    return [
      { metric: "Frags", [squadA]: squadDataA?.frags ?? 0, [squadB]: squadDataB?.frags ?? 0 },
      { metric: "Teamkills", [squadA]: squadDataA?.tk ?? 0, [squadB]: squadDataB?.tk ?? 0 },
      { metric: "Infantry Kills", [squadA]: squadDataA?.stats?.frags_inf ?? 0, [squadB]: squadDataB?.stats?.frags_inf ?? 0 },
      { metric: "Vehicle Kills", [squadA]: squadDataA?.stats?.frags_veh ?? 0, [squadB]: squadDataB?.stats?.frags_veh ?? 0 },
      { metric: "K/D Ratio", [squadA]: calcKD(squadDataA?.frags ?? 0, squadDataA?.death ?? 0), [squadB]: calcKD(squadDataB?.frags ?? 0, squadDataB?.death ?? 0) },
      { metric: "TK %", [squadA]: calcTKPercent(squadDataA?.tk ?? 0, squadDataA?.frags ?? 1), [squadB]: calcTKPercent(squadDataB?.tk ?? 0, squadDataB?.frags ?? 1) },
    ];
  }, [squadA, squadB, squads]);

  if (squads.length === 0) return null;

  return (
    <div className="bg-brand-gray/80 p-6 rounded-2xl shadow-lg border border-brand-muted w-full max-w-[1900px] mx-auto space-y-6">
      <div className="flex gap-4 justify-center">
        <select
          value={squadA || ""}
          onChange={(e) => setSquadA(e.target.value.toUpperCase())}
          className="px-3 py-2 rounded border border-brand-muted bg-brand-gray text-brand-light focus:bg-brand-gray-dark"
        >
          <option value="">Выберите первый отряд</option>
          {availableSquads.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={squadB || ""}
          onChange={(e) => setSquadB(e.target.value.toUpperCase())}
          className="px-3 py-2 rounded border border-brand-muted bg-brand-gray text-brand-light focus:bg-brand-gray-dark"
        >
          <option value="">Выберите второй отряд</option>
          {availableSquads.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {squadA && squadB && (
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={squadA} fill={stringToBrightColor(squadA)} />
              <Bar dataKey={squadB} fill={stringToBrightColor(squadB)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
