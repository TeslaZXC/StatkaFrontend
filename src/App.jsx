import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SqaudTop from "./pages/SqaudTop";
import "./index.css"
import PlayerTop from './pages/PlayerTop'
import PlayerDetails from "./pages/PlayerDetails";
import PlayerStats from "./pages/PlayerStats"; 
import MissionList from "./pages/MissionList";
import MissionDetails from './pages/MissionDetails'
import SquadStats from "./pages/SquadStats";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/squad-top" element={<SqaudTop />} />
        <Route path="/player-top" element={<PlayerTop />} />
        <Route path="/player/:name" element={<PlayerDetails />} />
        <Route path="/mission/:id" element={<MissionDetails />} />
        <Route path="/player-stat" element={<PlayerStats />} />
        <Route path="/missions" element={<MissionList />} />
        <Route path="/squad-stat/:name" element={<SquadStats />} />
      </Route>
    </Routes>
  );
}

export default App;
