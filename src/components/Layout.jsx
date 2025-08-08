import React, { useEffect, useState } from "react";
import Background from "./Background";
import Tabs from "./Tabs";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 2500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <Background blur={30}>
      {showMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-2 rounded-xl shadow-lg text-sm md:text-base backdrop-blur-md transition-all duration-500">
          сайт в разработке, дальше будет лучше, если че пишите мне в дс
        </div>
      )}

      <header className="p-4">
        <Tabs />
      </header>

      <main className="min-h-[80vh] flex items-center justify-center">
        <Outlet />
      </main>
    </Background>
  );
};

export default Layout;
