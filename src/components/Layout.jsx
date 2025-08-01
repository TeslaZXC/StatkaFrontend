import React from "react";
import Background from "./Background";
import Tabs from "./Tabs";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Background blur={30}>
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
