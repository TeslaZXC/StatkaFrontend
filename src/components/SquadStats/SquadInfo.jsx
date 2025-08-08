import React from "react";

const SquadInfo = ({ squad }) => (
  <div className="mb-6 space-y-2">
    <p><strong>Фраги:</strong> {squad.frags}</p>
    <p><strong>Смерти:</strong> {squad.deaths}</p>
    <p><strong>K/D:</strong> {squad.score}</p>
    <p><strong>Средняя посещаемость:</strong> {squad.average_attendance}</p>
  </div>
);

export default SquadInfo;
