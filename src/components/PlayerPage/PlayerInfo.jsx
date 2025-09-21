import { motion, AnimatePresence } from "framer-motion";

export default function PlayerInfo({ player, selectedSquad, onSquadSelect }) {
  if (!player) return null;

  const currentSquad =
    selectedSquad ||
    (player.squads && player.squads.length > 0
      ? player.squads[0].toUpperCase()
      : null);

  return (
    <AnimatePresence>
      <motion.div
        key={player.name + (selectedSquad || "")}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full text-brand-light"
      >
        <h3 className="text-2xl font-bold mb-6 text-center">
          {currentSquad ? `[${currentSquad}] ${player.name}` : player.name}
        </h3>

        {/* KD-коэффициенты большими цветными плашками */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <div className="px-6 py-4 rounded-2xl text-center min-w-[120px] flex flex-col justify-center items-center border-2 border-brand-red bg-brand-red/20">
            <p className="text-sm">KD Общее</p>
            <p className="text-2xl font-bold">{player.kd_ratio?.toFixed(2)}</p>
          </div>
          <div className="px-6 py-4 rounded-2xl text-center min-w-[120px] flex flex-col justify-center items-center border-2 border-brand-blue bg-brand-blue/20 text-brand-blue">
            <p className="text-sm">KD Пехота</p>
            <p className="text-2xl font-bold">{player.kd_inf?.toFixed(2)}</p>
          </div>
          <div className="px-6 py-4 rounded-2xl text-center min-w-[120px] flex flex-col justify-center items-center border-2 border-brand-yellow bg-brand-yellow/20 text-brand-yellow">
            <p className="text-sm">KD Техника</p>
            <p className="text-2xl font-bold">{player.kd_veh?.toFixed(2)}</p>
          </div>
        </div>

        {/* Основная статистика + любимое оружие и техника */}
        <div className="grid grid-cols-2 gap-6 text-sm w-full">
          <div>
            <p className="text-brand-muted">Матчей сыграно</p>
            <p>{player.matches}</p>
          </div>

          <div>
            <p className="text-brand-muted">Фраги</p>
            <p>{player.frags}</p>
          </div>

          <div>
            <p className="text-brand-muted">Смерти</p>
            <p>{player.death}</p>
          </div>

          <div>
            <p className="text-brand-muted">Фраги с технике</p>
            <p>{player.frags_veh}</p>
          </div>

          <div>
            <p className="text-brand-muted">Фраги по пехоте</p>
            <p>{player.frags_inf}</p>
          </div>

          <div>
            <p className="text-brand-muted">Тимкиллы</p>
            <p>{player.tk}</p>
          </div>

          <div>
            <p className="text-brand-muted">Уничтожено техники</p>
            <p>{player.destroyed_veh}</p>
          </div>

          <div>
            <p className="text-brand-muted">Любимое оружие</p>
            <p>
              {player.favorite_weapon
                ? `${player.favorite_weapon.name} (${player.favorite_weapon.kills} убийств)`
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-brand-muted">Любимая техника</p>
            <p>
              {player.favorite_vehicle
                ? `${player.favorite_vehicle.name} (${player.favorite_vehicle.kills} убийств)`
                : "-"}
            </p>
          </div>
        </div>

        {/* Сквады */}
        <div className="mt-8">
          <p className="text-brand-muted mb-2">Сквады</p>
          <div className="flex flex-wrap gap-2">
            {player.squads && player.squads.length > 0 ? (
              player.squads.map((squad) => (
                <button
                  key={squad}
                  onClick={() => onSquadSelect(squad)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSquad === squad
                      ? "bg-brand-red text-white"
                      : "bg-brand-gray/70 text-brand-light hover:bg-brand-gray/90"
                  }`}
                >
                  {squad.toUpperCase()}
                </button>
              ))
            ) : (
              <p>Нет данных</p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
