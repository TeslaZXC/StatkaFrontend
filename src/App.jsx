import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Background from "./components/Background";
import Home from "./pages/Home";
import MissionList from "./pages/MissionList";
import MissionPage from "./pages/MissionPage";
import PlayerSearchPage from "./pages/PlayerSearchPage";
import PlayerPage from "./pages/PlayerPage"; 
import PlayerTopPage from "./pages/PlayerTopPage";
import SquadPage from "./pages/SquadPage";
import SquadTopPage from "./pages/SquadTopPage";

function App() {
  return (
    <Router>
      <Background enableCursorEffect={true} />
      <Menu />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MissionList" element={<MissionList />} />
          <Route path="/mission/:id" element={<MissionPage />} />
          <Route path="/player-search" element={<PlayerSearchPage />} />
          <Route path="/player/:name" element={<PlayerPage />} />
          <Route path="/player-top" element={<PlayerTopPage />} />
          <Route path="/squad/:tag" element={<SquadPage />} /> 
          <Route path="/squad-top" element={<SquadTopPage />} /> 
        </Routes>
      </main>
    </Router>
  );
}

export default App;
