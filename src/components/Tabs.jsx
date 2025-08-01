import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react"; 

const tabs = [
  { id: "main", label: "💘 Главная", route: "/" },
  { id: "mission-stat", label: "📋 Миссии", route: "/missions" },
  { id: "player-stat", label: "📊 Статистика игроков", route: "/player-stat" },
  { id: "player-top", label: "👑 Топ игроков", route: "/player-top" },
  { id: "squad-top", label: "🏆 Топ отрядов", route: "/squad-top" },
];

const Tabs = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (route) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="hidden md:flex gap-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleClick(tab.route)}
            className="px-6 py-2 text-lg font-semibold rounded-full bg-dark text-light hover:bg-accent transition-all"
            whileHover={{ scale: 1.05 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="md:hidden relative">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-dark text-light rounded-full shadow-md"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <Menu size={20} /> Меню
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="absolute mt-2 left-0 right-0 bg-dark rounded-xl shadow-xl z-50 flex flex-col items-center py-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleClick(tab.route)}
                  className="w-full px-6 py-2 text-light hover:text-accent transition-colors text-base"
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
