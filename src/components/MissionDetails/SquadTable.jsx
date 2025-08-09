import React from "react";

const SquadTable = ({
  title,
  side,
  data,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  filterField,
  setFilterField,
}) => {
  const squads = data.filter((s) => s.side === side);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleFilter = (field) => {
    if (filterField === field) {
      setFilterField(null);
    } else {
      setFilterField(field);
    }
  };

  return (
    <div className="mt-8 rounded-lg shadow-lg bg-zinc-900/50 p-4 overflow-x-auto text-white">
      <h3 className="text-xl font-bold mb-3 text-accent">{title}</h3>
      <table className="min-w-full border border-zinc-700 text-sm">
        <thead className="bg-zinc-800 text-white select-none">
          <tr>
            {["squadName", "frags", "deaths", "teamkills"].map((field) => {
              let label =
                field === "squadName"
                  ? "Отряд"
                  : field === "frags"
                  ? "Фраги"
                  : field === "deaths"
                  ? "Смерти"
                  : "Тимкиллы";

              return (
                <th
                  key={field}
                  className="cursor-pointer px-3 py-2 border-b border-zinc-700 hover:text-accent select-none"
                  onClick={() => {
                    handleSort(field);
                    if (field === "squadName") handleFilter(null);
                    else handleFilter(field);
                  }}
                >
                  {label}{" "}
                  {sortField === field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {squads.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 font-semibold text-accent">
                Нет данных
              </td>
            </tr>
          ) : (
            squads.map(({ squadName, frags, deaths, teamkills }) => (
              <tr
                key={squadName}
                className="border-t border-zinc-700 hover:bg-zinc-800 cursor-pointer"
              >
                <td className="px-3 py-2">{squadName}</td>
                <td className="px-3 py-2">{frags}</td>
                <td className="px-3 py-2">{deaths}</td>
                <td className="px-3 py-2">{teamkills}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {filterField && (
        <div className="mt-2 text-sm text-accent">
          Фильтр по полю: <b>{filterField}</b> (кликните по заголовку чтобы сбросить)
        </div>
      )}
    </div>
  );
};

export default SquadTable;
