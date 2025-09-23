import { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  { name: "Миссии", path: "/MissionList" },
  { name: "Поиск игроков", path: "/player-search" },
  { name: "Лучшие игроки", path: "/player-top" },
  { name: "Лучшие отряды", path: "/squad-top" },
];

function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-sm border-b border-brand-gray shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="text-white text-2xl font-bold uppercase tracking-wide"
        >
          STATKA
        </Link>

        <nav className="hidden md:flex gap-10">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-white font-sans text-lg uppercase tracking-wider hover:text-red-500 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col gap-1 text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden flex flex-col items-center gap-4 pb-4 bg-black/60 backdrop-blur-sm">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="text-white font-sans text-lg uppercase tracking-wider hover:text-red-500 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Menu;
