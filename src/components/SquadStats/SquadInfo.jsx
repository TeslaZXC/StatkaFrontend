import React from "react";

const SquadInfo = ({ squad }) => {
  const kd =
    squad.deaths > 0 ? (squad.frags / squad.deaths).toFixed(2) : squad.frags;

  return (
    <div className="mb-6 space-y-2">
      <p><strong>Фраги:</strong> {squad.frags}</p>
      <p><strong>Тимкиллы:</strong> {squad.teamkills}</p>
      <p><strong>Смерти:</strong> {squad.deaths}</p>
      <p><strong>K/D:</strong> {kd}</p>
      <p><strong>Squad Number:</strong> {/* сюда можно вставить номер, если он есть */}</p>
    </div>
  );
};

export default SquadInfo;
