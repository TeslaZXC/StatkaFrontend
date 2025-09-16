import { useState, useMemo, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const formatTime = (t) => {
  const totalMinutes = Math.floor(t);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

const stringToBrightColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 75%, 50%)`;
};

const aggregateSquadData = (data, step = 10) => {
  const allSquads = data.map((s) => s.squad_tag.toUpperCase());
  const buckets = {};

  data.forEach((squad) => {
    (squad.victims_players ?? []).forEach((v) => {
      const bucket = Math.floor(v.time / step) * step;
      if (!buckets[bucket]) buckets[bucket] = { time: bucket };
      const tag = squad.squad_tag.toUpperCase();
      buckets[bucket][tag] = (buckets[bucket][tag] || 0) + 1;
    });
  });

  const result = Object.values(buckets).sort((a, b) => a.time - b.time);

  result.forEach((point) => {
    allSquads.forEach((squad) => {
      if (!(squad in point)) point[squad] = 0;
    });
  });

  return result;
};

export default function SquadChart({ data = [] }) {
  const buttonRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const squads = data.map((s) => s.squad_tag.toUpperCase());
  const chartData = useMemo(() => aggregateSquadData(data, 10), [data]);
  const [visibleSquads, setVisibleSquads] = useState(new Set(squads));

  if (!chartData || chartData.length === 0) return null;

  const squadColors = {};
  squads.forEach((s) => {
    squadColors[s] = stringToBrightColor(s);
  });

  const toggleSquad = (squad) => {
    setVisibleSquads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(squad)) {
        newSet.delete(squad);
      } else {
        newSet.add(squad);
      }
      return newSet;
    });
  };

  const selectAll = () => setVisibleSquads(new Set(squads));
  const clearAll = () => setVisibleSquads(new Set());

  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 224;
      let left = rect.left + window.scrollX;
      if (left + dropdownWidth > window.innerWidth) {
        left = rect.right - dropdownWidth + window.scrollX;
      }
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left,
      });
    }
  }, [dropdownOpen]);

  const renderFilterDropdown = () => (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
        className="px-3 py-1 bg-brand-gray text-brand-light rounded hover:bg-brand-gray/70 text-sm"
      >
        ⚙ Фильтр отрядов
      </button>

      {ReactDOM.createPortal(
        dropdownOpen && (
          <div
            className="absolute w-56 rounded-lg shadow-lg bg-brand-gray border border-brand-muted z-50 p-3"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
            }}
          >
            <div className="flex justify-between mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectAll();
                }}
                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                + Все
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                – Очистить
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {squads.map((s) => (
                <label key={s} className="flex items-center space-x-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={visibleSquads.has(s)} onChange={() => toggleSquad(s)} />
                  <span style={{ color: squadColors[s] }}>{s}</span>
                </label>
              ))}
            </div>
          </div>
        ),
        document.body
      )}
    </>
  );

  const renderChart = (chartData) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={formatTime} />
        <YAxis label={{ value: "Киллы", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(v) => v} labelFormatter={formatTime} />
        <Legend verticalAlign="top" height={36} />
        {[...visibleSquads].map((tag) => (
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
  );

  return (
    <div className="flex justify-center my-6">
      <div className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1900px]">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">{renderFilterDropdown()}</div>
        </div>

        <div className="overflow-hidden flex flex-col w-full p-4 h-[500px]">
          {renderChart(chartData)}
        </div>
      </div>
    </div>
  );
}
