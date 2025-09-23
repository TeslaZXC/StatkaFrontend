import { motion, AnimatePresence } from "framer-motion";

export default function SquadInfo({ squad }) {
  if (!squad) return null;

  const kd = squad.death ? (squad.frags / squad.death).toFixed(2) : "0.00";

  const mainStats = [
    { label: "Фраги", value: squad.frags },
    { label: "Смерти", value: squad.death },
    { label: "Тимкиллы", value: squad.tk },
    { label: "K/D", value: kd },
  ];

  const otherStats = [
    { label: "Миссий сыграно", value: squad.missions_played },
    { label: "Игроков в составе", value: squad.total_players },
    { label: "Счёт", value: squad.score },
    { label: "Средний онлайн", value: squad.avg_players?.toFixed(2) },
    { label: "Дата регистрации", value: squad.registered_at },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key={squad.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-6 text-white w-full"
      >
        {/* Логотип */}
        <img
          src={squad.url}
          alt={`${squad.name} logo`}
          className="w-32 h-32 object-cover rounded-full border-4 border-red-500 shadow-lg"
        />

        {/* Название отряда */}
        <h2 className="text-2xl font-bold text-center">
          {squad.name.toUpperCase()}
        </h2>

        {/* Основные блоки */}
        <div className="flex flex-wrap gap-4 justify-center mt-4 w-full max-w-4xl">
          {mainStats.map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-4 rounded-2xl text-center min-w-[140px] flex flex-col justify-center items-center border-2 border-red-500 bg-red-500/20 text-red-500"
            >
              <p className="text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Остальная статистика текстом */}
        <div className="mt-6 text-white text-center space-y-2">
          {otherStats.map((stat) => (
            <p key={stat.label}>
              <span className="font-bold">{stat.label}:</span> {stat.value}
            </p>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
