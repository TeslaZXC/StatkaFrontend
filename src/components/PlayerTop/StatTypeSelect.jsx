import React from "react";

const StatTypeSelect = ({ value, onChange }) => {
  return (
    <div className="flex gap-4 mb-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="statType"
          value="all"
          checked={value === "all"}
          onChange={() => onChange("all")}
        />
        Все килы
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="statType"
          value="inf"
          checked={value === "inf"}
          onChange={() => onChange("inf")}
        />
        Пехота
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="statType"
          value="veh"
          checked={value === "veh"}
          onChange={() => onChange("veh")}
        />
        Техника
      </label>
    </div>
  );
};

export default StatTypeSelect;
