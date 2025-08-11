import React from "react";
import SquadTopHeader from "./SquadTopHeader";
import SquadTopRow from "./SquadTopRow";

const SquadTopTable = ({ data, onSort, onRowClick }) => (
  <table className="min-w-full text-sm text-left border border-zinc-700">
    <SquadTopHeader onSort={onSort} />
    <tbody>
      {data.map((squad, index) => (
        <SquadTopRow
          key={`squad-${squad.name}`}
          squad={squad}
          index={index}
          onClick={onRowClick} // <-- передаем сюда
        />
      ))}
    </tbody>
  </table>
);

export default SquadTopTable;
