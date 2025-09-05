import { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  { name: "Главная", path: "/" },
  { name: "Миссии", path: "/MissionList" },
  { name: "Лучшие отряды", path: "/contact" },
  { name: "Лучшие игроки", path: "/contact" },
];

function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-brand-black/85 backdrop-blur-md rounded-b-3xl shadow-2xl border border-brand-gray max-w-3xl w-full">
      <div className="flex justify-center items-center px-6 py-4 relative">
        
        <nav className="hidden md:flex gap-10">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-brand-light font-sans text-xl uppercase tracking-wider hover:text-brand-red transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden absolute right-6 text-brand-light focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block w-6 h-0.5 bg-brand-light mb-1"></span>
          <span className="block w-6 h-0.5 bg-brand-light mb-1"></span>
          <span className="block w-6 h-0.5 bg-brand-light"></span>
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden flex flex-col items-center gap-4 pb-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="text-brand-light font-sans text-lg uppercase tracking-wider hover:text-brand-red transition-colors duration-200"
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
