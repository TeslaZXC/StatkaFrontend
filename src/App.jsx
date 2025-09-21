import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Background from "./components/Background";
import Home from "./pages/Home";
import MissionList from "./pages/MissionList";
import MissionPage from "./pages/MissionPage";
import PlayerSearchPage from "./pages/PlayerSearchPage";
import PlayerPage from "./pages/PlayerPage"; // 👈 подключаем страницу игрока

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
          <Route path="/player/:name" element={<PlayerPage />} /> {/* 👈 новая страница */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
