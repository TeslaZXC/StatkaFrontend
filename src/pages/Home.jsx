import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold animate-fade-in-up">
          STATKA — лучшая статистика игрового проекта{" "}
          <a
            href="https://www.red-bear.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline hover:text-accent/80 transition"
          >
            Red Bear
          </a>
        </h1>
      </div>

      <footer className="text-sm text-light opacity-80 text-center py-6 border-t border-accent">
        <p>
          © {new Date().getFullYear()} STATKA. Сделано топ лоу таб{" "}
          <span className="text-accent">[LG]Artyrka</span>.
        </p>
        <p className="text-xs mt-1">
          Сделано для проекта ред бир, спасибо что используете этот сайт
        </p>
      </footer>
    </div>
  );
};

export default Home;
